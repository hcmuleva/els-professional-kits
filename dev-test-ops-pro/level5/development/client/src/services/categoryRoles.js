import api from './api';



export const getRolesByCategory = async (categoryId) => {
   const res = await api.get(`categories/${categoryId}?sort=updatedAt:desc`,{
      params: {
       
         populate: {    
            categoryroles:{populate:['*']},            
         }
      }
   });
   return res.data;
 };
export const getCategoryById = (id) => api.get(`/categories/${id}`);
export const deleteRole = (roleId) => api.delete(`/categoryroles/${roleId}`);
export const updateRole = (id, data) => api.put(`/categoryroles/${id}`, { data });
export const createRoleForCategory = (payload) => api.post(`/categoryroles`, {
  payload,
});
