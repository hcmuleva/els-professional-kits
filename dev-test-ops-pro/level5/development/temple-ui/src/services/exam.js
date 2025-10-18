import api from "./api";

export const createExam = async (payload) => {
    try {
        const response = await api.post("/exams", {data:payload});
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to create exam";
    }
}

export const getExam = async () => {
    try {
        const response = await api.get("/exams", {
            params:{
                populate: "*"
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to get exam";
    }
}

export const getExamWithId = async (examId) => {
    try {
        const response = await api.get(`/exams/${examId}`, {
            params: {
                populate: {
                    questions: {
                        populate: "*" // Add any nested fields inside question
                    },
                }
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to get exam";
    }
};
