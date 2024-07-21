import { Organization } from "./Organization";

export class Activity {
  private _organization: Organization | null = null;

  constructor(
    private _id: string,
    private _name: string,
  ) {}

  public get name(): string {
    return this._name;
  }
  public set name(value: string) {
    this._name = value;
  }
  public get id(): string {
    return this._id;
  }
  public set id(value: string) {
    this._id = value;
  }
  public get organization(): Organization | null {
    return this._organization;
  }
  public set organization(value: Organization | null) {
    this._organization = value;
  }
}
