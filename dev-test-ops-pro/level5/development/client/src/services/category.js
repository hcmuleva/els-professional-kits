import api from "./api";

export const createCategory = async (data) => {
    try {
      const response = await api.post('/categories', { data });
      return response.data;
    } catch (error) {
      console.error("Error creating category", error);
      throw error.response?.data?.message || "Error creating category";
    }
  };
  
export const getAllCategory =async()=>{
    try {
        const response = await api.get('/categories?populate=*&sort=updatedAt:desc')
        return response.data;
    } catch (error) {
        console.log("Error in getting category")
        throw error.response?.data?.message || "Error in getting category"
    }
};
export const updateCategory=async(id,data)=>{
    try {
        const response =  await api.put(`/categories/${id}`, {data:data});
        return response.data   
    } catch (error) {
        throw error.response?.data?.message || "Error in update category"
    }
}
export const deleteCategory=async(id)=>{
    try {
        const response =  await api.delete(`/categories/${id}`);
        return response.data   
    } catch (error) {
        throw error.response?.data?.message || "Error in update category"
    }
}