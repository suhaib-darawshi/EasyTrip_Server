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
import { TripModel } from "src/models/TripModel";
import { RatingsModel } from "src/models/RatingsModel";
import { nmf, nmf1 } from "src/recommentationSystem/FullSystem";


const userSecret = process.env.userSecret || 'userSecret';
@Injectable()
export class UserService {
    constructor(@Inject(UserModel)private userModel:MongooseModel<UserModel>,@Inject(RatingsModel)private ratings:MongooseModel<UserModel>,@Inject(TripModel)private tripModel:MongooseModel<TripModel>){
    }
    async generateJWT(user: UserModel) {
        const payload = {
          id: user._id,
          // include any other information you want to include in the token
        };
        const token = jwt.sign(payload, userSecret, {
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
        let u= await this.userModel.create(user);
        if(u!=null){
            return await this.generateJWT(u);
        }
        return " ";
        
    }

    async update(user:UserModel){
        return await this.userModel.findByIdAndUpdate(user._id,user);
    }
    

    async delete(user:UserModel){
        return await this.userModel.findByIdAndDelete(user._id);
    }
     async  system(){
        let rates:RatingsModel[]=await this.ratings.find();
        let users:string[]=[];
        let trips:string[]=[];
        for (const iterator of rates) {
            users.push(iterator.userid);
            trips.push(iterator.tripid);
    
        }
        var usersSet =new Set(users);
        var tripsSet=new Set(trips);
        users=Array.from(usersSet);
        trips=Array.from(tripsSet);
        let w = new Array(usersSet.size).fill(0).map(() => new Array(tripsSet.size).fill(0));
        for (const iterator of rates){
            w[users.indexOf(iterator.userid)][trips.indexOf(iterator.tripid)]=iterator.rate;
        }
        for (let i = 0; i < w.length; i++){
            for(let j = 0; j < w[0].length; j++){
                if(!(w[i][j]>0)){
                    w[i][j]=-1;
                }
            }
        }
        
        var result=nmf(w,w.length,1000);
        console.log(result);
        for (let i = 0; i < w.length; i++){
            for(let j = 0; j < w[0].length; j++){
                if(!(w[i][j]>0)){
                    if(result[i][j]>4){
                        await this.mailRecommendation(trips[j],users[i]);
                        await this.addRecommendation(trips[j],users[i]);
                    }
                }
            }
        }
        return;
        }
    async addRecommendation(tripid:string,userid:string){
        let user=await this.userModel.findById(userid);
        let trip =await this.tripModel.findById(tripid);
        if(user==null||trip==null)
        return;
        user.recomended.push(tripid);
        return await this.update(user);
    }
    async mailRecommendation(tripid:string,userid:string){
        let user=await this.userModel.findById(userid);
        let trip =await this.tripModel.findById(tripid);
        if(user==null||trip==null)
        return;
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
          
         await transport.sendMail({ subject:"Confirm Your SignUp :",from:"Easy Trip",to:user.email,text:"Hi ,\n Check out our new Trip "+trip.name + " , to"+trip.location +"\n for only " + trip.price + " $ \n Come now before it's all filled \n The trip starts at : " +trip.begin.toISOString() });
         
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
