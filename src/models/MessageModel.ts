import { Model, ObjectID } from "@tsed/mongoose";
import {Property} from "@tsed/schema";
@Model()
export class MessageModel {
  @ObjectID("id")
  _id: string;
  @Property()
  userid:string;
  @Property()
  text:string;

  @Property()
  isSender:boolean;
}
