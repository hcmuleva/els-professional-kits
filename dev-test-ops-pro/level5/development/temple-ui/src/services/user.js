import api from "./api";
import qs from "qs";
export const updateUserProfile = async (userId, data) => {
  try {
    // console.log("Sending update:", { photos: photoIds });
    const response = await api.put(`/users/${userId}`, data);
    return response.data;
  } catch (error) {
    console.error(
      "Strapi update error:",
      error.response?.data || error.message
    );
    throw error.response?.data?.message || "Update failed";
  }
};

export const getUserData = async () => {
  try {
    const response = await api.get(`/users/me`, {
      params: {
        populate: "*",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Strapi get error:", error.response?.data || error.message);
    throw error.response?.data?.message || "get failed";
  }
};

export const customUpdateUserStatusRoleData = async (userId, data) => {
  try {
    const response = await api.put(`/customupdateuser/${userId}`, {
      data,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Strapi update error:",
      error.response?.data || error.message
    );
    throw error.response?.data?.message || "update failed";
  }
};

export const resetpassword = async (userId, newPassword) => {
  try {
    const response = await api.post("/reset-password", {
      userId, // can be email or username
      newPassword,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Reset Password failed";
  }
};

export const getDivanData = async () => {
  try {
    const response = await api.get(`/divans`);
    return response.data;
  } catch (error) {
    console.error("Strapi get error:", error.response?.data || error.message);
    throw error.response?.data?.message || "get failed";
  }
};
export const setDivanData = async (data) => {
  try {
    const response = await api.post(`/divans`, {
      data,
    });
    return response.data;
  } catch (error) {
    console.error("Strapi get error:", error.response?.data || error.message);
    throw error.response?.data?.message || "set failed";
  }
};
export const updateDivanData = async (data, divanId) => {
  try {
    const response = await api.put(`/divans/${divanId}`, {
      data,
    });
    return response.data;
  } catch (error) {
    console.error("Strapi get error:", error.response?.data || error.message);
    throw error.response?.data?.message || "update failed";
  }
};

export const searchUserWithQuery = async (searchTerm) => {
  const isNumeric = /^\d+$/.test(searchTerm); // simple check for numeric ID

  try {
    const filters = {
      $or: [
        {
          first_name: {
            $containsi: searchTerm,
          },
        },
        {
          mobile: {
            $containsi: searchTerm,
          },
        },
        {
          username: {
            $containsi: searchTerm,
          },
        },
        {
          email: {
            $containsi: searchTerm,
          },
        },
      ],
    };
    if (isNumeric) {
      filters.$or.push({
        id: {
          $eq: parseInt(searchTerm, 10),
        },
      });
    }

    const query = qs.stringify(
      {
        filters,
        pagination: {
          page: 1,
          pageSize: 50,
        },
      },
      {
        encodeValuesOnly: true,
      }
    );

    const res = await api.get(`/users?${query}`);
    return res.data;
  } catch (error) {
    console.error("Search error:", error);
    throw error.response?.data?.message || "Failed to get user";
  }
};

export const fetchOrgUsersList = async (start, limit, orgId) => {
  try {
    const response = await api.get(`/orgs/${orgId}`, {
      params: {
        _start: start,
        _limit: limit,
        _sort: "id:DESC",
        populate: "users",
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Strapi update error:",
      error.response?.data || error.message
    );
    throw error.response?.data?.message || "Get failed";
  }
};

export const fetchUserById = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`, {
      params: {
        populate: ["org", "user_org", "user_professions", "addresses"],
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching user by ID:",
      error.response?.data || error.message
    );
    throw error.response?.data?.message || "User fetch failed";
  }
};

export const fetchPaginatedUsersList = async (
  start = 0,
  limit = 10,
  filters = {}
) => {
  try {
    const mappedFilters = {};

    // Only add orgId filter if it exists
    if (filters.groupId) {
      mappedFilters.$and = [
        {
          $or: [
            { groupchats: { id: { $ne: filters.groupId } } },
            { groupchats: { id: { $null: true } } },
          ],
        },
      ];
    }

    if (filters.orgId) {
      mappedFilters.orgs = { id: { $eq: filters.orgId } };
    }

    // Only add committee_role filter if it's not empty/undefined
    if (filters.committee_role !== undefined && filters.committee_role !== "") {
      mappedFilters.committee_role = { $eq: filters.committee_role };
    }

    // Add other filters only if they exist and are not empty
    if (filters.education) {
      mappedFilters.$or = [
        { user_org: { degree: { $containsi: filters.education } } },
        { user_org: { degree_level: { $eqi: filters.education } } },
        { user_org: { branch: { $containsi: filters.education } } },
      ];
    }

    if (filters.occupation) {
      mappedFilters.occupation = { $eq: filters.occupation.toUpperCase() };
    }

    if (filters.education_level) {
      mappedFilters.user_org = {
        degree_level: { $eq: filters.education_level },
      };
    }

    if (filters.profession) {
      mappedFilters.$or = [
        { profession: { $eq: filters.profession } },
        { user_professions: { role: { $eq: filters.profession } } },
        { user_professions: { type: { $eq: filters.profession } } },
        { user_professions: { category: { $eq: filters.profession } } },
        { user_professions: { subcategory: { $eq: filters.profession } } },
      ];
    }

    if (filters.location) {
      mappedFilters.$or = [
        { addresses: { district: { $containsi: filters.location } } },
        { addresses: { state: { $containsi: filters.location } } },
        { addresses: { country: { $containsi: filters.location } } },
        { addresses: { village: { $containsi: filters.location } } },
        { addresses: { tehsil: { $containsi: filters.location } } },
        {
          addresses: {
            pincode: { $eq: parseInt(filters.location) || 0 },
          },
        },
      ];
    }

    if (filters.address) {
      mappedFilters.$or = [
        { addresses: { address_raw: { $containsi: filters.address } } },
        { addresses: { housename: { $containsi: filters.address } } },
        { addresses: { landmark: { $containsi: filters.address } } },
        { addresses: { district: { $containsi: filters.address } } },
        { addresses: { state: { $containsi: filters.address } } },
        { addresses: { country: { $containsi: filters.address } } },
        { addresses: { village: { $containsi: filters.address } } },
        { addresses: { tehsil: { $containsi: filters.address } } },
      ];
    }

    if (filters.semester) {
      mappedFilters.user_org = { semester: { $eq: filters.semester } };
    }

    if (filters.year) {
      mappedFilters.user_org = { year: { $eq: filters.year } };
    }

    if (filters.start_date) {
      mappedFilters.user_org = { start_date: { $gte: filters.start_date } };
    }

    if (filters.end_date) {
      mappedFilters.user_org = {
        end_date: {
          $lte: new Date(
            new Date(filters.end_date).setFullYear(
              new Date(filters.end_date).getFullYear() + 1
            )
          ).toISOString(),
        },
      };
    }

    // Clean up any undefined/null values
    Object.keys(mappedFilters).forEach((key) => {
      if (mappedFilters[key] == null) {
        delete mappedFilters[key];
      }
    });

    const params = {
      pagination: {
        start: start,
        limit: limit,
      },
      sort: ["id:desc"],
      populate: [
        "photos",
        "profilePicture",
        "user_org",
        "user_professions",
        "addresses",
        "orgs",
        "role",
      ],
    };

    // Only add filters if there are any
    if (Object.keys(mappedFilters).length > 0) {
      params.filters = mappedFilters;
    }

    console.log("API Request params:", JSON.stringify(params, null, 2));

    const response = await api.get("/users", { params });
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching paginated users:",
      error.response?.data || error.message
    );
    throw error.response?.data?.error || { message: "Fetch failed" };
  }
};

export const uploadImage = async (formData, jwt) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `Upload failed with status: ${response.status}`
      );
    }

    const data = await response.json();

    if (!data || !Array.isArray(data) || data.length === 0) {
      throw new Error("Invalid response from server");
    }

    return data;
  } catch (error) {
    console.error("Upload error:", error);
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      throw new Error("Network error. Please check your connection.");
    }
    throw error;
  }
};

export const searchUsers = async (
  searchQuery,
  start = 0,
  limit = 10,
  filters = {}
) => {
  try {
    // 1) Base full‐text search on username/email/…/org.name
    const searchFilters = {
      $or: [
        { username: { $containsi: searchQuery } },
        { email: { $containsi: searchQuery } },
        { first_name: { $containsi: searchQuery } },
        { last_name: { $containsi: searchQuery } },
        { occupation: { $containsi: searchQuery } },
        { mobile: { $containsi: searchQuery } },
        { addresses: { address_raw: { $containsi: searchQuery } } },
        { addresses: { housename: { $containsi: searchQuery } } },
        { addresses: { landmark: { $containsi: searchQuery } } },
        { addresses: { district: { $containsi: searchQuery } } },
        { addresses: { state: { $containsi: searchQuery } } },
        { addresses: { country: { $containsi: searchQuery } } },
        { addresses: { village: { $containsi: searchQuery } } },
        { addresses: { tehsil: { $containsi: searchQuery } } },
        { addresses: { pincode: { $eq: parseInt(searchQuery) || 0 } } },
        { org: { name: { $containsi: searchQuery } } },
      ],
    };

    // 2) Build nested “education” filters (if provided)
    const educationClause = filters.education
      ? {
          $or: [
            { user_org: { degree: { $containsi: filters.education } } },
            { user_org: { degree_level: { $eqi: filters.education } } },
            { user_org: { branch: { $containsi: filters.education } } },
          ],
        }
      : null;

    // 3) Build nested “profession” filters (if provided)
    const professionClause = filters.profession
      ? {
          $or: [
            {
              user_professions: {
                profession_type: { $containsi: filters.profession },
              },
            },
            {
              user_professions: {
                category: { $containsi: filters.profession },
              },
            },
            {
              user_professions: {
                subcategory: { $containsi: filters.profession },
              },
            },
            { user_professions: { role: { $containsi: filters.profession } } },
          ],
        }
      : null;

    // 4) Top‐level occupation (exact, uppercase)
    const occupationClause = filters.occupation
      ? { occupation: { $eq: filters.occupation.toUpperCase() } }
      : null;

    // 5) Location + address filters (unchanged)
    const locationClause = filters.location
      ? {
          $or: [
            { addresses: { district: { $containsi: filters.location } } },
            { addresses: { state: { $containsi: filters.location } } },
            { addresses: { country: { $containsi: filters.location } } },
            { addresses: { village: { $containsi: filters.location } } },
            { addresses: { tehsil: { $containsi: filters.location } } },
            {
              addresses: { pincode: { $eq: parseInt(filters.location) || 0 } },
            },
          ],
        }
      : null;

    const addressClause = filters.address
      ? {
          $or: [
            { addresses: { address_raw: { $containsi: filters.address } } },
            { addresses: { housename: { $containsi: filters.address } } },
            { addresses: { landmark: { $containsi: filters.address } } },
            { addresses: { district: { $containsi: filters.address } } },
            { addresses: { state: { $containsi: filters.address } } },
            { addresses: { country: { $containsi: filters.address } } },
            { addresses: { village: { $containsi: filters.address } } },
            { addresses: { tehsil: { $containsi: filters.address } } },
          ],
        }
      : null;

    // 6) Semester / Year / Date‐range on user_org (unchanged)
    const semesterClause = filters.semester
      ? { user_org: { semester: { $eq: filters.semester } } }
      : null;
    const yearClause = filters.year
      ? { user_org: { year: { $eq: filters.year } } }
      : null;
    const startDateClause = filters.start_date
      ? { user_org: { start_date: { $gte: filters.start_date } } }
      : null;
    const endDateClause = filters.end_date
      ? {
          user_org: {
            end_date: {
              $lte: new Date(
                new Date(filters.end_date).setFullYear(
                  new Date(filters.end_date).getFullYear() + 1
                )
              ).toISOString(),
            },
          },
        }
      : null;

    // 7) Gather all non‐null clauses into an array
    const nonNullClauses = [
      educationClause,
      professionClause,
      occupationClause,
      locationClause,
      addressClause,
      semesterClause,
      yearClause,
      startDateClause,
      endDateClause,
    ].filter((clause) => clause !== null);

    // 8) Combine full‐text search + all additional filters under a single $and
    const combinedFilters = nonNullClauses.length
      ? { $and: [searchFilters, ...nonNullClauses] }
      : searchFilters;

    // 9) Build final params
    const params = {
      _start: start,
      _limit: limit,
      filters: combinedFilters,
      _sort: "id:DESC",
      populate: [
        "photos",
        "profilePicture",
        "user_org",
        "user_professions",
        "addresses",
        "org",
        "role",
      ],
    };

    const response = await api.get("/users", { params });
    return response.data;
  } catch (error) {
    console.error(
      "Error searching users:",
      error.response?.data || error.message
    );
    throw error.response?.data?.message || "Search failed";
  }
};

// Helper function to build filters for search
const buildFiltersForSearch = (filters) => {
  const mappedFilters = {};

  if (filters.profession) {
    mappedFilters.Profession = { $containsi: filters.profession };
  }

  if (filters.location) {
    mappedFilters.$or = [
      { addresses: { district: { $containsi: filters.location } } },
      { addresses: { state: { $containsi: filters.location } } },
      { addresses: { country: { $containsi: filters.location } } },
      { addresses: { village: { $containsi: filters.location } } },
      { addresses: { tehsil: { $containsi: filters.location } } },
      { addresses: { pincode: { $eq: parseInt(filters.location) || 0 } } },
    ];
  }

  if (filters.address) {
    const addressFilters = [
      { addresses: { address_raw: { $containsi: filters.address } } },
      { addresses: { housename: { $containsi: filters.address } } },
      { addresses: { landmark: { $containsi: filters.address } } },
      { addresses: { district: { $containsi: filters.address } } },
      { addresses: { state: { $containsi: filters.address } } },
      { addresses: { country: { $containsi: filters.address } } },
      { addresses: { village: { $containsi: filters.address } } },
      { addresses: { tehsil: { $containsi: filters.address } } },
    ];

    mappedFilters.$or = mappedFilters.$or
      ? [...mappedFilters.$or, ...addressFilters]
      : addressFilters;
  }

  if (filters.semester) {
    mappedFilters["user_org.semester"] = { $eq: filters.semester };
  }

  if (filters.year) {
    mappedFilters["user_org.year"] = { $eq: filters.year };
  }

  if (filters.occupation) {
    mappedFilters.occupation = { $eq: filters.occupation.toUpperCase() };
  }

  if (filters.start_date) {
    mappedFilters["user_org.start_date"] = { $gte: filters.start_date };
  }

  if (filters.end_date) {
    mappedFilters["user_org.end_date"] = {
      $lte: new Date(
        new Date(filters.end_date).setFullYear(
          new Date(filters.end_date).getFullYear() + 1
        )
      ).toISOString(),
    };
  }

  return mappedFilters;
};

export const deleteSingleUser = async (id) => {
  try {
    const response = await api.delete(`/users/${id}`);
    return response;
  } catch (error) {
    console.error("Error delete users:", error.response?.data || error.message);
    throw error.response?.data?.message || "Search delete";
  }
};

export const getSingleUser = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`, {
      params: {
        populate: "*",
      },
    });
    return response;
  } catch (error) {
    console.error("Error getting user:", error.response?.data || error.message);
  }
};

export const searchUserByMobile = async (search) => {
  try {
    const response = await api.get(`/users`, {
      params: {
        filters: {
          mobile: { $containsi: search },
        },
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error searching user by mobile:",
      error.response?.data || error.message
    );
    throw error.response?.data?.message || "Search failed";
  }
};
