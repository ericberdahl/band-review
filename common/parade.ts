import { BreakUnit, BreakUnitStaticProps, SerializedBreakUnit } from "./breakUnit";
import { ParadeUnit, ParadeUnitStaticProps, SerializedParadeUnit } from "./paradeUnit";
import { Role, RoleStaticProps, SerializedRole } from "./role";
import { CompetitionSponsors, CompetitionSponsorsStaticProps, SerializedCompetitionSponsors } from "./sponsor";

import sanitize from "sanitize-filename";
import yaml from 'yaml';

import path from 'path';
import fs from 'fs/promises';

type SerializedParadeUnitRef = {
    ref : string;
}

type SerializedParadeLineupItem = SerializedParadeUnitRef | SerializedBreakUnit;

function isParadeUnitRef(item : SerializedParadeLineupItem) : item is SerializedParadeUnitRef {
    return (item as SerializedParadeUnitRef).ref !== undefined;
}

export type SerializedParade = {
    awards_location : string;
    awards_time : string;
    colors : string;    // color guard citation
    grand_marshall : SerializedRole;
    lineup : SerializedParadeLineupItem[];
    sponsors : SerializedCompetitionSponsors;
}

type ParadeLineupItemStaticProps = {
    type : 'break' | 'unit';
    item : BreakUnitStaticProps | ParadeUnitStaticProps;
}

export type ParadeStaticProps = {
    awardsTime : string;    // ISO DateTime format
    awardsLocation : string;
    colors : string;
    grandMarshal : RoleStaticProps;
    lineup : ParadeLineupItemStaticProps[];
    sponsors : CompetitionSponsorsStaticProps;
}

type ParadeLineupItem = ParadeUnit | BreakUnit;

async function getLineupItemStaticProps(item : ParadeLineupItem) : Promise<ParadeLineupItemStaticProps> {
    if (item instanceof BreakUnit) {
        return {
            type: 'break',
            item: await item.getStaticProps()
        }
    }
    else if (item instanceof ParadeUnit) {
        return {
            type: 'unit',
            item: await item.getStaticProps()
        }
    }
}

async function readSerializedUnitForSchool<T>(schoolRef : string) : Promise<T> {
    const filename = sanitize(schoolRef + '.yml');

    return yaml.parse(await fs.readFile(path.join('schools', filename), 'utf8'));
}

export class Parade {
    readonly awardsLocation : string;
    readonly awardsTime : string;   // TODO: change to DateTime
    readonly colors : string;
    readonly grandMarshal : Role;
    readonly lineup : ParadeLineupItem[]    = [];
    readonly sponsors : CompetitionSponsors;

    constructor(grandMarshal : Role, colors : string, awardsTime : string, awardsLocation : string, sponsors : CompetitionSponsors) {
        this.grandMarshal = grandMarshal;
        this.colors = colors;
        this.awardsTime = awardsTime;
        this.awardsLocation = awardsLocation;
        this.sponsors = sponsors;
    }

    static async deserialize(data : SerializedParade) : Promise<Parade> {
        const result = new Parade(await Role.deserialize(data.grand_marshall),
                                  data.colors,
                                  data.awards_time,
                                  data.awards_location,
                                  await CompetitionSponsors.deserialize(data.sponsors));

        result.lineup.push(...await Promise.all(data.lineup.map(async (li) => {
            if (isParadeUnitRef(li)) {
                return ParadeUnit.deserialize(await readSerializedUnitForSchool<SerializedParadeUnit>(li.ref))
            }
            else {
                return BreakUnit.deserialize(li);
            }
        })));

        return result;
    }

    async getStaticProps() : Promise<ParadeStaticProps> {
        return {
            awardsTime: this.awardsTime,
            awardsLocation: this.awardsLocation,
            colors: this.colors,
            grandMarshal: await this.grandMarshal.getStaticProps(),
            lineup: await Promise.all(this.lineup.map(async (li) => getLineupItemStaticProps(li))),
            sponsors: await this.sponsors.getStaticProps(),
        }
    }
}
