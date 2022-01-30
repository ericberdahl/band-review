type SerializedSponsor = {
    sponsor : string;
    presenter? : string;
    dedication? : string;
    message? : string;
}

type SerializedTrophySponsorship = {
    place : string;
    sponsors : SerializedSponsor[];
}

export type SerializedCompetitionSponsors = {
    general : string[];
    trophies : SerializedTrophySponsorship[];
}

type SponsorStaticProps = {
    name : string;
    presenter : string;
    dedication : string;
    message : string;
}

type TrophySponsorshipStaticProps = {
    place : string;
    sponsors : SponsorStaticProps[];
}

export type CompetitionSponsorsStaticProps = {
    general : string[];
    trophies : TrophySponsorshipStaticProps[];
}

class Sponsor {
    readonly name : string;
    presenter : string;
    dedication : string;
    message : string;

    constructor(name : string) {
        this.name = name;
    }

    static deserialize(data : SerializedSponsor) : Sponsor {
        const result = new Sponsor(data.sponsor);

        result.presenter = data.presenter;
        result.dedication = data.dedication;
        result.message = data.message;

        return result;
    }

    async getStaticProps() : Promise<SponsorStaticProps> {
        return {
            name: this.name,
            presenter: this.presenter || null,
            dedication: this.dedication || null,
            message: this.message || null,
        }
    }
}

class TrophySponsorship {
    readonly place : string;
    readonly sponsors : Sponsor[];

    constructor(place : string) {
        this.place = place;
        this.sponsors = [];
    }

    static deserialize(data : SerializedTrophySponsorship) : TrophySponsorship {
        const result = new TrophySponsorship(data.place);
        
        result.sponsors.push(...data.sponsors.map((s) => Sponsor.deserialize(s)));

        return result;
    }

    async getStaticProps() : Promise<TrophySponsorshipStaticProps> {
        return {
            place: this.place,
            sponsors: await Promise.all(this.sponsors.map(async (s) => s.getStaticProps())),
        }
    }
}

export class CompetitionSponsors {
    readonly generalSponsors : string[] = [];
    readonly trophies : TrophySponsorship[] = [];

    static deserialize(data : SerializedCompetitionSponsors) : CompetitionSponsors {
        const result = new CompetitionSponsors();
        
        result.generalSponsors.push(...data.general);
        result.trophies.push(...data.trophies.map((t) => TrophySponsorship.deserialize(t)))

        return result;
    }

    async getStaticProps() : Promise<CompetitionSponsorsStaticProps> {
        return {
            general: this.generalSponsors,
            trophies: await Promise.all(this.trophies.map(async (t) => t.getStaticProps())),
        }
    }
}