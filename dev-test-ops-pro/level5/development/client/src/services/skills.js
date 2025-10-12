import api from './api';

export const getAllSkills = async () => {
  try {
    const response = await api.get(`/skills`);
    return response.data;
  } catch (err) {
    throw err.response?.data?.message || "Error in getting skills data";
  }
};

// Get current user's skills
export const getUserSkills = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`,{
        params:{
            populate: "user_skill"
        }
    }); // Assuming you have an endpoint to get current user's skills
    return response.data;
  } catch (err) {
    throw err.response?.data?.message || "Error in getting user skills data";
  }
};

// Create new user skills (only called once)
export const setUserSkills = async (data) => {
  try {
    const response = await api.post(`/user-skills`, {
      data
    });
    return response.data;
  } catch (err) {
    throw err.response?.data?.message || "Error in creating user skills";
  }
};

// Update existing user skills
export const updateUserSkills = async (data, skillId) => {
  try {
    const response = await api.put(`/user-skills/${skillId}`, { // Fixed the comma to slash
      data
    });
    return response.data;
  } catch (err) {
    throw err.response?.data?.message || "Error in updating user skills";
  }
};

// Delete user skills record (probably not needed since you only update)
export const deleteUserSkills = async (skillId) => {
  try {
    const response = await api.delete(`/user-skills/${skillId}`); // Fixed the comma to slash and changed to DELETE method
    return response.data;
  } catch (err) {
    throw err.response?.data?.message || "Error in deleting user skills";
  }
};