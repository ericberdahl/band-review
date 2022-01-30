import { Concert, ConcertStaticProps, SerializedConcert } from './concert';
import { FieldShow, FieldShowStaticProps, SerializedFieldShow } from './fieldShow';
import { Parade, ParadeStaticProps, SerializedParade } from './parade';

import { DateTime } from 'luxon';
import yaml from 'yaml';

import fs from 'fs/promises';
import path from 'path';

type SerializedAnnouncer = {
    name : string;
    email : string;
}

type SerializedShow = {
    date : string;
    citation : string;
}

type SerializedBandReview = {
    announcer : SerializedAnnouncer;
    version : number;
    show : SerializedShow;
    next_show : SerializedShow;
    parade : SerializedParade;
    fieldshow : SerializedFieldShow;
    concert : SerializedConcert;
}

type AnnouncerStaticProps = {
    name : string;
    email : string;
}

type ShowStaticProps = {
    date : string;  // ISO date format
    citation : string;
}

type BandReviewStaticProps = {
    announcer : AnnouncerStaticProps;
    concert : ConcertStaticProps;
    fieldShow : FieldShowStaticProps;
    nextShow : ShowStaticProps;
    parade : ParadeStaticProps;
    show : ShowStaticProps;
    version : number;
};

export async function getBandReview() : Promise<BandReview> {
    const docs = yaml.parseAllDocuments(await fs.readFile(path.join('source', 'band-review.hbs'), 'utf8'));

    return BandReview.deserialize(docs[0].toJSON());
}

class Announcer {
    readonly name : string;
    readonly email : string;

    constructor(name : string, email: string) {
        this.name = name;
        this.email = email;
    }

    static deserialize(data : SerializedAnnouncer) : Announcer {
        return new Announcer(data.name, data.email);
    }

    async getStaticProps() : Promise<AnnouncerStaticProps> {    
        return {
            name: this.name,
            email: this.email
        }
    }    
}

class Show {
    readonly date : DateTime;
    readonly citation : string;

    constructor(date : DateTime, citation : string) {
        this.date = date;
        this.citation = citation;
    }

    static deserialize(data : SerializedShow) : Show {
        return new Show(DateTime.fromISO(data.date, { setZone: 'America/Los Angeles' }), data.citation);
    }

    async getStaticProps() : Promise<ShowStaticProps> {
        return {
            date: this.date.toISO(),
            citation: this.citation
        }
    }    
}

class BandReview {
    readonly announcer : Announcer;
    readonly version : number;
    readonly show : Show;
    readonly nextShow : Show;
    readonly parade : Parade;
    readonly fieldShow : FieldShow;
    readonly concert : Concert;

    constructor(announcer : Announcer, version : number, show : Show, nextShow : Show, parade : Parade, fieldShow : FieldShow, concert : Concert) {
        this.announcer = announcer;
        this.version = version;
        this.show = show;
        this.nextShow = nextShow;
        this.parade = parade;
        this.fieldShow = fieldShow;
        this.concert = concert;
    }

    static async deserialize(data : SerializedBandReview) : Promise<BandReview> {
        return new BandReview(Announcer.deserialize(data.announcer),
                              data.version,
                              Show.deserialize(data.show),
                              Show.deserialize(data.next_show),
                              await Parade.deserialize(data.parade),
                              await FieldShow.deserialize(data.fieldshow),
                              await Concert.deserialize(data.concert));
    }

    async getStaticProps() : Promise<BandReviewStaticProps> {
        // TODO : why is announcer optional?
        // TODO : why is show optional?
        // TODO : why is nextShow optional?
        return {
            announcer: (await this.announcer?.getStaticProps()) || null,
            concert: await this.concert.getStaticProps(),
            fieldShow: await this.fieldShow.getStaticProps(),
            parade: await this.parade.getStaticProps(),
            show: (await this.show?.getStaticProps()) || null,
            nextShow: (await this.nextShow?.getStaticProps()) || null,
            version: this.version,
        }
    }
}