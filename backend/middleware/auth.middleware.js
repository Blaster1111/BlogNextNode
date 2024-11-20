import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";  
import { apiResponse } from "../utils/apiResponse.js";  

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];  
  console.log(req.headers['authorization']);
  if (!token) {
    return res.status(401).json(new apiResponse(401, null, "Unauthorized"));
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(403).json(new apiResponse(403, null, "Forbidden"));
    }

    req.user = user;
    next();  
  });
};

export default authMiddleware;
