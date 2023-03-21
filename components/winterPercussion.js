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

    return (
        <div>
            <h2>Winter Percussion - {unit.schoolName}</h2>
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
                <em>(Wait for cue from T&amp;P judge):</em> Are the judges ready?
            </p>
            <p>
                <em>(Wait for cue from T&amp;P judge):</em> {unit.nickname} is your percussion unit ready?
            </p>
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
                    {li.unitType == 'breakUnit' && <Break eventLabel="Winter Percussion" unit={li}/>}
                    {li.unitType == 'winterPercussionUnit' && <School unit={li} show={show} isFirst={0 == schoolCount++}/>}
                </Chapter>
            ))}
        </>
    )
}

export default function WinterPercussion({ winterPercussion, show, winterGuard, nextShow }) {
    const numSchools = winterPercussion.lineup.filter((li) => li.unitType == 'winterPercussionUnit').length;
 
    return (
        <div>
            <Chapter>
                <h2>Winter Percussion - Open</h2>
                <p>
                    Good morning ladies and gentlemen.
                    Welcome to the Percussion Competition for the {show.citation}.
                    We are joined today by <NumericCitation count={numSchools}/> talented units anxious to perform and entertain.
                    Foothill High School wishes good luck to all the units performing today.
                    We hope you enjoy their shows.
                </p>
            </Chapter>

            <Lineup lineup={winterPercussion.lineup} show={show}/>

            <Chapter>
                <h2>Winter Percussion - End of Competition</h2>
                <p>
                    This concludes the Percussion Competition for the {show.citation}.
                    Please stay for the Percussion Awards, presented here in 20 minutes, and for the Color Guard competition, beginning at {winterGuard.startTime}.
                </p>
            </Chapter>

            <Chapter>
                <h2>Winter Percussion - Awards</h2>
                <p>
                    Foothill High School thanks the sponsors of the {show.citation}: <CommaSeparatedList>
                        {winterPercussion.sponsors.general.map((s, index) => <Fragment key={index}>{s}</Fragment>)}
                    </CommaSeparatedList>
                </p>
                {winterPercussion.sponsors.trophies.map((t, index) => <TrophySponsor place={t.place} sponsors={t.sponsors} key={index}/>)}
            
                <h3>General award announcement</h3>
                <p>
                    With a score of {"{score}"}, {"{nth}"} place {"{category}"} goes to [pause] {"{name of school}"}!
                </p>
            </Chapter>
        </div>
    );
}
