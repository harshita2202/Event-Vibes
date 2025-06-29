// To verify the valid user using token
const jwt = require ("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization && req.headers.authorization.startsWith("Bearer")
    )
    {
        try {
            token = req.headers.authorization.split(" ")[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            
            req.user = await User.findById(decoded.id).select("-passwordHash");

            next();
        }
        catch (error) {
            console.error("Token verification failed:", error);
            res.status(401).json({error: "Not authorized, invalid token"})
        }
    }

    if (!token){
        res.status(401).json({error: "Not authorized, no token"})
    }
};

module.exports = protect;