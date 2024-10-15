import { Router } from "express"
import {
    createNewRole,
    getAllRoles,
    getRoleById,
    updateRole,
    deleteRole
} from "../controllers/role.controller.js"

const router = Router()

router.route("/create").post(createNewRole)
router.route("/list").get(getAllRoles)
router.route("/:id").get(getRoleById)
router.route("/update/:id").put(updateRole)
router.route("/delete/:id").delete(deleteRole)

export default router