import { BodyParams, MultipartFile, PlatformMulterFile, UseBefore } from "@tsed/common";
import {Controller, Inject} from "@tsed/di";
import {Delete, Get, Post, Put} from "@tsed/schema";
import { UserModel } from "src/models/UserModel";
import { AdminService } from "src/services/AdminService";
import { CompanyService } from "src/services/CompanyService";
import { TripService } from "src/services/TripService";
import { UserService } from "src/services/UserService";
import {AdminAuth}from "src/middlewares/asd"
import { TripModel } from "src/models/TripModel";
import { ClientTripModel } from "src/interfaces/ClientTripModel";
import { CompanyModel } from "src/models/CompanyModel";
import { SendMessageIntr } from "src/interfaces/SendMessageIntr";
@Controller("/admin-controller")
export class AdminController {
  constructor(@Inject(AdminService)private adminService:AdminService ,@Inject(UserService)private userService:UserService,@Inject(TripService)private tripService:TripService,@Inject(CompanyService)private companyService:CompanyService ){}
  @UseBefore(AdminAuth)
  @Get("/getAllTrips")
  get() {
    return this.tripService.getAll();
  }
  @Post("/login")
  login(@MultipartFile('file')file:PlatformMulterFile,@BodyParams() user:UserModel){
    return this.adminService.login(user);
  }
  @UseBefore(AdminAuth)
  @Post("/get-info")
  getInfo(@MultipartFile('file')file:PlatformMulterFile,@BodyParams()user:UserModel){
    
    return this.userService.getInfo(user.email);
    
  }
  @UseBefore(AdminAuth)
  @Post("/approve")
  approve(@MultipartFile('file')file:PlatformMulterFile,@BodyParams() trip:TripModel){
    return this.tripService.acceptTrip(trip);
  }
  @UseBefore(AdminAuth)
  @Delete("/deleteUser")
  deleteUser(@MultipartFile('file')file:PlatformMulterFile,@BodyParams()user:UserModel){
    return this.userService.delete(user);
  }
  @UseBefore(AdminAuth)
  @Post("/lockTrip")
  lockTrip(@MultipartFile('file')file:PlatformMulterFile,@BodyParams()trip:TripModel){
    return  this.companyService.lockTrip(trip);
  }
  @UseBefore(AdminAuth)
  @Get("/getUsers")
  getAll(){
    return this.userService.getAll();
  }
  @UseBefore(AdminAuth)
  @Delete("/deleteTrip")
  deleteTrip(@MultipartFile('file')file:PlatformMulterFile,@BodyParams()trip:ClientTripModel){
    return this.tripService.delete(trip);
  }
  @UseBefore(AdminAuth)
  @Get("/getAllCompanies")
  getAllCompanies() {
    return this.companyService.getAll();
  }

  @UseBefore(AdminAuth)
  @Delete("/deleteCompany")
  deleteCompany(@MultipartFile('file')file:PlatformMulterFile,@BodyParams()com:CompanyModel){
    return this.companyService.delete(com);
  }
  @UseBefore(AdminAuth)
  @Post("/contact")
  contact(@MultipartFile("file")file:PlatformMulterFile,@BodyParams()msg:SendMessageIntr){
    return this.userService.contactApp(msg);

  }
  @UseBefore(AdminAuth)
  @Put("/updateUser")
  updateUser(@MultipartFile('file')file:PlatformMulterFile,@BodyParams()user:UserModel){
    
    return this.userService.update(user);
  }
}


