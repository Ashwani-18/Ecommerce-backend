// const JWT = require("jsonwebtoken")
// require("dotenv").config
// exports.auth = (req, res, next) => {
//     try {
//         const token = req.body.token;

//         if(!token) {
//             res.status(401).json({
//                 message: "token not found",
//                 success: false
//             });
//         }
        
//         // verify token 
//        try {
//          const decode = JWT.verify(token, process.env.JWT_SECRET)
//          console.log(decode);
//          req.body = decode;


//        } catch (error) {
//         res.status(401).json({
//             success: false,
//             message: "unable to verify token"
//         })
//        }

//     } 
// }
const JWT = require("jsonwebtoken");
require("dotenv").config();

// Middleware to verify JWT token
exports.auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Unauthorized: No token provided",
        success: false,
      });
    }

    const token = authHeader.split(" ")[1]; // Remove "Bearer "

    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    console.log("Decoded JWT payload:", decoded); // Debug log
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return res.status(401).json({
      message: "Unauthorized: Invalid or expired token",
      success: false,
    });
  }
};

// Middleware for student role
exports.isUser = (req, res, next) => {
  try {
    if (req.user.role !== 0) {
      return res.status(403).json({
        message: "Access denied. Student role required.",
        success: false,
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      message: "Error verifying user role",
      success: false,
    });
  }
};

// Middleware for admin role
exports.isAdmin = (req, res, next) => {
  try {
    if (req.user.role !== 1) {
      return res.status(403).json({
        message: "Access denied. Admin role required.",
        success: false,
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      message: "Error verifying admin role",
      success: false,
    });
  }
};
