import { BodyParams, MulterOptions, MultipartFile, PathParams, PlatformMulterFile, Req, Res, UseBefore } from "@tsed/common";
import {Controller, Inject} from "@tsed/di";
import { ObjectID } from "@tsed/mongoose";
import {Delete, Get, Post, Put} from "@tsed/schema";
import passport from "passport";
import { SendMessageIntr } from "src/interfaces/SendMessageIntr";
import { UserModel } from "src/models/UserModel";
import { UserService } from "src/services/UserService";
import * as jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { configurePassport } from "src/auth/passport";
import {userAuth}from "src/middlewares/asd"
const JWT_SECRET = process.env.JWT_SECRET || 'my-secret';
@Controller("/public-user-controller")
export class PublicUserController {
  constructor(@Inject(UserService)private userService:UserService){

  }
  @Post("/login")
  Login(@MultipartFile('file') file:PlatformMulterFile,@BodyParams()user:UserModel){
    return this.userService.auth(user); 
    
  }

  
  @Post("/signupAuth")
  get(@MultipartFile('file')file:PlatformMulterFile,@BodyParams()id1:UserModel) {
    return this.userService.signUp(id1);
  }
  @Post("/")
  createUser(@MultipartFile('file') file:PlatformMulterFile,@BodyParams()user:UserModel){
    
      user.image="defaultImage.png";
    
    return this.userService.create(user);
  }
  @UseBefore(userAuth)
  @Post("/get-info")
  getInfo(@MultipartFile('file')file:PlatformMulterFile,@BodyParams()user:UserModel){
    
    return this.userService.getInfo(user.email);
    
  }
  @Post("/file")
  @MulterOptions({dest:"./public/uploads/usersImages"})
  uploadUserImage(@MultipartFile('file')file:PlatformMulterFile,@BodyParams()user:UserModel){
    user.image=file.filename;
    return  this.userService.update(user);
  }

  @UseBefore(userAuth)
  @Put("/")
  updateUser(@MultipartFile('file')file:PlatformMulterFile,@BodyParams()user:UserModel){
    
    return this.userService.update(user);
  }
  @UseBefore(userAuth)
  @Post("/contact")
  contact(@MultipartFile("file")file:PlatformMulterFile,@BodyParams()msg:SendMessageIntr){
    return this.userService.contactApp(msg);

  }

  
 


}
