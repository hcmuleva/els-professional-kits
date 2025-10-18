import api from "./api";


export const getCourseList = async (data) => {
    try {
      const response = await api.get('/courses?populate=*')
      return response
    } catch (error) {
      console.error("Error creating course", error);
      throw error.response?.data?.message || "Error creating course";
    }
  };

export const createCourse = async (data) => {
    try {
      const response = await api.post('/courses', { data });
      return response.data;
    } catch (error) {
      console.error("Error creating course", error);
      throw error.response?.data?.message || "Error creating course";
    }
  };
  export const updateCourse=async(id,data)=>{
    try {
        const response =  await api.put(`/courses/${id}`, {data:data});
        return response.data   
    } catch (error) {
        throw error.response?.data?.message || "Error in update course"
    }
}
export const deleteCourse=async(id)=>{
    try {
        const response =  await api.delete(`/courses/${id}`);
        return response.data   
    } catch (error) {
        throw error.response?.data?.message || "Error in update course"
    }
}
export const getSingleUser = async ( userId ) => {
  try {
      const response = await api.get(`/users/${userId}`);
      return response.data;
  } catch (error) {
      throw error.response?.data?.message || "Failed to fetch business";
  }
}
export const getcustomcourses = async ( userId ) => {
  try {
      const response = await api.get(`/customcourse/${userId}`);
      return response.data;
  } catch (error) {
      throw error.response?.data?.message || "Failed to fetch business";
  }
}
 

