export type SerializedGrandMarshalUnit = {
    grandMarshal    : string | string[];
    title?          : string;
}

export type GrandMarshalUnitStaticProps = {
    unitType    : 'grandMarshal';
    members     : string[];
    title       : string;
}

export class GrandMarshalUnit {
    readonly title      : string;
    readonly members    : string[];

    constructor(members : string[], title : string = 'Grand Marshal') {
        this.members = members.slice();
        this.title = title;
    }

    static async deserialize(data : SerializedGrandMarshalUnit) : Promise<GrandMarshalUnit> {
        const members = (data.grandMarshal ? (Array.isArray(data.grandMarshal) ? data.grandMarshal.slice() : [data.grandMarshal]) : [])

        return new GrandMarshalUnit(members, data.title);
    }

    async getStaticProps() : Promise<GrandMarshalUnitStaticProps> {
        return {
            unitType:   'grandMarshal',
            members:    this.members.slice(),
            title:      this.title,
        }
    }
}
