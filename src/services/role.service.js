import { dbRole } from "../models/role.model.js"

export const createRole = async (data) => {
    return await dbRole.create(data)
}

export const findAllRoles = async () => {
    return await dbRole.find()
}

export const findRoleById = async (roleId) => {
    return await dbRole.findById(roleId)
}

export const updateRoleById = async (roleId, data) => {
    return await dbRole.findByIdAndUpdate(roleId, data, {
        new: true,
        runValidators: true,
    })
}

export const deleteRoleById = async (roleId) => {
    return await dbRole.findByIdAndDelete(roleId)
}