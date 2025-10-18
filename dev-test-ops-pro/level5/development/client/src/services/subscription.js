// src/services/subscription.js
import api from "./api";

export const getUserSubscriptions = async (userId) => {
  const res = await api.get(
    `/usersubscriptions?filters[user][id][$eq]=${userId}&populate=subcategory`
  );
  return res.data.data;
};

export const getAllCategoriesWithSubcategories = async () => {
  const res = await api.get("/categories?populate=subcategories");
  return res.data.data;
};

export const subscribeToSubcategories = async (userId, subcategoryIds) => {
  const results = await Promise.all(
    subcategoryIds.map((id) =>
      api.post("/usersubscriptions", {
        data: {
          user: userId,
          subcategory: id,
        },
      })
    )
  );
  return results;
};

export const getCategories = async () => {

    try {
      const response = await api.get(`/categories`, {
        params: {
          populate: "*", // Populates all relations
        },
       
      })
      return response.data
    } catch (err) {
      throw err.response?.data?.message || "Error in getting categories"
    }
  };


  export const customSubscribe = async (data) => {
    const response = await api.post("customsubscription/subscribe", {
        data: {
            ...data,
        },
        });
    return response.data;
 
};

  
