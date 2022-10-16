import Chapter from '../components/chapter';
import PageLink from '../components/pageLink';

import { getBandReview } from '../common/bandReview';

import { DateTime } from "luxon";

export default function BandReview({ bandReview }) {
    const generationDate = DateTime.now();

    const showYear = DateTime.fromISO(bandReview.show.date).year;

    const paradeSchools = bandReview.parade.lineup.filter((li) => li.unitType == 'paradeUnit')
                                    .sort((a, b) => a.schoolName.localeCompare(b.schoolName));
    const fieldShowSchools = bandReview.fieldShow.lineup.filter((li) => li.unitType == 'fieldShowUnit')
                                    .sort((a, b) => a.schoolName.localeCompare(b.schoolName));

    const paradeMissingData = paradeSchools.filter((s) => DateTime.fromISO(s.lastUpdated).year != showYear);
    const paradeWithData = paradeSchools.filter((s) => DateTime.fromISO(s.lastUpdated).year == showYear);

    const fieldShowMissingData = fieldShowSchools.filter((s) => DateTime.fromISO(s.lastUpdated).year != showYear);
    const fieldShowWithData = fieldShowSchools.filter((s) => DateTime.fromISO(s.lastUpdated).year == showYear);

    return (
        <div>
            <Chapter>
                <h1>{bandReview.show.citation}: {DateTime.fromISO(bandReview.show.date).toLocaleString(DateTime.DATE_FULL)}</h1>
                <p>{bandReview.announcer.name} &lt;{bandReview.announcer.email}&gt;</p>
                <p>v{bandReview.version}, {generationDate.toLocaleString(DateTime.DATETIME_FULL)} </p>

                <h2>Table of Contents</h2>
                <ol>
                    <li><PageLink page="paradeBook">Parade</PageLink></li>
                    <li><PageLink page="fieldShowBook">Field Show</PageLink></li>
                    <li><a href="#parade-checkup">Parade - Checkup</a></li>
                    <li><a href="#fieldshow-checkup">Field Show - Checkup</a></li>
                </ol>

                <h2 id="parade-checkup">Parade - Checkup</h2>

                <h3>{paradeMissingData.length} Schools Missing Parade Data</h3>
                {paradeMissingData.map((s) => (
                    <p key={s.schoolName}>{s.schoolName}</p>
                ))}

                <h3>{paradeWithData.length} Schools with Parade Data</h3>
                {paradeWithData.map((s) => (
                    <p key={s.schoolName}>{s.schoolName}</p>
                ))}

                <h2 id="fieldshow-checkup">Field Show - Checkup</h2>

                <h3>{fieldShowMissingData.length} Schools Missing Field Show Data</h3>
                {fieldShowMissingData.map((s) => (
                    <p key={s.schoolName}>{s.schoolName}</p>
                ))}

                <h3>{fieldShowWithData.length} Schools with Field Show Data</h3>
                {fieldShowWithData.map((s) => (
                    <p key={s.schoolName}>{s.schoolName}</p>
                ))}
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
