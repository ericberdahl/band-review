import { BreakUnit, BreakUnitStaticProps, SerializedBreakUnit } from './breakUnit';
import { WinterGuardUnit, WinterGuardUnitStaticProps, SerializedWinterGuardUnit } from './winterGuardUnit';
import { readSerializedUnitForSchool } from './showUnit'
import { CompetitionSponsors, CompetitionSponsorsStaticProps, SerializedCompetitionSponsors } from './sponsor';

type SerializedWinterGuardUnitRef = {
    ref : string;
    unit? : string;
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
                return WinterGuardUnit.deserialize(await readSerializedUnitForSchool<SerializedWinterGuardUnit>(li.ref), li.unit)
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
