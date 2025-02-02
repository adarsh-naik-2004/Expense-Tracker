import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

export const verifyJWT = (req, res, next) => {

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  const authHeader = req.headers.authorization || req.headers.Authorization;
  
  if (!authHeader?.startsWith('Bearer ')) {
    console.log("❌ No token provided or incorrect format");
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err, decoded) => {
      if (err) {
        console.error("❌ Token verification failed:", err.message);
        return res.status(403).json({ message: "Forbidden: Invalid token" });
      }
      // Set the full user object instead of just the id
      req.user = { id: decoded.id };
      console.log("✅ Token verified, user:", req.user);
      next();
    }
  );
};