import { BodyParams, MultipartFile, PlatformMulterFile } from "@tsed/common";
import {Controller, Inject} from "@tsed/di";
import {email, Get, Post} from "@tsed/schema";
import { UserModel } from "src/models/UserModel";
import { UserService } from "src/services/UserService";

@Controller("/get-info")
export class GetInfoController {
  constructor(@Inject(UserService)private userService:UserService){

  }
  @Get("/")
  get() {
    return "hello";
  }
  @Post("/")
  getInfo(@MultipartFile('file')file:PlatformMulterFile,@BodyParams()user:UserModel){
    return this.userService.getInfo(user.email);
    
  }
}
