import CommaSeparatedList from "./commaSeparatedList.jsx"

import { Fragment } from 'preact';

export default function Directors({ directors }) {
    return (
        <>
            <>directed by </>
            <CommaSeparatedList>
                {directors.map((d) => <Fragment key={d}>{d}</Fragment>)}
            </CommaSeparatedList>
        </>
    )
}
