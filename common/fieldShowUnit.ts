import { Role, RoleStaticProps, SerializedRole } from './role';

import { DateTime } from 'luxon';

type SerializedUnit = {
    isHost? : boolean;
    lastUpdated: string;
    nickname : string;
    directors : string[];
    staff? : SerializedRole[];
    leaders : SerializedRole[];
    program : string;
    music? : string;
    description? : string;
    notes? : string;
}

export type SerializedFieldShowUnit = {
    [unitKey : string] : SerializedUnit;
    // @ts-ignore name is a required field
    name : string;
    // @ts-ignore city is a required field
    city : string;
}

export type FieldShowUnitStaticProps = {
    unitType : 'fieldShowUnit';
    city : string;
    description : string;
    directors : string[];
    isHost : boolean;
    lastUpdated : string;
    leaders : RoleStaticProps[];
    music : string;
    nickname : string;
    notes : string;
    program : string;
    schoolName : string;
    staff : RoleStaticProps[];
}

export class FieldShowUnit {
    city : string           = '';
    description : string    = '';
    directors : string[]    = [];
    isHost : boolean        = false;
    lastUpdated : DateTime;
    leaders : Role[]        = [];
    music : string          = '';
    nickname : string       = '';
    notes : string          = '';
    program : string        = '';
    schoolName : string     = '';
    staff : Role[]          = [];

    static async deserialize(data : SerializedFieldShowUnit, unitKey : string = 'fieldshow') : Promise<FieldShowUnit> {
        const result = new FieldShowUnit();

        result.city = data.city;
        result.schoolName = data.name || '';

        result.lastUpdated = DateTime.fromFormat(data[unitKey].lastUpdated, 'yyyy-MM-dd H:mm:ss Z');

        result.description = data[unitKey].description;
        result.directors.push(...data[unitKey].directors);
        result.isHost = (data[unitKey].isHost || false);
        if (data[unitKey].leaders) {
            result.leaders.push(...await Promise.all(data[unitKey].leaders.map(async (s) => Role.deserialize(s))));
        }
        result.music = data[unitKey].music || '';
        result.nickname = data[unitKey].nickname || '';
        result.notes = data[unitKey].notes || '';
        result.program = data[unitKey].program || '';
        if (data[unitKey].staff) {
            result.staff.push(...await Promise.all(data[unitKey].staff.map(async (s) => Role.deserialize(s))));
        }

        return result;
    }

    async getStaticProps() : Promise<FieldShowUnitStaticProps> {
        return {
            unitType: 'fieldShowUnit',
            city: this.city,
            description: this.description || null,
            directors: this.directors,
            isHost: this.isHost,
            lastUpdated: this.lastUpdated.toISO(),
            leaders: await Promise.all(this.leaders.map(async (l) => l.getStaticProps())),
            music: this.music || null,
            nickname: this.nickname,
            notes: this.notes || null,
            program: this.program || null,
            schoolName: this.schoolName,
            staff: await Promise.all(this.staff.map(async (s) => s.getStaticProps())),
        }
    }
}
