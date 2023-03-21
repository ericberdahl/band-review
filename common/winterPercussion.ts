import { BreakUnit, BreakUnitStaticProps, SerializedBreakUnit } from './breakUnit';
import { WinterPercussionUnit, WinterPercussionUnitStaticProps, SerializedWinterPercussionUnit } from './winterPercussionUnit';
import { readSerializedUnitForSchool } from './showUnit'
import { CompetitionSponsors, CompetitionSponsorsStaticProps, SerializedCompetitionSponsors } from './sponsor';

type SerializedWinterPercussionUnitRef = {
    ref : string;
    unit? : string;
}

type SerializedFieldShowLineupItem = SerializedWinterPercussionUnitRef | SerializedBreakUnit;

function isWinterPercussionUnitRef(item : SerializedFieldShowLineupItem) : item is SerializedWinterPercussionUnitRef {
    return (item as SerializedWinterPercussionUnitRef).ref !== undefined;
}

export type SerializedWinterPercussion = {
    lineup : SerializedFieldShowLineupItem[];
    sponsors : SerializedCompetitionSponsors;
    start_time : string;    // hh:mmAM
}

type WinterPercussionLineupItemStaticProps = BreakUnitStaticProps | WinterPercussionUnitStaticProps;

export type WinterPercussionStaticProps = {
    lineup : WinterPercussionLineupItemStaticProps[];
    sponsors : CompetitionSponsorsStaticProps;
    startTime : string;
}

type WinterPercussionLineupItem = WinterPercussionUnit | BreakUnit;

export class WinterPercussion {
    readonly lineup : WinterPercussionLineupItem[] = [];
    readonly sponsors : CompetitionSponsors;
    readonly startTime : string;    // TODO: change to DateTime

    constructor(startTime : string, sponsors : CompetitionSponsors) {
        this.startTime = startTime;
        this.sponsors = sponsors;
    }

    static async deserialize(data : SerializedWinterPercussion) : Promise<WinterPercussion> {
        const result = new WinterPercussion(data.start_time,
                                            await CompetitionSponsors.deserialize(data.sponsors));

        result.lineup.push(...await Promise.all(data.lineup.map(async (li) => {
            if (isWinterPercussionUnitRef(li)) {
                return WinterPercussionUnit.deserialize(await readSerializedUnitForSchool<SerializedWinterPercussionUnit>(li.ref), li.unit)
            }
            else {
                return BreakUnit.deserialize(li);
            }
        })));

        return result;
    }

    async getStaticProps() : Promise<WinterPercussionStaticProps> {
        return {
            startTime: this.startTime,
            lineup: await Promise.all(this.lineup.map(async (li) => li.getStaticProps())),
            sponsors: await this.sponsors.getStaticProps(),
        }
    }
}
