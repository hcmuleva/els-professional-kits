import api from "./api";
import { fetchPaginatedUsersList } from "./user";

export const getProfessionTypes = async () => {
  try {
    const response = await api.get("/profession-categories");
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch Professions";
  }
};

export const getProfessionsUser = async (type, templeId) => {
  console.log(templeId);
  try {
    const response = await api.get("/user-professions", {
      params: {
        populate: "*",
        filters: {
          profession_type: {
            $eq: type,
          },
          user: {
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
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch Professions";
  }
};

export const setUserProfession = async (data) => {
  try {
    const response = await api.post("/user-professions", {
      data: {
        ...data,
        user: { connect: [data.user] }, // Transform user ID to relation format
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to Create Profession";
  }
};

export const updateUserProfession = async (professionId, data) => {
  try {
    const response = await api.put(`/user-professions/${professionId}`, {
      data: {
        ...data,
        user: { connect: [data.user] },
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to Update Profession";
  }
};

export const deleteUserProfession = async (professionId) => {
  try {
    const response = await api.delete(`/user-professions/${professionId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to Delete Profession";
  }
};

export const getUserProfession = async (userId) => {
  try {
    const response = await api.get("/user-professions", {
      params: {
        filters: {
          user: {
            id: {
              $eq: userId,
            },
          },
        },
        populate: ["address"], // or populate: '*' to fetch everything
      },
    });
    return response.data; // check this - may need to return response.data.data
  } catch (error) {
    throw error.response?.data?.error?.message || "Failed to get Profession";
  }
};

export const fetchProfessionStatistics = async () => {
  try {
    // Fetch all users to calculate profession statistics
    const response = await fetchPaginatedUsersList(0, 1000);
    const users = response.data;

    // Calculate profession statistics
    const professionCounts = {};

    users.forEach((user) => {
      const profession =
        user.profession ||
        user?.user_professions?.role ||
        user?.user_professions?.type;
      if (profession && profession !== "N/A") {
        professionCounts[profession] = (professionCounts[profession] || 0) + 1;
      }
    });

    // Convert to array and sort by count
    const sortedProfessions = Object.entries(professionCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    return {
      data: sortedProfessions,
      total: users.length,
    };
  } catch (error) {
    console.error("Error fetching profession statistics:", error);
    throw error;
  }
};
