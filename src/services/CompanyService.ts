import {Inject, Injectable} from "@tsed/di";
import { MongooseModel } from "@tsed/mongoose";
import { IntegerType } from "mongodb";
import { AddTrip } from "src/interfaces/AddTrip";
import { ClientTripModel } from "src/interfaces/ClientTripModel";
import { CompanyModel } from "src/models/CompanyModel";
import { TripModel } from "src/models/TripModel";

@Injectable()
export class CompanyService {
    constructor(@Inject(CompanyModel)private companyMode:MongooseModel<CompanyModel>,@Inject(TripModel)private tripModel:MongooseModel<TripModel>){

    }
    async getAll(){
        return await this.companyMode.find();
    }
    async getInfo(emaill:string){
        let list:CompanyModel[]=[];
        list =await this.companyMode.find({email:emaill});
        for (const iterator of list) {
            if(emaill==iterator.email){
                return iterator;
            }
        } 
    }
    async get(id:string){
        return await this.companyMode.findById(id);
    }
    async create(company:CompanyModel){
        return await this.companyMode.create(company);
    }
    async getCompanyTrips(id:string){
        let tr:TripModel[]=[];
        let intr:TripModel[]=[];
        tr= await this.tripModel.find({companyid:id});
        for (const iterator of tr) {
            intr.push(await this.demonstrateCompany(iterator));
        }
        return intr;
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
    async login(company:CompanyModel){
        let coms:CompanyModel[]=[];
        coms=await this.companyMode.find();
        for (const iterator of coms) {
            if(company.email==iterator.email){
                if(company.password==iterator.password){
                    return "ACCESSED";
                }
                else {
                    return "WRONG PASSOWRD";
                }
                
            }
        }
        return "USER NOT FOUND";
    }
    async addNewTrip(trip:TripModel){
        let tr:TripModel=await this.tripModel.create(trip);
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
                await this.companyMode.findByIdAndUpdate(com._id,com);
                return "added";
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
   async demonstrateCompany(trip:TripModel){
        let tr:TripModel|null;
        if(trip==null)
        trip={}as TripModel;
        tr=await this.tripModel.findById(trip._id);
        let comid:string;
        let comp:CompanyModel|null;
        
        if(tr!=null){
            comid=tr.companyid;
            comp=await this.companyMode.findById(comid);
            if(comp!=null){
                tr.companyid=comp;

            }
            trip=tr;
            

        }
        
        return trip;
        
    }
    
}
