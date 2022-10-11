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

function School({ unit }) {
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
            {unit.program &&
                <p>
                    The {unit.nickname} will perform their program, {unit.program}{unit.music && <>, featuring {unit.music}</>}.
                </p>
            }
            {unit.description && <p>{unit.description}</p>}
            {unit.notes && <p>{unit.notes}</p>}
            {!unit.notes && <Note>{unit.schoolName} has no parade notes.</Note>}
        </div>
    )
}

function FieldShowBreak({ unit }) {
    return (
        <Break eventLabel="Field Show" unit={unit}/>
    );
}

function Lineup({ lineup, container }) {
    const ContainerTag = container || Chapter;
    
    const elMissingRenderer = lineup.find(element => !element.renderer);
    if (elMissingRenderer) {
        throw new Error(`Field Show: ${elMissingRenderer.unitType} does not have a renderer`);
    }

    return (
        <>
            {lineup.map((li, index) => (
                <ContainerTag key={index}>
                    <li.renderer unit={li}/>
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
    const numFieldShowUnits = event.fieldShow.lineup.filter((li) => li.unitType == 'fieldShowUnit').length;
    const numParadeShowUnits = event.parade.lineup.filter((li) => li.unitType == 'paradeUnit').length;
    const numConcertUnits = event.concert.lineup.filter((li) => li.unitType == 'concertUnit').length;

    const fieldShowtartUnits = [ "anthemPerformer" ];
    const endOfStart = event.fieldShow.lineup.findIndex((element => !fieldShowtartUnits.includes(element.unitType)));

    const fieldShowStartUnit = {
        unitType:           "_fieldShowStart",
        citation:           event.show.citation,
        numFieldShowUnits:  numFieldShowUnits,
        lineup:             mapRenderersForLineup(event.fieldShow.lineup.slice(0, endOfStart)),
    }

    var lineup = event.fieldShow.lineup.slice(endOfStart);
    lineup.splice(0, 0, fieldShowStartUnit);
    lineup = mapRenderersForLineup(lineup);

    return (
        <div>
            <Lineup lineup={lineup}/>

            <Chapter>
                <h2>Field Show - Close</h2>
                <p>
                    This concludes the Field Show Competition for the {event.show.citation}.
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
                <p>
                    Foothill High School thanks the sponsors of the {event.show.citation}: <CommaSeparatedList>
                        {event.fieldShow.sponsors.general.map((s, index) => <Fragment key={index}>{s}</Fragment>)}
                    </CommaSeparatedList>
                </p>

                <h3>General award announcement</h3>
                <p>
                    With a score of {"{score}"}, {"{nth}"} place {"{category}"} goes to [pause] {"{name of school}"}!
                </p>

                {event.fieldShow.sponsors.trophies.map((t, index) => <TrophySponsor place={t.place} sponsors={t.sponsors} key={index}/>)}
            </Chapter>
        </div>
    );
}
