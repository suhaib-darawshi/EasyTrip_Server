import { BodyParams, MulterOptions, MultipartFile, PlatformMulterFile } from "@tsed/common";
import {Controller, Inject} from "@tsed/di";
import {Get, Post, Put} from "@tsed/schema";
import { AddTrip } from "src/interfaces/AddTrip";
import { CompanyModel } from "src/models/CompanyModel";
import { TripModel } from "src/models/TripModel";
import { CompanyService } from "src/services/CompanyService";
import { TripService } from "src/services/TripService";

@Controller("/company-controller")
export class CompanyController {
  constructor(@Inject(CompanyService)private service:CompanyService){}
  @Get("/getAll")
  getAll() {
    return this.service.getAll();
  }

  @Post("/")
  create(@MultipartFile('file')file:PlatformMulterFile,@BodyParams()com:CompanyModel){
    return this.service.create(com);
  }
  @Post("/createTrip")
  @MulterOptions({dest:"./public/uploads/images"})
  addNewTrip(@MultipartFile('file')file:PlatformMulterFile,@BodyParams()trip:TripModel){
    trip.url='public/uploads/images/'+file.filename;
    return this.service.addNewTrip(trip);
  }
  @Post("/getCompanyInfo")
  getInfo(@MultipartFile('file')file:PlatformMulterFile,@BodyParams()com:CompanyModel){
    return this.service.getInfo(com.email);
  }
  @Put("/updateCompany")
  update(@MultipartFile('file')file:PlatformMulterFile,@BodyParams()com:CompanyModel){
    return this.service.update(com);
  }
  @Put("/addTrip")
  addTrip(@MultipartFile('file')file:PlatformMulterFile,@BodyParams()intr:AddTrip){
    return this.service.addTrip(intr);
  }
  @Post("/getSpecific")
  getTrips(@MultipartFile('file')file:PlatformMulterFile,@BodyParams()com:CompanyModel){
    return this.service.getCompanyTrips(com._id);
  }
  @Post("/login")
  login(@MultipartFile('file')file:PlatformMulterFile,@BodyParams()com:CompanyModel){
  return this.service.login(com);  
  }
  
}
