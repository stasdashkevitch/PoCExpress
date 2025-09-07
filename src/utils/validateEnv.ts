import { cleanEnv, port, str } from "envalid";

export function validateEnv() {
  cleanEnv(process.env, {
    JWT_SECRET: str(),
    MONGO_PASSWORD: str(),
    MONGO_INIT_DB: str(),
    MONGO_USER: str(),
    MONGO_PORT: port(),
  });
}
