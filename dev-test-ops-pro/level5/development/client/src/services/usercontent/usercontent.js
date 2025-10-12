import api from "../api";
export const getUserContent = async()=>{
    try {
        const response = await api.get('/usercontents');
        return response.data; 
    } catch (error) {
     throw error.response?.data?.message || "Error in getting userconent"
    }
}