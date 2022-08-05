import mongoose from "mongoose";

export enum FoodTypeEnum {
    MEAT = "meat",
    VEGAN ="vegan",
    DRINK = "drink"
}

export type Food =  {
    type: FoodTypeEnum;
    name: string;
}


export type FoodDocument = mongoose.Document & Food

const foodSchema = new mongoose.Schema({
    name: { type: String, unique: true },
    type: {type: FoodTypeEnum},
}, { timestamps: false });

export const User = mongoose.model<FoodDocument>("Food", foodSchema);
