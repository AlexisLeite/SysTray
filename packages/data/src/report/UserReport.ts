import { User } from "../timing/User";
import { Report } from "./Report";

export class UserReport extends Report {
  constructor(private user: User) {
    super();
  }

  public getReportAsJson(): string {
    throw new Error("Method not implemented.");
  }
}
