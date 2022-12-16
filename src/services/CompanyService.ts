import {Inject, Injectable} from "@tsed/di";
import { MongooseModel } from "@tsed/mongoose";
import { IntegerType } from "mongodb";
import { AddTrip } from "src/interfaces/AddTrip";
import { CompanyModel } from "src/models/CompanyModel";
import { TripModel } from "src/models/TripModel";

@Injectable()
export class CompanyService {
    constructor(@Inject(CompanyModel)private companyMode:MongooseModel<CompanyModel>,@Inject(TripModel)private tripModel:MongooseModel<TripModel>){

    }
    async getAll(){
        return await this.companyMode.find();
    }
    async get(id:string){
        return await this.companyMode.findById(id);
    }
    async create(company:CompanyModel){
        return await this.companyMode.create(company);
    }
    async update(company:CompanyModel){
        let com:CompanyModel|null;
        
         await this.companyMode.findByIdAndUpdate(company._id,company);
         com =await this.companyMode.findById(company._id);
         let trips:TripModel[];
        trips =await this.tripModel.find();
        
        // let y:string="a";
    //     if(com!=null){
    //     for(var x of trips){
    //         if(x.company==(com._id) ){
    //             x.company=com._id;
                
    //             trips[trips.indexOf(x)].company=co;
    //             await this.tripModel.findByIdAndUpdate(x._id,x);
    //             y="asd";
                
    //         }
            
                
            
            
            
    //     }
    // }
        return com;
    }

    async delete(company:CompanyModel){
        return await this.companyMode.findByIdAndDelete(company._id);
    }
    async addTrip(intr:AddTrip){
        let com:CompanyModel| null;
        
        com =await this.companyMode.findById(intr.companyid);
        if(com !=null){
            if(intr.method.toLowerCase()=="add"){
                com.trips.push(intr.tripid);
                await this.companyMode.findByIdAndUpdate(com._id,com);
                return "added"
            }
            else{
                com.trips.splice(com.trips.indexOf(intr.tripid),1);
                await this.companyMode.findByIdAndUpdate(com._id,com);
                return "removed";
            } 
            
        }
        else{
            return "trip not found";
        }

    }
    async getCompanyTrips(com:CompanyModel){
        let company:CompanyModel|null;
        let trips:TripModel[]=[];
        let tr:TripModel|null;
        company=await this.companyMode.findById(com._id);
        if(company==null)
            return "company not found";
        else{
            for(var tid of company.trips){
                tr=await this.tripModel.findById(tid);
                if(tr!=null){
                    trips.push(tr);
                }
            }
            return trips;
        }
    }
}
