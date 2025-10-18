import api from "./api";
  export const getAllSubCategories = async ( filters) => {

    
    const res = await api.get("/subcategories", {
      params: {
        filters: {
          temples: { id: filters.templeId },
        },
        populate: {
          subcategory: { populate: ["*"] },
        },
      },
    });
    return res.data;
  };
  
  export const createSubCategory = async (categoryId, data) => {
    return await api.post(`/subcategories`, {
      data: {
        ...data,
        category: categoryId,
      },
    });
  };
  
  export const updateSubCategory = async (id, data) => {
    return await api.put(`/subcategories/${id}`, { data });
  };
  
  export const deleteSubCategory = async (id) => {
    return await api.delete(`/subcategories/${id}`);
  };
  