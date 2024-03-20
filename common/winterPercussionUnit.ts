import { Role, RoleStaticProps, SerializedRole } from './role';

import { DateTime } from 'luxon';

import { strict as assert } from 'assert';

type SerializedUnit = {
    isHost? : boolean;
    division? : string;    // division in which the unit is competing
    lastUpdated: string;
    nickname : string;
    directors : string[];
    staff? : SerializedRole[];
    leaders : SerializedRole[];
    program : string;
    music? : string;
    notes? : string;
}

export type SerializedWinterPercussionUnit = {
    [unitKey : string] : SerializedUnit;
    // @ts-ignore name is a required field
    name : string;
    // @ts-ignore city is a required field
    city : string;
}

export type WinterPercussionUnitStaticProps = {
    unitType : 'winterPercussionUnit';
    city : string;
    directors : string[];
    isHost : boolean;
    division : string;
    lastUpdated : string;
    leaders : RoleStaticProps[];
    music : string;
    nickname : string;
    notes : string;
    program : string;
    schoolName : string;
    staff : RoleStaticProps[];
}

export class WinterPercussionUnit {
    city : string           = '';
    division : string       = null;
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

    static async deserialize(data : SerializedWinterPercussionUnit, unitKey : string = 'winterpercussion') : Promise<WinterPercussionUnit> {
        const result = new WinterPercussionUnit();

        result.city = data.city;
        result.schoolName = data.name || '';

        const unit = data[unitKey];
        assert.ok(unit, `${data.name} has no winter percussion unit named "${unitKey}"`);

        assert.ok(unit.lastUpdated, `${data.name} winter percussion unit has no lastUpdated`);
        result.lastUpdated = DateTime.fromFormat(unit.lastUpdated, 'yyyy-MM-dd H:mm:ss Z');

        if (unit.directors) {
            result.directors.push(...unit.directors);
        }
        result.isHost = (unit.isHost || false);
        result.division = (unit.division || null);
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

    async getStaticProps() : Promise<WinterPercussionUnitStaticProps> {
        return {
            unitType: 'winterPercussionUnit',
            city: this.city,
            directors: this.directors,
            isHost: this.isHost,
            division: this.division || null,
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
