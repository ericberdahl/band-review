export type SerializedAwardsUnit = {
    awardsLabel         : string;
    location            : string;
    time                : string;
    continuation?       : string;
    continuationTime?   : string;
}

export type AwardsUnitStaticProps = {
    unitType            : 'awardsUnit';
    label               : string;
    location            : string;
    time                : string;
    continuation        : string;
    continuationTime    : string;
}

export class AwardsUnit {
    readonly label              : string;
    readonly location           : string;
    readonly time               : string;
    readonly continuation       : string;
    readonly continuationTime   : string;

    constructor(label : string, location : string, time : string, continuation : string, continuationTime : string) {
        this.label = label;
        this.location = location;
        this.time = time;
        this.continuation = continuation;
        this.continuationTime = continuationTime;
    }

    static async deserialize(data : SerializedAwardsUnit) : Promise<AwardsUnit> {
        return new AwardsUnit(data.awardsLabel, data.location, data.time, data.continuation, data.continuationTime);
    }

    async getStaticProps() : Promise<AwardsUnitStaticProps> {
        return {
            unitType:           'awardsUnit',
            label:              this.label,
            location:           this.location,
            time:               this.time,
            continuation:       (this.continuation ? this.continuation : null),
            continuationTime:   (this.continuationTime ? this.continuationTime : null),
        }
    }
}
