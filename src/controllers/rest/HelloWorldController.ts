import { BodyParams, MultipartFile, PlatformMulterFile } from "@tsed/common";
import {Controller} from "@tsed/di";
import {Get, Post} from "@tsed/schema";

@Controller("/hello-world")
export class HelloWorldController {
  @Post("/")
  get(@MultipartFile('file')file:PlatformMulterFile,@BodyParams()id1:JSON) {

    return id1;
  }
}
