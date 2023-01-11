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
import {jwtMiddleware}from "src/middlewares/asd"
const JWT_SECRET = process.env.JWT_SECRET || 'my-secret';
@Controller("/public-user-controller")
export class PublicUserController {
  constructor(@Inject(UserService)private userService:UserService){

  }
  @Post("/login")
  Login(@MultipartFile('file') file:PlatformMulterFile,@BodyParams()user:UserModel){
    return this.userService.auth(user); 
    
  }

  @UseBefore(jwtMiddleware)
  @Get("/")
  getAll(){
    return this.userService.getAll();
  }
  @Post("/signupAuth")
  get(@MultipartFile('file')file:PlatformMulterFile,@BodyParams()id1:UserModel) {
    return this.userService.signUp(id1);
  }

  @Post("/")
  createUser(@MultipartFile('file') file:PlatformMulterFile,@BodyParams()user:UserModel){
    if(user.image=="not send"){
      user.image="defaultImage.png";
    }
    else {
      user.image=file.filename;
    }
    return this.userService.create(user);
  }
  
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


  @Put("/")
  updateUser(@MultipartFile('file')file:PlatformMulterFile,@BodyParams()user:UserModel){
    
    return this.userService.update(user);
  }
  @Post("/contact")
  contact(@MultipartFile("file")file:PlatformMulterFile,@BodyParams()msg:SendMessageIntr){
    return this.userService.contactApp(msg);

  }

  
 @UseBefore(jwtMiddleware)
  @Delete("/")
  deleteUser(@MultipartFile('file')file:PlatformMulterFile,@BodyParams()user:UserModel){
    return this.userService.delete(user);
  }


}
