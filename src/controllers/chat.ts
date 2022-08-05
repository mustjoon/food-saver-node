import { Response, Request } from "express";
import {getIO} from "../socket";


import { UserDocument } from "../models/User";
import ChatService from "../services/chat-service";
import OpportunityService from "../services/opportunity-service";
import MessageService from "../services/message-service";
import { MessageDocument } from "src/models/Message";




export const createChat = async(req: Request, res: Response) => {
    const {_id} = req.user as UserDocument;
    const {opportunityId} = req.body;
    const chat = await ChatService.findOrCreateByUserAndOpportunity(_id, opportunityId);

    res.status(200).json({
        item: chat
    });
};

export const getChat = async(req: Request, res: Response) => {
    const {_id} = req.user as UserDocument;
    const opportunityId = req.params.id;
    
    const chat = await ChatService.findOrCreateByUserAndOpportunity(_id, opportunityId);
    res.status(200).json({
       item: chat
    });
};
export const getChats = async(req: Request, res: Response) => {
    const {_id} = req.user as UserDocument;
    
    const chat = await ChatService.findByUser(_id);
    res.status(200).json({
       items: chat
    });
};

export const joinChatRoom = async(req: Request, res: Response) => {
    
 

   
    //res.status(200).json({"empty": "empty"});
};

export const setupChatSockets = () => {
    const io = getIO();
    io.on("connection", (socket) => {
        
        const userId = socket.decoded.sub;
      
        socket.on("subscribe", async (room) => {
            const chat = await ChatService.getById(room);
            if(chat) {
                socket.join(room);
             
            }
        });
       
        socket.on("chatroom", async (data) => {
          
            const message = await MessageService.create({ chat: data.chatId, text: data.message, creator: userId} as MessageDocument);
 
            io._io.sockets.in(data.chatId).emit("message", message);
            
        });
      });

  
};

