import Break from "./break";
import Chapter from "./chapter";
import CommaSeparatedList from "./commaSeparatedList";
import Note from './note';
import Leadership from "./leadership";
import NumericCitation from "./numericCitation";
import TrophySponsor from "./trophySponsor";

import { DateTime } from "luxon";

import { Fragment } from "react";

function AnthemPerformer({ unit }) {
    return (
        <>
            <h2>Field Show - Anthem Performer</h2>
            <p>
                And now, please rise, remove your caps, give respect to the colors flying at the north end of the field,
                and enjoy our National Anthem performed by {unit.performer}.
            </p>
        </>
    );
}

function FieldShowStart({ unit }) {
    return (
        <>
            <h2>Field Show - Open</h2>
            <p>
                Good afternoon ladies and gentlemen.
                Welcome to the Field Show Competition for the {unit.citation}.
                We are joined today by <NumericCitation count={unit.numFieldShowUnits}/> talented bands anxious to perform.
                Foothill High School wishes good luck and good music to all the bands performing today. We hope you enjoy their shows.
            </p>

            <Lineup lineup={unit.lineup} container={Fragment}/>
        </>
    )
}

function School({ unit, year }) {
    return (
        <div>
            <h2>Field Show - {unit.schoolName}</h2>
            {!unit.nickname && <Note label="important">{unit.schoolName} is missing nickname.</Note>}
            {!unit.program && <Note label="important">{unit.schoolName} is missing field show program.</Note>}
            {!unit.directors && <Note label="warning">{unit.schoolName} has no directors.</Note>}
            {!unit.leaders && <Note label="warning">{unit.schoolName} has no leaders.</Note>}
            <Note>Last updated {DateTime.fromISO(unit.lastUpdated).toLocaleString(DateTime.DATETIME_FULL)}</Note>
            <p>Now taking the field is{unit.isHost && ' your host,'} the {unit.nickname}, from {unit.schoolName} in {unit.city}.</p>
            <Leadership unit={unit}/>
            {unit.music &&
                <p>
                    The {unit.nickname}'s program features {unit.music}.
                </p>
            }
            {unit.notes && <p>{unit.notes}</p>}
            {!unit.notes && <Note>{unit.schoolName} has no parade notes.</Note>}
            <p>
                <em>(Wait for cue from T&amp;P judge):</em> Drum Major is your band ready?
            </p>
            <p>
                <em>(After drum major salute):</em> Presenting their {year} field show, {unit.program}, {unit.nickname}, you may now take the field in competition!
            </p>
        </div>
    )
}

function FieldShowBreak({ unit }) {
    return (
        <Break eventLabel="Field Show" unit={unit}/>
    );
}

function Lineup({ lineup, container, ...rest}) {
    const ContainerTag = container || Chapter;
    
    const elMissingRenderer = lineup.find(element => !element.renderer);
    if (elMissingRenderer) {
        throw new Error(`Field Show: ${elMissingRenderer.unitType} does not have a renderer`);
    }

    return (
        <>
            {lineup.map((li, index) => (
                <ContainerTag key={index}>
                    <li.renderer unit={li} {...rest}/>
                </ContainerTag>
            ))}
        </>
    );
}

function mapRenderersForLineup(lineup) {
    const renderers = {
        '_fieldShowStart':  FieldShowStart,

        'anthemPerformer':  AnthemPerformer,
        'breakUnit':        FieldShowBreak,
        'fieldShowUnit':    School,
    }

    return lineup.map((li) => {
        const result = li;
        result.renderer = renderers[li.unitType];
        if (!result.renderer) {
            throw new Error(`Field Show: ${li.unitType} does not have a renderer`);
        }
        return result;
    });
}

export default function FieldShow({ event }) {
    const concert = event.concert;
    const fieldShow = event.fieldShow;
    const parade = event.parade;
    const show = event.show;

    const numFieldShowUnits = fieldShow.lineup.filter((li) => li.unitType == 'fieldShowUnit').length;
    const numParadeShowUnits = parade.lineup.filter((li) => li.unitType == 'paradeUnit').length;
    const numConcertUnits = concert.lineup.filter((li) => li.unitType == 'concertUnit').length;

    const fieldShowtartUnits = [ "anthemPerformer" ];
    const endOfStart = fieldShow.lineup.findIndex((element => !fieldShowtartUnits.includes(element.unitType)));

    const fieldShowStartUnit = {
        unitType:           "_fieldShowStart",
        citation:           show.citation,
        numFieldShowUnits:  numFieldShowUnits,
        lineup:             mapRenderersForLineup(fieldShow.lineup.slice(0, endOfStart)),
    }

    var lineup = fieldShow.lineup.slice(endOfStart);
    lineup.splice(0, 0, fieldShowStartUnit);
    lineup = mapRenderersForLineup(lineup);

    return (
        <div>
            <Lineup lineup={lineup} year={DateTime.fromISO(show.date).year}/>

            <Chapter>
                <h2>Field Show - Close</h2>
                <p>
                    This concludes the Field Show Competition for the {show.citation}.
                    Please stay for the Field Show Awards, presented here in 15 minutes.
                </p>
                <p>
                    Whether you're from Foothill or cheering your home school, you probably know how much work it takes to hold a successful band review, where student performers can share their talent with and their love of music.
                    Today, {numParadeShowUnits} bands marched in parade, {numConcertUnits} performed in concert, and {numFieldShowUnits} presented field shows.
                    All this would not happen without the work of several hundred student and parent volunteers.
                    Foothill High School thanks everyone who contributed to the success of today's Band Review.
                </p>
            </Chapter>

            <Chapter>
                <h2>Field Show - Awards</h2>
                {fieldShow.sponsors.general.length > 0 && <>
                    <p>
                        Foothill High School thanks the sponsors of the {show.citation}: <CommaSeparatedList>
                            {fieldShow.sponsors.general.map((s, index) => <Fragment key={index}>{s}</Fragment>)}
                        </CommaSeparatedList>
                    </p>
                </>}

                <h3>General award announcement</h3>
                <p>
                    With a score of {"{score}"}, {"{nth}"} place {"{category}"} goes to [pause] {"{name of school}"}!
                </p>

                {fieldShow.sponsors.trophies.map((t, index) => <TrophySponsor place={t.place} sponsors={t.sponsors} key={index}/>)}
            </Chapter>
        </div>
    );
}
