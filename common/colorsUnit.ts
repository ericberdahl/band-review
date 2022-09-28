export type SerializedColorsUnit = {
    colors : string;
}

export type ColorsUnitStaticProps = {
    unitType : 'presentationOfColors';
    presenter : string;
}

export class ColorsUnit {
    readonly presenter : string;

    constructor(presenter : string) {
        this.presenter = presenter;
    }

    static async deserialize(data : SerializedColorsUnit) : Promise<ColorsUnit> {
        return new ColorsUnit(data.colors);
    }

    async getStaticProps() : Promise<ColorsUnitStaticProps> {
        return {
            unitType: 'presentationOfColors',
            presenter: this.presenter,
        }
    }
}
