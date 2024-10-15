import { dbSubdepartment } from "../models/subdepartment.model.js";

export const createSubdepartment = async (data) => {
    return await dbSubdepartment.create(data);
};

export const findAllSubdepartments = async () => {
    return await dbSubdepartment.find()
};

export const findSubdepartmentById = async (subdepartmentId) => {
    return await dbSubdepartment.findById(subdepartmentId)
};

export const updateSubdepartmentById = async (subdepartmentId, data) => {
    return await dbSubdepartment.findByIdAndUpdate(subdepartmentId, data, {
        new: true,
        runValidators: true,
    });
};

export const deleteSubdepartmentById = async (subdepartmentId) => {
    return await dbSubdepartment.findByIdAndDelete(subdepartmentId);
};
