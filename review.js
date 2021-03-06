#!/usr/bin/env node

const path = require('path');

const __debugname = path.basename(__filename, path.extname(__filename));
const debug = require('debug')(__debugname);
const info = require('debug')(__debugname + '*');
const error = require('debug')(__debugname + ':<error>*');

info.log = console.info.bind(console);
error.log = console.info.bind(console);

function main()
{
    const program = require('commander');
    const competitionMetadata = require('./lib/competition-metadata');
    const discoverPartials = require('./lib/discover-partials');
    const Handlebars = require('handlebars');
    const helpers = require('./lib/handlebars-helpers');
    const lookupUnits = require('./lib/lookup-units');
    const renderHandlebars = require('./lib/render-handlebars');
    const renderHTML = require('./lib/render-adoc-to-html');
    const renderPDF = require('./lib/render-adoc-to-pdf');

    const showProgress = (...args) => {
            return (files, metalsmith, done) => {
                info(...args);
                done();
            }
        };
    
    program
        .version('1.0.0')
        .parse(process.argv);

    helpers.defaultTimezone('America/Los_Angeles');
    helpers.register({ handlebars: Handlebars, namespace: 'x-'});

    const Metalsmith = require('metalsmith');
    let metalsmith = Metalsmith(__dirname);
    
    metalsmith = metalsmith.use(showProgress('starting'))
        .source('./source')
        .destination('./_build');
    
    metalsmith = metalsmith.use(showProgress('looking up schools'))
        .use(lookupUnits({
            pattern: '*.hbs'
        }));

    metalsmith = metalsmith.use(showProgress('computing lineup statistics'))
        .use(competitionMetadata({
            pattern: '*.hbs'
        }));

    metalsmith = metalsmith.use(showProgress('finding handlebars partials'))
        .use(discoverPartials({
            directory: 'partials',
            handlebars: Handlebars,
            pattern: '*.hbs'
        }));

    metalsmith = metalsmith.use(showProgress('rendering templates to asciidoc'))
        .use(renderHandlebars({
            pattern: '*.hbs',
            handlebars: Handlebars,
            renderedExtension: '.adoc'
        }));

    metalsmith = metalsmith.use(showProgress('rendering asciidoc to html'))
        .use(renderHTML({
            pattern: '*.adoc',
            renderedExtension: '.html',
            removeOriginal: false
        }));

    metalsmith = metalsmith.use(showProgress('rendering asciidoc to pdf'))
        .use(renderPDF({
            pattern: '*.adoc',
            renderedExtension: '.pdf',
            removeOriginal: false
        }));

    metalsmith = metalsmith.build((err) => {
            if (err)
            {
                error(err);
            }
            else
            {
                info('complete');
            }
        });
    }

if (require.main == module)
{
    main();
}
