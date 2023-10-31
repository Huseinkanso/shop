import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
// auth user & get token
// route post  /api/users/auth
// access public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    // set jwt cookie as http-only cookie
    generateToken(res, user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
    return;
  }
  throw new Error("Invalid Email or Password");
});

// register user & get token
// route post  /api/users
// access public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
    return;
  }
  const user = await User.create({
    name,
    email,
    password,
  });
  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  }
});

// logout user & clear cookie
// route get  /api/users/login
// private public
const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: 0,
  });
  res.status(200).json({ message: "logout successfully" });
});

// get user profile
// route get  /api/users/profile
// access private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findOne(req.user._id);
  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
    return;
  }
  throw new Error("user not found");
});

// update user profile
// route put  /api/users/profile
// access private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findOne(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }
    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
    return;
  }
  throw new Error({ message: "user not found" });
});

// get users
// route get  /api/users
// access private/admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.status(200).json(users);
});

// get user by id
// route get  /api/users/:id
// access private/admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (user) {
    res.status(200).json(user);
    return;
  }
  res.status(404);
  throw new Error("user not found");
});

// delete user
// route delete  /api/users/:id
// access private/admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error("cannot delete admin user");
      return;
    }
    await user.deleteOne({ _id: user._id });
    res.status(200).json({ message: "user removed" });
    return;
  }
  res.status(404);
  throw new Error("user not found");
});

// update user
// route put  /api/users/:id
// access private/admin
const updateUser = asyncHandler(async (req, res) => {
  const { name, email, isAdmin } = req.body;
  const user = await User.findById(req.params.id);
  if (user) {
    user.name = name || user.name;
    user.email = email || user.email;
    user.isAdmin = Boolean(isAdmin);
    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
    return;
  }
  throw new Error("user not found");
});

export {
  authUser,
  registerUser,
  logout,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
};
