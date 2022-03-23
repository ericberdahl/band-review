import { DateTime } from 'luxon';

export type SerializedShowCitation = {
    date : string;
    citation : string;
}

export type ShowCitationStaticProps = {
    date : string;  // ISO date format
    citation : string;
}

export class ShowCitation {
    readonly date : DateTime;
    readonly citation : string;

    constructor(date : DateTime, citation : string) {
        this.date = date;
        this.citation = citation;
    }

    static async deserialize(data : SerializedShowCitation) : Promise<ShowCitation> {
        return new ShowCitation(DateTime.fromISO(data.date, { setZone: 'America/Los Angeles' }), data.citation);
    }

    async getStaticProps() : Promise<ShowCitationStaticProps> {
        return {
            date: this.date.toISO(),
            citation: this.citation
        }
    }    
}
