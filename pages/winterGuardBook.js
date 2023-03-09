import Chapter from '../components/chapter';
import WinterGuard from '../components/winterGuard';

import { getWinterShow } from '../common/winterShow';

import { DateTime } from "luxon";

export default function WinterGuardBook({ winterShow, generationDate }) {
    const showYear = DateTime.fromISO(winterShow.show.date).year;

    const guardSchools = winterShow.winterGuard.lineup.filter((li) => li.unitType == 'winterGuardUnit')
                                    .sort((a, b) => a.schoolName.localeCompare(b.schoolName));

    const guardMissingData = guardSchools.filter((s) => DateTime.fromISO(s.lastUpdated).year != showYear);
    const guardWithData = guardSchools.filter((s) => DateTime.fromISO(s.lastUpdated).year == showYear);

    return (
        <div>
            <Chapter>
                <h1>{winterShow.show.citation} : Winter Guard Announcer's Book: {DateTime.fromISO(winterShow.show.date).toLocaleString(DateTime.DATE_FULL)}</h1>
                <p>{winterShow.announcer.name} &lt;{winterShow.announcer.email}&gt;</p>
                <p>v{winterShow.version}, {DateTime.fromISO(generationDate).toLocaleString(DateTime.DATETIME_FULL)} </p>

                {guardMissingData.length > 0 && <>
                    <h2>Winter Guard Competition - Checkup</h2>

                    <h3>{guardMissingData.length} Schools Missing Winter Guard Data</h3>
                    {guardMissingData.map((s) => (
                        <p key={s.schoolName}>{s.schoolName}</p>
                    ))}
                </>}
            </Chapter>

            <WinterGuard winterGuard={winterShow.winterGuard} show={winterShow.show}/>

            <Chapter>
                <h2>Winter Show - Close</h2>
                <p>
                    This concludes the {winterShow.show.citation}.
                    Thank you and congratulations to all the units we’ve seen today, and thank you all for attending and cheering on these talented performers.
                </p>
                <p>
                    Mark your calendars to join us again next year, on {DateTime.fromISO(winterShow.nextShow.date).toLocaleString(DateTime.DATE_FULL)}, for the {winterShow.nextShow.citation}.
                    On behalf of Foothill High School, I wish you all a safe and enjoyable weekend. Good night.
                </p>
            </Chapter>
        </div>
    );
}

export async function getStaticProps() {
    const winterShow = await getWinterShow();

    const props = {
        winterShow:     await winterShow.getStaticProps(),
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
