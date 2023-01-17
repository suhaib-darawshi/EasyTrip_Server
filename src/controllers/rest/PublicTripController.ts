import { PlatformMulterFile,MultipartFile, BodyParams, MulterOptions, UseBefore } from "@tsed/common";
import {Controller, Inject} from "@tsed/di";
import {Delete, Get, Post, Put} from "@tsed/schema";
import { AddTrip } from "src/interfaces/AddTrip";
import { ClientTripModel } from "src/interfaces/ClientTripModel";
import { LikeTripJson } from "src/interfaces/LikeTripJson";
import { RateTrip } from "src/interfaces/RateTrip";
import { TripModel } from "src/models/TripModel";
import { TripService } from "src/services/TripService";
import {AdminAuth, userAuth}from "src/middlewares/asd"
import { RatingsService } from "src/services/RatingsService";
import { RatingsModel } from "src/models/RatingsModel";
@Controller("/public-trip-controller")
export class PublicTripController {
  constructor(@Inject(TripService)private tripService:TripService,@Inject(RatingsService)private ratingService:RatingsService){

  }
  @UseBefore(userAuth)
  @Get("/")
  getAll() {
    return this.tripService.getAllForUsers();
  }

  @Get("/")
  get(@MultipartFile('file') file:PlatformMulterFile,@BodyParams()trip:ClientTripModel){
    return this.tripService.get(trip);
  }

  @Post("/uploadImage")
  @MulterOptions({dest:"./public/uploads/images"})
  up(@MultipartFile('file')file:PlatformMulterFile,@BodyParams()trip:ClientTripModel){
    return "./public/uploads/images"+file.filename;
  }
  @UseBefore(userAuth)
  @Post("/BookTrip")
  bookTrip(@MultipartFile('file')file:PlatformMulterFile,@BodyParams()ids:LikeTripJson){
    return this.tripService.BookTrip(ids);
  }
  @Put("/")
  update(@MultipartFile('file')file:PlatformMulterFile,@BodyParams()trip:ClientTripModel){
    return this.tripService.update(trip);
  }
  @UseBefore(userAuth)
  @Put("/like-trip")
  likeTrip(@MultipartFile('file')file:PlatformMulterFile,@BodyParams() ids:LikeTripJson){
    return this.tripService.likeTrip(ids);
    
  }
  
  @Post("/addCompany")
  addCompany(@MultipartFile('file')file:PlatformMulterFile,@BodyParams()ids:AddTrip){
    return this.tripService.putCompanyById(ids);
  }
  @UseBefore(userAuth)
  @Post("/RateTrip")
  rate(@MultipartFile("file")file:PlatformMulterFile,@BodyParams()rateTrip:RatingsModel){
    return this.ratingService.rateAtrip(rateTrip);
  }

}
