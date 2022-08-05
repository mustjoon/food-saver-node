import { Message, MessageDocument } from "../models/Message";
import {BaseService} from "./base-service";
export class MessageService extends BaseService<MessageDocument> {
    constructor(model: typeof Message) {
        super(model);
    }

    getByChat = async (chatId: string) => {
        const messages = await this.model.find({chat: chatId});
        if(!messages) {
            return [];
        }
        return messages;
    }
}

export default new MessageService(Message);