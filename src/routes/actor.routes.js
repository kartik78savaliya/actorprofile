import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { changeCurrentPassword, forgotPassword, loginActor, logoutActor, registerActor, resetPassword, verfiyOtp, verfiyRegistration } from "../controllers/actor.controller.js";

const router = Router()

router.route("/register").post(registerActor)
router.route("/login").post(loginActor)
router.route("/logout").post(logoutActor)
router.route("/forgotpassword").post(forgotPassword)
router.route("/verifyotp").post(verfiyOtp)
router.route("/verifyregistration").post(verfiyRegistration)
router.route("/resetpassword").post(resetPassword)

router.route("/changepassword").post(verifyJWT, changeCurrentPassword)

export default router