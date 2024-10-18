import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { createProfileDb, deleteProfileDb, findAllProfilesWithAllDetails, findProfileByIdWithAllDetails, getAllProfiles, getProfileByIdDb, updateProfileDb } from "../services/profile.service.js"
import { deleteFromCloudinary, uploadOnCloudinary, uploadVideoToCloudinary } from "../helpers/cloudinary.helper.js"
import { config } from "../utils/config.js"
import { getBufferString, getVideoSizeInMB } from "../utils/getItems.js"
import { createProfileEmail, profileEmail } from "../helpers/email.helper.js"
import { findRoleById } from "../services/role.service.js"

export const createProfile = asyncHandler(async (req, res) => {
    const { actorId, profilePicture, videoType, videoLink, role } = req.body
    if (!actorId) {
        return res
            .status(200)
            .json(new ApiError(400, "actorId is required"))
    }
    const isRoleExist = await findRoleById(role)
    if(!isRoleExist){
        return res.status(404).json(new ApiError(404, "role doest not exist"));
    }
    let profileVideoUrl = ""
    let profileVideoCloudinaryPublicId = ""
    if (videoType === "link") {
        profileVideoUrl = videoLink
    } else {
        if (req.files && req.files.video) {
            const videoSize = getVideoSizeInMB(req.files.video)
            if (videoSize > 1) {
                return res
                    .status(200)
                    .json(new ApiError(500, "Video size should not be greater than 1 mb"))
            }
            const buffer = getBufferString(req.files.video)
            const uploadResult = await uploadVideoToCloudinary(buffer, config.cloudinaryProfileVideoFolderName);
            if (uploadResult.success) {
                profileVideoUrl = uploadResult.result.url;
                profileVideoCloudinaryPublicId = uploadResult.result.public_id;
            }
            else {
                return res
                    .status(200)
                    .json(new ApiError(500, "Failed to upload video"))
            }
        }
    }
    let profilePictureUrl = ""
    let profilePictureCloudinaryPublicId = ""
    const uploadResult = await uploadOnCloudinary(profilePicture, "image", config.cloudinaryProfilePictureFolderName)
    if (uploadResult.success) {
        profilePictureUrl = uploadResult.result.url
        profilePictureCloudinaryPublicId = uploadResult.result.public_id
    }
    else {
        return res
            .status(200)
            .json(new ApiError(500, "Failed to upload Profile picture"))
    }
    const data = {
        ...req.body,
        profilePicture: profilePictureUrl,
        profilePicturePublicId: profilePictureCloudinaryPublicId,
        video: profileVideoUrl,
        videoPublicId: profileVideoCloudinaryPublicId
    }
    const createdProfile = await createProfileDb(data)
    if (createdProfile) {
        await createProfileEmail(createdProfile)
        const profile = await findProfileByIdWithAllDetails(createdProfile._id)
        return res
            .status(201)
            .json(new ApiResponse(201, "Profile Created Successfully", profile))
    }
})

export const listProfiles = asyncHandler(async (req, res) => {
    const profiles = await findAllProfilesWithAllDetails()
    if (profiles.length === 0) {
        return res
            .status(200)
            .json(new ApiResponse(404, "No profiles found"))
    }
    return res
        .status(200)
        .json(new ApiResponse(200, "Profile list fetched successfully", profiles))
})

export const deleteProfile = asyncHandler(async (req, res) => {
    const { profileId } = req.params;
    if (!profileId) {
        return res
            .status(200)
            .json(new ApiError(400, "Profile ID is required"));
    }
    const profile = await getProfileByIdDb(profileId);
    if (!profile) {
        return res
            .status(200)
            .json(new ApiError(404, "Profile not found"));
    }
    if (profile.profilePicturePublicId) {
        await deleteFromCloudinary(profile.profilePicturePublicId);
    }
    if (profile.videoPublicId) {
        await deleteFromCloudinary(profile.videoPublicId);
    }
    const deletedProfile = await deleteProfileDb(profileId);
    if (deletedProfile) {
        return res
            .status(200)
            .json(new ApiResponse(200, "Profile deleted successfully"));
    }
    else {
        return res
            .status(200)
            .json(new ApiError(500, "Failed to delete profile"));
    }
});

export const editProfile = asyncHandler(async (req, res) => {
    const { profileId } = req.params;
    const { profilePicture, videoType, videoLink,role } = req.body;
    if (!profileId) {
        return res.status(200).json(new ApiError(400, "Profile ID is required"));
    }
    const isRoleExist = await findRoleById(role)
    if(!isRoleExist){
        return res.status(404).json(new ApiError(404, "role doest not exist"));
    }
    const profile = await getProfileByIdDb(profileId);
    if (!profile) {
        return res.status(200).json(new ApiError(404, "Profile not found"));
    }
    let profileVideoUrl = profile.video;
    let profileVideoCloudinaryPublicId = profile.videoPublicId;
    if (videoType === "link") {
        profileVideoUrl = videoLink;
    } else {
        if (req.files && req.files.video) {
            const videoSize = getVideoSizeInMB(req.files.video);
            if (videoSize > 1) {
                return res.status(200).json(new ApiError(500, "Video size should not be greater than 1 MB"));
            }

            if (profileVideoCloudinaryPublicId) {
                await deleteFromCloudinary(profileVideoCloudinaryPublicId);
            }

            const buffer = getBufferString(req.files.video);
            const uploadResult = await uploadVideoToCloudinary(buffer, config.cloudinaryProfileVideoFolderName);
            if (uploadResult.success) {
                profileVideoUrl = uploadResult.result.url;
                profileVideoCloudinaryPublicId = uploadResult.result.public_id;
            } else {
                return res.status(200).json(new ApiError(500, "Failed to upload video"));
            }
        }
    }
    let profilePictureUrl = profile.profilePicture;
    let profilePictureCloudinaryPublicId = profile.profilePicturePublicId;
    if (profilePicture) {
        if (profilePictureCloudinaryPublicId) {
            await deleteFromCloudinary(profilePictureCloudinaryPublicId);
        }

        const uploadResult = await uploadOnCloudinary(profilePicture, "image", config.cloudinaryProfilePictureFolderName);
        if (uploadResult.success) {
            profilePictureUrl = uploadResult.result.url;
            profilePictureCloudinaryPublicId = uploadResult.result.public_id;
        } else {
            return res.status(200).json(new ApiError(500, "Failed to upload profile picture"));
        }
    }
    const updatedData = {
        ...req.body,
        profilePicture: profilePictureUrl,
        profilePicturePublicId: profilePictureCloudinaryPublicId,
        video: profileVideoUrl,
        videoPublicId: profileVideoCloudinaryPublicId,
    };
    const updatedProfile = await updateProfileDb(profileId, updatedData);
    if (updatedProfile) {
        return res.status(200).json(new ApiResponse(200, "Profile updated successfully", updatedProfile));
    } else {
        return res.status(200).json(new ApiError(500, "Failed to update profile"));
    }
});

export const getProfileById = asyncHandler(async (req, res) => {
    const { profileId } = req.params
    const profile = await findProfileByIdWithAllDetails(profileId);
    if (!profile) {
        return res.status(404).json(new ApiError(404, "Profile not found"));
    }
    return res.status(200).json(new ApiResponse(200, "Profile details fetched successfully", profile));
});

export const shareProfiles = asyncHandler(async (req, res) => {
    const { profileIds, toProfileIds } = req.body
    if (!profileIds || !Array.isArray(profileIds) || profileIds.length === 0) {
        return res.status(400).json(new ApiError(400, "Profile IDs are required."))
    }
    if (!toProfileIds || !Array.isArray(toProfileIds) || toProfileIds.length === 0) {
        return res.status(400).json(new ApiError(400, "Recipient Profile IDs are required"))
    }
    const profiles = (await Promise.all(profileIds.map(findProfileByIdWithAllDetails)))
    .filter(profile => profile !== null);
    // console.log(profiles,"profiles");
    
    const recipients = await Promise.all(toProfileIds.map(id => findProfileByIdWithAllDetails(id)))
    const recipientEmails = recipients
    .filter(profile => profile && profile.email)
    .map(profile => profile.email)
    const emailData={
        profiles:profiles,
        receiverEmailAdrress:recipientEmails.join(","),
        subject:"List of profiles"
    }

    await profileEmail(emailData)
    return res.status(200).json(new ApiResponse(200, "profile shared successfully",))
});
