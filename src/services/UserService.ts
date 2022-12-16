import {Inject, Injectable} from "@tsed/di";
import { MongooseModel, ObjectID } from "@tsed/mongoose";
import { ObjectId } from "mongoose";
import { UserModel } from "src/models/UserModel";

@Injectable()
export class UserService {
    constructor(@Inject(UserModel)private userModel:MongooseModel<UserModel>){

    }
    async getone(){
        return await this.userModel.findOne();
    }
    async getAll(){
        return await this.userModel.find();
    }
    async getInfo(em:string){
        let user:UserModel|null;
        user= await this.userModel.findOne({email:em});
        if(user!=null){
            user.image="public/uploads/usersImages/"+user.image;
        }
        return user;
    }
    
    async auth(user:UserModel){
        let users:UserModel[];
        users=await this.userModel.find({email:user.email});
        let au:boolean = false;
        let pu:boolean = false;
        for(var x of users){
            if(x.email==user.email){

                au=true;
                if(x.password==user.password){
                    pu=true;
                }
                break;
            }
        }
        if(pu){
            return "ACCESSED";
        }
        else if(au){
            return "WRONG PASSOWRD"
        }
        else {
            return "USER NOT FOUND"
        }

    }
    async get(user:UserModel){
        
        return await this.userModel.find({email:user.email});
    }

    async create(user:UserModel){
        return await this.userModel.create(user);
    }

    async update(user:UserModel){
        return await this.userModel.findByIdAndUpdate(user._id,user);
    }
    

    async delete(user:UserModel){
        return await this.userModel.findByIdAndDelete(user._id);
    }
}
