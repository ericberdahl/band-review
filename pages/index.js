import Parade from '../components/parade'
import PageBreak from '../components/pageBreak';

import { getBandReview } from '../common/bandReview';

import { DateTime } from "luxon";

function TableOfContents() {
    return (
        <div>
            TODO: Write table of contents
        </div>
    );
}

function FieldShow() {
    return (
        <div>
            TODO: Write the fieldshow
        </div>
    );
}

function HomePage({ bandReview }) {
    const generationDate = DateTime.now();

    const showYear = DateTime.fromISO(bandReview.show.date).year;

    const paradeSchools = bandReview.parade.lineup.filter((li) => li.type == 'unit')
                                    .map((li) => li.item)
                                    .sort((a, b) => a.schoolName.localeCompare(b.schoolName));

    const paradeMissingData = paradeSchools.filter((s) => DateTime.fromISO(s.lastUpdated).year != showYear);
    const paradeWithData = paradeSchools.filter((s) => DateTime.fromISO(s.lastUpdated).year == showYear);

    const fieldShowMissingData = [];
    const fieldShowSchools = [];

    return (
        <div>
            <h1>{bandReview.show.citation} Announcer's Book: {DateTime.fromISO(bandReview.show.date).toLocaleString(DateTime.DATE_FULL)}</h1>
            <p>{bandReview.announcer.name} &lt;{bandReview.announcer.email}&gt;</p>
            <p>v{bandReview.version}, {generationDate.toLocaleString(DateTime.DATETIME_FULL)} </p>
            <TableOfContents/>

            <h2>Band Review - Checkup</h2>

            <h3>{paradeMissingData.length} Schools Missing Parade Data</h3>
            {paradeMissingData.map((s) => (
                <p key={s.schoolName}>{s.schoolName}</p>
            ))}

            <h3>{fieldShowMissingData.length} Schools Missing Field Show Data</h3>

            `#each` bandReview.fieldShow._schoolsMissingData `schoolName` +

            <h3>{paradeSchools.length} Schools with Parade Data</h3>
            {paradeWithData.map((s) => (
                <p key={s.schoolName}>{s.schoolName}</p>
            ))}

            <h3>{fieldShowSchools.length} Schools with Field Show Data</h3>

            `#each` bandReview.fieldShow._schoolsUpToDate `schoolName` +

            <PageBreak/>

            <Parade parade={bandReview.parade} show={bandReview.show} nextShow={bandReview.nextShow} fieldShow={bandReview.fieldShow}/>

            <FieldShow/>

            <h2>Band Review - Close</h2>
            <p>
                This concludes the {bandReview.show.citation}.
                Thank you and congratulations to all the bands we’ve seen today, and thank you all for attending and cheering on these fine young performers.
            </p>
            <p>
                Mark your calendars to join us again next year, on {DateTime.fromISO(bandReview.nextShow.date).toLocaleString(DateTime.DATE_FULL)}, for the {bandReview.nextShow.citation}.
                On behalf of Foothill High School, I wish you all a safe and enjoyable weekend. Good night.
            </p>
        </div>
    );
}
  
export default HomePage;

export async function getStaticProps() {
    const bandReview = await getBandReview();

    const props = {
        bandReview: bandReview.getStaticProps()
    };

    return {
        props: props
    }
}
