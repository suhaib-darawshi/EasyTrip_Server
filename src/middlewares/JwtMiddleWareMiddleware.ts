import {Middleware, MiddlewareMethods} from "@tsed/platform-middlewares";
import {Context} from "@tsed/platform-params";

@Middleware()
export class JwtMiddleWareMiddleware implements MiddlewareMethods {
  use(@Context() ctx: Context) {

  }
}
