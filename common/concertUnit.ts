import { DateTime } from 'luxon';

import { strict as assert } from 'assert';

type SerializedUnit = {
    lastUpdated: string;
    nickname : string;
}

export type SerializedConcertUnit = {
    [unitKey : string] : SerializedUnit;
    // @ts-ignore name is a required field
    name : string;
    // @ts-ignore city is a required field
    city : string;
}

export type ConcertUnitStaticProps = {
    unitType : 'concertUnit';
    city : string;
    lastUpdated : string;
    nickname : string;
    schoolName : string;
}

export class ConcertUnit {
    city : string           = '';
    lastUpdated : DateTime;
    nickname : string       = '';
    schoolName : string     = '';

    static async deserialize(data : SerializedConcertUnit, unitKey : string = 'concert') : Promise<ConcertUnit> {
        const result = new ConcertUnit();

        const unit = data[unitKey];
        assert.ok(unit, `${data.name} has no concert unit named "${unitKey}"`);

        result.city = data.city;
        result.schoolName = data.name || '';

        result.lastUpdated = DateTime.fromFormat(unit.lastUpdated, 'yyyy-MM-dd H:mm:ss Z');
        result.nickname = unit.nickname || '';

        return result;
    }

    async getStaticProps() : Promise<ConcertUnitStaticProps> {
        return {
            unitType: 'concertUnit',
            city: this.city,
            lastUpdated: this.lastUpdated.toISO(),
            nickname: this.nickname,
            schoolName: this.schoolName,
        }
    }
}
