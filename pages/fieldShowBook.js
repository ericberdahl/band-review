import Chapter from '../components/chapter';
import FieldShow from '../components/fieldShow';

import { getBandReview } from '../common/bandReview';

import { DateTime } from "luxon";

export default function FieldShowBook({ bandReview }) {
    const generationDate = DateTime.now();

    const showYear = DateTime.fromISO(bandReview.show.date).year;

    const fieldShowSchools = bandReview.fieldShow.lineup.filter((li) => li.unitType == 'fieldShowUnit')
                                    .sort((a, b) => a.schoolName.localeCompare(b.schoolName));

    const fieldShowMissingData = fieldShowSchools.filter((s) => DateTime.fromISO(s.lastUpdated).year != showYear);
    const fieldShowWithData = fieldShowSchools.filter((s) => DateTime.fromISO(s.lastUpdated).year == showYear);

    return (
        <div>
            <Chapter>
                <h1>{bandReview.show.citation} : Field Show Announcer's Book: {DateTime.fromISO(bandReview.show.date).toLocaleString(DateTime.DATE_FULL)}</h1>
                <p>{bandReview.announcer.name} &lt;{bandReview.announcer.email}&gt;</p>
                <p>v{bandReview.version}, {generationDate.toLocaleString(DateTime.DATETIME_FULL)} </p>

                {fieldShowMissingData.length > 0 && <>
                    <h2>Field Show Competition - Checkup</h2>

                    <h3>{fieldShowMissingData.length} Schools Missing Field Show Data</h3>
                    {fieldShowMissingData.map((s) => (
                        <p key={s.schoolName}>{s.schoolName}</p>
                    ))}
                </>}
            </Chapter>

            <FieldShow event={bandReview}/>

            <Chapter>
                <h2>Band Review - Close</h2>
                <p>
                    This concludes the {bandReview.show.citation}.
                    Thank you and congratulations to all the bands we’ve seen today, and thank you all for attending and cheering on these fine young performers.
                </p>
                <p>
                    Mark your calendars to join us again next year, on {DateTime.fromISO(bandReview.nextShow.date).toLocaleString(DateTime.DATE_FULL)}, for the {bandReview.nextShow.citation}.
                    On behalf of Foothill High School, I wish you all a safe and enjoyable weekend. Good night.
                </p>
            </Chapter>
        </div>
    );
}

export async function getStaticProps() {
    const bandReview = await getBandReview();

    const props = {
        bandReview: await bandReview.getStaticProps()
    };

    return {
        props: props
    }
}

// Setting unstable_runtimeJS to false removes all Next.js/React scripting from
// the page when it is exported. This creates a truly static HTML page, but
// should be used with caution because it does remove all client-side React
// processing. So, the page needs to be truly static, or the export will yield
// a page that is incorrect.
export const config = {
    unstable_runtimeJS: false
};
