import { BaseModel } from "@library/shared";
import { User } from "@library/schema/user";

export class UserModel extends BaseModel<any> {

    constructor() {
        super(
            User,
            {
                return_doc: true,
                exclusion: {
                    password_hash: 0
                }
            }
        );
    }
}

export const userModel = new UserModel(); 