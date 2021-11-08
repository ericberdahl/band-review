export type SerializedRole = {
    title : string;
    members : string[];
}

export type RoleStaticProps = {
    title : string;
    members : string[];
}

export class Role {
    readonly title : string;
    readonly members : string[];

    constructor(title : string) {
        this.title = title;
        this.members = [];
    }

    static deserialize(data : SerializedRole) : Role {
        const result = new Role(data.title);

        result.members.push(...data.members);

        return result;
    }

    getStaticProps() : RoleStaticProps {
        return {
            title: this.title,
            members: this.members,
        }
    }
}
