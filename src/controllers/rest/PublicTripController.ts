import { PlatformMulterFile,MultipartFile, BodyParams } from "@tsed/common";
import {Controller, Inject} from "@tsed/di";
import {Delete, Get, Post, Put} from "@tsed/schema";
import { AddTrip } from "src/interfaces/AddTrip";
import { LikeTripJson } from "src/interfaces/LikeTripJson";
import { TripModel } from "src/models/TripModel";
import { TripService } from "src/services/TripService";

@Controller("/public-trip-controller")
export class PublicTripController {
  constructor(@Inject(TripService)private tripService:TripService){

  }

  @Get("/")
  getAll() {
    return this.tripService.getAll();
  }

  @Get("/")
  get(@MultipartFile('file') file:PlatformMulterFile,@BodyParams()trip:TripModel){
    return this.tripService.get(trip);
  }
  
  @Post("/")
  create(@MultipartFile('file')file:PlatformMulterFile,@BodyParams()trip:TripModel){
    return this.tripService.create(trip);
  }
  
  @Put("/")
  update(@MultipartFile('file')file:PlatformMulterFile,@BodyParams()trip:TripModel){
    return this.tripService.update(trip);
  }
  @Put("/like-trip")
  likeTrip(@MultipartFile('file')file:PlatformMulterFile,@BodyParams() ids:LikeTripJson){
    return this.tripService.likeTrip(ids);
    
  }

  @Delete("/")
  delete(@MultipartFile('file')file:PlatformMulterFile,@BodyParams()trip:TripModel){
    return this.tripService.delete(trip);
  }
  @Post("/addCompany")
  addCompany(@MultipartFile('file')file:PlatformMulterFile,@BodyParams()ids:AddTrip){
    return this.tripService.putCompanyById(ids);
  }

}
