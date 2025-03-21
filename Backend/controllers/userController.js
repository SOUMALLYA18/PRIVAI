import userModel from "../models/userModel.js";
import { validateUser } from "../models/userModel.js";
import { generateToken } from "../utils/jwt.js";
import { createUser } from "../services/userService.js";

export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, password, email } = req.body;

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const { error } = validateUser({ firstName, lastName, password, email });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const user = await createUser({
      firstName,
      lastName,
      email,
      password,
    });
    const token = generateToken({ id: user._id });
    delete user._doc.password;

    res.status(201).json({ token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
