import mongoose from "mongoose";

/*
    Base service to handle dealing with database driver.
    Handle errors here instead of in controllers and always return items or 
    throw error
    TODO: ERROR HANDLING
*/
export class BaseService<T extends {_id: string }> {

    model: mongoose.Model<mongoose.Document & T>
    populatedFields: string[]
    constructor(model: mongoose.Model<mongoose.Document & T>, populatedFields: string[] = []) {
        this.model = model;
        this.populatedFields = populatedFields;
    }
    
   //public validate = async(req: Req)

    public getAll = async (): Promise<{count: number; items: T[]}> =>  {

        try {
            const count = await this.model.countDocuments();
            const items = await this.model.find({}).populate(this.populatedFields.join(""));
            return {count, items};
        } catch(err) {
           throw new Error("Error fetching data");
        }
    }

    public getById = async(id: string): Promise<T> => {
        try {
            return await this.model.findById(id);
        } catch(err) {
            throw new Error("Error");
        }
    }

    public create = async (item: T): Promise<T> =>  {
        try {
            return await this.model.create(item);
        } catch(err) {
            throw new Error("Error creating");
        }
    }
    

    public edit = async (id: string,item: T): Promise<T> => {
        try {
           
            const resource = await this.model.findById(id);
           
            const doc = await resource.update(item);
          
            return await this.model.findById(id);
        } catch(err) {
            throw new Error("Error editing:"+ err);
        }
    }
 }