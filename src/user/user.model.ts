import mongoose from "mongoose";
import { User } from "./user.interface";

const adressSchema = new mongoose.Schema({
  city: String,
  street: String,
});

const userSchema = new mongoose.Schema({
  address: adressSchema,
  name: String,
  email: String,
  password: String,
});

export const userModel = mongoose.model<User & mongoose.Document>(
  "User",
  userSchema,
);
