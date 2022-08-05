import mongoose from "mongoose";

const {Schema} = mongoose;

export type ChatType =  {
    donator: string;
    receiver: string;
    opportunity: string;
}
export type ChatDocument = mongoose.Document & ChatType


const chatSchema = new mongoose.Schema({
    donator: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    opportunity: {
        type: Schema.Types.ObjectId,
        ref: "Opportunity"
    },
    
}, { timestamps: true });

export const Chat = mongoose.model<ChatDocument>("Chat", chatSchema);
