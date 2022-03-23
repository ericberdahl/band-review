export type SerializedAnnouncer = {
    name : string;
    email : string;
}

export type AnnouncerStaticProps = {
    name : string;
    email : string;
}

export class Announcer {
    readonly name : string;
    readonly email : string;

    constructor(name : string, email: string) {
        this.name = name;
        this.email = email;
    }

    static async deserialize(data : SerializedAnnouncer) : Promise<Announcer> {
        return new Announcer(data.name, data.email);
    }

    async getStaticProps() : Promise<AnnouncerStaticProps> {    
        return {
            name: this.name,
            email: this.email
        }
    }    
}
