import {Inject, Injectable} from "@tsed/di";
import { MongooseModel } from "@tsed/mongoose";
import { UserModel } from "src/models/UserModel";
import * as jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'my-secret';
@Injectable()
export class AdminService {
    constructor(@Inject(UserModel)private userModel:MongooseModel<UserModel>){

    }
    
    async generateJWT(user: UserModel) {
        const payload = {
          id: user._id,
          // include any other information you want to include in the token
        };
        const token = jwt.sign(payload, JWT_SECRET, {
          expiresIn: '1h', // token expires in one hour
        });
        return token;
      }
    async login(user:UserModel){
        let use:UserModel|null;
        
        use=await this.userModel.findOne({email:user.email});
        if(use==null){
            return 'USER NOT FOUND';
        }
        if(user.password!=use.password){
            return 'WRONG PASSWORD';
        }
        
        if(use.role!='Super Admin'){
            return 'UnAuthorized';
        }
        return await this.generateJWT(user);
    }
}
