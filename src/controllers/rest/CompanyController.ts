import { BodyParams, MulterOptions, MultipartFile, PlatformMulterFile, UseBefore } from "@tsed/common";
import {Controller, Inject} from "@tsed/di";
import {Delete, Get, Post, Put} from "@tsed/schema";
import { AddTrip } from "src/interfaces/AddTrip";
import { ClientTripModel } from "src/interfaces/ClientTripModel";
import { LockTrip } from "src/interfaces/LockTrip";
import { CompanyModel } from "src/models/CompanyModel";
import { TripModel } from "src/models/TripModel";
import { CompanyService } from "src/services/CompanyService";
import { TripService } from "src/services/TripService";
import {jwtMiddleware}from "src/middlewares/asd"
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
  @Post("/signUpAuth")
  mail(@MultipartFile('file')file:PlatformMulterFile,@BodyParams()com:CompanyModel){
    return this.service.signUp(com);
  }
  @Post("/uploadTripImage")
  @MulterOptions({dest:"./public/uploads/images"})
  uploadTripImage(@MultipartFile('file')file:PlatformMulterFile,@BodyParams()trip:ClientTripModel){
    trip.url='public/uploads/images/'+file.filename;
    return trip.url;
  }
  @Post("/createTrip")
  addNewTrip(@MultipartFile('file')file:PlatformMulterFile,@BodyParams()trip:ClientTripModel){
    return this.service.addNewTrip(trip);
    
  }
  @Post("/getCompanyInfo")
  getInfo(@MultipartFile('file')file:PlatformMulterFile,@BodyParams()com:CompanyModel){
    return this.service.getInfo(com.email);
  }
  @Put("/")
  update(@MultipartFile('file')file:PlatformMulterFile,@BodyParams()com:CompanyModel){
    return this.service.update(com);
  }
  @UseBefore(jwtMiddleware)
  @Delete("/")
  delete(@MultipartFile('file')file:PlatformMulterFile,@BodyParams()com:CompanyModel){
    return this.service.delete(com);
  }
  @Put("/addTrip")
  addTrip(@MultipartFile('file')file:PlatformMulterFile,@BodyParams()intr:AddTrip){
    return this.service.addTrip(intr);
  }
  @Post("/getSpecific")
  getTrips(@MultipartFile('file')file:PlatformMulterFile,@BodyParams()com:CompanyModel){
    return this.service.getCompanyTrips(com._id);
  }
  @Post("/lockTrip")
  lockTrip(@MultipartFile('file')file:PlatformMulterFile,@BodyParams()trip:TripModel){
    return  this.service.lockTrip(trip);
  }
  @Post("/login")
  login(@MultipartFile('file')file:PlatformMulterFile,@BodyParams()com:CompanyModel){
  return this.service.login(com);  
  }
  @Put("/upLogo")
  @MulterOptions({dest:"./public/uploads/companylogos"})
  uplogo(@MultipartFile('file')file:PlatformMulterFile,@BodyParams()com:CompanyModel){
    com.logo="public/uploads/companylogos/"+file.filename;
    return this.service.update(com);
  }
  
}
