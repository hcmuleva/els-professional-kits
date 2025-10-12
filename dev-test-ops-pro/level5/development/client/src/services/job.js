import api from "./api";

export const getJobData = async () => {
    const response = await api.get("/jobs");
   return  response.data;
  
};

export const createJob = async (data) => {
    const response = await api.post("/Jobs", data);
    return response.data;
}
