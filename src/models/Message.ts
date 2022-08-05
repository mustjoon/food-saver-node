import mongoose from "mongoose";

const {Schema} = mongoose;

export type MessageType =  {
    text: string;
    chat: string;
    creator: string;
}
export type MessageDocument = mongoose.Document & MessageType

const messageSchema = new mongoose.Schema({
    text: String,
    chat: {
        type: Schema.Types.ObjectId,
        ref: "Chat"
    }, 
    creator: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }, 
}, { timestamps: true });

export const Message = mongoose.model<MessageDocument>("Message", messageSchema);
