const _ = require('lodash');
const fs = require('fs');
const logs = require('./logs').forFilename(__filename);
const moment = require('moment');
const path = require('path');
const pluginKit = require('metalsmith-plugin-kit')
const yaml = require('node-yaml');

function lookupSchoolUnit(metalsmith, competition, schoolName, unitName)
{
    logs.debug('looking up %s unit for %s school', unitName, schoolName);

    const schoolDataDir = metalsmith.path('schools');

    const schoolPath = path.join(schoolDataDir, schoolName + '.yml');
    if (!fs.existsSync(schoolPath)) {
        logs.error("School %s not found", schoolName);    
    }

    const school = yaml.readSync(schoolPath);
    const unit = school[unitName];
    if (unit === undefined) {
        logs.error("Unit %s of school %s not found", unitName, schoolName);
    }

    _.defaults(unit, {
        city: school.city,
        schoolName: school.name,
    });

    unit._upToDate = (moment(unit.lastUpdated).year() >= moment(competition.show.date).year());

    unit._leadership = [];
    if (unit.directors) {
        unit._leadership.push({
            introduction: '',
            leaders: [
                { title: 'directed by', members: unit.directors }
            ]
            });
    }
    if (unit.staff) {
        unit._leadership.push({
            introduction: '',
            leaders: unit.staff
            });
    }
    if (unit.leaders) {
        unit._leadership.push({
            introduction: 'led by ',
            leaders: unit.leaders
        });
    }

    if (!unit.nickname) {
        logs.error("%s unit at %s has no nickname", unitName, schoolName);
    }

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
                logs.debug('looking up units for all events in %s competition', competitionName);
                _.forEach(competition.units, (eventName) => {
                    logs.debug('looking up units for %s event in %s competition', eventName, competitionName);
                    
                    competition[eventName].lineup = _.map(competition[eventName].lineup, (unit) => {
                        if (unit.ref) {
                            const schoolName = unit.ref;
                            const unitName = _.get(unit, 'unit', eventName);
                            logs.debug('looking up %s unit for %s school in %s competition', unitName, schoolName, competitionName);

                            unit = lookupSchoolUnit(metalsmith, competition, schoolName, unitName);
                            if (!unit) {
                                logs.error('could not find %s unit for %s school in %s competition', unitName, schoolName, competitionName);
                            }
                        }
                        return unit;
                    });
                });
            },
    });
}


module.exports = lookupUnits;
