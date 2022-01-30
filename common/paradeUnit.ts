import { Role, RoleStaticProps, SerializedRole } from './role'

import { DateTime } from 'luxon';

type SerializedUnit = {
    isHost? : boolean;
    lastUpdated: string;
    nickname : string;
    directors : string[];
    staff : SerializedRole[];
    leaders : SerializedRole[];
    music : string;
    notes : string;
}

export type SerializedParadeUnit = {
    [unitKey : string ] : SerializedUnit;
    // @ts-ignore name is a required field
    name : string;
    // @ts-ignore city is a required field
    city : string;
}

export type ParadeUnitStaticProps = {
    city : string;
    directors : string[];
    isHost : boolean;
    lastUpdated : string;
    leaders : RoleStaticProps[];
    music : string;
    nickname : string;
    notes : string;
    schoolName : string;
    staff : RoleStaticProps[];
}

export class ParadeUnit {
    city : string           = '';
    directors : string[]    = [];
    isHost : boolean        = false;
    lastUpdated : DateTime;
    leaders : Role[]        = [];
    music : string          = '';
    nickname : string       = '';
    notes : string          = '';
    schoolName : string     = '';
    staff : Role[]          = [];

    static async deserialize(data : SerializedParadeUnit, unitKey : string = 'parade') : Promise<ParadeUnit> {
        const result = new ParadeUnit();

       result.lastUpdated = DateTime.fromFormat(data[unitKey].lastUpdated, 'yyyy-MM-dd H:mm:ss Z');

        result.city = data.city;
        result.directors.push(...data[unitKey].directors);
        result.isHost = (data[unitKey].isHost || false);
        if (data[unitKey].leaders) {
            result.leaders.push(...await Promise.all(data[unitKey].leaders.map(async (s) => Role.deserialize(s))));
        }
        result.music = data[unitKey].music || '';
        result.nickname = data[unitKey].nickname || '';
        result.notes = data[unitKey].notes || '';
        result.schoolName = data.name || '';
        if (data[unitKey].staff) {
            result.staff.push(...await Promise.all(data[unitKey].staff.map(async (s) => Role.deserialize(s))));
        }

        return result;
    }

    async getStaticProps() : Promise<ParadeUnitStaticProps> {
        return {
            city: this.city,
            directors: this.directors,
            isHost: this.isHost,
            lastUpdated: this.lastUpdated.toISO(),
            leaders: await Promise.all(this.leaders.map(async (l) => l.getStaticProps())),
            music: this.music,
            nickname: this.nickname,
            notes: this.notes,
            schoolName: this.schoolName,
            staff: await Promise.all(this.staff.map(async (s) => s.getStaticProps())),
        }
    }
}
