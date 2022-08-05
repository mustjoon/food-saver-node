import { Chat, ChatDocument } from "../models/Chat";
import {BaseService} from "./base-service";
import OpportunityService from "./opportunity-service";
import MessageService from "./message-service";
export class ChatService extends BaseService<ChatDocument> {
    constructor(model: typeof Chat) {
        super(model);
    }

    findByUser = async (userId: string) => {
        try {
            const chats = await this.model.find( { $or: [ { receiver: userId }, { donator: userId } ] } );
            return chats;
        } catch(err) {
            throw new Error("Error fetching");
        } 

    }

    findOrCreateByUserAndOpportunity =  async (userId: string, opportunityId: string): Promise<ChatDocument> => {
        try {
            let chat = await this.model.findOne({receiver: userId, opportunity: opportunityId});
            if(chat == null) {
                const opportunity = await OpportunityService.getById(opportunityId);
                if(!opportunity) {
                    throw new Error("Item does not exist");
                }
                
                chat = new Chat();
                chat.donator = opportunity.creator;
                chat.receiver = userId;
                chat.opportunity = opportunityId;
                return await chat.save();
            }
            return chat;
        } catch(err) {
            console.log("ERROR", err);
            throw new Error(err);
        }
       
    }

    getChatMessages = async (chatId: string) => {
        return MessageService.getByChat(chatId);
    }
}

export default new ChatService(Chat);