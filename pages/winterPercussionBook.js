import Chapter from '../components/chapter';
import WinterPercussion from '../components/winterPercussion';

import { getWinterShow } from '../common/winterShow';

import { DateTime } from "luxon";

export default function WinterPercussionBook({ winterShow }) {
    const generationDate = DateTime.now();

    const showYear = DateTime.fromISO(winterShow.show.date).year;

    const percussionSchools = winterShow.winterPercussion.lineup.filter((li) => li.unitType == 'winterPercussionUnit')
                                    .sort((a, b) => a.schoolName.localeCompare(b.schoolName));

    const percussionMissingData = percussionSchools.filter((s) => DateTime.fromISO(s.lastUpdated).year != showYear);
    const percussionWithData = percussionSchools.filter((s) => DateTime.fromISO(s.lastUpdated).year == showYear);

    return (
        <div>
            <Chapter>
                <h1>{winterShow.show.citation} : Parade Announcer's Book: {DateTime.fromISO(winterShow.show.date).toLocaleString(DateTime.DATE_FULL)}</h1>
                <p>{winterShow.announcer.name} &lt;{winterShow.announcer.email}&gt;</p>
                <p>v{winterShow.version}, {generationDate.toLocaleString(DateTime.DATETIME_FULL)} </p>

                <h2>Winter Percussion Competition - Checkup</h2>

                <h3>{percussionMissingData.length} Schools Missing Winter Percussion Data</h3>
                {percussionMissingData.map((s) => (
                    <p key={s.schoolName}>{s.schoolName}</p>
                ))}

                <h3>{percussionWithData.length} Schools with Winter Percussion Data</h3>
                {percussionWithData.map((s) => (
                    <p key={s.schoolName}>{s.schoolName}</p>
                ))}
            </Chapter>

            <WinterPercussion winterPercussion={winterShow.winterPercussion} show={winterShow.show} nextShow={winterShow.nextShow} winterGuard={winterShow.winterGuard}/>
        </div>
    );
}

export async function getStaticProps() {
    const winterShow = await getWinterShow();

    const props = {
        winterShow: await winterShow.getStaticProps()
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
