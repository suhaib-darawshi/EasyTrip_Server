import { Model, ObjectID } from "@tsed/mongoose";
import {Default, Property} from "@tsed/schema";
import { CompanyModel } from "./CompanyModel";
@Model()
export class TripModel {

  @ObjectID("id")
  _id: string;

  @Property()
  name:string;

  @Property()
  location:string;

  @Property()
  
  url:string;

  @Property()
  description:string;
  
  @Property()
  companyid:string;
  @Property()
  hotel:string;
  @Property()
  hotelRank:string;
  @Property()
  flight:string;
  
  @Property()
  @Default([])
  liked_users:string[];

  @Property()
  @Default(Date.now)
  createdAt:Date;

  @Property()
  @Default(Date.now)
  begin:Date;

  @Property()
  @Default(0)
  BookLimit:Number;

  @Property()
  @Default([])
  BookedUsers:string[];

  @Property()
  @Default(Date.now)
  end:Date;

  @Property()
  @Default(0)
  price:Number;

  @Property()
  @Default(0)
  liked_count:Number;

  @Property()
  @Default(true)
  available:boolean;

  @Property()
  @Default(false)
  carProvided:boolean;

  @Property()
  @Default(false)
  foodDeserved:boolean;

  
}
