import PageLink from '../components/pageLink';

export default function HomePage({ }) {
    return (
        <ul>
            <li><PageLink page="bandReview">Band Review</PageLink></li>
            <li><PageLink page="winterShow">Winter Show</PageLink></li>
        </ul>
    );
}

// Setting unstable_runtimeJS to false removes all Next.js/React scripting from
// the page when it is exported. This creates a truly static HTML page, but
// should be used with caution because it does remove all client-side React
// processing. So, the page needs to be truly static, or the export will yield
// a page that is incorrect.
export const config = {
    unstable_runtimeJS: false
};
