import { User, UserDocument } from "../models/User";
import {BaseService} from "./base-service";
export class UserService extends BaseService<UserDocument> {
    constructor(model: typeof User) {
        super(model);
    }

    editProfile = async (id: number, data: any) => {
        const user = await this.model.findById(id);
        user.profile = data;
        await user.save();
        return user;
    }
}

export default new UserService(User);