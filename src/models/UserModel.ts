import {Property,Default} from "@tsed/schema";
import { Model, ObjectID } from "@tsed/mongoose";
@Model()
export class UserModel {
  @ObjectID("id")
  _id: string;

  @Property()
  first_name:string;

  @Property()
  last_name:string;

  @Property()
  email:string;

  @Property()
  password:string;

  @Property()
  phoneNumber:string;

  @Property()
  @Default("standard")
  role:string;

  @Property()
  @Default(Date.now)
  createdAt:Date;

  @Property()
  
  liked_trips:string[];
}
