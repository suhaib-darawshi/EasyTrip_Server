import {Inject, Injectable} from "@tsed/di";
import { MongooseModel } from "@tsed/mongoose";
import { CompanyModel } from "src/models/CompanyModel";
import { RatingsModel } from "src/models/RatingsModel";
import { TripModel } from "src/models/TripModel";

@Injectable()
export class RatingsService {
    constructor(@Inject(RatingsModel) private ratingModel:MongooseModel<RatingsModel>,@Inject(TripModel) private tripModel:MongooseModel<TripModel>,@Inject(CompanyModel) private companyModel:MongooseModel<CompanyModel>){}
    async getAll(){
        return await this.ratingModel.find();
    }

    async getTripRatings(id:string){
        return await this.ratingModel.find({tripid:id});
    }

    async getCompanyRatings(id:string){
        return await this.ratingModel.find({companyid:id});
    }

    async getUserRatings(id:string){
        return await this.ratingModel.find({userid:id});
    }

    async create(rate:RatingsModel){
        return await this.ratingModel.create(rate);
    }

    async update(rate:RatingsModel){
        return await this.ratingModel.findByIdAndUpdate(rate._id,rate);
    }

    async rateAtrip(rate:RatingsModel){
        let r=await this.ratingModel.findOne({userid:rate.userid,tripid:rate.tripid});
        if(r==null){
             await this.create(rate);
            
        }
        else{
            r.rate=rate.rate;
             await this.update(r);
             
        }
        this.getFinalTripRate(rate.tripid);
        this.getFinalCompanyRate(rate.companyid);
        return ;
        
    }

    async getFinalTripRate(id:string){
        let ratings=await this.ratingModel.find({tripid:id});
        let sum=0;
        if(ratings.length<1){
            return;
        }
        for (const iterator of ratings) {
            sum+=iterator.rate;
        }
        let tr=await this.tripModel.findById(id);
         await this.tripModel.findByIdAndUpdate(id,{rate:sum/ratings.length});
        return sum/ratings.length;
    }

    async getFinalCompanyRate(id:string){
        let ratings=await this.ratingModel.find({companyid:id});
        let sum=0;
        if(ratings.length<1){
            return;
        }
        for (const iterator of ratings) {
            sum+=iterator.rate;
        }
        let tr=await this.companyModel.findById(id);
         await this.companyModel.findByIdAndUpdate(id,{rate:sum/ratings.length});
         return sum/ratings.length;
        
        
    }
}
