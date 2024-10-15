import { dbProfile } from "../models/profile.model.js"
import mongoose from "mongoose";

export const createProfileDb = async (data) => {
  return await dbProfile.create(data)
}

export const getAllProfiles = async () => {
  return await dbProfile.find().exec()
}

export const getProfileByIdDb = async (profileId) => {
  return await dbProfile.findById(profileId).exec();
};

export const deleteProfileDb = async (profileId) => {
  return await dbProfile.findByIdAndDelete(profileId).exec();
};

export const updateProfileDb = async (profileId, data) => {
  return await dbProfile.findByIdAndUpdate(profileId, data, { new: true }).exec();
};



export const findProfileByIdWithAllDetails = async (profileId) => {
  const profileDetails = await dbProfile.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(profileId) }
    },
    {
      $lookup: {
        from: 'roles',
        localField: 'role',
        foreignField: '_id',
        as: 'roleData'
      }
    },
    {
      $unwind: {
        path: '$roleData',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: 'subdepartments',
        localField: 'roleData.subdepartment',
        foreignField: '_id',
        as: 'subdepartmentData'
      }
    },
    {
      $unwind: {
        path: '$subdepartmentData',
        preserveNullAndEmptyArrays: true 
      }
    },
    {
      $lookup: {
        from: 'departments',
        localField: 'roleData.department',
        foreignField: '_id',
        as: 'departmentData'
      }
    },
    {
      $unwind: {
        path: '$departmentData',
        preserveNullAndEmptyArrays: true 
      }
    },
    {
      $addFields: {
        roleId: { $ifNull: ['$roleData._id', null] },
        roleName: { $ifNull: ['$roleData.name', null] },
        subDepartmentId: { $ifNull: ['$subdepartmentData._id', null] },
        subDepartmentName: { $ifNull: ['$subdepartmentData.name', null] },
        departmentId: { $ifNull: ['$departmentData._id', null] },
        departmentName: { $ifNull: ['$departmentData.name', null] }
      }
    },
    {
      $project: {
        _id:1,
        id: { $toString: '$_id' },
        actorId: 1,
        name: 1,
        email: 1,
        mobile: 1,
        bio: 1,
        actingExperience: 1,
        profilePicture: 1,
        profileType: 1,
        castingType: 1,
        unionMember: 1,
        roleId: 1,
        roleName: 1,
        departmentId: 1,
        departmentName: 1,
        subDepartmentId: 1,
        subDepartmentName: 1,
        video: 1
      }
    }
  ]);

  return profileDetails.length ? profileDetails[0] : null;
};


export const findAllProfilesWithAllDetails = async () => {
  const profiles = await dbProfile.aggregate([
    {
      $lookup: {
        from: 'roles',
        localField: 'role',
        foreignField: '_id',
        as: 'roleData'
      }
    },
    {
      $unwind: {
        path: '$roleData',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: 'subdepartments',
        localField: 'roleData.subdepartment',
        foreignField: '_id',
        as: 'subdepartmentData'
      }
    },
    {
      $unwind: {
        path: '$subdepartmentData',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: 'departments',
        localField: 'roleData.department',
        foreignField: '_id',
        as: 'departmentData'
      }
    },
    {
      $unwind: {
        path: '$departmentData',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $addFields: {
        roleId: { $ifNull: ['$roleData._id', null] },
        roleName: { $ifNull: ['$roleData.name', null] },
        subDepartmentId: { $ifNull: ['$subdepartmentData._id', null] },
        subDepartmentName: { $ifNull: ['$subdepartmentData.name', null] },
        departmentId: { $ifNull: ['$departmentData._id', null] },
        departmentName: { $ifNull: ['$departmentData.name', null] }
      }
    },
    {
      $project: {
        _id: 1,
        id: { $toString: '$_id' },
        actorId: 1,
        name: 1,
        email: 1,
        mobile: 1,
        bio: 1,
        actingExperience: 1,
        profilePicture: 1,
        profileType: 1,
        castingType: 1,
        unionMember: 1,
        roleId: 1,
        roleName: 1,
        departmentId: 1,
        departmentName: 1,
        subDepartmentId: 1,
        subDepartmentName: 1,
        video: 1
      }
    }
  ]);

  return profiles;
};
