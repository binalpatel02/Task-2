export interface IUserContext {
    user_id? : string;
    email? : string;
}

export class AccountUserUtil {
    constructor (
        private readonly user? : IUserContext
    ) {}

    getUserId() {
        return this.user?.user_id;
    }

    getEmail() {
        return this.user?.email;
    }

    getAuditFields() {
        return {
            created_by : this.user?.user_id,
            updated_by : this.user?.user_id
        }
    }
}
