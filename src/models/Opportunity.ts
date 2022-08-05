import mongoose from "mongoose";

import {UserDocument} from "./User";

const {Schema} = mongoose;

export type Item =  {
    name: string;
    price: number;
    amount: number;
    description: string;
}

export type OpportunityType =  {
    city: string;
    items: Item[];
    creator: any;
    receiver: any;
    description: string;
    location: string;
    price: number;
    coordinates: {
        lat: number;
        lng: number;
    };
}
export type OpportunityDocument = mongoose.Document & OpportunityType


const opportunitySchema = new mongoose.Schema({
    city: String,
    creator: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    description: String,
    location: String,
    coordinates: {
        lat: Number,
        lng: Number
    },
}, { timestamps: true });

export const Opportunity = mongoose.model<OpportunityDocument>("Opportunity", opportunitySchema);
