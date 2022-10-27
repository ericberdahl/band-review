import Chapter from '../components/chapter';

import { getWinterShow } from '../common/winterShow';

import { DateTime } from "luxon";

export default function WinterShow({ winterShow, generationDate }) {
    const showYear = DateTime.fromISO(winterShow.show.date).year;

    const percussionSchools = winterShow.winterPercussion.lineup.filter((li) => li.unitType == 'winterPercussionUnit')
                                    .sort((a, b) => a.schoolName.localeCompare(b.schoolName));
    const guardSchools = winterShow.winterGuard.lineup.filter((li) => li.unitType == 'winterGuardUnit')
                                    .sort((a, b) => a.schoolName.localeCompare(b.schoolName));

    const percussionMissingData = percussionSchools.filter((s) => DateTime.fromISO(s.lastUpdated).year != showYear);
    const percussionWithData = percussionSchools.filter((s) => DateTime.fromISO(s.lastUpdated).year == showYear);

    const guardMissingData = guardSchools.filter((s) => DateTime.fromISO(s.lastUpdated).year != showYear);
    const guardWithData = guardSchools.filter((s) => DateTime.fromISO(s.lastUpdated).year == showYear);

    return (
        <div>
            <Chapter>
                <h1>{winterShow.show.citation}: {DateTime.fromISO(winterShow.show.date).toLocaleString(DateTime.DATE_FULL)}</h1>
                <p>{winterShow.announcer.name} &lt;{winterShow.announcer.email}&gt;</p>
                <p>v{winterShow.version}, {DateTime.fromISO(generationDate).toLocaleString(DateTime.DATETIME_FULL)} </p>

                <h2>Winter Percussion - Checkup</h2>

                <h3>{percussionMissingData.length} Schools Missing Winter Percussion Data</h3>
                {percussionMissingData.map((s) => (
                    <p key={s.schoolName}>{s.schoolName}</p>
                ))}

                <h3>{percussionWithData.length} Schools with Winter Percussion Data</h3>
                {percussionWithData.map((s) => (
                    <p key={s.schoolName}>{s.schoolName}</p>
                ))}

                <h2>Winter Guard - Checkup</h2>

                <h3>{guardMissingData.length} Schools Missing Winter Guard Data</h3>
                {guardMissingData.map((s) => (
                    <p key={s.schoolName}>{s.schoolName}</p>
                ))}

                <h3>{guardWithData.length} Schools with Winter Guard Data</h3>
                {guardWithData.map((s) => (
                    <p key={s.schoolName}>{s.schoolName}</p>
                ))}
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
