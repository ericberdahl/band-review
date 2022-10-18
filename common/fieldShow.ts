import { AnthemPerformerUnit, AnthemPerformerUnitStaticProps, SerializedAnthemPerformerUnit } from './anthemPerformerUnit';
import { AwardsUnit, AwardsUnitStaticProps, SerializedAwardsUnit } from './awardsUnit';
import { BreakUnit, BreakUnitStaticProps, SerializedBreakUnit } from './breakUnit';
import { FieldShowUnit, FieldShowUnitStaticProps, SerializedFieldShowUnit } from './fieldShowUnit';
import { CompetitionSponsors, CompetitionSponsorsStaticProps, SerializedCompetitionSponsors } from './sponsor';

import sanitize from "sanitize-filename";
import yaml from 'yaml';

import { strict as assert } from 'assert';
import path from 'path';
import fs from 'fs/promises';

type SerializedFieldShowUnitRef = {
    ref : string;
}

type SerializedFieldShowLineupItem = SerializedAnthemPerformerUnit | SerializedAwardsUnit | SerializedBreakUnit | SerializedBreakUnit | SerializedFieldShowUnitRef;

function isAnthemPerformerShowUnit(item : SerializedFieldShowLineupItem) : item is SerializedAnthemPerformerUnit {
    return (item as SerializedAnthemPerformerUnit).anthemPerformer !== undefined;
}

function isAwardsShowUnit(item : SerializedFieldShowLineupItem) : item is SerializedAwardsUnit {
    return (item as SerializedAwardsUnit).awardsLabel !== undefined;
}

function isBreakShowUnit(item : SerializedFieldShowLineupItem) : item is SerializedBreakUnit {
    return (item as SerializedBreakUnit).break !== undefined;
}

function isFieldShowUnitRef(item : SerializedFieldShowLineupItem) : item is SerializedFieldShowUnitRef {
    return (item as SerializedFieldShowUnitRef).ref !== undefined;
}

export type SerializedFieldShow = {
    lineup : SerializedFieldShowLineupItem[];
    sponsors : SerializedCompetitionSponsors;
    start_time : string;    // hh:mmAM
}

type FieldShowLineupItemStaticProps = AnthemPerformerUnitStaticProps | AwardsUnitStaticProps | BreakUnitStaticProps | FieldShowUnitStaticProps;

export type FieldShowStaticProps = {
    lineup : FieldShowLineupItemStaticProps[];
    sponsors : CompetitionSponsorsStaticProps;
    startTime : string;
}

type FieldShowLineupItem = AnthemPerformerUnit | AwardsUnit | BreakUnit | FieldShowUnit;

async function readSerializedUnitForSchool<T>(schoolRef : string) : Promise<T> {
    const filename = sanitize(schoolRef + '.yml');

    try {
        return yaml.parse(await fs.readFile(path.join('schools', filename), 'utf8'));
    }
    catch (e)
    {
        console.error(`Exception parsing field show for school ${schoolRef}`);
        throw e;
    }
}

export class FieldShow {
    readonly lineup : FieldShowLineupItem[] = [];
    readonly sponsors : CompetitionSponsors;
    readonly startTime : string;    // TODO: change to DateTime

    constructor(startTime : string, sponsors : CompetitionSponsors) {
        this.startTime = startTime;
        this.sponsors = sponsors;
    }

    static async deserialize(data : SerializedFieldShow) : Promise<FieldShow> {
        const result = new FieldShow(data.start_time,
                                     await CompetitionSponsors.deserialize(data.sponsors));

        result.lineup.push(...await Promise.all(data.lineup.map(async (li) => {
            if (isFieldShowUnitRef(li)) {
                return FieldShowUnit.deserialize(await readSerializedUnitForSchool<SerializedFieldShowUnit>(li.ref))
            }
            else if (isAnthemPerformerShowUnit(li)) {
                return AnthemPerformerUnit.deserialize(li);
            }
            else if (isAwardsShowUnit(li)) {
                return AwardsUnit.deserialize(li);
            }
            else if (isBreakShowUnit(li)) {
                return BreakUnit.deserialize(li);
            }
            else {
                assert.fail(`Unrecognized field show lineup item: ${JSON.stringify(li)}`)
            }
        })));

        return result;
    }

    async getStaticProps() : Promise<FieldShowStaticProps> {
        return {
            startTime: this.startTime,
            lineup: await Promise.all(this.lineup.map(async (li) => li.getStaticProps())),
            sponsors: await this.sponsors.getStaticProps(),
        }
    }
}