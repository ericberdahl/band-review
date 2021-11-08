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
    name : string;
    city : string;
    fieldshow : SerializedUnit;
}

export type FieldShowUnitStaticProps = {
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

    static deserialize(data : SerializedFieldShowUnit) : FieldShowUnit {
        const result = new FieldShowUnit();

        result.city = data.city;
        result.schoolName = data.name || '';

        result.lastUpdated = DateTime.fromFormat(data.fieldshow.lastUpdated, 'yyyy-MM-dd H:mm:ss Z');

        result.description = data.fieldshow.description;
        result.directors.push(...data.fieldshow.directors);
        result.isHost = (data.fieldshow.isHost || false);
        if (data.fieldshow.leaders) {
            result.leaders.push(...data.fieldshow.leaders.map((s) => Role.deserialize(s)));
        }
        result.music = data.fieldshow.music || '';
        result.nickname = data.fieldshow.nickname || '';
        result.notes = data.fieldshow.notes || '';
        result.program = data.fieldshow.program || '';
        if (data.fieldshow.staff) {
            result.staff.push(...data.fieldshow.staff.map((s) => Role.deserialize(s)));
        }

        return result;
    }

    getStaticProps() : FieldShowUnitStaticProps {
        return {
            city: this.city,
            description: this.description || null,
            directors: this.directors,
            isHost: this.isHost,
            lastUpdated: this.lastUpdated.toISO(),
            leaders: this.leaders.map((l) => l.getStaticProps()),
            music: this.music || null,
            nickname: this.nickname,
            notes: this.notes || null,
            program: this.program || null,
            schoolName: this.schoolName,
            staff: this.staff.map((s) => s.getStaticProps()),
        }
    }
}
