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

type SerializedFieldShowLineupItem = SerializedFieldShowUnitRef | SerializedBreakUnit;

function isFieldShowUnitRef(item : SerializedFieldShowLineupItem) : item is SerializedFieldShowUnitRef {
    return (item as SerializedFieldShowUnitRef).ref !== undefined;
}

function isBreakShowUnit(item : SerializedFieldShowLineupItem) : item is SerializedBreakUnit {
    return (item as SerializedBreakUnit).break !== undefined;
}

export type SerializedFieldShow = {
    anthem_performer : string;
    lineup : SerializedFieldShowLineupItem[];
    sponsors : SerializedCompetitionSponsors;
    start_time : string;    // hh:mmAM
}

type FieldShowLineupItemStaticProps = BreakUnitStaticProps | FieldShowUnitStaticProps;

export type FieldShowStaticProps = {
    anthemPerformer : string;
    lineup : FieldShowLineupItemStaticProps[];
    sponsors : CompetitionSponsorsStaticProps;
    startTime : string;
}

type FieldShowLineupItem = FieldShowUnit | BreakUnit;

async function readSerializedUnitForSchool<T>(schoolRef : string) : Promise<T> {
    const filename = sanitize(schoolRef + '.yml');

    return yaml.parse(await fs.readFile(path.join('schools', filename), 'utf8'));
}

export class FieldShow {
    readonly anthemPerformer : string;
    readonly lineup : FieldShowLineupItem[] = [];
    readonly sponsors : CompetitionSponsors;
    readonly startTime : string;    // TODO: change to DateTime

    constructor(startTime : string, anthemPerformer : string, sponsors : CompetitionSponsors) {
        this.startTime = startTime;
        this.anthemPerformer = anthemPerformer ? anthemPerformer : null;
        this.sponsors = sponsors;
    }

    static async deserialize(data : SerializedFieldShow) : Promise<FieldShow> {
        const result = new FieldShow(data.start_time,
                                     data.anthem_performer,
                                     await CompetitionSponsors.deserialize(data.sponsors));

        result.lineup.push(...await Promise.all(data.lineup.map(async (li) => {
            if (isFieldShowUnitRef(li)) {
                return FieldShowUnit.deserialize(await readSerializedUnitForSchool<SerializedFieldShowUnit>(li.ref))
            }
            else if (isBreakShowUnit(li)) {
                return BreakUnit.deserialize(li);
            }
            else {
                assert.fail(`Unrecognized lineup item: ${li}`)
            }
        })));

        return result;
    }

    async getStaticProps() : Promise<FieldShowStaticProps> {
        return {
            anthemPerformer: this.anthemPerformer,
            startTime: this.startTime,
            lineup: await Promise.all(this.lineup.map(async (li) => li.getStaticProps())),
            sponsors: await this.sponsors.getStaticProps(),
        }
    }
}