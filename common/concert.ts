import { BreakUnit, BreakUnitStaticProps, SerializedBreakUnit } from './breakUnit';
import { ConcertUnit, ConcertUnitStaticProps, SerializedConcertUnit } from './concertUnit';
import { readSerializedUnitForSchool } from './showUnit'

type SerializedConcertUnitRef = {
    ref : string;
    unit? : string;
}

type SerializedConcertLineupItem = SerializedConcertUnitRef | SerializedBreakUnit;

function isConcertUnitRef(item : SerializedConcertLineupItem) : item is SerializedConcertUnitRef {
    return (item as SerializedConcertUnitRef).ref !== undefined;
}

export type SerializedConcert = {
    lineup : SerializedConcertLineupItem[];
}

type ConcertLineupItemStaticProps = BreakUnitStaticProps | ConcertUnitStaticProps;

export type ConcertStaticProps = {
    lineup : ConcertLineupItemStaticProps[];
}

type ConcertLineupItem = ConcertUnit | BreakUnit;

export class Concert {
    readonly lineup : ConcertLineupItem[] = [];

    constructor() {
    }

    static async deserialize(data : SerializedConcert) : Promise<Concert> {
        const result = new Concert();

        result.lineup.push(...await Promise.all(data.lineup.map(async (li) => {
            if (isConcertUnitRef(li)) {
                return ConcertUnit.deserialize(await readSerializedUnitForSchool<SerializedConcertUnit>(li.ref), li.unit);
            }
            else {
                return BreakUnit.deserialize(li);
            }
        })));

        return result;
    }

    async getStaticProps() : Promise<ConcertStaticProps> {
        return {
            lineup: await Promise.all(this.lineup.map(async (li) => li.getStaticProps())),
        }
    }
}
