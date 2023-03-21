import Break from "./break";
import Chapter from "./chapter";
import CommaSeparatedList from './commaSeparatedList'
import Leadership from './leadership';
import Note from './note'
import NumericCitation from './numericCitation';
import TrophySponsor from './trophySponsor';

import { Fragment } from 'react';

import { DateTime } from "luxon";

function School({ unit, show, isFirst }) {
    isFirst = isFirst || false;
    const year = DateTime.fromISO(show.date).year;

    const ordinal = (isFirst ? 'first' : 'next');

    // TODO replace 2023 with a proper year reference

    return (
        <div>
            <h2>Winter Guard - {unit.schoolName}</h2>
            {!unit.nickname && <Note label="important">{unit.schoolName} is missing nickname.</Note>}
            {!unit.program && <Note label="important">{unit.schoolName} is missing percussion program.</Note>}
            {(!unit.directors || 0 == unit.directors.length) && <Note label="warning">{unit.schoolName} has no directors.</Note>}
            {(!unit.leaders || 0 == unit.leaders.length) && <Note label="warning">{unit.schoolName} has no leaders.</Note>}
            <Note>Last updated {DateTime.fromISO(unit.lastUpdated).toLocaleString(DateTime.DATETIME_FULL)}</Note>
            <p>Now taking the floor is{unit.isHost && ' your host,'} the {unit.nickname}, from {unit.schoolName} in {unit.city}.</p>
            <Leadership unit={unit}/>
            {unit.program &&
                <p>
                    The {unit.nickname} will perform their program, {unit.program}{unit.music && <>, featuring {unit.music}</>}.
                </p>
            }
            {unit.notes && <p>{unit.notes}</p>}
            {!unit.notes && <Note>{unit.schoolName} has no percussion notes.</Note>}
            <p>
                <em>(Wait for cue from T&amp;P judge):</em> Performing their {year} show, {unit.program && <>{unit.program},</>} NCBA is proud to present the {unit.nickname}.
            </p>
        </div>
    )
}

function Lineup({ lineup, show }) {
    let schoolCount = 0;

    return (
        <>
            {lineup.map((li, index) => (
                <Chapter key={index}>
                    {li.unitType == 'breakUnit' && <Break eventLabel="Winter Guard" unit={li}/>}
                    {li.unitType == 'winterGuardUnit' && <School unit={li} show={show} isFirst={0 == schoolCount++}/>}
                </Chapter>
            ))}
        </>
    )
}

export default function WinterGuard({ show, winterGuard }) {
    const numSchools = winterGuard.lineup.filter((li) => li.unitType == 'winterGuardUnit').length;
 
    return (
        <div>
            <Chapter>
                <h2>Winter Guard - Open</h2>
                <p>
                    Good afternoon ladies and gentlemen.
                    Welcome to the Color Guard Competition for the {show.citation}.
                    We are joined today by <NumericCitation count={numSchools}/> wonderful guard units anxious to entertain and delight us.
                    Foothill High School wishes good luck to all the units performing today and hopes you enjoy the competition.
                </p>
            </Chapter>

            <Lineup lineup={winterGuard.lineup} show={show}/>

            <Chapter>
                <h2>Winter Guard - End of Competition</h2>
                <p>
                    This concludes the Color Guard Competition for the {show.citation}.
                    Thank you and congratulations to all the guard units we’ve seen this afternoon, and
                    thank you all for attending and cheering on these talented young performers.
                </p>
                <p>
                    Please stay for the Color Guard Awards, presented here in 20 minutes.
                </p>
            </Chapter>

            <Chapter>
                <h2>Winter Guard - Awards</h2>
                <p>
                    Foothill High School thanks the sponsors of the {show.citation}: <CommaSeparatedList>
                        {winterGuard.sponsors.general.map((s, index) => <Fragment key={index}>{s}</Fragment>)}
                    </CommaSeparatedList>
                </p>
                {winterGuard.sponsors.trophies.map((t, index) => <TrophySponsor place={t.place} sponsors={t.sponsors} key={index}/>)}
            
                <h3>General award announcement</h3>
                <p>
                    With a score of {"{score}"}, {"{nth}"} place {"{category}"} goes to [pause] {"{name of school}"}!
                </p>
            </Chapter>
        </div>
    );
}
