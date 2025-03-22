import userModel from "../models/userModel.js";
import { hashPassword } from "../utils/bcryptUtils.js";

export const createUser = async ({ firstName, lastName, email, password }) => {
  if (!firstName || !lastName || !email || !password) {
    throw new Error("All fields are required");
  }

  const hashedPassword = await hashPassword(password);

  const user = await userModel.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });

  return await user.save();
};

export const fetchAllUsers = async ({ userId }) => {
  if (!userId) {
    throw new Error("User ID is required to fetch users");
  }

  try {
    const users = await userModel.find();

    if (users.length === 0) {
      console.error("❌ No users found in DB");
    }

    return users;
  } catch (error) {
    console.error("❌ Error fetching users:", error.message);
    throw new Error("Failed to fetch users");
  }
};
