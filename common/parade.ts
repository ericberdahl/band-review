import { BreakUnit, BreakUnitStaticProps, SerializedBreakUnit } from "./breakUnit";
import { ColorsUnit, ColorsUnitStaticProps, SerializedColorsUnit } from "./colorsUnit";
import { GrandMarshalUnit, GrandMarshalUnitStaticProps, SerializedGrandMarshalUnit } from "./grandMarshalUnit";
import { ParadeUnit, ParadeUnitStaticProps, SerializedParadeUnit } from "./paradeUnit";
import { readSerializedUnitForSchool } from './showUnit'
import { CompetitionSponsors, CompetitionSponsorsStaticProps, SerializedCompetitionSponsors } from "./sponsor";

import { strict as assert } from 'assert';

type SerializedParadeUnitRef = {
    ref : string;
}

type SerializedParadeLineupItem = SerializedParadeUnitRef | SerializedBreakUnit | SerializedColorsUnit | SerializedGrandMarshalUnit;

function isParadeUnitRef(item : SerializedParadeLineupItem) : item is SerializedParadeUnitRef {
    return (item as SerializedParadeUnitRef).ref !== undefined;
}

function isBreakShowUnit(item : SerializedParadeLineupItem) : item is SerializedBreakUnit {
    return (item as SerializedBreakUnit).break !== undefined;
}

function isColorsShowUnit(item : SerializedParadeLineupItem) : item is SerializedColorsUnit {
    return (item as SerializedColorsUnit).colors !== undefined;
}

function isGrandMarshalShowUnit(item : SerializedParadeLineupItem) : item is SerializedGrandMarshalUnit {
    return (item as SerializedGrandMarshalUnit).grandMarshal !== undefined;
}

export type SerializedParade = {
    awards_location : string;
    awards_time : string;
    lineup : SerializedParadeLineupItem[];
    sponsors : SerializedCompetitionSponsors;
}

type ParadeLineupItemStaticProps = BreakUnitStaticProps | ParadeUnitStaticProps | ColorsUnitStaticProps | GrandMarshalUnitStaticProps;

export type ParadeStaticProps = {
    awardsTime : string;    // ISO DateTime format
    awardsLocation : string;
    lineup : ParadeLineupItemStaticProps[];
    sponsors : CompetitionSponsorsStaticProps;
}

type ParadeLineupItem = ParadeUnit | BreakUnit | ColorsUnit | GrandMarshalUnit;

export class Parade {
    readonly awardsLocation : string;
    readonly awardsTime : string;   // TODO: change to DateTime
    readonly lineup : ParadeLineupItem[]    = [];
    readonly sponsors : CompetitionSponsors;

    constructor(awardsTime : string, awardsLocation : string, sponsors : CompetitionSponsors) {
        this.awardsTime = awardsTime;
        this.awardsLocation = awardsLocation;
        this.sponsors = sponsors;
    }

    static async deserialize(data : SerializedParade) : Promise<Parade> {
        const result = new Parade(data.awards_time,
                                  data.awards_location,
                                  await CompetitionSponsors.deserialize(data.sponsors));

        result.lineup.push(...await Promise.all(data.lineup.map(async (li) => {
            if (isParadeUnitRef(li)) {
                return ParadeUnit.deserialize(await readSerializedUnitForSchool<SerializedParadeUnit>(li.ref))
            }
            else if (isBreakShowUnit(li)) {
                return BreakUnit.deserialize(li);
            }
            else if (isColorsShowUnit(li)) {
                return ColorsUnit.deserialize(li);
            }
            else if (isGrandMarshalShowUnit(li)) {
                return GrandMarshalUnit.deserialize(li);
            }
            else {
                assert.fail(`Unrecognized parade lineup item: ${JSON.stringify(li)}`)
            }
        })));

        return result;
    }

    async getStaticProps() : Promise<ParadeStaticProps> {
        return {
            awardsTime: this.awardsTime,
            awardsLocation: this.awardsLocation,
            lineup: await Promise.all(this.lineup.map(async (li) => li.getStaticProps())),
            sponsors: await this.sponsors.getStaticProps(),
        }
    }
}
