import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
    createRole,
    findAllRoles,
    findRoleById,
    updateRoleById,
    deleteRoleById
} from "../services/role.service.js";
import { findDepartmentById } from "../services/department.service.js";
import { findSubdepartmentById } from "../services/subdepartment.service.js";

export const createNewRole = asyncHandler(async (req, res) => {
    const { name, subdepartment, department } = req.body;
    if (!name || !subdepartment || !department) {
        return res.status(400).json(new ApiError(400, "Name, subdepartment, and department are required"));
    }
    const isDepartmentExist = await findDepartmentById(department)
    if(!isDepartmentExist){
        return res.status(404).json(new ApiError(404, "department doest not exist"));
    }
    const isSubDepartmentExist = await findSubdepartmentById(subdepartment)
    if(!isSubDepartmentExist){
        return res.status(404).json(new ApiError(404, "sub department doest not exist"));
    }
    const role = await createRole(req.body);
    return res.status(201).json(new ApiResponse(201, "Role created successfully", role));
});

export const getAllRoles = asyncHandler(async (req, res) => {
    const roles = await findAllRoles();
    if (roles.length) {
        return res.status(200).json(new ApiResponse(200, "List of all roles", roles));
    } else {
        return res.status(200).json(new ApiResponse(200, "Role list is empty"));
    }
});

export const getRoleById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const role = await findRoleById(id);
    if (!role) {
        return res.status(404).json(new ApiError(404, "Role not found"));
    }
    return res.status(200).json(new ApiResponse(200, "Role details fetched successfully", role));
});

export const updateRole = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { subdepartment, department } = req.body;
    const isDepartmentExist = await findDepartmentById(department)
    if(!isDepartmentExist){
        return res.status(404).json(new ApiError(404, "department doest not exist"));
    }
    const isSubDepartmentExist = await findSubdepartmentById(subdepartment)
    if(!isSubDepartmentExist){
        return res.status(404).json(new ApiError(404, "sub department doest not exist"));
    }
    const updatedRole = await updateRoleById(id, req.body);
    if (!updatedRole) {
        return res.status(404).json(new ApiError(404, "Role not found"));
    }
    return res.status(200).json(new ApiResponse(200, "Role updated successfully", updatedRole));
});

export const deleteRole = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const deletedRole = await deleteRoleById(id);
    if (!deletedRole) {
        return res.status(404).json(new ApiError(404, "Role not found"));
    }
    return res.status(200).json(new ApiResponse(200, "Role deleted successfully"));
});
