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

    getStaticProps() : AnnouncerStaticProps {    
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

    getStaticProps() : ShowStaticProps {
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

    constructor(announcer : Announcer, version : number, show : Show, nextShow : Show, parade : Parade, fieldShow : FieldShow) {
        this.announcer = announcer;
        this.version = version;
        this.show = show;
        this.nextShow = nextShow;
        this.parade = parade;
        this.fieldShow = fieldShow;
    }

    static async deserialize(data : SerializedBandReview) : Promise<BandReview> {
        return new BandReview(Announcer.deserialize(data.announcer),
                              data.version,
                              Show.deserialize(data.show),
                              Show.deserialize(data.next_show),
                              await Parade.deserialize(data.parade),
                              await FieldShow.deserialize(data.fieldshow));
    }

    getStaticProps() : BandReviewStaticProps {
        return {
            announcer: this.announcer?.getStaticProps() || null,
            version: this.version,
            show: this.show?.getStaticProps() || null,
            nextShow: this.nextShow?.getStaticProps() || null,
            parade: this.parade.getStaticProps(),
            fieldShow: this.fieldShow.getStaticProps(),
        }
    }
}
