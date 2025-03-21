import userModel from "../models/userModel.js";
import { hashPassword } from "../utils/bcryptUtils.js";

export const createUser = async ({ firstName, lastName, email, password }) => {
  if (!firstName || !lastName || !email || !password) {
    throw new Error("All fields are required");
  }

  const hashedPassword = await hashPassword(password);

  const user = new userModel({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });

  return user.save();
};
