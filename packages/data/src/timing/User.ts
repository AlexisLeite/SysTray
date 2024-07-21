import { TimeSpent } from "./TimeSpent";

export class User {
  private _timeSpent: TimeSpent[] = [];

  constructor(
    private _id: string,
    private _name: string,
  ) {}

  public get id(): string {
    return this._id;
  }
  public set id(value: string) {
    this._id = value;
  }
  public get name(): string {
    return this._name;
  }
  public set name(value: string) {
    this._name = value;
  }
  public get timeSpent(): TimeSpent[] {
    return this._timeSpent;
  }
  public set timeSpent(value: TimeSpent[]) {
    this._timeSpent = value;
  }
}
