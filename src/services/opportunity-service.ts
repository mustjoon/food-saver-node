import { Opportunity, OpportunityDocument } from "../models/Opportunity";
import {BaseService} from "./base-service";
import UserService from "./user-service";
export class OpportunityService extends BaseService<OpportunityDocument> {
    constructor(model: typeof Opportunity, populatedFields) {
        super(model, populatedFields);
    }

    /*
        Call base create method and append created resource to current user
    */
    createOpportunity = async (userId: string, item: OpportunityDocument) => {
        item.creator = userId;
        const resource = await this.create(item);
        const user = await UserService.getById(userId);

        user.opportunitys.push(resource);
        user.save();

        return resource.populate(this.populatedFields.join(""));
    }
}

export default new OpportunityService(Opportunity, ["creator"]);