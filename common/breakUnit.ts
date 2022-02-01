export type SerializedBreakUnit = {
    break : number;
}

export type BreakUnitStaticProps = {
    unitType : 'breakUnit';
    duration : number;  // minutes
}

export class BreakUnit {
    readonly duration : number;

    constructor(duration : number) {
        this.duration = duration;
    }

    static async deserialize(data : SerializedBreakUnit) : Promise<BreakUnit> {
        return new BreakUnit(data.break);
    }

    async getStaticProps() : Promise<BreakUnitStaticProps> {
        return {
            unitType: 'breakUnit',
            duration: this.duration,
        }
    }
}
