import { Role, RoleStaticProps, SerializedRole } from './role';

import { DateTime } from 'luxon';

import { strict as assert } from 'assert';

type SerializedUnit = {
    isHost? : boolean;
    lastUpdated: string;
    nickname : string;
    directors : string[];
    staff? : SerializedRole[];
    leaders : SerializedRole[];
    program : string;
    music? : string;
    notes? : string;
}

export type SerializedWinterGuardUnit = {
    [unitKey : string] : SerializedUnit;
    // @ts-ignore name is a required field
    name : string;
    // @ts-ignore city is a required field
    city : string;
}

export type WinterGuardUnitStaticProps = {
    unitType : 'winterGuardUnit';
    city : string;
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

export class WinterGuardUnit {
    city : string           = '';
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

    static async deserialize(data : SerializedWinterGuardUnit, unitKey : string = 'winterguard') : Promise<WinterGuardUnit> {
        const result = new WinterGuardUnit();

        result.city = data.city;
        result.schoolName = data.name || '';

        const unit = data[unitKey];
        assert.ok(unit, `${data.name} has no winter guard unit named "${unitKey}"`);

        assert.ok(unit.lastUpdated, `${data.name} winter guard unit has no lastUpdated`);
        result.lastUpdated = DateTime.fromFormat(unit.lastUpdated, 'yyyy-MM-dd H:mm:ss Z');

        if (unit.directors) {
            result.directors.push(...unit.directors);
        }
        result.isHost = (unit.isHost || false);
        if (unit.leaders) {
            result.leaders.push(...await Promise.all(unit.leaders.map(async (s) => Role.deserialize(s))));
        }
        result.music = unit.music || '';
        result.nickname = unit.nickname || '';
        result.notes = unit.notes || '';
        result.program = unit.program || '';
        if (unit.staff) {
            result.staff.push(...await Promise.all(unit.staff.map(async (s) => Role.deserialize(s))));
        }

        return result;
    }

    async getStaticProps() : Promise<WinterGuardUnitStaticProps> {
        return {
            unitType: 'winterGuardUnit',
            city: this.city,
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
