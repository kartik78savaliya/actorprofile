import { Router } from "express"
import {
    createNewDepartment,
    getAllDepartments,
    getDepartmentById,
    updateDepartment,
    deleteDepartment
} from "../controllers/department.controller.js"

const router = Router()

router.route("/create").post(createNewDepartment)
router.route("/list").get(getAllDepartments)
router.route("/:id").get(getDepartmentById)
router.route("/update/:id").put(updateDepartment)
router.route("/delete/:id").delete(deleteDepartment)

export default router
