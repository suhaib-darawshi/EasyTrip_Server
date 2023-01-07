import { Model, ObjectID } from "@tsed/mongoose";
import {Default, Property} from "@tsed/schema";

@Model()
export class CompanyModel {
  @ObjectID('id')
  _id: string;

  @Property()
  name:string;

  @Property()
  email:string;

  @Property()
  password:string;

  @Property()
  phone:string;

  @Property()
  @Default('public/uploads/companylogos/defaultImage.png')
  logo:string;
  
  @Property()
  @Default("not available")
  website:string;

  @Property()
  address:string;

  @Property()
  @Default("0")
  rank:string;

  @Property()
  @Default([])
  trips:string[];
}
