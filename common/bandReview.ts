import { Announcer, AnnouncerStaticProps, SerializedAnnouncer } from './announcer';
import { Concert, ConcertStaticProps, SerializedConcert } from './concert';
import { FieldShow, FieldShowStaticProps, SerializedFieldShow } from './fieldShow';
import { Parade, ParadeStaticProps, SerializedParade } from './parade';
import { ShowCitation, ShowCitationStaticProps, SerializedShowCitation } from './showCitation';

import yaml from 'yaml';

import fs from 'fs/promises';
import path from 'path';

type SerializedBandReview = {
    announcer : SerializedAnnouncer;
    version : number;
    show : SerializedShowCitation;
    next_show : SerializedShowCitation;
    parade : SerializedParade;
    fieldshow : SerializedFieldShow;
    concert : SerializedConcert;
}

type BandReviewStaticProps = {
    announcer : AnnouncerStaticProps;
    concert : ConcertStaticProps;
    fieldShow : FieldShowStaticProps;
    nextShow : ShowCitationStaticProps;
    parade : ParadeStaticProps;
    show : ShowCitationStaticProps;
    version : number;
};

export async function getBandReview() : Promise<BandReview> {
    return BandReview.deserialize(yaml.parse(await fs.readFile(path.join('source', 'band-review.yml'), 'utf8')));
}

class BandReview {
    readonly announcer : Announcer;
    readonly version : number;
    readonly show : ShowCitation;
    readonly nextShow : ShowCitation;
    readonly parade : Parade;
    readonly fieldShow : FieldShow;
    readonly concert : Concert;

    constructor(announcer : Announcer, version : number, show : ShowCitation, nextShow : ShowCitation, parade : Parade, fieldShow : FieldShow, concert : Concert) {
        this.announcer = announcer;
        this.version = version;
        this.show = show;
        this.nextShow = nextShow;
        this.parade = parade;
        this.fieldShow = fieldShow;
        this.concert = concert;
    }

    static async deserialize(data : SerializedBandReview) : Promise<BandReview> {
        return new BandReview(await Announcer.deserialize(data.announcer),
                              data.version,
                              await ShowCitation.deserialize(data.show),
                              await ShowCitation.deserialize(data.next_show),
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
