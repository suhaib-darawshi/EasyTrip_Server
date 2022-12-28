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
  companyid:any;
  @Property()
  @Default("not provided")
  hotel:string;
  @Property()
  @Default("not provided")
  hotelRank:string;
  @Property()
  @Default("not provided")
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
  @Default(0)
  duration:Number;

  @Property()
  @Default([])
  BookedUsers:string[];

  @Property()
  @Default(Date.now)
  end:Date;

  @Property()
  @Default('0')
  price:string;

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
