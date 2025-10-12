import api from "./api";

export const getSubcategoryDetails = async (templeId, subcategoryId) => {
  const res = await api.get(
    `/userroles?filters[temple][id][$eq]=${templeId}&filters[subcategory][id][$eq]=${subcategoryId}&populate[user][populate][0]=profilePicture&populate[categoryrole]=true`
  );
  return res.data.data;
};

export const deleteUserRole = async (userRoleId) => {
  try {
    const res = await api.delete(`/userroles/${userRoleId}`);
    return res.data;
  } catch (error) {
    console.error(
      "Error deleting user:",
      error.response?.data || error.message
    );
  }
};

export const getUserRole = async () => {
  const res = await api.get(`/users/me`, {
    params: {
      populate: {
        "*": true,
        userroles: {
          populate: "*",
        },
      },
    },
  });
  return res.data;
};
