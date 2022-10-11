export type SerializedAnthemPerformerUnit = {
    anthemPerformer : string;
}

export type AnthemPerformerUnitStaticProps = {
    unitType    : 'anthemPerformer';
    performer   : string;
}

export class AnthemPerformerUnit {
    readonly performer  : string;

    constructor(performer : string) {
        this.performer = performer;
    }

    static async deserialize(data : SerializedAnthemPerformerUnit) : Promise<AnthemPerformerUnit> {
        return new AnthemPerformerUnit(data.anthemPerformer);
    }

    async getStaticProps() : Promise<AnthemPerformerUnitStaticProps> {
        return {
            unitType:   'anthemPerformer',
            performer:  this.performer,
        }
    }
}
