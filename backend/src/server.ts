import { validateEnv } from "./utils/validateEnv";
import { App } from "./app";
import { PostController } from "./post/post.controller";
import "dotenv/config";
import { dataSource } from "./orm-data-source";

validateEnv();

(async () => {
  try {
    await dataSource.initialize();
    console.log("DB has been inizialized");
  } catch (error) {
    console.log("Error while connecting to DB");

    return error;
  }
})();

const app = new App([new PostController()], 5000);

app.listen();
