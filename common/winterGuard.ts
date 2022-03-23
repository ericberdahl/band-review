import { BreakUnit, BreakUnitStaticProps, SerializedBreakUnit } from './breakUnit';
import { WinterGuardUnit, WinterGuardUnitStaticProps, SerializedWinterGuardUnit } from './winterGuardUnit';
import { CompetitionSponsors, CompetitionSponsorsStaticProps, SerializedCompetitionSponsors } from './sponsor';

import sanitize from "sanitize-filename";
import yaml from 'yaml';

import path from 'path';
import fs from 'fs/promises';

type SerializedWinterGuardUnitRef = {
    ref : string;
}

type SerializedFieldShowLineupItem = SerializedWinterGuardUnitRef | SerializedBreakUnit;

function isWinterGuardUnitRef(item : SerializedFieldShowLineupItem) : item is SerializedWinterGuardUnitRef {
    return (item as SerializedWinterGuardUnitRef).ref !== undefined;
}

export type SerializedWinterGuard = {
    lineup : SerializedFieldShowLineupItem[];
    sponsors : SerializedCompetitionSponsors;
    start_time : string;    // hh:mmAM
}

type WinterGuardLineupItemStaticProps = BreakUnitStaticProps | WinterGuardUnitStaticProps;

export type WinterGuardStaticProps = {
    lineup : WinterGuardLineupItemStaticProps[];
    sponsors : CompetitionSponsorsStaticProps;
    startTime : string;
}

type WinterGuardLineupItem = WinterGuardUnit | BreakUnit;

async function readSerializedUnitForSchool<T>(schoolRef : string) : Promise<T> {
    const filename = sanitize(schoolRef + '.yml');

    return yaml.parse(await fs.readFile(path.join('schools', filename), 'utf8'));
}

export class WinterGuard {
    readonly lineup : WinterGuardLineupItem[] = [];
    readonly sponsors : CompetitionSponsors;
    readonly startTime : string;    // TODO: change to DateTime

    constructor(startTime : string, sponsors : CompetitionSponsors) {
        this.startTime = startTime;
        this.sponsors = sponsors;
    }

    static async deserialize(data : SerializedWinterGuard) : Promise<WinterGuard> {
        const result = new WinterGuard(data.start_time,
                                       await CompetitionSponsors.deserialize(data.sponsors));

        result.lineup.push(...await Promise.all(data.lineup.map(async (li) => {
            if (isWinterGuardUnitRef(li)) {
                return WinterGuardUnit.deserialize(await readSerializedUnitForSchool<SerializedWinterGuardUnit>(li.ref))
            }
            else {
                return BreakUnit.deserialize(li);
            }
        })));

        return result;
    }

    async getStaticProps() : Promise<WinterGuardStaticProps> {
        return {
            startTime: this.startTime,
            lineup: await Promise.all(this.lineup.map(async (li) => li.getStaticProps())),
            sponsors: await this.sponsors.getStaticProps(),
        }
    }
}
