import api from "./api";

// Get all activities with population
export const getActivities = async (params = {}) => {
    try {
        const response = await api.get('/activities', {
            params: {
                populate: "*",
                sort: "createdAt:desc", // Show newest first
                ...params
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Error in getting activities";
    }
};

// Add new activity
export const addActivity = async (data) => {
    try {
        const response = await api.post('/activities', {
            data
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Error in adding activity";
    }
};

// Get single activity by ID
export const getActivity = async (id) => {
    try {
        const response = await api.get(`/activities/${id}`, {
            params: {
                populate: "*"
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Error in getting activity";
    }
};

// Update activity
export const updateActivity = async (id, data) => {
    try {
        const response = await api.put(`/activities/${id}`, {
            data
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Error in updating activity";
    }
};

// Delete activity
export const deleteActivity = async (id) => {
    try {
        const response = await api.delete(`/activities/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Error in deleting activity";
    }
};

// Get activities by organization using custom Strapi API
export const getActivitiesByOrg = async (templeId, page = 1, pageSize = 10, filters) => {
  try {
    if (!templeId) {
      throw new Error("temple ID is required");
    }

    const params = {
      page,
      pageSize,
      sort: "createdAt:desc",
  
    };

    // Merge filters properly into the params object using the correct Strapi format
    if (filters) {
      // Use qs to stringify nested filters properly (RECOMMENDED way)
      const qs = require("qs");
      const queryString = qs.stringify(
        {
          ...params,
          filters,
        },
        { encodeValuesOnly: true }
      );

      const response = await api.get(`/customactivity/temple/${templeId}?${queryString}`);
      return response.data;
    }

    // If no filters, send normal params
    const response = await api.get(`/customactivity/temple/${templeId}`, { params });
    return response.data;

  } catch (error) {
    throw error.response?.data?.message || "Error in getting organization activities";
  }
};


export const toggleActivityLike = async (activityId) => {
    try {
        const response = await api.post(`/customactivity/${activityId}/toggle-like`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Error toggling like";
    }
};

// NEW: Get like status for an activity
export const getActivityLikeStatus = async (activityId) => {
    try {
        const response = await api.get(`/customactivity/${activityId}/like-status`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Error getting like status";
    }
};


// // Get activities by user
// export const getActivitiesByUser = async (userId, params = {}) => {
//     try {
//         const response = await api.get('/activities', {
//             params: {
//                 populate: "*",
//                 sort: "createdAt:desc",
//                 filters: {
//                     user: {
//                         id: {
//                             $eq: userId
//                         }
//                     }
//                 },
//                 ...params
//             }
//         });
//         return response.data;
//     } catch (error) {
//         throw error.response?.data?.message || "Error in getting user activities";
//     }
// };

// // Get activities by type
// export const getActivitiesByType = async (type, params = {}) => {
//     try {
//         const response = await api.get('/activities', {
//             params: {
//                 populate: "*",
//                 sort: "createdAt:desc",
//                 filters: {
//                     type: {
//                         $eq: type
//                     }
//                 },
//                 ...params
//             }
//         });
//         return response.data;
//     } catch (error) {
//         throw error.response?.data?.message || "Error in getting activities by type";
//     }
// };

// // Search activities
// export const searchActivities = async (searchTerm, params = {}) => {
//     try {
//         const response = await api.get('/activities', {
//             params: {
//                 populate: "*",
//                 sort: "createdAt:desc",
//                 filters: {
//                     $or: [
//                         {
//                             title: {
//                                 $containsi: searchTerm
//                             }
//                         },
//                         {
//                             subtitle: {
//                                 $containsi: searchTerm
//                             }
//                         }
//                     ]
//                 },
//                 ...params
//             }
//         });
//         return response.data;
//     } catch (error) {
//         throw error.response?.data?.message || "Error in searching activities";
//     }
// };

// // Get paginated activities
// export const getPaginatedActivities = async (page = 1, pageSize = 10, params = {}) => {
//     try {
//         const response = await api.get('/activities', {
//             params: {
//                 populate: "*",
//                 sort: "createdAt:desc",
//                 pagination: {
//                     page,
//                     pageSize
//                 },
//                 ...params
//             }
//         });
//         return response.data;
//     } catch (error) {
//         throw error.response?.data?.message || "Error in getting paginated activities";
//     }
// };

// // Get recent activities (last 7 days)
// export const getRecentActivities = async (params = {}) => {
//     const sevenDaysAgo = new Date();
//     sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
//     try {
//         const response = await api.get('/activities', {
//             params: {
//                 populate: "*",
//                 sort: "createdAt:desc",
//                 filters: {
//                     createdAt: {
//                         $gte: sevenDaysAgo.toISOString()
//                     }
//                 },
//                 ...params
//             }
//         });
//         return response.data;
//     } catch (error) {
//         throw error.response?.data?.message || "Error in getting recent activities";
//     }
// };