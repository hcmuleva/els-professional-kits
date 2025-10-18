import api from "./api";


export const getPincode = async (pincode) => {
  try {
    const response = await api.get(`/pincodes?filters[pincode]=${pincode}`);
    return response.data;
  } catch (err) {
    throw err.response?.data?.message || "Error in getting pincode";
  }
};