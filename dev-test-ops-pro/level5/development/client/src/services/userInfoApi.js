import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;
const jwt = localStorage.getItem("jwt");

console.log("API_URL", API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getUserData = async (userId, jwt) => {
  try {
    const response = await api.get(`/users/${userId}`, {
      params: {
        populate: "*", // Populate all relations
      },
    });
    return response.data;
  } catch (error) {
    console.error("Strapi fetch error:", error.response?.data || error.message);
    throw error.response?.data?.message || "Failed to fetch user data";
  }
};

export const addEducationData = async (educationData) => {
  try {
    // console.log("Sending update:", { photos: photoIds });
    console.log("jwt", jwt);
    const response = await api.post(
      `/educations`,
      { data: educationData },
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Strapi update error:",
      error.response?.data || error.message
    );
    throw error.response?.data?.message || "Update failed";
  }
};

export const updateEducationData = async (educationData, educationId) => {
  try {
    // console.log("Sending update:", { photos: photoIds });
    console.log("jwt", jwt);
    const response = await api.put(
      `/educations/${educationId}`,
      { data: educationData },
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Strapi update error:",
      error.response?.data || error.message
    );
    throw error.response?.data?.message || "Update failed";
  }
};

export const deleteEducationData = async (educationId) => {
  try {
    // console.log("Sending update:", { photos: photoIds });
    console.log("jwt", jwt);
    const response = await api.delete(`/educations/${educationId}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Strapi update error:",
      error.response?.data || error.message
    );
    throw error.response?.data?.message || "Update failed";
  }
};

//business

export const addBusinessData = async (businessData) => {
  try {
    // console.log("Sending update:", { photos: photoIds });
    console.log("jwt", jwt);
    const response = await api.post(
      `/businesses`,
      { data: businessData },
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Strapi update error:",
      error.response?.data || error.message
    );
    throw error.response?.data?.message || "Update failed";
  }
};

export const updateBusinessData = async (businessData, businessId) => {
  try {
    // console.log("Sending update:", { photos: photoIds });
    console.log("jwt", jwt);
    const response = await api.put(
      `/businesses/${businessId}`,
      { data: businessData },
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Strapi update error:",
      error.response?.data || error.message
    );
    throw error.response?.data?.message || "Update failed";
  }
};

export const deleteBusinessData = async (businessId) => {
  try {
    // console.log("Sending update:", { photos: photoIds });
    console.log("jwt", jwt);
    const response = await api.delete(`/businesses/${businessId}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Strapi update error:",
      error.response?.data || error.message
    );
    throw error.response?.data?.message || "Update failed";
  }
};

export const getUserCounts = async (templeId) => {
  try {
    const response = await api.get(`/custom-temple/type-count/${templeId}`);

    // Return the response data directly (not response.data)
    // The component expects to call res.json() on the response
    return {
      json: async () => response.data,
      ok: true,
      status: 200,
    };
  } catch (error) {
    console.error("Strapi fetch error:", error.response?.data || error.message);

    // Return a response-like object that the component can handle
    return {
      json: async () => {
        throw new Error(
          error.response?.data?.message || "Failed to fetch user data"
        );
      },
      ok: false,
      status: error.response?.status || 500,
    };
  }
};
