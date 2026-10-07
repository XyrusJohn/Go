import cloudinary from "../config/cloudinary.js";
// Auto retries upload to Cloudinary with exponential backoff
export const uploadWithRetry = async (dataURI, options, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await cloudinary.uploader.upload(dataURI, { ...options });
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
};
