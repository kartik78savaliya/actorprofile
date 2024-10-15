import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import {
    findActorByEmail,
    createActor,
    findActorByIdWithSelect,
    generateAccessAndRefreshTokens,
    updateActorPassword,
    verifyActorPassword,
    updateActorDataById,
    findActorByData,
} from "../services/actor.service.js"
import { registrationVerficationOtpEmail, resetPasswordOtpEmail } from "../helpers/email.helper.js"
import { getRandomOtp } from "../utils/getItems.js"

export const registerActor = asyncHandler(async (req, res) => {
    const { userName, email, password } = req.body
    if (!(userName && email && password)) {
        return res
            .status(200)
            .json(new ApiError(400, "All fields are required"))
    }
    const actorExist = await findActorByData({ email: email, isVerified: true })
    if (actorExist) {
        return res
            .status(200)
            .json(new ApiError(409, "Actor with email already exists"))
    }
    const otp = getRandomOtp()
    const unverfiedActorExist = await findActorByData({ email: email, isVerified: false })
    if (unverfiedActorExist) {
        await updateActorDataById(unverfiedActorExist._id, { otp: otp })
        const emailData = {
            subject: "Your otp for Registration Verification",
            receiverEmailAdrress: unverfiedActorExist.email,
            otp: unverfiedActorExist.otp,
            userName: unverfiedActorExist.userName,
        }
        await registrationVerficationOtpEmail(emailData)
        return res
            .status(200)
            .json(new ApiResponse(200, "Otp sent to your email for verfication"))
    }
    const actor = await createActor({ ...req.body, otp })
    const createdActor = await findActorByIdWithSelect(actor._id, "-password -refreshToken")
    const emailData = {
        subject: "Your otp for Registration Verification",
        receiverEmailAdrress: createdActor.email,
        otp: createdActor.otp,
        userName: createdActor.userName,
    }
    await registrationVerficationOtpEmail(emailData)
    if (!createdActor) {
        return res
            .status(200)
            .json(new ApiError(500, "Something went wrong while registering the actor"))
    }
    return res
        .status(200)
        .json(new ApiResponse(200, "Otp sent to your email for verfication"))
})

export const loginActor = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    if (!(email && password)) {
        return res
            .status(200)
            .json(new ApiError(400, "Email & password is required"))
    }
    const actor = await findActorByEmail(email)
    if (!actor) {
        return res
            .status(200)
            .json(new ApiError(409, "Actor does not exist"))
    }
    const actorId = actor._id    
    if (!actor.isVerified) {
        return res
            .status(403)
            .json(new ApiError(403, "Your registration verfication is still pending"))
    }
    const isPasswordValid = await verifyActorPassword(actorId, password)
    if (!isPasswordValid) {
        return res
            .status(200)
            .json(new ApiError(401, "Invalid Credential"))
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(actorId)
    const loggedInActor = await findActorByIdWithSelect(actorId, "-password -refreshToken")
    const options = {
        httpOnly: true,
        secure: true
    }
    const data = {
        ...loggedInActor,
        accessToken,
        refreshToken
    }
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, "Actor logged In Successfully", data))
})

export const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body
    const actorId = req.authInfo?._id
    if (!(oldPassword && newPassword)) {
        return res
            .status(200)
            .json(new ApiError(400, "oldPassword & newPassword is required"))
    }
    const isPasswordValid = await verifyActorPassword(actorId, oldPassword)
    if (!isPasswordValid) {
        return res
            .status(200)
            .json(new ApiError(400, "Invalid old password"))
    }
    await updateActorPassword(actorId, newPassword)
    return res
        .status(200)
        .json(new ApiResponse(200, "Password changed successfully"))
})

export const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body
    if (!email) {
        return res
            .status(200)
            .json(new ApiError(400, "Please provide email"))
    }
    const actor = await findActorByEmail(email)
    if (actor) {
        let otp = getRandomOtp()
        let otpPresentInDb = false;
        do {
            otpPresentInDb = await findActorByData({ otp: otp }) ? true : false;
            if (otpPresentInDb) {
                otp = getRandomOtp()
            }
        } while (otpPresentInDb)
        const emailData = {
            subject: "Your otp for Reset Password",
            receiverEmailAdrress: email,
            otp: otp,
            userName: actor.userName,
        }
        await resetPasswordOtpEmail(emailData)
        await updateActorDataById(actor.id, { otp: otp })
        return res
            .status(200)
            .json(new ApiResponse(200, "Reset password otp sent to your email"))
    }
    else {
        return res
            .status(200)
            .json(new ApiError(404, "User Not Exist"))
    }
})

export const verfiyOtp = asyncHandler(async (req, res) => {
    const { otp, email } = req.body
    if (!(otp && email)) {
        return res
            .status(200)
            .json(new ApiError(400, "Please Provide otp & email"))
    }
    const actor = await findActorByData({ email: email, otp: otp })
    if (!actor) {
        return res
            .status(200)
            .json(new ApiError(400, "Invalid otp"))
    }
    return res
        .status(200)
        .json(new ApiResponse(200, "Otp Verfied Successfully"))
})

export const resetPassword = asyncHandler(async (req, res) => {
    const { otp, newPassword } = req.body
    if (!(otp && newPassword)) {
        return res
            .status(200)
            .json(new ApiError(400, "Please Provide otp & Password"))
    }
    const actor = await findActorByData({ otp: otp })
    if (!actor) {
        return res
            .status(200)
            .json(new ApiError(400, "Invalid otp"))
    }
    const actorId = actor.id
    await updateActorPassword(actorId, newPassword)
    await updateActorDataById(actorId, { otp: '' })
    return res
        .status(200)
        .json(new ApiResponse(200, "Password updated!"))
})

export const logoutActor = asyncHandler(async (req, res) => {
    const { actorId } = req.body
    await updateActorDataById(actorId, { refreshToken: '' })
    const options = {
        httpOnly: true,
        secure: true
    }
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, "User logged Out Successfully"))
})

export const verfiyRegistration = asyncHandler(async (req, res) => {
    const { otp, email } = req.body
    if (!(otp && email)) {
        return res
            .status(200)
            .json(new ApiError(400, "Please Provide otp & email"))
    }
    const actor = await findActorByData({ email: email, otp: otp })
    if (actor) {
        await updateActorDataById(actor._id,{isVerified:true, otp:""})
        const createdActor = await findActorByIdWithSelect(actor._id, "-password -refreshToken")
        return res
            .status(200)
            .json(new ApiResponse(200, "Otp Verfied Successfully & Actor registration successfull",createdActor))
    }
    return res
        .status(200)
        .json(new ApiError(400, "Invalid otp"))
})