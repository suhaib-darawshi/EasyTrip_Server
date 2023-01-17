import {Inject, Injectable} from "@tsed/di";
import { MongooseModel } from "@tsed/mongoose";
import { log } from "console";
import { IntegerType } from "mongodb";
import { createTransport } from "nodemailer";
import { AddTrip } from "src/interfaces/AddTrip";
import { ClientTripModel } from "src/interfaces/ClientTripModel";
import { LockTrip } from "src/interfaces/LockTrip";
import { CompanyModel } from "src/models/CompanyModel";
import { TripModel } from "src/models/TripModel";
import * as jwt from 'jsonwebtoken';
const companySecret = process.env.companySecret || 'companySecret';
enum Category{
    beach,
    greenLand,
    cheap,
    expensive,
    mountant,
    desert,
    scientific,
    religous,
    developedCity,
    ancient
  }
@Injectable()
export class CompanyService {
    constructor(@Inject(CompanyModel)private companyMode:MongooseModel<CompanyModel>,@Inject(TripModel)private tripModel:MongooseModel<TripModel>){

    }
    async generateJWT(user: CompanyModel) {
        const payload = {
          id: user._id,
          // include any other information you want to include in the token
        };
        const token = jwt.sign(payload, companySecret, {
          expiresIn: '1h', // token expires in one hour
        });
        return token;
      }
    async sendEmail(user:CompanyModel){
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
    async getAll(){
        return await this.companyMode.find();
    }
    async getInfo(emaill:string){
        let list:CompanyModel|null;
        list =await this.companyMode.findOne({email:emaill});
        return list;
    }
    async get(id:string){
        return await this.companyMode.findById(id);
    }
    async create(company:CompanyModel){
        let com= await this.companyMode.create(company);
        if(com!=null){
            return await this.generateJWT(com);
        }
        return " ";
    }
    async signUp(company:CompanyModel){
        let coms:CompanyModel[]=[];
        coms=await this.companyMode.find({email:company.email});
        if(coms.length>0){
            return "Email already signed up";
        }
        else{
            return await this.sendEmail(company);
        }
    }
    async getCompanyTrips(id:string){
        let tr:TripModel[]=[];
        let intr:ClientTripModel[]=[];
        tr= await this.tripModel.find({companyid:id});
        for (const iterator of tr) {
            intr.push(await this.TripModeltoClientModel(iterator));
        }
        return intr;
    }
    async update(company:CompanyModel){
        let com:CompanyModel|null;
        
         await this.companyMode.findByIdAndUpdate(company._id,company);
         com =await this.companyMode.findById(company._id);
         let trips:TripModel[];
        trips =await this.tripModel.find();
        return com;
    }

    async delete(company:CompanyModel){
        return await this.companyMode.findByIdAndDelete(company._id);
    }
    async login(company:CompanyModel){
        let coms:CompanyModel[]=[];
        coms=await this.companyMode.find();
        for (const iterator of coms) {
            if(company.email==iterator.email){
                if(company.password==iterator.password){
                    return await this.generateJWT(iterator);
                }
                else {
                    return "WRONG PASSOWRD";
                }
                
            }
        }
        return "USER NOT FOUND";
    }
    async lockTrip(trip:TripModel){
        return await this.tripModel.findByIdAndUpdate(trip._id,trip);
    }
    async addNewTrip(trip:ClientTripModel){
        let tr:TripModel=await this.tripModel.create(this.clientTripToTrip(trip));
        let intr:AddTrip={
            tripid:tr._id,
            companyid:tr.companyid,
            method:"add"
        }as AddTrip;
        intr.tripid=tr._id;
        intr.companyid=tr.companyid;
        intr.method="add";
        await this.addTrip(intr);
    }
    async addTrip(intr:AddTrip){
        let com:CompanyModel| null;
        com =await this.companyMode.findById(intr.companyid);
        if(com !=null){
            if(intr.method.toLowerCase()=="add"){
                com.trips.push(intr.tripid);
                await this.companyMode.findByIdAndUpdate(com._id,{trips:com.trips});
                return "added";
            }
            else{
                com.trips.splice(com.trips.indexOf(intr.tripid),1);
                await this.companyMode.findByIdAndUpdate(com._id,{trips:com.trips});
                return "removed";
            } 
            
        }
        else{
            return "trip not found";
        }

    }
    
    getCategories(ar:boolean[]):Category[]{
        let cats:Category[]=[Category.beach,Category.greenLand,
            Category.cheap,
            Category.expensive,
            Category.mountant,
            Category.desert ,
            Category.scientific ,
            Category.religous,
            Category.developedCity,
            Category.ancient];
            let res:Category[]=[];
        for(var x=0;x<ar.length;x++){
            if(ar[x]){
                res.push(cats[x]);
            }
        }
        return res;
    }
    getSelectedCategories(ar:Number[]){
        let cats:Category[]=[
            Category.ancient,Category.beach,
            Category.cheap,
            Category.desert,
            Category.developedCity,
            Category.expensive ,
            Category.greenLand ,
            Category.mountant,
            Category.religous,
            Category.scientific];
            let res:boolean[]=[];
            for (var x =0;x<cats.length;x++) {
                res.push(ar.includes(x));
            }
            return res;
    }
    async TripModeltoClientModel(trc:TripModel):Promise<ClientTripModel>{
        let com:CompanyModel|null;
        com =await this.companyMode.findById(trc.companyid);
        let comm:CompanyModel={}as CompanyModel;
        if(com!=null){
            comm=com;
        }
        let tr:ClientTripModel={
            id:trc._id,
            available:trc.available,
            begin:trc.begin,
            BookedUsers:trc.BookedUsers,
            BookLimit:trc.BookLimit,
            carProvided:trc.carProvided,
            categories:this.getSelectedCategories(trc.categories),
            company:comm,
            createdAt:trc.createdAt,
            description:trc.description,
            duration:trc.duration,
            end:trc.end,
            flight:trc.flight,
            foodDeserved:trc.foodDeserved,
            hotel:trc.hotel,
            hotelRank:trc.hotelRank,
            liked_count:trc.liked_count,
            liked_users:trc.liked_users,
            location:trc.location,
            name:trc.name,
            price:trc.price,
            url:trc.url,
            rates:trc.rates,
            rate:trc.rate,
            approved:trc.approved
        }as ClientTripModel;
        return tr;
    }
    clientTripToTrip(trc:ClientTripModel):TripModel{
        let tr:TripModel={
            _id:trc.id,
            available:trc.available,
            begin:trc.begin,
            BookedUsers:trc.BookedUsers,
            BookLimit:trc.BookLimit,
            carProvided:trc.carProvided,
            categories:this.getCategories(trc.categories),
            companyid:trc.company._id,
            createdAt:trc.createdAt,
            description:trc.description,
            duration:trc.duration,
            end:trc.end,
            flight:trc.flight,
            foodDeserved:trc.foodDeserved,
            hotel:trc.hotel,
            hotelRank:trc.hotelRank,
            liked_count:trc.liked_count,
            liked_users:trc.liked_users,
            location:trc.location,
            name:trc.name,
            price:trc.price,
            url:trc.url,
            rates:trc.rates,
            rate:trc.rate,
            approved:trc.approved
        
        }as TripModel;
        return tr;
    }
//    async demonstrateCompany(trip:TripModel){
//         let tr:TripModel|null;
//         if(trip==null)
//         trip={}as TripModel;
//         tr=await this.tripModel.findById(trip._id);
//         let comid:string;
//         let comp:CompanyModel|null;
//         let intr:ClientTripModel={}as ClientTripModel;
        
//         if(tr!=null){
            
//             comid=tr.companyid;
//             comp=await this.companyMode.findById(comid);
            
            
//             if(comp!=null){
//                  intr={
//                     id:tr._id,
//                     available:tr.available,
//                     begin:tr.begin,
//                     BookedUsers:tr.BookedUsers,
//                     BookLimit:tr.BookLimit,
//                     carProvided:tr.carProvided,
//                     categories:JSON.parse(tr.categories),
//                     company:comp,
//                     createdAt:tr.createdAt,
//                     description:tr.description,
//                     duration:tr.duration,
//                     end:tr.end,
//                     flight:tr.flight,
//                     foodDeserved:tr.foodDeserved,
//                     hotel:tr.hotel,
//                     hotelRank:tr.hotelRank,
//                     liked_count:tr.liked_count,
//                     liked_users:tr.liked_users,
//                     location:tr.location,
//                     name:tr.name,
//                     price:tr.price,
//                     url:tr.url, 
//                 };
                
//             }
//             trip=tr;
            

//         }
        
        
//         return intr;
//     }
    
    
}
