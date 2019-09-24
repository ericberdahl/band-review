const _ = require('lodash');
const logs = require('./logs').forFilename(__filename);
const numericCitation = require('./numeric-citation');
const pluginKit = require('metalsmith-plugin-kit');

function addCompetitionMetadata(options)
{
    if (!options.pattern) {
        throw Error('pattern option is required');
    }

    return pluginKit.middleware({
        match: options.pattern,

        before: (files, metalsmith) => {
                const metadata = metalsmith.metadata();

                // TODO relace _generatonDate with built-in to get current date
                logs.debug('adding generation date');
                metadata._generationDate = new Date();
            },

        each: (competitionName, competition, files, metalsmith) => {
                logs.debug('computing lineup stats for all events in %s competition', competitionName);
                _.forEach(competition.units, (eventName) => {
                    logs.debug('computing lineup stats for %s event in %s competition', eventName, competitionName);

                    const event = _.get(competition, eventName);
                    const schoolsInLineup = event.lineup.filter((unit) => !('break' in unit));
                    
                    event._schoolsUpToDate = schoolsInLineup.filter((unit) => unit._upToDate);
                    event._schoolsMissingData = schoolsInLineup.filter((unit) => !unit._upToDate);
        
                    // Count the number of schools in each lineup
                    event._count = {
                        number : schoolsInLineup.length,
                        citation : numericCitation(schoolsInLineup.length),
                        upToDate : event._schoolsUpToDate.length,
                        missingData : event._schoolsMissingData.length
                    };

                    logs.debug('_count: %o', event._count);
                });
            },
        });

}

module.exports = addCompetitionMetadata;