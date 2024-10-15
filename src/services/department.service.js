import { dbDepartment } from "../models/department.model.js"

export const createDepartment = async (data) => {
    return await dbDepartment.create(data)
}

export const findAllDepartments = async () => {
    return await dbDepartment.find()
}

export const findDepartmentById = async (departmentId) => {
    return await dbDepartment.findById(departmentId)
}

export const updateDepartmentById = async (departmentId, data) => {
    return await dbDepartment.findByIdAndUpdate(departmentId, data, { new: true })
}

export const deleteDepartmentById = async (departmentId) => {
    return await dbDepartment.findByIdAndDelete(departmentId)
}
