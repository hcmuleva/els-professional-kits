import api from "./api";

export const createAgriculture = async (data) => {
  try {
   

    const response = await api.post("/agricultures", {
      data
    });

    return response.data;
  } catch (error) {
    throw error.response?.data?.error?.message || error.message || "Failed to create agriculture";
  }
};

export const updateAgriculture = async (agriId, payload) => {
  try {
    const response = await api.put(`/agricultures/${agriId}`, {
      data: payload,
    });

    return response.data;
  } catch (error) {
    throw error.response?.data?.error?.message || error.message || "Failed to update agriculture";
  }
};


export const getAgricultures = async (userId) => {
    try {

      // Use Strapi's filters to get entries where user.id === userId
      const response = await api.get(`/agricultures`, {
        params: {
          filters: {
            user: {
              id: {
                $eq: userId,
              },
            },
          },
          populate: "*", // to fetch full related data
        },
      });
  
      return response.data;
    } catch (error) {
      throw error.response?.data?.error?.message || error.message || "Failed to fetch agriculture records";
    }
  };

  export const deleteAgriculture = async (id) => {
    try {
     
  
      const response = await api.delete(`/agricultures/${id}`);
  
      return response;
    } catch (error) {
      throw error.response?.data?.error?.message || error.message || "Failed to delete agriculture";
    }
  }; 
  
  
  
  export const getAgricultureById = async (landUnit, templeId) => {
    try {
      const response = await api.get(`/agricultures`, {
        params: {
          'filters[land_unit][$eq]': landUnit,
          'filters[user][temples][id][$eq]': templeId,
          'populate': 'user,user.temples',
        },
        paramsSerializer: (params) => {
          return Object.entries(params)
            .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
            .join('&');
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.error?.message || 'Failed to get agriculture list';
    }
  };