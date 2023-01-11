import {Inject, Injectable} from "@tsed/di";
import { Logger } from "@tsed/logger";
import { MongooseModel, ObjectID } from "@tsed/mongoose";
import { ObjectId } from "mongoose";
import { UserModel } from "src/models/UserModel";
import * as passport from 'passport';
import * as JWT from 'passport-jwt';
import * as jwt from 'jsonwebtoken';
import "@tsed/logger-smtp";
import { createTransport, getTestMessageUrl } from "nodemailer";
import { SendMessageIntr } from "src/interfaces/SendMessageIntr";
import { MessageModel } from "src/models/MessageModel";


import * as passportLocal from 'passport-local';

import { Service } from '@tsed/di';


const JWT_SECRET = process.env.JWT_SECRET || 'my-secret';
@Injectable()
export class UserService {
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
      
      
    async getone(){
        return await this.userModel.findOne();
    }
    async getAll(){
        let users:UserModel[]= await this.userModel.find();
        for (var iterator of users) {
            iterator.image="public/uploads/usersImages/"+iterator.image;
        }
        return users;
    }
    async getInfo(em:string){
        let user:UserModel|null;
        user= await this.userModel.findOne({email:em});
        if(user!=null){
            user.image="public/uploads/usersImages/"+user.image;
        }
        return user;
    }
    async em(user:UserModel){
        let  x1:Number= (Math.random()*899999)+100000;
        let x:string=x1.toFixed(0);
    

    var transport = createTransport({
      host: "smtp.gmail.com",
      port: 465,
      auth: {
        user: "easytrip236@gmail.com", // your email address
        pass: "eqkprqdbehmtllqs", // your webmail password
      },
      secure: true,
      logger: true,
      debug: true,
      
      
    });
    
    // ...
    
   await transport.sendMail({ subject:"Confirm Your SignUp :",from:"Easy Trip",to:user.email,text:"Hi ,\n you've tried to sign up in our application Easy Trip , Please enter this number to complete your sign up :"+x });
   return x;


}
//         const logger = new Logger("loggerName");

// logger.appenders.set("email", {
//   type: "smtp",
//   level: ["error"],
//   SMTP:{
//     auth:{
//       user:"eng.suhaibdarawshi@gmail.com",
//       pass:"gwbmxlonszaxpdmy"
//     }
//   },
//   recipients: "suhaibdarawshi@gmail.com",
//   subject: "Latest logs",
//   sender: "eng.suhaibdarawshi@gmail.com",
//   attachment: {
//     enable: true,
    
//     message: "See the attachment for the latest logs"
//   },
//   sendInterval: 3600});
  
//     }
    async auth(user:UserModel){
        let users:UserModel[];
        users=await this.userModel.find({email:user.email});
        let au:boolean = false;
        let pu:boolean = false;
        let usere:UserModel=user;
        for(var x of users){
            if(x.email==user.email){

                au=true;
                if(x.password==user.password){
                    pu=true;
                    usere=x;
                }
                break;
            }
        }
        if(pu){
            return await this.generateJWT(usere);
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
    async signUp(user:UserModel){
        let users:UserModel[]=[];
        users=await this.userModel.find({email:user.email});
        if(users.length>0){
            return "Email already signed up";
        }
        else{
            return await this.em(user);
        }
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

    async contactApp(msg:SendMessageIntr){
        let ms:MessageModel={
            userid:msg.userid,
            text:msg.text,
            isSender:msg.isSender
        }as MessageModel;
        let user:UserModel|null;
        user=await this.userModel.findById(msg.userid);
        if(user!=null){
            user.chat.push(ms);
            await this.userModel.findByIdAndUpdate(msg.userid,{chat:user.chat});
        }
    }
  

}
