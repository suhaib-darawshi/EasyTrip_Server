import {Inject, Injectable} from "@tsed/di";
import { MongooseModel } from "@tsed/mongoose";
import { MessageModel } from "src/models/MessageModel";

@Injectable()
export class MessageService {
    constructor(@Inject(MessageModel)private messageModel: MongooseModel<MessageModel>){

    }

    async get(id:string){
        return await this.messageModel.find({userid:id});
    }
    
}
