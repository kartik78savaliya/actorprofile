import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
    createDepartment,
    findAllDepartments,
    findDepartmentById,
    updateDepartmentById,
    deleteDepartmentById
} from "../services/department.service.js";

export const createNewDepartment = asyncHandler(async (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json(new ApiError(400, "name is required"));
    }
    const department = await createDepartment(req.body);
    return res.status(201).json(new ApiResponse(201, "Department created successfully", department));
});

export const getAllDepartments = asyncHandler(async (req, res) => {
    const departments = await findAllDepartments();
    if(departments.length){
        return res.status(200).json(new ApiResponse(200, "List of all departments", departments));
    }
    else{
        return res.status(200).json(new ApiResponse(200, "Department list is empty"));
    }
});

export const getDepartmentById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const department = await findDepartmentById(id);
    if (!department) {
        return res.status(404).json(new ApiError(404, "Department not found"));
    }
    return res.status(200).json(new ApiResponse(200, "Department details fetched successfully", department));
});

export const updateDepartment = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updatedDepartment = await updateDepartmentById(id, req.body);
    if (!updatedDepartment) {
        return res.status(404).json(new ApiError(404, "Department not found"));
    }
    return res.status(200).json(new ApiResponse(200, "Department updated successfully", updatedDepartment));
});

export const deleteDepartment = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const deletedDepartment = await deleteDepartmentById(id);
    if (!deletedDepartment) {
        return res.status(404).json(new ApiError(404, "Department not found"));
    }
    return res.status(200).json(new ApiResponse(200, "Department deleted successfully"));
});
