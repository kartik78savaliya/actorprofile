import { Router } from "express"
import {
    createNewSubdepartment,
    getAllSubdepartments,
    getSubdepartmentById,
    updateSubdepartment,
    deleteSubdepartment
} from "../controllers/subdepartment.controller.js"

const router = Router()

router.route("/create").post(createNewSubdepartment)
router.route("/list").get(getAllSubdepartments)
router.route("/:id").get(getSubdepartmentById)
router.route("/update/:id").put(updateSubdepartment)
router.route("/delete/:id").delete(deleteSubdepartment)

export default router
