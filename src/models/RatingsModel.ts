import { Model, ObjectID } from "@tsed/mongoose";
import {Property} from "@tsed/schema";
@Model()
export class RatingsModel {
  @ObjectID("id")
  _id: string;
  @Property()
  userid:string;
  @Property()
  companyid:string;
  @Property()
  tripid:string;
  @Property()
  rate:number;
}
