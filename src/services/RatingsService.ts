import {Inject, Injectable} from "@tsed/di";
import { MongooseModel } from "@tsed/mongoose";
import { RatingsModel } from "src/models/RatingsModel";

@Injectable()
export class RatingsService {
    constructor(@Inject(RatingsModel) private ratingModel:MongooseModel<RatingsModel>){}
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
            return await this.create(rate);
        }
        else{
            return await this.update(rate);
        }
    }

    async getFinalTripRate(id:string){
        let ratings=await this.ratingModel.find({tripid:id});
        let sum=0;
        for (const iterator of ratings) {
            sum+=iterator.rate;
        }
        return (sum/ratings.length);
    }

    async getFinalCompanyRate(id:string){
        let ratings=await this.ratingModel.find({companyid:id});
        let sum=0;
        for (const iterator of ratings) {
            sum+=iterator.rate;
        }
        return (sum/ratings.length);
    }
}
