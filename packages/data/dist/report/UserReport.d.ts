import { User } from '../timing/User.js';
import { Report } from './Report.js';

declare class UserReport extends Report {
    private user;
    constructor(user: User);
    getReportAsJson(): string;
}

export { UserReport };
//# sourceMappingURL=UserReport.d.ts.map
