import { Organization } from './Organization.js';

declare class Activity {
    private _id;
    private _name;
    private _organization;
    constructor(_id: string, _name: string);
    get name(): string;
    set name(value: string);
    get id(): string;
    set id(value: string);
    get organization(): Organization | null;
    set organization(value: Organization | null);
}

export { Activity };
//# sourceMappingURL=Activity.d.ts.map
