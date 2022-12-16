import { Model, ObjectID } from "@tsed/mongoose";
import {Property} from "@tsed/schema";
@Model()
export class CompanyModel {
  @ObjectID('id')
  _id: string;

  @Property()
  name:string;

  @Property()
  email:string;

  @Property()
  phone:string;

  @Property()
  logo:string;
  
  @Property()
  website:string;

  @Property()
  address:string;

  @Property()
  rank:string;

  @Property()
  trips:string[];
}
