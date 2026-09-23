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

    async getUserForLogin(email: string) {
        return await User.findOne({email}).select("+password_hash")
    }
}

export const userModel = new UserModel(); 