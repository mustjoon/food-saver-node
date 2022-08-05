import jsonwebtoken from "jsonwebtoken";
import { Request } from "express";
import UserService from "./user-service";
import {JWT_SECRET} from "../util/secrets";

class JwtService {
    decode = (request: Request): {sub: string} => {
        const {authorization} = request.headers as any;
      
        return  jsonwebtoken.decode(authorization.replace("Bearer ", ""));
    }

    verify = (token: string, callback) => {
        return jsonwebtoken.verify(token, JWT_SECRET,callback);
    }

    getToken = (request: Request) => {
        const {sub} = this.decode(request);
        return sub;
    }

    getUser = (request: Request) => {
        const userId = this.decode(request).sub;
        return UserService.getById(userId);

    }
}

export default new JwtService;