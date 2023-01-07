import {Controller} from "@tsed/di";
import {Get} from "@tsed/schema";

@Controller("/message-controller")
export class MessageController {
  @Get("/")
  get() {
    return "hello";
  }
}
