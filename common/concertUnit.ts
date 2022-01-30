import { DateTime } from 'luxon';

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

    static deserialize(data : SerializedConcertUnit, unitKey : string = 'concert') : ConcertUnit {
        const result = new ConcertUnit();

        result.city = data.city;
        result.schoolName = data.name || '';

        result.lastUpdated = DateTime.fromFormat(data[unitKey].lastUpdated, 'yyyy-MM-dd H:mm:ss Z');
        result.nickname = data[unitKey].nickname || '';

        return result;
    }

    async getStaticProps() : Promise<ConcertUnitStaticProps> {
        return {
            city: this.city,
            lastUpdated: this.lastUpdated.toISO(),
            nickname: this.nickname,
            schoolName: this.schoolName,
        }
    }
}
