import { Announcer, AnnouncerStaticProps, SerializedAnnouncer } from './announcer';
import { ShowCitation, ShowCitationStaticProps, SerializedShowCitation } from './showCitation';
import { WinterGuard, WinterGuardStaticProps, SerializedWinterGuard } from './winterGuard';
import { WinterPercussion, WinterPercussionStaticProps, SerializedWinterPercussion } from './winterPercussion';

import yaml from 'yaml';

import fs from 'fs/promises';
import path from 'path';

type SerializedWinterShow = {
    announcer : SerializedAnnouncer;
    version : number;
    show : SerializedShowCitation;
    next_show : SerializedShowCitation;
    units : string[];
    winterguard : SerializedWinterGuard;
    winterpercussion : SerializedWinterPercussion;
}

type BandReviewStaticProps = {
    announcer : AnnouncerStaticProps;
    nextShow : ShowCitationStaticProps;
    show : ShowCitationStaticProps;
    version : number;
    winterGuard : WinterGuardStaticProps;
    winterPercussion : WinterPercussionStaticProps;
};

export async function getWinterShow() : Promise<WinterShow> {
    try {
        return WinterShow.deserialize(yaml.parse(await fs.readFile(path.join('source', 'winter-show.yml'), 'utf8')));
    }
    catch (e)
    {
        e.message = `${e.message}; parsing winter show data`
        throw e;
    }
}

class WinterShow {
    readonly announcer : Announcer;
    readonly version : number;
    readonly show : ShowCitation;
    readonly nextShow : ShowCitation;
    readonly winterGuard : WinterGuard;
    readonly winterPercussion : WinterPercussion;

    constructor(announcer : Announcer, version : number, show : ShowCitation, nextShow : ShowCitation, winterGuard : WinterGuard, winterPercussion : WinterPercussion) {
        this.announcer = announcer;
        this.version = version;
        this.show = show;
        this.nextShow = nextShow;
        this.winterGuard = winterGuard;
        this.winterPercussion = winterPercussion;
    }

    static async deserialize(data : SerializedWinterShow) : Promise<WinterShow> {
        return new WinterShow(await Announcer.deserialize(data.announcer),
                              data.version,
                              await ShowCitation.deserialize(data.show),
                              await ShowCitation.deserialize(data.next_show),
                              await WinterGuard.deserialize(data.winterguard),
                              await WinterPercussion.deserialize(data.winterpercussion));
    }

    async getStaticProps() : Promise<BandReviewStaticProps> {
        // TODO : why is announcer optional?
        // TODO : why is show optional?
        // TODO : why is nextShow optional?
        return {
            announcer: (await this.announcer?.getStaticProps()) || null,
            show: (await this.show?.getStaticProps()) || null,
            nextShow: (await this.nextShow?.getStaticProps()) || null,
            version: this.version,
            winterGuard: await this.winterGuard.getStaticProps(),
            winterPercussion: await this.winterPercussion.getStaticProps(),
        }
    }
}
