import dayjs from "dayjs";
import api from "./api";
// import { ca } from "date-fns/locale";

export const uploadImage = async (formData) => {
  try {
    const uploadResponse = await api.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Upload successful:", uploadResponse);
    return uploadResponse.data;
  } catch (error) {
    console.error("Upload failed:", error.message);
    throw error;
  }
};

export const getSingleTemple = async (templeId) => {
  try {
    // console.log("Sending update:", { photos: photoIds });

    const response = await api.get(`/temples/${templeId}`, {
      params: {
        populate: {
          images: true, // Assuming 'images' is a media field or media relation
          address: true, // Assuming 'address' is a relation or component
        },
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

export const assignRoleToUser = async (payload) => {
  const response = await api.post(`/communityuserroles`, { data: payload });
  return response.data;
};

export const fetchRoles = async (communityId) => {
  try {
    const response = await api.get(
      `/communityroles?filters[community][id][$eq]=${communityId}`,
      {
        params: {
          populate: "*",
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

export const getMyCommunities = async (userId) => {
  try {
    const response = await api.get("/communityuserroles", {
      params: {
        filters: {
          users_permissions_user: {
            id: {
              $eq: userId,
            },
          },
        },
        populate: "*",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch community";
  }
};

export const getCommunityUserRoles = async (communityId, templeId) => {
  try {
    const response = await api.get(`/communityuserroles`, {
      params: {
        "filters[community][id][$eq]": communityId,
        "filters[temple][id][$eq]": templeId,
        populate: "*",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching community user roles:", error);
    return null;
  }
};

export const getAssignedUnAssginedSubcategories = async (
  id,
  selectedCategoryId
) => {
  console.log(
    "getAssignedUnAssginedSubcategories called with id:",
    id,
    "and selectedCategoryId:",
    selectedCategoryId
  );

  // 1. Get all assigned subcategories from temple
  const templesubcat = await api.get(
    `/temples/${id}?populate[subcategories]=*`
  );
  const assignedAll =
    templesubcat.data?.data.attributes.subcategories?.data.map((item) => ({
      id: item.id,
      ...item.attributes,
    })) || [];

  // 2. Get subcategories from selected category
  const templecat = await api.get(
    `/categories/${selectedCategoryId}?populate[subcategories]=*`
  );
  const allSubcategories =
    templecat.data?.data.attributes.subcategories?.data.map((item) => ({
      id: item.id,
      ...item.attributes,
    })) || [];

  console.log("templecat (category-scoped subcategories)", allSubcategories);

  // 3. Filter assigned subcategories to include only those in selected category
  const allowedIds = new Set(allSubcategories.map((item) => item.id));
  const assigned = assignedAll.filter((item) => allowedIds.has(item.id));

  // 4. Derive unassigned subcategories by subtracting assigned from all
  const assignedIds = new Set(assigned.map((item) => item.id));
  const unassignedSubcategories = allSubcategories.filter(
    (item) => !assignedIds.has(item.id)
  );

  const responsedata = {
    assigned,
    unassigned: unassignedSubcategories,
  };

  return responsedata ?? [];
};

export const updateTempleSubcategories = async (
  newsubcategories,
  existingsubcategories,
  removesubcategories,
  templeid
) => {
  const response = await api.post(
    `/custom-community/temple-subcategories
`,
    {
      data: {
        newsubcategories,
        existingsubcategories,
        removesubcategories,
        templeid,
      },
    }
  );
  console.log("updateTempleSubcategories", response.data);
  return response.data;
};
export const getAssginedCommunityToTemple = async ({ id }) => {
  try {
    const response = await api.post(
      `/custom-community/temple-subcategories-usercount
`,
      {
        templeId: id,
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Community Update failed";
  }
};

export const getUsersToSubcategory = async ({ templeid, subcategoryid }) => {
  try {
    const response = await api.get("/userroles", {
      params: {
        filters: {
          temple: { id: { $eq: templeid } },
          subcategory: { id: { $eq: subcategoryid } },
        },
        populate: {
          role: { populate: ["*"] },
          subcategory: { populate: ["*"] },
          user: {
            populate: ["profilePicture"],
          },
        },
      },
    });
    return response.data;
  } catch (error) {
    throw error?.response?.data?.message || "Unable to get users";
  }
};

export const getCustomCommunityUsers = async (templeId, subcategoryId) => {
  const res = await api.get(`/custom-community/community-users`, {
    params: { templeId, subcategoryId },
  });
  return res.data;
};

export const updateCustomCommunityUsers = async ({
  templeId,
  subcategoryId,
  assignedUserIds,
}) => {
  return api.post("/custom-community/community-users", {
    templeId,
    subcategoryId,
    assignedUserIds,
  });
};
export const updateUserRole = async (userObject) => {
  const { userroleId, status, categoryRoleId, start, enddate } = userObject;
  return api.put(`/userroles/${userroleId}`, {
    data: {
      status,
      categoryrole: categoryRoleId, // ensure correct key
      start,
      enddate,
    },
  });
};

export const getTempleUserWithStatus = async (templeId) => {
  try {
    const response = await api.post(
      `/custom-community/temple-users-with-status`,
      {
        templeId,
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Unable to get users";
  }
};

export const AssignUserToTempleCommunity = async ({
  templeId,
  subcategoryId,
  userId,
}) => {
  try {
    const response = api.post("/userroles", {
      data: {
        temple: templeId,
        subcategory: subcategoryId,
        user: userId,
      },
    });
    return response.data;
  } catch (error) {
    throw error?.response?.data?.message || "Unable to assign user";
  }
};
