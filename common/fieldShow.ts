import { BreakUnit, BreakUnitStaticProps, SerializedBreakUnit } from './breakUnit';
import { FieldShowUnit, FieldShowUnitStaticProps, SerializedFieldShowUnit } from './fieldShowUnit';
import { CompetitionSponsors, CompetitionSponsorsStaticProps, SerializedCompetitionSponsors } from './sponsor';

import sanitize from "sanitize-filename";
import yaml from 'yaml';

import path from 'path';
import fs from 'fs/promises';

type SerializedFieldShowUnitRef = {
    ref : string;
}

type SerializedFieldShowLineupItem = SerializedFieldShowUnitRef | SerializedBreakUnit;

function isFieldShowUnitRef(item : SerializedFieldShowLineupItem) : item is SerializedFieldShowUnitRef {
    return (item as SerializedFieldShowUnitRef).ref !== undefined;
}

export type SerializedFieldShow = {
    anthem_performer : string;
    lineup : SerializedFieldShowLineupItem[];
    sponsors : SerializedCompetitionSponsors;
    start_time : string;    // hh:mmAM
}

type FieldShowLineupItemStaticProps = {
    type : 'break' | 'unit';
    item : BreakUnitStaticProps | FieldShowUnitStaticProps;
}

export type FieldShowStaticProps = {
    anthemPerformer : string;
    lineup : FieldShowLineupItemStaticProps[];
    sponsors : CompetitionSponsorsStaticProps;
    startTime : string;
}

type FieldShowLineupItem = FieldShowUnit | BreakUnit;

function getLineupItemStaticProps(item : FieldShowLineupItem) : FieldShowLineupItemStaticProps {
    if (item instanceof BreakUnit) {
        return {
            type: 'break',
            item: item.getStaticProps()
        }
    }
    else if (item instanceof FieldShowUnit) {
        return {
            type: 'unit',
            item: item.getStaticProps()
        }
    }
}

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
        this.anthemPerformer = anthemPerformer;
        this.sponsors = sponsors;
    }

    static async deserialize(data : SerializedFieldShow) : Promise<FieldShow> {
        const result = new FieldShow(data.start_time,
                                     data.anthem_performer,
                                     CompetitionSponsors.deserialize(data.sponsors));

        result.lineup.push(...await Promise.all(data.lineup.map(async (li) => {
            if (isFieldShowUnitRef(li)) {
                return FieldShowUnit.deserialize(await readSerializedUnitForSchool<SerializedFieldShowUnit>(li.ref))
            }
            else {
                return BreakUnit.deserialize(li);
            }
        })));

        return result;
    }

    getStaticProps() : FieldShowStaticProps {
        return {
            anthemPerformer: this.anthemPerformer,
            startTime: this.startTime,
            lineup: this.lineup.map((li) => getLineupItemStaticProps(li)),
            sponsors: this.sponsors.getStaticProps(),
        }
    }
}