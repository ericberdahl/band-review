const _ = require('lodash');
const logs = require('./logs').forFilename(__filename);
const path = require('path');
const pluginKit = require('metalsmith-plugin-kit');

function renderTemplates(options)
{
    if (!options.pattern) {
        throw Error('pattern option is required');
    }
    if (!options.handlebars) {
        throw Error('Handlebars option is required');
    }

    return pluginKit.middleware({
        match: options.pattern,

        each: (competitionName, competition, files, metalsmith) => {
                const locals = _.assign({}, metalsmith.metadata(), competition);

                const template = options.handlebars.compile(competition.contents.toString());
                competition.contents = Buffer.from(template(locals));

                if (options.renderedExtension) {
                    const pathParts = path.parse(competitionName);
                    const newName = path.join(pathParts.dir, pathParts.name + options.renderedExtension);
                    
                    logs.debug('renaming %s to %s', competitionName, newName);
                    delete files[competitionName];
                    files[newName] = competition;
                }
            },
        });
    
    
}

module.exports = renderTemplates;
