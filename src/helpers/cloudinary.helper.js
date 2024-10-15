import { v2 as cloudinary } from 'cloudinary';
import { config } from '../utils/config.js';

cloudinary.config({
  cloud_name: config.cloudinaryCloudName,
  api_key: config.cloudinaryApiKey,
  api_secret: config.cloudinaryApiSecret
});

export async function uploadOnCloudinary(file, resourceType, folderName) {
  try {
    const result = await cloudinary.uploader.upload(file, {
      resource_type: resourceType,
      folder: folderName
    });
    return { success: true, result };
  } catch (error) {
    return { success: false, error };
  }
}

export const uploadVideoToCloudinary = async (buffer, folderName) => {
  try {
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folderName,
          resource_type: 'video',
          transformation: [
            {
              quality: 'auto',
              fetch_format: 'mp4',
            },
          ],
          timeout: 300000, 
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      uploadStream.end(buffer);
    });
    return { success: true, result };
  } catch (error) {
    return {
      success: false, error,
    };
  }
};

export async function deleteFromCloudinary(publicId) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return { success: true, result };
  } catch (error) {
    return { success: false, error };
  }
}