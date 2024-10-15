import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
    createSubdepartment,
    findAllSubdepartments,
    findSubdepartmentById,
    updateSubdepartmentById,
    deleteSubdepartmentById
} from "../services/subdepartment.service.js";
import { findDepartmentById } from "../services/department.service.js";

export const createNewSubdepartment = asyncHandler(async (req, res) => {
    const { name, department } = req.body;
    if (!name || !department) {
        return res.status(400).json(new ApiError(400, "Name and department are required"));
    }
    const isDepartmentExist = await findDepartmentById(department)
    if(!isDepartmentExist){
        return res.status(404).json(new ApiError(404, "department doest not exist"));
    }
    const subdepartment = await createSubdepartment(req.body);
    return res.status(201).json(new ApiResponse(201, "Subdepartment created successfully", subdepartment));
});

export const getAllSubdepartments = asyncHandler(async (req, res) => {
    const subdepartments = await findAllSubdepartments();
    if (subdepartments.length) {
        return res.status(200).json(new ApiResponse(200, "List of all subdepartments", subdepartments));
    } else {
        return res.status(200).json(new ApiResponse(200, "Subdepartment list is empty"));
    }
});

export const getSubdepartmentById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const subdepartment = await findSubdepartmentById(id);
    if (!subdepartment) {
        return res.status(404).json(new ApiError(404, "Subdepartment not found"));
    }
    return res.status(200).json(new ApiResponse(200, "Subdepartment details fetched successfully", subdepartment));
});

export const updateSubdepartment = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const {department} = req.body
    const isDepartmentExist = await findDepartmentById(department)
    if(!isDepartmentExist){
        return res.status(404).json(new ApiError(404, "department doest not exist"));
    }
    const updatedSubdepartment = await updateSubdepartmentById(id, req.body);
    if (!updatedSubdepartment) {
        return res.status(404).json(new ApiError(404, "Subdepartment not found"));
    }
    return res.status(200).json(new ApiResponse(200, "Subdepartment updated successfully", updatedSubdepartment));
});

export const deleteSubdepartment = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const deletedSubdepartment = await deleteSubdepartmentById(id);
    if (!deletedSubdepartment) {
        return res.status(404).json(new ApiError(404, "Subdepartment not found"));
    }
    return res.status(200).json(new ApiResponse(200, "Subdepartment deleted successfully"));
});
