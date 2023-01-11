import { BodyParams, MultipartFile, PlatformMulterFile, UseBefore } from "@tsed/common";
import {Controller, Inject} from "@tsed/di";
import {Get, Post} from "@tsed/schema";
import { UserModel } from "src/models/UserModel";
import { AdminService } from "src/services/AdminService";
import { CompanyService } from "src/services/CompanyService";
import { TripService } from "src/services/TripService";
import { UserService } from "src/services/UserService";
import {jwtMiddleware}from "src/middlewares/asd"
import { TripModel } from "src/models/TripModel";
@Controller("/admin-controller")
export class AdminController {
  constructor(@Inject(AdminService)private adminService:AdminService ,@Inject(TripService)private tripService:TripService,@Inject(CompanyService)private companyService:CompanyService ){}
  @UseBefore(jwtMiddleware)
  @Get("/getAllTrips")
  get() {
    return this.tripService.getAll();
  }
  @Post("/login")
  login(@MultipartFile('file')file:PlatformMulterFile,@BodyParams() user:UserModel){
    return this.adminService.login(user);
  }
  @UseBefore(jwtMiddleware)
  @Post("/approve")
  approve(@MultipartFile('file')file:PlatformMulterFile,@BodyParams() trip:TripModel){
    return this.tripService.acceptTrip(trip);
  }


}
