export type SerializedBreakUnit = {
    break : number;
}

export type BreakUnitStaticProps = {
    duration : number;  // minutes
}

export class BreakUnit {
    readonly duration : number;

    constructor(duration : number) {
        this.duration = duration;
    }

    static deserialize(data : SerializedBreakUnit) {
        return new BreakUnit(data.break);
    }

    getStaticProps() : BreakUnitStaticProps {
        return {
            duration: this.duration,
        }
    }
}
