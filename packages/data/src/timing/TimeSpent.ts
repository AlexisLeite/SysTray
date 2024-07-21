import { Activity } from "./Activity";
import { Organization } from "./Organization";
import { Time } from "./Time";

export class TimeSpent {
  constructor(
    private _beginning: Time,
    private _end: Time,
    private _organization: Organization,
    private _activity: Activity,
  ) {}

  public get activity(): Activity {
    return this._activity;
  }
  public set activity(value: Activity) {
    this._activity = value;
  }
  public get beginning(): Time {
    return this._beginning;
  }
  public set beginning(value: Time) {
    this._beginning = value;
  }
  public get end(): Time {
    return this._end;
  }
  public set end(value: Time) {
    this._end = value;
  }
  public get organization(): Organization {
    return this._organization;
  }
  public set organization(value: Organization) {
    this._organization = value;
  }
}
