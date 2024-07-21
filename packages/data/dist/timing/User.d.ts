import { TimeSpent } from './TimeSpent.js';

declare class User {
    private _id;
    private _name;
    private _timeSpent;
    constructor(_id: string, _name: string);
    get id(): string;
    set id(value: string);
    get name(): string;
    set name(value: string);
    get timeSpent(): TimeSpent[];
    set timeSpent(value: TimeSpent[]);
}

export { User };
//# sourceMappingURL=User.d.ts.map
