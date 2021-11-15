import Break from "./break";
import Chapter from "./chapter";
import CommaSeparatedList from './commaSeparatedList'
import Leadership from './leadership';
import Note from './note'
import NumericCitation from './numericCitation';
import TrophySponsor from './trophySponsor';

import { Fragment } from 'react';

import { DateTime } from "luxon";

function School({ unit, isFirst }) {
    isFirst = isFirst || false;

    const ordinal = (isFirst ? 'first' : 'next');

    return (
        <div>
            <h2>Parade - {unit.schoolName}</h2>
            {!unit.nickname && <Note label="important">{unit.schoolName} is missing nickname.</Note>}
            {!unit.music && <Note label="important">{unit.schoolName} is missing parade music.</Note>}
            {!unit.directors && <Note label="warning">{unit.schoolName} has no directors.</Note>}
            {!unit.leaders && <Note label="warning">{unit.schoolName} has no leaders.</Note>}
            <Note>Last updated {DateTime.fromISO(unit.lastUpdated).toLocaleString(DateTime.DATETIME_FULL)}</Note>
            <p>Our {ordinal} band is{unit.isHost && ' your host,'} the {unit.nickname}, from {unit.schoolName} in {unit.city}.</p>
            <Leadership unit={unit}/>
            {unit.music && <p>The {unit.nickname} will perform {unit.music}.</p>}
            {unit.notes && <p>{unit.notes}</p>}
            {!unit.notes && <Note>{unit.schoolName} has no parade notes.</Note>}
        </div>
    )
}

function Lineup({ lineup }) {
    let schoolCount = 0;

    return (
        <>
            {lineup.map((li, index) => (
                <Chapter key={index}>
                    {li.type == 'break' && <Break eventLabel="Parade" unit={li.item}/>}
                    {li.type == 'unit' && <School unit={li.item} isFirst={0 == schoolCount++}/>}
                </Chapter>
            ))}
        </>
    )
}

export default function Parade({ parade, show, fieldShow, nextShow }) {
    const numSchools = parade.lineup.filter((li) => li.type == 'unit').length;
 
    return (
        <div>
            <Chapter>
                <h2>Parade - Open</h2>
                <p>
                    Good morning ladies and gentlemen.
                    Welcome to the Parade Competition for the {show.citation}.
                    We are joined today by <NumericCitation count={numSchools}/> wonderful bands to entertain and delight us.
                    Foothill High School wishes good luck and good music to all the bands performing today. We hope you enjoy the competition.
                </p>
            </Chapter>

            <Chapter>
                <h2>Parade - Presentation of the Colors</h2>
                <p>
                    As we start our parade, please rise, remove your caps, and give your attention and respect to the Presentation of the Colors by {parade.colors}.
                </p>

                <h2>Parade - Recurring Announcements</h2>
                <ul>
                    <li>As a courtesy to the performers, spectators please step back fully onto the curb to allow the band to use the entire street.</li>
                    <li>As our parade continues, bands will get progressively larger.</li>
                </ul>
            </Chapter>

            <Chapter>
                <h2>Parade - Grand Marshal</h2>
                <p>
                    And now… please welcome our {parade.grandMarshal.title}, <CommaSeparatedList>
                        {parade.grandMarshal.members.map((gm, index) => <Fragment key={index}>{gm}</Fragment>)}
                    </CommaSeparatedList>.
                </p>
            </Chapter>

            <Lineup lineup={parade.lineup}/>

            <Chapter>
                <h2>Parade - Close</h2>
                <p>
                    This concludes the Parade Competition for the {show.citation}.
                    Thank you and congratulations to all the bands we've seen this morning, and thank you all for attending and cheering on these fine young performers.
                </p>
                <p>
                    Parade Awards will be presented at {parade.awardsTime} in the {parade.awardsLocation}.
                </p>
                <p>
                    Please join us at the Foothill High School Stadium for the Field Show Competition,
                    starting at {fieldShow.startTime} this afternoon and running through this evening.
                </p>
                <p>
                    Mark your calendars to join us again next year, on {DateTime.fromISO(nextShow.date).toLocaleString(DateTime.DATE_FULL)}, for the {nextShow.citation}.
                    On behalf of Foothill High School, I wish you all a safe and enjoyable weekend.
                    Good day.
                </p>
            </Chapter>

            <Chapter>
                <h2>Parade and Concert - Awards</h2>
                <p>
                    Foothill High School thanks the sponsors of the {show.citation}: <CommaSeparatedList>
                        {parade.sponsors.general.map((s, index) => <Fragment key={index}>{s}</Fragment>)}
                    </CommaSeparatedList>
                </p>
                {parade.sponsors.trophies.map((t, index) => <TrophySponsor place={t.place} sponsors={t.sponsors} key={index}/>)}
            
                <p>
                    (announce scores and awards for Parade and Concert)
                </p>
            </Chapter>
        </div>
    );
}
