import axios from "axios";
import api from "./api";
const API_URL = process.env.REACT_APP_API_URL;

export const getUnauthorizedTempleLists = async () => {
  try {
    const API_URL = process.env.REACT_APP_API_URL;
    const response = await api.get(`${API_URL}/temples?populate[address]=true`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch temple";
  }
};
export const getTempleById = async (templeId) => {
  try {
    const response = await api.get(`/temples`, {
      params: {
        populate: ["title", "subtitle", "address", "images", "qr_images", "gotra"],
      },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch temple";
  }
};

export const getTempleSubcategories = async (templeId) => {
  try {
    const response = await api.get(
      `/temples/${templeId}?populate[subcategories]=*`
    );
    console.log("temple subcategories", response.data);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch temple";
  }
};

export const getTempleLists = async () => {
  try {
    const response = await api.get("/temples", {
      params: {
        populate: "*",
        sort: ["createdAt:asc"],
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch temple";
  }
};

export const createTemple = async (data) => {
  try {
    const response = await api.post(`/temples`, {
      data,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to create Temple";
  }
};

export const updateTemple = async (id, data) => {
  try {
    const response = await api.put(`/temples/${id}`, { data: data });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Error in update temples";
  }
};
export const deleteTemple = async (id) => {
  try {
    const response = await api.delete(`/temples/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Error in update temple";
  }
};
export const fetchTempleUsers = async (templeId) => {
  console.log("templeId", templeId);
  try {
    const response = await api.get(`/temples/${templeId}`, {
      params: {
        populate: [
          "users_permissions_users",
          "users_permissions_users.profilePicture",
          "users_permissions_users.communities",
        ],
      },
    });
    console.log("temple users", response.data);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch temple";
  }
};
export const fetchTempleCommunities = async (templeId) => {
  try {
    const response = await api.get(`/temples/${templeId}`, {
      params: {
        populate: "communities",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch temple";
  }
};
export const fetchUnlinkedCommunities = async (templeId) => {
  try {
    const response = await api.get(
      `/custom-temple/${templeId}/unlinked-communities`
    );
    return response.data;
  } catch (error) {
    throw (
      error.response?.datemplesa?.message ||
      "Failed to fetch unlinked communities"
    );
  }
};
export const linkCommunitiesToTemple = async (templeId, communities) => {
  try {
    const response = await api.post(`/custom-temple/add-communities`, {
      data: {
        id: templeId,
        communities,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to link communities";
  }
};

export const assignUsersToCommunity = async (data) => {
  try {
    const response = await api.post(
      `/custom-temple/assign-users-to-community`,
      {
        data,
      }
    );
    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message || "Failed to assign users to community"
    );
  }
};

export const getCommunityroles = async ({ communityid }) => {
  try {
    const response = await api.get(`/communityroles`, {
      params: {
        populate: "*",
        filters: {
          community: {
            id: {
              $eq: communityid,
            },
          },
        },
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch community roles";
  }
};

export const fetchCustomTempleUsers = async ({
  id,
  page,
  pageSize,
  gender,
  minAge,
  maxAge,
  search,
  gotra,
  profession,
}) => {
  const params = new URLSearchParams();
  params.append("templeId", id);
  params.append("page", page);
  params.append("pageSize", pageSize);
  if (gender) params.append("gender", gender);
  if (minAge) params.append("minAge", minAge);
  if (maxAge) params.append("maxAge", maxAge);
  if (search) params.append("search", search);
  if (gotra) params.append("gotra", gotra);
  if (profession) params.append("profession", profession);

  const res = await api.get(
    `/custom-temple/paginated-users?${params.toString()}`
  );
  return res.data;
};

export const fetchSubcategoryrole = async (subcategoryId) => {
  try {
    const res = await api.get(`/custom-temple/roles/${subcategoryId}`);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch subcategory roles";
  }
};

export const assignUserRoleToTemple = async (data) => {
  try {
    const res = await api.post(`/userroles`, { data });
    return res.data;
  } catch (error) {
    throw (
      error.response?.data?.message || "Failed to assign user role to temple"
    );
  }
};

export const UserToTemple = async (templeId, data) => {
  try {
    const res = await api.post(`/temples/${templeId}`, { data });
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to assign user  to temple";
  }
};

export const getUserRequestForTemple = async (filters) => {
  try {
    const response = await api.get("/usertemples", {
      params: {
        populate: "user",
        filters,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user temples:", error);
  }
};

export const updateUserTempleStatus = async (id, data) => {
  try {
    const response = await api.put(`/usertemples/${id}`, { data: data });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Error in update temples";
  }
};

export const updateTempleImage = async (templeId, photoId) => {
  try {
    const response = await api.put(
      `/temples/${templeId}`,
      { data: { images: photoId } },
      { params: { populate: "images" } } // ✅ This line fetches updated image
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error updating temple image:",
      error.response?.data || error.message
    );
    throw error.response?.data?.message || "Temple image update failed";
  }
};
export const convertTTS = async (text, filename) => {
  try {
    const res = await api.post(`/custom-temple/ttsgenerate`, {
      text,
      filename,
    });
    return res.data;
  } catch (error) {
    throw (
      error.response?.data?.message || "Failed to assign user role to temple"
    );
  }
};

export const AllUserWithStatus = async ({ templeId }) => {
  try {
    const response = await api.post(
      "/custom-temple/get-users-grouped-by-status",
      {
        templeId,
      }
    );
    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message || "Failed to fetch all users with status"
    );
  }
};

export const changeuserstatus = async ({ userid, userstatus }) => {
  try {
    const response = await api.post(`/custom-temple/custom-update-user`, {
      userstatus,
      userid,
    });
    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message || "Failed to fetch all users with status"
    );
  }
};

const getAllFamilies = async ({ templeId }) => {
  try {
    const response = await api.get(`/api/temples/${templeId}/families`);

    return response.data;
  } catch (error) {
    console.error("Error fetching families:", error);
  }
};
export const getTemplesWithAddress = async () => {
  try {
    const response = await api.get("/temples", {
      params: {
        populate: {
          address: true,
        },
        pagination: {
          limit: 1000,
        },
      },
    });

    const items = response.data?.data || [];
    return items;
  } catch (error) {
    console.error("Error fetching temples with address:", error);
    throw (
      error.response?.data?.message || "Failed to fetch temples with address"
    );
  }
};

// Get assigned and unassigned users for selected temples
export const getAssignedUnAssginedUsersForTemples = async (templeIds) => {
  try {
    const queryString = templeIds.map((id) => `templeIds=${id}`).join("&");
    const res = await api.get(`/temples/${queryString}`);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch users for temples";
  }
};

// Assign users to multiple temples
export const assignUsersToTemples = async (data) => {
  try {
    const { templeIds, newUsers, existingUsers, removedUsers } = data;

    // Process each temple
    const promises = templeIds.map(async (templeId) => {
      const allAssignedUsers = [...newUsers, ...existingUsers];

      const res = await api.put(`/temples/${templeId}`, {
        data: {
          users: allAssignedUsers,
        },
      });
      return res.data;
    });

    await Promise.all(promises);
    return { success: true };
  } catch (error) {
    throw error.response?.data?.message || "Failed to assign users to temples";
  }
};

// Alternative single temple user assignment (if you need it)
export const assignUsersToSingleTemple = async (templeId, userIds) => {
  try {
    const res = await api.put(`/temples/${templeId}`, {
      data: {
        users: userIds,
      },
    });
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to assign users to temple";
  }
};
