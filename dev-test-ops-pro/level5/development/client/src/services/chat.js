import api from "./api";

// Get paginated messages for individual chat
export const getPaginatedUserChat = async (
  senderId,
  receiverId,
  page = 1,
  limit = 20
) => {
  try {
    const params = {
      senderId,
      receiverId,
      page,
      limit,
    };

    const response = await api.get("/customchat/conversation", { params });
    return response.data;
  } catch (error) {
    console.error("Error getting user chat:", error);
    throw error.response?.data?.error?.message || "Error getting user chat";
  }
};

// Get paginated messages for group chat
export const getPaginatedGroupChat = async (
  groupId,
  page = 1,
  limit = 20,
  userId = null
) => {
  try {
    const params = {
      groupId,
      page,
      limit,
    };

    // Add userId for membership validation if provided
    if (userId) {
      params.userId = userId;
    }

    const response = await api.get("/customchat/group-conversation", { params });
    return response.data;
  } catch (error) {
    console.error("Error getting group chat:", error);
    throw error.response?.data?.error?.message || "Error getting group chat";
  }
};

// Legacy unified function - kept for backward compatibility
export const getPaginatedChats = async (
  chatId,
  page = 1,
  limit = 20,
  isGroup = false,
  userId = null,
  receiverId = null
) => {
  try {
    if (isGroup) {
      return await getPaginatedGroupChat(chatId, page, limit, userId);
    } else {
      return await getPaginatedUserChat(userId, receiverId, page, limit);
    }
  } catch (error) {
    console.error("Error getting chats:", error);
    throw error;
  }
};

// Get user's chat list
export const getUserChatList = async (userId) => {
  try {
    const response = await api.get("/customchat/conversation-list", {
      params: { userId },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching chat list:", error);
    return [];
  }
};

// Get user's group chat list
export const getUserGroupChatList = async (userId) => {
  try {
    const response = await api.get("/customchat/group-conversation-list", {
      params: { userId },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching group chat list:", error);
    return [];
  }
};

// Send message to individual chat
export const sendUserMessage = async (senderId, receiverId, message) => {
  try {
    const payload = {
      sender: senderId,
      receiver: receiverId,
      message: message,
    };

    const response = await api.post("/customchat", payload);
    return response.data.data;
  } catch (error) {
    console.error("Error sending user message:", error);
    throw error.response?.data?.error?.message || "Error sending user message";
  }
};

// Send message to group chat
export const sendGroupMessage = async (senderId, groupId, message) => {
  try {
    const payload = {
      sender: senderId,
      groupchat: groupId,
      message: message,
    };
    const response = await api.post("/sendgroup", payload);
    return response.data.data;
  } catch (error) {
    console.error("Error sending group message:", error);
    throw error.response?.data?.error?.message || "Error sending group message";
  }
};

// Legacy unified send function - kept for backward compatibility
export const sendMessage = async (payload, isGroup = false) => {
  try {
    if (isGroup) {
      return await sendGroupMessage(payload.sender, payload.groupchat, payload.message);
    } else {
      return await sendUserMessage(payload.sender, payload.receiver, payload.message);
    }
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

// Get group chat details with members
export const getGroupChatDetails = async (groupId) => {
  try {
    const endpoint = groupId ? `/groupchats/${groupId}` : "/groupchats";
    const response = await api.get(endpoint, {
      params: {
        populate: {
          users_permissions_users: { populate: ["profile_picture", "avatar"] },
          chats: { populate: ["sender"] },
        },
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error getting group chat details:", error);
    throw error.response?.data?.error?.message || "Error getting group chat details";
  }
};

// Get individual chat details
export const getUserChatDetails = async (senderId, receiverId) => {
  try {
    const response = await api.get("/customchat/chat-details", {
      params: {
        senderId,
        receiverId,
        populate: {
          sender: { populate: ["profile_picture", "avatar"] },
          receiver: { populate: ["profile_picture", "avatar"] },
        },
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error getting user chat details:", error);
    throw error.response?.data?.error?.message || "Error getting user chat details";
  }
};

// Create or get individual chat
// export const getOrCreateUserChat = async (senderId, receiverId) => {
//   try {
//     const response = await api.post("/customchat/create-or-get", {
//       senderId,
//       receiverId,
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error creating/getting user chat:", error);
//     throw error.response?.data?.error?.message || "Error creating/getting user chat";
//   }
// };

export const createGroupChat = async (data) => {
  try {
    const response = await api.post("/groupchats",{
      data
    });
    return response.data;
  } catch (error) {
    console.error("Error creating group chat:", error);
    throw error.response?.data?.error?.message || "Error creating group chat";
  }
};


export const updateGroupChat = async (userId, groupId) => {
  try {
    const response = await api.put(`/groupchats/${groupId}`, {
      data: {
        users_permissions_users: {
          connect: [userId], // <- Append instead of overwrite
        },
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating group chat:", error);
    throw error.response?.data?.error?.message || "Error updating group chat";
  }
};

export const removeUserFromGroupChat = async (userId, groupId) => {
  try {
    const response = await api.put(`/groupchats/${groupId}`, {
      data: {
        users_permissions_users: {
          disconnect: [userId], // <- Remove user from group
        },
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error removing user from group chat:", error);
    throw error.response?.data?.error?.message || "Error removing user from group chat";
  }
};

// Fetch group members (new function)
export const fetchGroupMembers = async (groupId, start = 0, limit = 20, filters = {}) => {
  try {
    const params = new URLSearchParams({
      'pagination[start]': start.toString(),
      'pagination[limit]': limit.toString(),
      'populate': 'users_permissions_users.photos,users_permissions_users.profilePicture',
    });

    // Add filters if provided
    if (filters.$or) {
      filters.$or.forEach((filter, index) => {
        Object.keys(filter).forEach(key => {
          if (typeof filter[key] === 'object' && filter[key].$containsi) {
            params.append(`filters[$or][${index}][users_permissions_users][${key}][$containsi]`, filter[key].$containsi);
          }
        });
      });
    }

    const response = await api.get(`/groupchats/${groupId}?${params.toString()}`);
    
    // Extract members from the group chat response
    const groupData = response.data?.data;
    const members = groupData?.attributes?.users_permissions_users?.data || [];
    
    const formattedMembers = members.map(member => ({
      id: member.id,
      ...member.attributes,
      photos: member.attributes?.photos?.data?.attributes,
      profilePicture: member.attributes?.profilePicture?.data?.attributes,
    }));

    return {
      data: formattedMembers,
      pagination: {
        total: members.length, // Note: This might need adjustment based on your API
        start,
        limit,
      }
    };
  } catch (error) {
    console.error("Error fetching group members:", error);
    throw error.response?.data?.error?.message || "Error fetching group members";
  }
};
