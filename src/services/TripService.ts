import {Inject, Injectable} from "@tsed/di";
import { MongooseModel } from "@tsed/mongoose";
import { doesNotMatch } from "assert";
import { IntegerType } from "mongodb";
import { AddTrip } from "src/interfaces/AddTrip";
import { ClientTripModel } from "src/interfaces/ClientTripModel";
import { LikeTripJson } from "src/interfaces/LikeTripJson";
import { RateTrip } from "src/interfaces/RateTrip";
import { CompanyModel } from "src/models/CompanyModel";
import { TripModel } from "src/models/TripModel";
import { UserModel } from "src/models/UserModel";


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
export class TripService {
    constructor(@Inject(TripModel)private tripModel:MongooseModel<TripModel>,@Inject(CompanyModel)private companyModel:MongooseModel<CompanyModel>,@Inject(UserModel)private userModel:MongooseModel<UserModel> ){

    }
    // async demonstrateCompany(trip:TripModel){
    //     let tr:TripModel|null;
    //     if(trip==null)
    //     trip={}as TripModel;
    //     tr=await this.tripModel.findById(trip._id);
    //     let comid:string;
    //     let comp:CompanyModel|null;
    //     let intr:ClientTripModel={}as ClientTripModel;
    //     if(tr!=null){
            
    //         comid=tr.companyid;
    //         comp=await this.companyModel.findById(comid);
    //         if(comp!=null){
    //              intr={
    //                 id:tr._id,
    //                 available:tr.available,
    //                 begin:tr.begin,
    //                 BookedUsers:tr.BookedUsers,
    //                 BookLimit:tr.BookLimit,
    //                 carProvided:tr.carProvided,
    //                 categories:JSON.parse("["+tr.categories+"]"),
    //                 company:comp,
    //                 createdAt:tr.createdAt,
    //                 description:tr.description,
    //                 duration:tr.duration,
    //                 end:tr.end,
    //                 flight:tr.flight,
    //                 foodDeserved:tr.foodDeserved,
    //                 hotel:tr.hotel,
    //                 hotelRank:tr.hotelRank,
    //                 liked_count:tr.liked_count,
    //                 liked_users:tr.liked_users,
    //                 location:tr.location,
    //                 name:tr.name,
    //                 price:tr.price,
    //                 url:tr.url, 
    //             }as ClientTripModel;
                
    //         }
    //         trip=tr;
            

    //     }
        
        
    //     return intr;
    // }
    async getAllForUsers(){
        let intrtrips:ClientTripModel[]=[];
        let trips:TripModel[]=[];
        trips= await this.tripModel.find({approved:true});
        for(var x of trips){
            intrtrips.push(await this.TripModeltoClientModel(x));
        }
        return intrtrips;
    }
    async getAll(){
        let intrtrips:ClientTripModel[]=[];
        let trips:TripModel[]=[];
        trips= await this.tripModel.find();
        for(var x of trips){
            intrtrips.push(await this.TripModeltoClientModel(x));
        }
        return intrtrips;
    }
    async acceptTrip(trip:TripModel){
        
        return await this.tripModel.findByIdAndUpdate(trip._id,trip);
    }
    async get(trip:ClientTripModel){
        let tr:TripModel|null;
        tr=await this.tripModel.findById(trip.id);
        if(tr!=null)
        return await this.TripModeltoClientModel(tr );
    }
    async create(trip:TripModel){
        return await this.tripModel.create(trip);
    }
    async update(trip:ClientTripModel){
        return await this.tripModel.findByIdAndUpdate(trip.id, this.clientTripToTrip(trip));
    }
    async delete(trip:ClientTripModel){
        return await this.tripModel.findByIdAndDelete(trip.id);
    }
    async likeTrip(ids:LikeTripJson){
        let a:Array<string>;
        let trip:TripModel | null;
        trip=await this.tripModel.findById(ids.tripid);
        let us:UserModel|null;
        us=await this.userModel.findById(ids.userid);
        if(trip == null){
            return "trip not found";
        }
        if(us==null){
            return 'user not fount';
        }
        if(ids.method=="like"){
            trip.liked_users.push(ids.userid);
            us.liked_trips.push(ids.tripid);
            // return await this.tripModel.findByIdAndUpdate(ids.tripid,trip);
        }
        else {
            trip.liked_users.splice(trip.liked_users.indexOf(ids.userid),1);
            us.liked_trips.splice(us.liked_trips.indexOf(trip._id),1);
        }
        trip.liked_count=trip.liked_users.length;
        await this.userModel.findByIdAndUpdate(ids.userid,us);
        return await this.tripModel.findByIdAndUpdate(ids.tripid,trip);

        
    }

    async rateTrip(rate:RateTrip){
        let trip:TripModel|null;
        trip=await this.tripModel.findById(rate.tripid);
        if(trip==null){
            return "trip not found";
        }
        
        let ratesSum:number=0;
        let ins:number=-1;
        for(var ind of trip.rates){
            if(ind.userid==rate.userid){
                ins=trip.rates.indexOf(ind);
            }
        }
        if(ins!=-1){
            trip.rates.splice(ins,1);
        }
        trip.rates.push(rate);
        for(var ind of trip.rates){
            ratesSum+=ind.rate;
        }
        trip.rate=ratesSum/trip.rates.length;
        await this.tripModel.findByIdAndUpdate(trip._id,{rates:trip.rates,rate:trip.rate});
        return 'done';
    }
    async BookTrip(ids:LikeTripJson){
        let tr:TripModel|null;
        tr= await this.tripModel.findById(ids.tripid);
        let us:UserModel|null;
        us=await this.userModel.findById(ids.userid);
        if(tr!=null && us!= null){
            if(ids.method=="book"){
                if(!(tr.BookedUsers.length<tr.BookLimit)){
                    return "Maximum Number";
                }
                tr.BookedUsers.push(us._id.toString());
                us.booked_trips.push(tr._id.toString());
                if(!(tr.BookedUsers.length<tr.BookLimit)){
                    tr.available=false;
                }
                

            }
            else{
                if(!(tr.BookedUsers.includes(us._id))){
                    return "user is not in the booked list";
                }
                tr.BookedUsers.splice(tr.BookedUsers.indexOf(us._id,1));
                us.booked_trips.splice(us.booked_trips.indexOf(tr._id,1));

            }
            await this.userModel.findByIdAndUpdate(us._id,us);
            await this.tripModel.findByIdAndUpdate(tr._id,tr);
            return "done";
        }
        
    }
    async putCompanyById(ids:AddTrip){
        let trip:TripModel | null;
        trip= await this.tripModel.findById(ids.tripid);
        let com :CompanyModel |null;
        com=await this.companyModel.findById(ids.companyid);
        if(trip !=null && com !=null){
            com.trips.push(ids.tripid);
            await this.companyModel.findByIdAndUpdate(com._id,{trips:com.trips})
            trip.companyid=com._id;
             await this.tripModel.findByIdAndUpdate(trip._id,{companyid:trip.companyid});
             
            return trip;
        }
        else {
            return "trip or company not found";
        }
    }
    async TripModeltoClientModel(trc:TripModel):Promise<ClientTripModel>{
        let com:CompanyModel|null;
        com =await this.companyModel.findById(trc.companyid);
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
    getCategories(ar:boolean[]):Category[]{
        let cats:Category[]=[
            Category.ancient,
            Category.beach,
            Category.cheap,
            Category.desert ,
            Category.developedCity,
            Category.expensive,
            Category.greenLand,
            Category.mountant,
            Category.religous,
            Category.scientific ,
            ];
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
    
}
