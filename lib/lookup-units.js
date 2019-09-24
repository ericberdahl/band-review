const _ = require('lodash');
const debug = require('debug')('lookup-units');
const error = require('debug')('lookup-units:<error>*');
const moment = require('moment');
const path = require('path');
const pluginKit = require('metalsmith-plugin-kit')
const yaml = require('node-yaml');

function lookupSchoolUnit(metalsmith, competition, schoolName, unitName)
{
    debug('looking up %s unit for %s school', unitName, schoolName);

    const schoolDataDir = metalsmith.path('schools');
    const school = yaml.readSync(path.join(schoolDataDir, schoolName + '.yml'));
    const unit = school[unitName];

    _.defaults(unit, {
        city: school.city,
        schoolName: school.name,
        _lastUpdated: new Date(unit['last-updated'])
    });
    unit._upToDate = (unit._lastUpdated.getFullYear() >= moment(competition.show.date).year());

    return unit;
}

function lookupUnits(options)
{
    if (!options.pattern) {
        throw Error('pattern option is required');
    }

    return pluginKit.middleware({
        match: options.pattern,
        
        each:  (competitionName, competition, files, metalsmith) => {
                debug('looking up units for all events in %s competition', competitionName);
                _.forEach(competition.units, (eventName) => {
                    debug('looking up units for %s event in %s competition', eventName, competitionName);
                    
                    competition[eventName].lineup = _.map(competition[eventName].lineup, (unit) => {
                        if (unit.ref) {
                            const schoolName = unit.ref;
                            const unitName = _.get(unit, 'unit', eventName);
                            debug('looking up %s unit for %s school in %s competition', unitName, schoolName, competitionName);

                            unit = lookupSchoolUnit(metalsmith, competition, schoolName, unitName);
                            if (!unit) {
                                error('could not find %s unit for %s school in %s competition', unitName, schoolName, competitionName);
                            }
                        }
                        return unit;
                    });
                });
            },
    });
}


module.exports = lookupUnits;
