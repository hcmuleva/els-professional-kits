import api from "./api";


export const getUsercontents = async (userid) => {
    try {
      const response = await api.get(`/usercontents?filters[createdby][id][$eq]=${userid}`, {
        params: {
         // 'filters[community][id][$eq]': communityId,
         // 'filters[temple][id][$eq]': templeId,
          'populate': '*'
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching community user roles:", error);
      return null;
    }
  };


export const createContent = (data) => {
  return api.post('/contents', { data }); // adjust if needed
};

export const getContentsByCourseId = (courseId) => {
  return api.get(`/contents?filters[course][id][$eq]=${courseId}`, {
    params: {
     // 'filters[community][id][$eq]': communityId,
     // 'filters[temple][id][$eq]': templeId,
      'populate': '*'
    }
  });
};