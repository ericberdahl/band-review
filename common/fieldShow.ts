import { AnthemPerformerUnit, type AnthemPerformerUnitStaticProps, type SerializedAnthemPerformerUnit } from './anthemPerformerUnit';
import { AwardsUnit, type AwardsUnitStaticProps, type SerializedAwardsUnit } from './awardsUnit';
import { BreakUnit, type BreakUnitStaticProps, type SerializedBreakUnit } from './breakUnit';
import { FieldShowUnit, type FieldShowUnitStaticProps, type SerializedFieldShowUnit } from './fieldShowUnit';
import { readSerializedUnitForSchool } from './showUnit'
import { CompetitionSponsors, type CompetitionSponsorsStaticProps, type SerializedCompetitionSponsors } from './sponsor';

import { strict as assert } from 'assert';

type SerializedFieldShowUnitRef = {
    ref: string;
}

type SerializedFieldShowLineupItem = SerializedAnthemPerformerUnit | SerializedAwardsUnit | SerializedBreakUnit | SerializedBreakUnit | SerializedFieldShowUnitRef;

function isAnthemPerformerShowUnit(item: SerializedFieldShowLineupItem): item is SerializedAnthemPerformerUnit {
    return (item as SerializedAnthemPerformerUnit).anthemPerformer !== undefined;
}

function isAwardsShowUnit(item: SerializedFieldShowLineupItem): item is SerializedAwardsUnit {
    return (item as SerializedAwardsUnit).awardsLabel !== undefined;
}

function isBreakShowUnit(item: SerializedFieldShowLineupItem): item is SerializedBreakUnit {
    return (item as SerializedBreakUnit).break !== undefined;
}

function isFieldShowUnitRef(item: SerializedFieldShowLineupItem): item is SerializedFieldShowUnitRef {
    return (item as SerializedFieldShowUnitRef).ref !== undefined;
}

export type SerializedFieldShow = {
    lineup: SerializedFieldShowLineupItem[];
    sponsors: SerializedCompetitionSponsors;
    start_time: string;    // hh:mmAM
}

type FieldShowLineupItemStaticProps = AnthemPerformerUnitStaticProps | AwardsUnitStaticProps | BreakUnitStaticProps | FieldShowUnitStaticProps;

export type FieldShowStaticProps = {
    lineup: FieldShowLineupItemStaticProps[];
    sponsors: CompetitionSponsorsStaticProps;
    startTime: string;
}

type FieldShowLineupItem = AnthemPerformerUnit | AwardsUnit | BreakUnit | FieldShowUnit;

export class FieldShow {
    readonly lineup: FieldShowLineupItem[] = [];
    readonly sponsors: CompetitionSponsors;
    readonly startTime: string;    // TODO: change to DateTime

    constructor(startTime: string, sponsors: CompetitionSponsors) {
        this.startTime = startTime;
        this.sponsors = sponsors;
    }

    static async deserialize(data: SerializedFieldShow): Promise<FieldShow> {
        const result = new FieldShow(data.start_time,
            await CompetitionSponsors.deserialize(data.sponsors));

        result.lineup.push(...await Promise.all(data.lineup.map(async (li) => {
            if (isFieldShowUnitRef(li)) {
                return FieldShowUnit.deserialize(await readSerializedUnitForSchool<SerializedFieldShowUnit>(li.ref))
                    .catch((e) => {
                        e.message = `${e.message}; deserializing FieldShowUnit "${li.ref}"`
                        throw e;
                    });
            }
            else if (isAnthemPerformerShowUnit(li)) {
                return AnthemPerformerUnit.deserialize(li)
                    .catch((e) => {
                        e.message = `${e.message}; deserializing field show AnthemPerformerUnit "${li.anthemPerformer}"`
                        throw e;
                    });
                ;
            }
            else if (isAwardsShowUnit(li)) {
                return AwardsUnit.deserialize(li)
                    .catch((e) => {
                        e.message = `${e.message}; deserializing field show AwardsUnit "${li.awardsLabel}"`
                        throw e;
                    });
            }
            else if (isBreakShowUnit(li)) {
                return BreakUnit.deserialize(li)
                    .catch((e) => {
                        e.message = `${e.message}; deserializing field show BreakUnit "${li.break}"`
                        throw e;
                    });
            }
            else {
                assert.fail(`Unrecognized field show lineup item: ${JSON.stringify(li)}`)
            }
        })));

        return result;
    }

    async getStaticProps(): Promise<FieldShowStaticProps> {
        return {
            startTime: this.startTime,
            lineup: await Promise.all(this.lineup.map(async (li) => li.getStaticProps())),
            sponsors: await this.sponsors.getStaticProps(),
        }
    }
}