import {Inject, Injectable} from "@tsed/di";
import { MongooseModel } from "@tsed/mongoose";
import { TripModel } from "src/models/TripModel";

@Injectable()
export class TripService {
    constructor(@Inject(TripModel)private tripModel:MongooseModel<TripModel>){

    }

    async getAll(){
        return await this.tripModel.find();
    }
    async get(trip:TripModel){
        return await this.tripModel.findById(trip._id);
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
}
