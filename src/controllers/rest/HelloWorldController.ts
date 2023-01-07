import { BodyParams, MultipartFile, PlatformMulterFile } from "@tsed/common";
import {Controller, Inject, setLoggerFormat} from "@tsed/di";
import {Get, Post} from "@tsed/schema";
import {Logger} from "@tsed/logger";
import "@tsed/logger-smtp";
import { UserService } from "src/services/UserService";
@Controller("/hello-world")
export class HelloWorldController {
  constructor(@Inject(UserService)private service:UserService){}

  // @Post("/")
  get(@MultipartFile('file')file:PlatformMulterFile,@BodyParams()id1:JSON) {
    return ;
//     const logger = new Logger("loggerName");
// logger.start;
// logger.appenders.set("email", {
//   type: "smtp",
//   level: ["error"],
  
//   SMTP:{
//     host:"smtp.gmail.com",
//     port:587,
//     auth:{
//       user:"eng.suhaibdarawshi@gmail.com",
//       pass:"gwbmxlonszaxpdmy"
//     }
//   },
//   recipients: "suhaibdarawshi@gmail.com",
//   subject: "Latest logs",
//   sender: "eng.suhaibdarawshi@gmail.com",
  
//   attachment: {
//     enable: true,
    
//     message: "See the attachment for the latest logs"
//   },
//   sendInterval: 3600});
    // return logger.shutdown;

  }
}
