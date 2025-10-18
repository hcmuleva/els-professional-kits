import api from "./api";

export const login = async (identifier, password) => {
    try {
      const response = await api.post('/custom-login', {
        identifier, // can be email or username
        password,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Login failed";
    }
  };
  
  export const customRegister = async (data) => {
    try {
      const response = await api.post("/custom-register", {
        ...data,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Registration failed";
    }
  }
  
  export const getAuthenticatedUser = async (jwt) => {
    try {
      const response = await api.get("/users/me", {
        params: {
          populate: "*", // Populates all relations
        },
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to fetch user";
    }
  };
  
  export const getPincode = async (pincode) => {
    try {
      const response = await api.get(`/pincodes?filters[pincode]=${pincode}`)
      return response.data
    } catch (err) {
      throw err.response?.data?.message || "Error in getting pincode"
    }
  }
  
  
  
  export const updateUser = async (data, userId) => {
    try {
      // console.log("Sending update:", { photos: photoIds });
  
      const response = await api.put(`/users/${userId}`, {
        ...data,
      });
      return response.data;
  
    } catch (error) {
      console.error(
        "Strapi update error:",
        error.response?.data || error.message
      );
      throw error.response?.data?.message || "Update failed";
    }
  }
  
export const customProfileUsers = async (userId) => {
  try {
    const response = await api.post("/custom-profilelist", {
      userid: userId,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Fetch Profile Failed";
  }
};
