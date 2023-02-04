import {$log, Inject, Injectable} from "@tsed/common";
import { PlatformExpress } from "@tsed/platform-express";
import {Server} from "./Server";
import * as cron from 'cron';
import { UserService } from "./services/UserService";
import { MongooseModels } from "@tsed/mongoose";
import { UserModel } from "./models/UserModel";
import { TripModel } from "./models/TripModel";
import { RatingsModel } from "./models/RatingsModel";
import mongoose from "./config/mongoose";
async function bootstrap() {
  try {
    const platform = await PlatformExpress.bootstrap(Server);
    await platform.listen();

    process.on("SIGINT", () => {
      platform.stop();
    });
  } catch (error) {
    $log.error({event: "SERVER_BOOTSTRAP_ERROR", message: error.message, stack: error.stack});
  }

}



bootstrap();
