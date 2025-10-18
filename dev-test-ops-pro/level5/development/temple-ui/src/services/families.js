import api from "./api";

export const customFamilies = async (data) => {
  try {
    const response = await api.post("/families", {
      data: data,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Family Creation failed";
  }
}
export const updateFamily = async (familyId, data) => {
  try {
    const response = await api.put(`/families/${familyId}`, {
      data: data,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Family update failed";
  }
}

export const getAllFamilies = async (data) => {
  try {
    const response = await api.post("/custom-temple/families/summary", {
     ...data,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Family get failed";
  }
}
export const getSingleFamily = async (familyId) => {
  try {
    const response = await api.post('/custom-temple/singlefamily/details', { familyId });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Family get failed';
  }
};

export const fetchFamilies = async (familyId) => {
  try {
    const response = await api.get(`/families/${familyId}`, {
      params: {
        populate: {
          mukhiya:{
            populate: "*",
          },
          myfamilies: {
            populate: "*",
          },
          members: {
            populate: ['profilePicture', "addresses"],
          },
        },
        pagination: {
          page: 1,
          pageSize: 100, // Set high limit to fetch all members
        },
      },
    });
    return response.data;
  } catch (error) {
    console.error("Fetch Error:", error.response?.data || error.message);
    throw error.response?.data?.message || "परिवार डेटा लोड करने में विफल";
  }
};


export const addUserToFamily = async (userId, familyId) => {
  try {
    const response = await api.put(`/users/${userId}`, {
      family: familyId
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to add member to family";
  }
};

// Updated service function to work with your API
export const addUserToMyFamily = async (payload) => {
  try {
    const response = await api.post('/custom-myfamily', payload);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to register family");
  }
};

// Alternative version if you want to keep the original function signature
// and add a new function for family registration
export const createFamilyRelations = async (familyId, members) => {
  try {
    const response = await api.post('/custom-myfamily', {
      familyId,
      members
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to create family relations");
  }
};

// Keep your existing function for individual user addition if needed
export const addUserToExistingFamily = async (userId, familyId) => {
  try {
    const response = await api.put(`/custom-myfamily`, {
      family: familyId
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to add member to family");
  }
};