import api from "./api";

export const createAnnouncement = async (data) => {
  try {
    const response = await api.post("/announcements", {
      data,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error?.message || error.message || "Failed to create Announcement";
  }
};

export const updateAnnouncement = async (id, data) => {
  try {
    const response = await api.put(`/custom-announcements/${id}`, { data });
    return response.data;
  } catch (error) {
    console.error("Error updating announcement", error);
    throw error.response?.data?.error?.message || "Error updating announcement";
  }
};

export const deleteAnnouncement = async (id) => {
  try {
    const response = await api.delete(`/custom-announcements/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting announcement", error);
    throw error.response?.data?.error?.message || "Error deleting announcement";
  }
};

export const fetchAnnouncementsByTemple = async (templeId, subcategoryid, options = {}) => {
  try {
    const { page = 1, pageSize = 10, sort = ['createdAt:desc'] } = options;
    
    // Build filters object
    const filters = {
      temple: { id: templeId }
    };
    
    // Add subcategory filter if provided
    if (subcategoryid) {
      filters.subcategory = { id: subcategoryid };
    }

    const response = await api.get(`/announcements`, {
      params: {
        filters,
        populate: "*",
        pagination: {
          page,
          pageSize
        },
        sort
      }
    });
    
    return response.data;
  } catch (error) {
    console.error("Error fetching announcements:", error);
    throw error.response?.data?.error?.message || "Error fetching announcements";
  }
};
