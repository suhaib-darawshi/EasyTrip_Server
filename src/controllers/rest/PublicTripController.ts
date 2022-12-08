import { PlatformMulterFile,MultipartFile, BodyParams } from "@tsed/common";
import {Controller, Inject} from "@tsed/di";
import {Delete, Get, Post, Put} from "@tsed/schema";
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

  @Delete("/")
  delete(@MultipartFile('file')file:PlatformMulterFile,@BodyParams()trip:TripModel){
    return this.tripService.delete(trip);
  }

}
