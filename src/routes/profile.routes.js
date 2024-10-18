import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createProfile, deleteProfile, editProfile, getProfileById, listProfiles, shareProfiles } from "../controllers/profile.controller.js";

const router = Router()

router.route("/create").post(verifyJWT, createProfile)
router.route("/edit/:profileId").put(verifyJWT, editProfile)
router.route("/delete/:profileId").delete(verifyJWT, deleteProfile)

router.route("/list").get(listProfiles)
router.route("/share").post(shareProfiles)
router.route("/:profileId").get(getProfileById)

export default router