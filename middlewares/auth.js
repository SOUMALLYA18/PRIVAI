import { verifyToken } from "../utils/jwt.js";
import redisClient from "../services/redisService.js";

export const authUser = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ error: "Unauthorized - No token provided" });
    }
    const isBlacklisted = await redisClient.get(token);
    if (isBlacklisted) {
      res.cookie("token", "");
      return res.status(401).json({ error: "Unauthorized user" });
    }
    let user;
    try {
      user = verifyToken(token);
    } catch (err) {
      return res.status(401).json({ error: "Unauthorized - Invalid token" });
    }

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
    next(error);
  }
};
