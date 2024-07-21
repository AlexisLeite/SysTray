import { Activity } from './Activity.js';

declare class Organization {
    id: string;
    name: string;
    constructor(id: string, name: string);
    activities: Activity[];
    addActivity(activity: Activity): void;
    getActivities(): Activity[];
}

export { Organization };
//# sourceMappingURL=Organization.d.ts.map
