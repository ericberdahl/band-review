import CommaSeparatedList from './commaSeparatedList'

import { Fragment } from 'react';

export default function TrophySponsor({ place, sponsors }) {
    return (
        <div>
            <h3>{place}</h3>
            <p>
                The {place} trophy is sponsored by <CommaSeparatedList>{sponsors.map((s, index) => <Fragment key={index}>{s.name}</Fragment>)}</CommaSeparatedList>. {sponsors.map((s) => {
                    return (
                        <Fragment key={s.name}>
                            {s.dedication && <>{s.name} dedicates the {place} trophy {s.dedication}</>}
                            {s.message}
                            {s.presenter && <>The {place} trophy will be pressented by {s.presenter}.</>}
                        </Fragment>
                    );
                })}
            </p>
        </div>
    );
}

