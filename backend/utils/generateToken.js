import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    // for https
    secure: process.env.NODE_ENV === "production",
    // like same origin policy
    sameSite: "strict",
    // 30 days
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};

export default generateToken
