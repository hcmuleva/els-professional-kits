import api from './api';

export const setUserResultData = async (data) => {
  try {
    const response = await api.post(`/results`,{
        data
    });
    return response.data;
  } catch (err) {
    throw err.response?.data?.message || "Error in setting result data";
  }
};

export const getUsersResultData = async () => {
  try {
    const response = await api.get("/results", {
      params: {
        populate: {
          exam: {
            populate: ["course", "content", "questions"],
          },
          user: true,
          attachment: true,
        },
      },
    });
    return response.data;
  } catch (err) {
    throw err.response?.data?.message || "Error in getting result data";
  }
};