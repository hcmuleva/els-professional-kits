import api from "./api";

export const uploadFile = async (formData) => {



  console.log("uploadFile function called");
  try {
    const uploadResponse = await api.post("/upload", formData);
    console.log("Upload successful:", uploadResponse);
    console.log(process.env.REACT_APP_API_URL, 'api ')
    
    if (!uploadResponse.data || !Array.isArray(uploadResponse.data) || uploadResponse.data.length === 0) {
      throw new Error("Invalid response from server");
    }
    
    return uploadResponse.data;
  } catch (error) {
    console.error("Upload error:", error);
    if (error.message?.includes("Network Error")) {
      throw new Error("Network error. Please check your connection.");
    }
    throw error;
  }
};