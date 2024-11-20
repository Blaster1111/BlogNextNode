import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import bcrypt from "bcrypt";

// Signup controller
const signup = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "Email already registered");
  }

  const user = new User({ email, passwordHash: password });
  await user.save();

  const accessToken = user.generateAccessToken();

  res.status(201).json(
    new apiResponse(201, { user, accessToken }, "User registered successfully")
  );
});

// Login controller
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  const accessToken = user.generateAccessToken();

  res.status(200).json(
    new apiResponse(200, { user, accessToken }, "Login successful")
  );
});

export { signup, login };
