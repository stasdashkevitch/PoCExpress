import { validateEnv } from "./utils/validateEnv";
import { App } from "./app";
import { PostController } from "./post/post.controller";
import "dotenv/config";
import { AuthenticationController } from "./authentication/authentication.controller";
import { UserController } from "./user/user.controller";

validateEnv();

const app = new App(
  [new PostController(), new AuthenticationController(), new UserController()],
  5000,
);

app.listen();
