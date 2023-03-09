import { Role, RoleStaticProps, SerializedRole } from './role'

import { DateTime } from 'luxon';

import { strict as assert } from 'assert';

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
    unitType : 'paradeUnit';
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

        const unit = data[unitKey];
        assert.ok(unit, `${data.name} has no parade unit named "${unitKey}"`);
        assert.ok(unit.directors, `${data.name}'s parade unit has no directors`);
        
        result.lastUpdated = DateTime.fromFormat(unit.lastUpdated, 'yyyy-MM-dd H:mm:ss Z');

        result.city = data.city;
        result.directors.push(...unit.directors);
        result.isHost = (unit.isHost || false);
        if (unit.leaders) {
            result.leaders.push(...await Promise.all(unit.leaders.map(async (s) => Role.deserialize(s))));
        }
        result.music = unit.music || '';
        result.nickname = unit.nickname || '';
        result.notes = unit.notes || '';
        result.schoolName = data.name || '';
        if (unit.staff) {
            result.staff.push(...await Promise.all(unit.staff.map(async (s) => Role.deserialize(s))));
        }

        return result;
    }

    async getStaticProps() : Promise<ParadeUnitStaticProps> {
        return {
            unitType: 'paradeUnit',
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
