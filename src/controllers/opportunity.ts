import { Response, Request, NextFunction } from "express";
import { UserDocument } from "../models/User";
import {  OpportunityDocument } from "../models/Opportunity";
import OpportunityService from "../services/opportunity-service";
export const getOpportunitys = async(req: Request, res: Response) => {
    const {count, items} = await OpportunityService.getAll();
    res.status(200).json({
        count,
        items,
    });
};

export const createOpportunity = async(req: Request, res: Response) => {
    const user = req.user as UserDocument;
    const userId = user._id;
    const payload = req.body as OpportunityDocument;
  
    
    const item = await OpportunityService.createOpportunity(userId,payload);
    res.status(200).json({
        item
    });
};


export const editOpportunity = async(req: Request, res: Response) => {
    const payload = req.body as OpportunityDocument;
    const {id} = req.params;
    const item = await OpportunityService.edit(id, payload);
    res.status(200).json({
        item
    });
};
