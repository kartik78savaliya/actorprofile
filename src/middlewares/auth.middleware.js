import jwt from "jsonwebtoken"
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { config } from "../utils/config.js";
import { findActorByIdWithSelect } from "../services/actor.service.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.header("Authorization")
        if (!token) {
            return res
                .status(401)
                .json(new ApiError(401, "Please provide token"))
        }
        const decodedToken = jwt.verify(token, config.accessTokenSecret)
        const actor = await findActorByIdWithSelect(decodedToken._id, "-password -refreshToken")
        if (!actor) {
            return res
                .status(401)
                .json(new ApiError(401, "Invalid Access Token"))
        }
        req.authInfo = actor;
        next()
    }
    catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res
                .status(403)
                .json(new ApiError(403, "Token has expired"))
        }
    }

})