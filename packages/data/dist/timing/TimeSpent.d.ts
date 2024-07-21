import { Activity } from './Activity.js';
import { Organization } from './Organization.js';
import { Time } from './Time.js';

declare class TimeSpent {
    private _beginning;
    private _end;
    private _organization;
    private _activity;
    constructor(_beginning: Time, _end: Time, _organization: Organization, _activity: Activity);
    get activity(): Activity;
    set activity(value: Activity);
    get beginning(): Time;
    set beginning(value: Time);
    get end(): Time;
    set end(value: Time);
    get organization(): Organization;
    set organization(value: Organization);
}

export { TimeSpent };
//# sourceMappingURL=TimeSpent.d.ts.map
