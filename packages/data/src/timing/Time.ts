export class Time {
  constructor(private _timestamp: number) {}

  public get timestamp(): number {
    return this._timestamp;
  }
  public set timestamp(value: number) {
    this._timestamp = value;
  }
}
