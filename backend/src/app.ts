import * as express from "express";
import * as bodyParser from "body-parser";
import mongoose from "mongoose";
import { errorMidleware } from "./midleware/error.midleware";
import cookieParser = require("cookie-parser");

export class App {
  public app: express.Application;
  public port: number;

  constructor(controllers, port) {
    this.app = express();
    this.port = port;

    this.connectToDB();
    this.initializeMidlewares();
    this.initializeControllers(controllers);
    this.initializeMidlewares();
    this.intializeErrorHandling();
  }

  private initializeMidlewares() {
    this.app.use(bodyParser.json());
    this.app.use(cookieParser());
  }

  private intializeErrorHandling() {
    this.app.use(errorMidleware);
  }

  private initializeControllers(controllers) {
    controllers.forEach((controller) => {
      this.app.use("/", controller.router);
    });
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }

  private connectToDB() {
    const { MONGO_USER, MONGO_PASSWORD, MONGO_PORT, MONGO_INIT_DB } =
      process.env;

    mongoose
      .connect(
        `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@localhost:${MONGO_PORT}/${MONGO_INIT_DB}?authSource=admin`,
      )
      .then(() => console.log("Successfull db connection"))
      .catch((err) => console.error(`Database connection error: ${err}`));
  }
}
