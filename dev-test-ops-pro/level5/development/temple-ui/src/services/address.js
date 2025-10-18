import api from "./api";
export const createAddress = async (data) =>{
    try {
        const response = await api.post('/addresses', { data });
        return response.data;
      } catch (error) {
        console.error("Error creating address", error);
        throw error.response?.data?.message || "Error creating address";
      }
};
export const updateAddress=async(id,data)=>{
    try {
        const response =  await api.put(`/addresses/${id}`, {data:data});
        return response.data   
    } catch (error) {
        throw error.response?.data?.message || "Error in update Address"
    }
}
export const getAllAddresses=async()=>{
    try {
        const response =  await api.get(`/addresses?populate=*`);
        return response.data   
    } catch (error) {
        throw error.response?.data?.message || "Error in get Address"
    }
}

export const fetchUserAddresses=async(userId)=>{
    try {
        const response =  await api.get(`/users/${userId}`,{
            params:{
                populate:"addresses"
            }
        });
        return response.data   
    } catch (error) {
        throw error.response?.data?.message || "Error in get Address"
    }
}

export const deleteUserAddress=async(addressId)=>{
    try {
        const response =  await api.delete(`/addresses/${addressId}`);
        return response.data   
    } catch (error) {
        throw error.response?.data?.message || "Error in Delete Address"
    }
}