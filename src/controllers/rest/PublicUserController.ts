import { BodyParams, MultipartFile, PathParams, PlatformMulterFile } from "@tsed/common";
import {Controller, Inject} from "@tsed/di";
import { ObjectID } from "@tsed/mongoose";
import {Delete, Get, Post, Put} from "@tsed/schema";
import { UserModel } from "src/models/UserModel";
import { UserService } from "src/services/UserService";

@Controller("/public-user-controller")
export class PublicUserController {
  constructor(@Inject(UserService)private userService:UserService){

  }
  
  
  @Get("/")
  getAll(){
    return this.userService.getAll();
  }
  @Post("/")
  createUser(@MultipartFile('file') file:PlatformMulterFile,@BodyParams()user:UserModel){
    return this.userService.create(user);
  }
  @Post("/login")
  Login(@MultipartFile('file') file:PlatformMulterFile,@BodyParams()user:UserModel){
    return this.userService.auth(user); 
    
  }

  @Put("/")
  updateUser(@MultipartFile('file')file:PlatformMulterFile,@BodyParams()user:UserModel){
    return this.userService.update(user);
  }

  @Delete("/")
  deleteUser(@MultipartFile('file')file:PlatformMulterFile,@BodyParams()user:UserModel){
    return this.userService.delete(user);
  }


}
