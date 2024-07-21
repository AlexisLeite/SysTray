import { Organization } from "../timing/Organization";
import { Report } from "./Report";

export class OrganizationReport extends Report {
  constructor(private organization: Organization) {
    super();
  }

  public getReportAsJson(): string {
    throw new Error("Method not implemented.");
  }
}
