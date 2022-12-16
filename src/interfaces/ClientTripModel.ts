import { CompanyModel } from "src/models/CompanyModel";

export interface ClientTripModel {
    id: string;

    name:string;
  
    location:string;
  
    url:string;
  
    description:string;
    
    company:CompanyModel;
    
    liked_users:string[];
    createdAt:Date;
    liked_count:Number;
  
    available:boolean;
}
