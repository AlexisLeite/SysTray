import { Activity } from "./Activity";

export class Organization {
  constructor(
    public id: string,
    public name: string,
  ) {}

  activities: Activity[] = [];

  addActivity(activity: Activity) {
    this.activities.push(activity);
  }
  getActivities(): Activity[] {
    return [...this.activities];
  }
}
