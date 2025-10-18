import api from "./api";

export const createQuestions = async (data) => {
    try {
      const response = await api.post(`/questions`, {
        data
      });
      return response.data;
    } catch (error) {
      console.error("Error creating Questions:", error);
      return null;
    }
  };


export const getAllQuestions = async ({ filters = {}, page = 1, pageSize = 10 }) => {
  try {
    const response = await api.get(`/questions`, {
      params: {
        ...filters,
        'pagination[page]': page,
        'pagination[pageSize]': pageSize,
      },
    });
    return response.data; // Expected format: { data: [...], meta: { pagination: { page, pageSize, pageCount, total } } }
  } catch (error) {
    console.error("Error getting Questions:", error);
    return { data: [], meta: { pagination: { total: 0 } } }; // Return empty data on error
  }
};

 export const getQuestions = async (contentId) => {
    try {
      const response = await api.get(`/contents/${contentId}`,{
        params:{
          populate : "questions"
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error creating Questions:", error);
      return null;
    }
  };
