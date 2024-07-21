import { Organization } from '../timing/Organization.js';
import { Report } from './Report.js';

declare class OrganizationReport extends Report {
    private organization;
    constructor(organization: Organization);
    getReportAsJson(): string;
}

export { OrganizationReport };
//# sourceMappingURL=OrganizationReport.d.ts.map
