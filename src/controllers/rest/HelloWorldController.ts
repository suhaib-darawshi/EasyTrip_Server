import { BodyParams, MultipartFile, PlatformMulterFile } from "@tsed/common";
import {Controller, Inject, setLoggerFormat} from "@tsed/di";
import {Get, Post} from "@tsed/schema";
import {Logger} from "@tsed/logger";
import "@tsed/logger-smtp";
import { UserService } from "src/services/UserService";
import { UserModel } from "src/models/UserModel";

import { RatingsService } from "src/services/RatingsService";

@Controller("/hello")
export class HelloWorldController {
  constructor(@Inject(UserService)private service:UserService,@Inject(RatingsService)private ratingService:RatingsService){}

  @Post("/")
  async get(@MultipartFile('file')file:PlatformMulterFile,@BodyParams()id1:UserModel) {
    return this.service.system();
  }
}
