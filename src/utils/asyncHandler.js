import { ApiError } from "./ApiError.js";

const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => {
            return res.status(500).json(new ApiError(500, err.message || "Something Went Wrong"))
        })
    }
}

export { asyncHandler }