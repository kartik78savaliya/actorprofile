import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { config } from "../utils/config.js";
import { findActorByIdWithSelect } from "../services/actor.service.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(400).json(new ApiError(400, "Please provide token"));
    }

    try {
        const decodedToken = jwt.verify(token, config.accessTokenSecret);

        const actor = await findActorByIdWithSelect(decodedToken._id, "-password -refreshToken");

        if (!actor) {
            return res.status(401).json(new ApiError(401, "Invalid Access Token"));
        }

        req.authInfo = actor;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json(new ApiError(401, "Token has expired"));
        } else if (error.name === "JsonWebTokenError") {
            return res.status(401).json(new ApiError(401, "Invalid or malformed token"));
        } else {
            return res.status(500).json(new ApiError(500, "Internal Server Error"));
        }
    }
});
