import CommaSeparatedList from './commaSeparatedList';

import { Fragment } from 'react';

function Directors({ directors }) {
    return (
        <>
            <>directed by </>
            <CommaSeparatedList>
                {directors.map((d) => <Fragment key={d}>{d}</Fragment>)}
            </CommaSeparatedList>
        </>
    )
}

function RoleList({ roles }) {
    return (
        <CommaSeparatedList>
            {roles.map((s) => (
                <Fragment key={s.title}>
                    <>{s.title} </>
                    <CommaSeparatedList>
                        {s.members.map((m) => <Fragment key={m}>{m}</Fragment>)}
                    </CommaSeparatedList>
                </Fragment>
            ))}
        </CommaSeparatedList>
    );
}

export default function Leadership({ unit }) {
    let hasLeadership = (0 < unit.directors.length
                        && 0 < unit.staff.length
                        && 0 < unit.leaders.length);
    return (
        <>
            {hasLeadership && <>
                <>The {unit.nickname} is </>
                <CommaSeparatedList>
                    {0 < unit.directors.length && <Directors directors={unit.directors}/>}
                    {0 < unit.staff.length && <RoleList roles={unit.staff}/>}
                    {0 < unit.leaders.length && <>led by <RoleList roles={unit.leaders}/></>}
                </CommaSeparatedList>
                .
            </>}
        </>
    );
}
