import Chapter from '../components/chapter';
import Parade from '../components/parade';

import { getBandReview } from '../common/bandReview';

import { DateTime } from "luxon";

export default function ParadeBook({ bandReview, generationDate }) {
    const showYear = DateTime.fromISO(bandReview.show.date).year;

    const paradeSchools = bandReview.parade.lineup.filter((li) => li.unitType == 'paradeUnit')
                                    .sort((a, b) => a.schoolName.localeCompare(b.schoolName));

    const paradeMissingData = paradeSchools.filter((s) => DateTime.fromISO(s.lastUpdated).year != showYear);
    const paradeWithData = paradeSchools.filter((s) => DateTime.fromISO(s.lastUpdated).year == showYear);

    return (
        <div>
            <Chapter>
                <h1>{bandReview.show.citation} : Parade Announcer's Book: {DateTime.fromISO(bandReview.show.date).toLocaleString(DateTime.DATE_FULL)}</h1>
                <p>{bandReview.announcer.name} &lt;{bandReview.announcer.email}&gt;</p>
                <p>v{bandReview.version}, {DateTime.fromISO(generationDate).toLocaleString(DateTime.DATETIME_FULL)} </p>

                {paradeMissingData.length > 0 && <>
                    <h2>Parade Competition - Checkup</h2>

                    <h3>{paradeMissingData.length} Schools Missing Parade Data</h3>
                    {paradeMissingData.map((s) => (
                        <p key={s.schoolName}>{s.schoolName}</p>
                    ))}
                </>}
            </Chapter>

            <Parade parade={bandReview.parade} show={bandReview.show} nextShow={bandReview.nextShow} fieldShow={bandReview.fieldShow}/>
        </div>
    );
}

export async function getStaticProps() {
    const bandReview = await getBandReview();

    const props = {
        bandReview:     await bandReview.getStaticProps(),
        generationDate: DateTime.now().toISO(),
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
