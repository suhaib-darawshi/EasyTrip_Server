import {Inject, Injectable} from "@tsed/di";
import { MongooseModel } from "@tsed/mongoose";
import { AddTrip } from "src/interfaces/AddTrip";
import { ClientTripModel } from "src/interfaces/ClientTripModel";
import { LikeTripJson } from "src/interfaces/LikeTripJson";
import { CompanyModel } from "src/models/CompanyModel";
import { TripModel } from "src/models/TripModel";

@Injectable()
export class TripService {
    constructor(@Inject(TripModel)private tripModel:MongooseModel<TripModel>,@Inject(CompanyModel)private companyModel:MongooseModel<CompanyModel>){

    }
    async demonstrateCompany(trip:TripModel){
        let tr:TripModel|null;
        if(trip==null)
        trip={}as TripModel;
        tr=await this.tripModel.findById(trip._id);
        let comid:string;
        let comp:CompanyModel|null;
        
        if(tr!=null){
            comid=tr.companyid;
            comp=await this.companyModel.findById(comid);
            if(comp!=null){
                tr.companyid=comp;

            }
            trip=tr;
            

        }
        
        return trip;
        
    }
    async getAll(){
        let intrtrips:TripModel[]=[];
        let trips:TripModel[]=[];
        trips= await this.tripModel.find();
        for(var x of trips){
            intrtrips.push(await this.demonstrateCompany(x));
        }
        return intrtrips;
    }
    async get(trip:TripModel){
        let tr:TripModel|null;
        tr=await this.tripModel.findById(trip._id);
        if(tr!=null)
        return this.demonstrateCompany(tr );
    }
    async create(trip:TripModel){
        return await this.tripModel.create(trip);
    }
    async update(trip:TripModel){
        return await this.tripModel.findByIdAndUpdate(trip._id,trip);
    }
    async delete(trip:TripModel){
        return await this.tripModel.findByIdAndDelete(trip._id);
    }
    async likeTrip(ids:LikeTripJson){
        let a:Array<string>;
        let trip:TripModel | null;
        trip=await this.tripModel.findById(ids.tripid);
        if(trip == null){
            return "trip not found";
        }
        if(ids.method=="like"){
            trip.liked_users.push(ids.userid);
            //return await this.tripModel.findByIdAndUpdate(ids.tripid,trip);
        }
        else {
            trip.liked_users.splice(trip.liked_users.indexOf(ids.userid),1);
            
        }
        trip.liked_count=trip.liked_users.length;
        return await this.tripModel.findByIdAndUpdate(ids.tripid,trip);

        
    }
    async putCompanyById(ids:AddTrip){
        let trip:TripModel | null;
        trip= await this.tripModel.findById(ids.tripid);
        let com :CompanyModel |null;
        com=await this.companyModel.findById(ids.companyid);
        if(trip !=null && com !=null){
            com.trips.push(ids.tripid);
            await this.companyModel.findByIdAndUpdate(com._id,com)
            trip.companyid=com._id;
             await this.tripModel.findByIdAndUpdate(trip._id,trip);
             
            return trip;
        }
        else {
            return "trip or company not found";
        }
    }
    
}
