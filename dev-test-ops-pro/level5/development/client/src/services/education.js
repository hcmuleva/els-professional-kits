import api from "./api";

export const getEducationData = async () => {
    try {
        const response = await api.get(`/educationdatas`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to get education data";
    }
}

export const getEducation = async (userId) => {
    try {
        const response = await api.get(`/users/${userId}`, {
            params: {
                populate: {
                    user_educations: {
                        populate: "address"
                    }
                }
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to get education data";
    }
};

export const createEducation = async (payload) => {
    try {
        const response = await api.post("/user-educations", {data:payload});
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to create education";
    }
    }
export const updateEducation = async (id, payload) => {
    try {
        const response = await api.put(`/user-educations/${id}`, {data:payload});
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to update education";
    }
}
export const deleteEducation = async (id) => {
    try {
        const response = await api.delete(`/user-educations/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to delete education";
    }
}


export const getEducationById = async (educationLevel, templeId) => {
    try {
      const response = await api.get(`/users`, {
        params: {
          'filters[education_level][$eq]': educationLevel,
          'filters[temples][id][$eq]': templeId,
        },
        paramsSerializer: (params) => {
          // Ensure query parameters are serialized correctly for Strapi
          return Object.entries(params)
            .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
            .join('&');
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.error?.message || 'Failed to get education list';
    }
  };