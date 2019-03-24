#!/usr/bin/env node

const child_process = require('child_process');
const fs = require('fs');
const Handlebars = require('handlebars');
const path = require('path');
const walk = require('walk');
const yaml = require('node-yaml');

async function collectSchoolData(config)
{
    // Add each school into a large array property that holds all the schools
    let schools = { };
    const walker = walk.walk(config.schoolDataDir);
    return new Promise((resolve, reject) => {
        walker.on('file', (root, stat, next) => {
            const extension = path.extname(stat.name);
            if (extension == '.yml')
            {
                schools[path.basename(stat.name, extension)] = yaml.readSync(path.join(root, stat.name));
            }
            next();
        });
        walker.on('errors', (root, stats, next) => {
            reject(stats.error);
            next();
        });
        walker.on('end', () => {
            resolve(schools);
        });
    });
}

function normalizeSchoolData(schools, units, yearOfShow)
{
    Object.keys(schools).forEach((s) => {
        const aSchool = schools[s];
        units.forEach((unitname) => {
            if (unitname in aSchool)
            {
                const aUnit = aSchool[unitname];

                // Ensure that city and schoolName properties are set, taking them from the school itself if necessary
                ('city' in aUnit) || (aUnit.city = aSchool.city);
                ('schoolName' in aUnit) || (aUnit.schoolName = aSchool.name);

                // Add a computed property that indicates whether the unit data is up to date for the current program
                aUnit._lastUpdated = new Date(aUnit['last-updated']);
                aUnit._upToDate = (aUnit._lastUpdated.getFullYear() >= yearOfShow.year);
            }
        });
    });
}

function lookupUnitRef(ref, defaultUnit, schools)
{
    let result = ref
    if ('ref' in ref)
    {
        const unitname = (!('unit' in ref) ? defaultUnit : ref.unit);
        if (!(ref.ref in schools))
        {
            console.log('# ERROR %s school not found', ref.ref);
        }
        else if (!(unitname in schools[ ref.ref ]))
        {
            console.log('# ERROR %s unit not found in %s school.', unitname, ref.ref);
        }

        result = schools[ ref.ref ][unitname];
    }

    return result
}

function computeNumericCitation(config, count)
{
    const found = config.count_citation.find((cite) => (cite.min <= count && count <= cite.max));
    return (found ? found.cite : count);
}

function countLineup(lineup)
{
    return lineup.length - lineup.reduce((total, item) => ('break' in item ? total + 1 : total), 0);
}

function computeLineupStats(config, unit)
{
    // Count the number of schools in each lineup
    lineupCount = countLineup(unit.lineup)
    unit._count = {
        number : lineupCount,
        citation : computeNumericCitation(config, lineupCount),
        upToDate : unit._schoolsUpToDate.length,
        missingData : unit._schoolsMissingData.length
    }

    // TODO Collect the schools with up to date information and
    // those without up to date information
}


async function collectViewdata(event, config)
{
    const data = yaml.readSync(event.dataPath);
    data._generationDate = new Date();

    const schools = await collectSchoolData(config);
    normalizeSchoolData(schools, data.units, data.show);

    /*
     * In each event, compute stats on the lineups
     */
    data.units.forEach((unitname) => {
        if (unitname in data)
        {
            data[unitname].lineup = data[unitname].lineup.map((item) => {
                return lookupUnitRef(item, unitname, schools);
            });

            lineupSchools = data[unitname].lineup.filter((unit) => !('break' in unit));
            data[unitname]._schoolsUpToDate = lineupSchools.filter((unit) => unit._upToDate);
            data[unitname]._schoolsMissingData = lineupSchools.filter((unit) => !unit._upToDate);

            computeLineupStats(config, data[unitname]);
        }
    });

    return data
}

async function collectPartials(basePath)
{
    const walker = walk.walk(basePath);
    return new Promise((resolve, reject) => {
        walker.on('file', (root, stat, next) => {
            const extension = path.extname(stat.name);
            if (extension == '.adoc')
            {
                Handlebars.registerPartial(path.basename(stat.name, extension),
                                           fs.readFileSync(path.join(root, stat.name), { encoding:'utf8'}));
            }
            next();
        });
        walker.on('errors', (root, stats, next) => {
            reject(stats.error);
            next();
        });
        walker.on('end', () => {
            resolve();
        });
    });
}

async function buildAdoc(event, config)
{
    const rootTemplate = '{{> ' + event.rootPartial + ' }}';
    const basename = event.rootPartial + '-book';
    const adocFilepath = path.join(config.outputDir, basename + '.adoc');
    const pdfFilepath = path.join(config.outputDir, basename + '.pdf');

    if (!fs.existsSync(config.outputDir)) {
        fs.mkdirSync(config.outputDir, { recursive: true });
    }

    console.log('# Collecting data');
    const viewdata = await collectViewdata(event, config);

    console.log('# Compiling partials');
    await collectPartials(config.partialsDir);
    
    console.log('# Compiling asciidoc book %s', adocFilepath);
    const template = Handlebars.compile(rootTemplate);

    fs.writeFileSync(adocFilepath, template(viewdata));
}

async function buildHTML(event, config)
{
    const basename = event.rootPartial + '-book';
    const adocFilepath = path.join(config.outputDir, basename + '.adoc');
    const htmlFilepath = path.join(config.outputDir, basename + '.html');

    console.log('# Compiling HTML %s', htmlFilepath);
    child_process.spawnSync('asciidoctor', [ adocFilepath ]);
}

async function buildPDF(event, config)
{
    const basename = event.rootPartial + '-book';
    const adocFilepath = path.join(config.outputDir, basename + '.adoc');
    const pdfFilepath = path.join(config.outputDir, basename + '.pdf');

    console.log('# Compiling pdf book %s', pdfFilepath);
    child_process.spawnSync('asciidoctor-pdf', [
        '-a', 'pdf-stylesdir=.',
        '-a', 'pdf-style=announcer',
        adocFilepath,
        '-o', pdfFilepath
    ]);
}

async function buildAll(event, config)
{
    await buildAdoc(event, config);
    await buildHTML(event, config);
    await buildPDF(event, config);
}

function main()
{
    const program = require('commander');

    const config = yaml.readSync('_data/config.yml');

    const bandReview = {
        dataPath: './_data/bandreview.yml',
        rootPartial: 'band-review'
    };

    const winterShow = {
        dataPath: './_data/wintershow.yml',
        rootPartial: 'winter-show'
    };

    program
        .version('1.0.0')
        .parse(process.argv);

    buildAll(winterShow, config)
        .then(() => {
            return buildAll(bandReview, config);
        })
        .then(() => {
            console.log('# main : done');
        });
}

if (require.main == module)
{
    main();
}
