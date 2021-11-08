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
    name : string;
    city : string;
    parade : SerializedUnit;
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

    static deserialize(data : SerializedParadeUnit) : ParadeUnit {
        const result = new ParadeUnit();

       result.lastUpdated = DateTime.fromFormat(data.parade.lastUpdated, 'yyyy-MM-dd H:mm:ss Z');

        result.city = data.city;
        result.directors.push(...data.parade.directors);
        result.isHost = (data.parade.isHost || false);
        if (data.parade.leaders) {
            result.leaders.push(...data.parade.leaders.map((s) => Role.deserialize(s)));
        }
        result.music = data.parade.music || '';
        result.nickname = data.parade.nickname || '';
        result.notes = data.parade.notes || '';
        result.schoolName = data.name || '';
        if (data.parade.staff) {
            result.staff.push(...data.parade.staff.map((s) => Role.deserialize(s)));
        }

        return result;
    }

    getStaticProps() : ParadeUnitStaticProps {
        return {
            city: this.city,
            directors: this.directors,
            isHost: this.isHost,
            lastUpdated: this.lastUpdated.toISO(),
            leaders: this.leaders.map((l) => l.getStaticProps()),
            music: this.music,
            nickname: this.nickname,
            notes: this.notes,
            schoolName: this.schoolName,
            staff: this.staff.map((s) => s.getStaticProps()),
        }
    }
}
