import {$log, PlatformLoggerSettings} from "@tsed/common";
import {isProduction} from "../envs/index";
import {Logger} from "@tsed/logger";
import "@tsed/logger-smtp";
const logger = new Logger("loggerName");

logger.appenders.set("email", {
  type: "smtp",
  
  level: ["error"],
  recipients: "dev.team@company.name",
  SMTP:{
    auth:{
      user:"eng.suhaibdarawshi@gmail.com",
      pass:"40533-*sec"
    }
  }
});
if (isProduction) {
  $log.appenders.set("stdout", {
    type: "stdout",
    levels: ["info", "debug"],
    layout: {
      type: "json"
    }
  });

  $log.appenders.set("stderr", {
    levels: ["trace", "fatal", "error", "warn"],
    type: "stderr",
    layout: {
      type: "json"
    }
  });
}

export default <PlatformLoggerSettings> {
  disableRoutesSummary: isProduction
};
