import api from "./api";

export const getBusinessData = async () => {
  const response = await api.get("/datacategories");
  const json = response.data;
  return json?.data?.[0]?.attributes?.business?.businessTypes ?? [];
};

export const getFilteredBusinessData = async (type, templeId) => {
  const response = await api.get("/businesses", {
    params: {
      populate: "*",
      filters: {
        type: {
          $eq: type,
        },
        users_permissions_user: {
          temples: {
            id: {
              $eq: templeId,
            },
          },
        },
      },
    },
  });
  return response.data;
};

export const fetchUserBusinessData = async (userId) => {
  try {
    const response = await api.get(
      `/users/${userId}?populate[businesses][populate][address][populate][businesses]=*`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Fetch Business failed";
  }
};

export const createBusiness = async (data) => {
  try {
    const response = await api.post("/businesses", {
      data,
    });
    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.error?.message ||
      error.message ||
      "Failed to create businesses"
    );
  }
};

export const updateBusiness = async (businessId, payload) => {
  try {
    const response = await api.put(`/businesses/${businessId}`, {
      data: payload,
    });
    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.error?.message ||
      error.message ||
      "Failed to update businesses"
    );
  }
};

export const getBusiness = async (userId) => {
  try {
    // Use Strapi's filters to get entries where user.id === userId
    const response = await api.get(`/businesses`, {
      params: {
        filters: {
          users_permissions_user: {
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
    throw (
      error.response?.data?.error?.message ||
      error.message ||
      "Failed to fetch businesses records"
    );
  }
};

export const deleteBusiness = async (id) => {
  try {
    const response = await api.delete(`/businesses/${id}`);
    return response;
  } catch (error) {
    throw (
      error.response?.data?.error?.message ||
      error.message ||
      "Failed to delete businesses"
    );
  }
};
