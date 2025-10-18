import api from "./api";

export const createEvent = async (payload) => {
    try {
        console.log("pahload for testing", payload.data);
        const response = await api.post("/events", payload);
        return response.data.data; // Return the actual event data

    } catch (error) {
        throw error.response?.data?.message || "Failed to create event";
    }
}

export const getEvents = async () => {
    try {
        const response = await api.get("/events", {
            params:{
                populate: "*"
            }
        });
        return response.data.data; // Return the actual event data

    } catch (error) {
        throw error.response?.data?.error?.message || "Failed to get events";
    }
}