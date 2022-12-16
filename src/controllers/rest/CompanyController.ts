import { BodyParams, MultipartFile, PlatformMulterFile } from "@tsed/common";
import {Controller, Inject} from "@tsed/di";
import {Get, Post, Put} from "@tsed/schema";
import { AddTrip } from "src/interfaces/AddTrip";
import { CompanyModel } from "src/models/CompanyModel";
import { CompanyService } from "src/services/CompanyService";
import { TripService } from "src/services/TripService";

@Controller("/company-controller")
export class CompanyController {
  constructor(@Inject(CompanyService)private service:CompanyService){}
  @Get("/getAll")
  getAll() {
    return this.service.getAll();
  }

  @Get("/")
  get(@MultipartFile('file')file:PlatformMulterFile,@BodyParams()com:CompanyModel){
    return this.service.get(com._id);
  }
  @Post("/")
  create(@MultipartFile('file')file:PlatformMulterFile,@BodyParams()com:CompanyModel){
    return this.service.create(com);
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
    return this.service.getCompanyTrips(com);

  }
  
}
