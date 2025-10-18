import api from "./api";

export const getCommitteeData = async()=>{
    try {
        const response = await api.get('/committee-data')
        return response.data;
    } catch (error) {
        console.log("Error in getting committee")
        throw error.response?.data?.message || "Error in getting committee data"
    }
};

export const createCommittee = async(data)=>{
    try {
        const response = await api.post('/committees',{
            data
        })
        return response.data;
    } catch (error) {
        console.log("Error in creating committee")
        throw error.response?.data?.message || "Error in creating committee"
    }
};

export const updateCommittee = async(data,committee_id)=>{
    try {
        const response = await api.put(`/committees/${committee_id}`,{
            data
        })
        return response.data;
    } catch (error) {
        console.log("Error in updating committee")
        throw error.response?.data?.message || "Error in updating committee "
    }
};

export const deleteCommittee = async(committee_id)=>{
    try {
        const response = await api.delete(`/committees/${committee_id}`)
        return response.data;
    } catch (error) {
        console.log("Error in deleting committee")
        throw error.response?.data?.message || "Error in deleting committee "
    }
};


export const getCommittee = async(data)=>{
    try {
        const response = await api.get('/committees')
        return response.data;
    } catch (error) {
        console.log("Error in getting committee")
        throw error.response?.data?.message || "Error in getting committee"
    }
};

export const getSingleCommittee = async (committee_id) => {
  try {
    const response = await api.get(`/committees/${committee_id}`, {
      params: {
        populate: {
          users: {
            populate: 'addresses'
          }
        }
      }
    });
    return response.data;
  } catch (error) {
    console.error("🧨 Committee fetch failed:", error);
    throw error?.response?.data?.message || "⚠️ Couldn't retrieve committee data.";
  }
};

export const updateSingleCommittee = async(data, committee_id)=>{
    try {
        const response = await api.put(`/committees/${committee_id}`,{
            data
        })
        return response.data;
    } catch (error) {
        console.log("Error in getting committee")
        throw error.response?.data?.message || "Error in getting committee"
    }
};

export const addUserToCommittee = async (committeeId, userId) => {
  try {
    const response = await api.post(`/customcommittee/${committeeId}/add-user`, {
      userId,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding user to committee:", error);
    throw error.response?.data?.message || "Failed to add user";
  }
};