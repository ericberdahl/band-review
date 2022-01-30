import { BreakUnit, BreakUnitStaticProps, SerializedBreakUnit } from './breakUnit';
import { ConcertUnit, ConcertUnitStaticProps, SerializedConcertUnit } from './concertUnit';

import sanitize from "sanitize-filename";
import yaml from 'yaml';

import path from 'path';
import fs from 'fs/promises';

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

type ConcertLineupItemStaticProps = {
    type : 'break' | 'unit';
    item : BreakUnitStaticProps | ConcertUnitStaticProps;
}

export type ConcertStaticProps = {
    lineup : ConcertLineupItemStaticProps[];
}

type ConcertLineupItem = ConcertUnit | BreakUnit;

async function getLineupItemStaticProps(item : ConcertLineupItem) : Promise<ConcertLineupItemStaticProps> {
    if (item instanceof BreakUnit) {
        return {
            type: 'break',
            item: await item.getStaticProps()
        }
    }
    else if (item instanceof ConcertUnit) {
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
            lineup: await Promise.all(this.lineup.map(async (li) => getLineupItemStaticProps(li))),
        }
    }
}
