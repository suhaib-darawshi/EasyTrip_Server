import { CompanyModel } from "src/models/CompanyModel";
import { RateTrip } from "./RateTrip";
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
export interface ClientTripModel {
    id: string;
    name:string;
    BookLimit:Number;
    location:string;
    begin:Date;
    url:string;
    flight:string;
    description:string;
    hotelRank:string;
    company:CompanyModel;
    categories:boolean[];
    liked_users:string[];
    createdAt:Date;
    liked_count:Number;
    hotel:string;
    available:boolean;
    duration:Number;
    BookedUsers:string[];
    end:Date;
    price:string;
    carProvided:boolean;
    foodDeserved:boolean;
    rates:RateTrip[];
    rate:Number;

}
