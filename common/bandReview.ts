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

type SerializedFieldShow = {
    start_time : string;
    anthem_performer? : string;
    lineup : [];        // IFieldCompetitionSegments[]
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

function announcerStaticProps(announcer : Announcer) : AnnouncerStaticProps {
    if (!announcer) return null;

    return {
        name: announcer.name,
        email: announcer.email
    }
}

function showStaticProps(show : Show) : ShowStaticProps {
    if (!show) return null;

    return {
        date: show.date.toISO(),
        citation: show.citation
    }
}

type FieldShowStaticProps = any;    // TODO: change to real type

function fieldShowStaticProps(fieldShow : FieldShow) : FieldShowStaticProps {
    return {
        missingData: fieldShow.missingData,
        schools: fieldShow.schools,
    }
}

function deserializeAnnouncer(data : SerializedAnnouncer) : Announcer {
    return new Announcer(data.name, data.email);
}

function deserializeShow(data : SerializedShow) : Show {
    return new Show(DateTime.fromISO(data.date, { setZone: 'America/Los Angeles' }), data.citation);
}

class Announcer {
    readonly name : string;
    readonly email : string;

    constructor(name : string, email: string) {
        this.name = name;
        this.email = email;
    }
}

class Show {
    readonly date : DateTime;
    readonly citation : string;

    constructor(date : DateTime, citation : string) {
        this.date = date;
        this.citation = citation;
    }
}

class FieldShow {
    readonly missingData = [];
    readonly schools = [];
}

class BandReview {
    readonly announcer : Announcer;
    readonly version : number;
    readonly show : Show;
    readonly nextShow : Show;
    readonly parade : Parade;
    readonly fieldShow : FieldShow;

    constructor(announcer : Announcer, version : number, show : Show, nextShow : Show, parade : Parade) {
        this.announcer = announcer;
        this.version = version;
        this.show = show;
        this.nextShow = nextShow;
        this.parade = parade;
        this.fieldShow = new FieldShow();
    }

    static async deserialize(data : SerializedBandReview) : Promise<BandReview> {
        return new BandReview(deserializeAnnouncer(data.announcer),
                                data.version,
                                deserializeShow(data.show),
                                deserializeShow(data.next_show),
                                await Parade.deserialize(data.parade));
    }

    getStaticProps() : BandReviewStaticProps {
        return {
            announcer: announcerStaticProps(this.announcer),
            version: this.version,
            show: showStaticProps(this.show),
            nextShow: showStaticProps(this.nextShow),
            parade: this.parade.getStaticProps(),
            fieldShow: fieldShowStaticProps(this.fieldShow),
        }
    }
}
