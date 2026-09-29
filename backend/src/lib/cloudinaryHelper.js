import cloudinary from "../config/cloudinary.js";

export const uploadWithRetry = async (dataURI, options, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await cloudinary.uploader.upload(dataURI, { ...options });
      console.log("hello world");
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      console.log("hello world");
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
};
