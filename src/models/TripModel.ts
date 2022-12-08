import { Model, ObjectID } from "@tsed/mongoose";
import {Default, Property} from "@tsed/schema";
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
  liked_users:string[];

  @Property()
  @Default(Date.now)
  createdAt:Date;

  @Property()
  @Default(0)
  liked_count:Number;

  @Property()
  @Default(true)
  available:boolean;

  @Property()
  company:string;
}
