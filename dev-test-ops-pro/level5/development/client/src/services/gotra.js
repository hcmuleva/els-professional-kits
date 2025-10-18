import api from "./api";

export const getGotraData = async (id) => {
  try {
    const response = await api.get(`/gotras/1`);
    console.log("Gotra Data:", response.data);
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch Gotra");
  }
};
