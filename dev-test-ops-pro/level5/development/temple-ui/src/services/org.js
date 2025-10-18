import api from "./api";

export const getOrgsList = async () => {
  try {
    const response = await api.get("/temples", {
      params: {
        populate: ["address", "images"],
        sort: ["createdAt:asc"], // ✅ Use array format for sort
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch orgs";
  }
};

export const getSingleOrgPopulate = async (orgId) => {
  try {
    // Fixed: Removed the extra closing brace
    const response = await api.get(`/orgs/${orgId}`, {
      params: {
        populate: "*"
      }
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error(error.response?.data?.message || "Failed to fetch Org");
  }
};

export const getSingleOrg = async (orgId) => {
  try {
    // Fixed: Removed the extra closing brace
    const response = await api.get(`/orgs/${orgId}`,{
      params:{
        populate: "*"
      }
    });
    console.log(response)
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error(error.response?.data?.message || "Failed to fetch Org");
  }
};

export const getOrgUser = async () => {
    try {
      const response = await api.get(`/users/me`, {
        params: {
          populate: {
            orgs: {
              populate: {
                users: {
                  populate: "*"
                },
                orgimages: {
                  populate: "*"
                }
              }
            }
          },
        }
      });
      
      // Return the user data which includes orgs
      return response.data;
  
    } catch (error) {
      console.error(
        "Strapi get error:",
        error.response?.data || error.message
      );
      
      // Handle different error scenarios
      if (error.response?.status === 401) {
        throw new Error("Authentication required");
      } else if (error.response?.status === 403) {
        throw new Error("Access denied");
      } else if (error.response?.status === 404) {
        throw new Error("User not found");
      }
      
      throw error.response?.data?.message || error.message || "Failed to fetch user organizations";
    }
}


export const setUserOrg = async (data)=>{
     try {
        const response = await api.post("/user-orgs",{
            data
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to fetch user";
    }
}

export const updateUserOrg = async (data, orgId)=>{
     try {
        const response = await api.put(`/user-orgs/${orgId}`,{
            data
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to fetch user";
    }
}

export const getUserOrg = async ( userId)=>{
     try {
        const response = await api.get(`/users/${userId}`,{
          params:{
            populate:"user_org"
          }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to fetch user";
    }
}

export const deleteUserOrg = async ( orgId)=>{
     try {
        const response = await api.get(`/user-orgs/${orgId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to delete user oorf";
    }
}