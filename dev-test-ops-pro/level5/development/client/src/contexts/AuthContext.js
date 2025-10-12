// src/context/AuthContext.js
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  useRef,
} from "react";
import ably from "../utils/ablyClient";
import { getUserData } from "../services/user";
import { getUserRole } from "../services/userrole";

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // --- state init ---
  const [jwt, setJwt] = useState(() => localStorage.getItem("jwt") || null);
  const [user, setUser] = useState(() => {
    try {
      const userData = localStorage.getItem("user");
      return userData ? JSON.parse(userData) : null;
    } catch (e) {
      console.error("Error parsing user:", e);
      return null;
    }
  });
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem("authenticated") === "true"
  );
  const [profileUpdated, setProfileUpdated] = useState(false);
  const [profiles, setProfiles] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("profiles")) || {};
    } catch (e) {
      return {};
    }
  });
  const [isAccountActive, setIsAccountActive] = useState(true);

  // Notification related
  const [notifications, setNotifications] = useState({});
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);
  const [hasNewAnnouncement, setHasNewAnnouncement] = useState(false);
  const processedMessageIds = useRef(new Set());
  const audioContextRef = useRef(null);

  // ---------------------------
  // normalize /users/me response
  // ---------------------------
  const normalizeUserData = (me = {}) => {
    const normalized = { ...me };

    // admin detection
    const settingjson = me?.settingjson || {};
    const combinedAdminItems = [
      ...(settingjson.temples || []),
      ...(settingjson.course || []),
    ];
    const contentitem = settingjson?.content;
    const adminItem = combinedAdminItems.find(
      (t) => t.role === "ADMIN" || t.role === "Author" || t.role === "Co-author"
    );

    if (adminItem || contentitem) {
      normalized.admin = true;
      if (adminItem?.temple) normalized.templeadminrole = adminItem.temple;
      if (contentitem) normalized.contentadminrole = contentitem;
      if (settingjson?.course) normalized.courseadminrole = settingjson.course;
    } else {
      normalized.admin = normalized.admin ?? false;
      normalized.templeadminrole = normalized.templeadminrole ?? null;
    }

    normalized.userroles =
      normalized.userroles ||
      normalized.user_roles ||
      normalized.userroles ||
      [];
    normalized.orgs = normalized.orgs || normalized.orgs || [];
    normalized.temples = normalized.temples || normalized.temples || [];

    if (!normalized.profilePicture && normalized.avatar) {
      normalized.profilePicture = normalized.avatar;
    }

    normalized.role =
      normalized.role ||
      normalized.roles ||
      normalized.user_role ||
      normalized.role;

    normalized.groupchats = normalized.groupchats || [];
    normalized.photos = normalized.photos ?? null;
    normalized.family = normalized.family ?? null;

    return normalized;
  };

  // ---------------------------
  // audio notification
  // ---------------------------
  const playNotificationSound = useCallback(() => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext ||
          window.webkitAudioContext)();
      }
      const audioContext = audioContextRef.current;
      if (audioContext.state === "suspended") {
        const resumeAudio = () => {
          audioContext.resume().then(() => {
            const o = audioContext.createOscillator();
            const g = audioContext.createGain();
            o.connect(g);
            g.connect(audioContext.destination);
            o.frequency.value = 800;
            o.type = "sine";
            g.gain.setValueAtTime(0, audioContext.currentTime);
            g.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.1);
            g.gain.exponentialRampToValueAtTime(
              0.01,
              audioContext.currentTime + 0.5
            );
            o.start(audioContext.currentTime);
            o.stop(audioContext.currentTime + 0.5);
          });
          document.removeEventListener("click", resumeAudio);
        };
        document.addEventListener("click", resumeAudio);
      } else {
        const o = audioContext.createOscillator();
        const g = audioContext.createGain();
        o.connect(g);
        g.connect(audioContext.destination);
        o.frequency.value = 800;
        o.type = "sine";
        g.gain.setValueAtTime(0, audioContext.currentTime);
        g.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.1);
        g.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 0.5
        );
        o.start(audioContext.currentTime);
        o.stop(audioContext.currentTime + 0.5);
      }
    } catch (err) {
      console.error("Audio notification not supported:", err);
    }
  }, []);

  // ---------------------------
  // notifications helpers
  // ---------------------------
  const saveNotifications = useCallback((notificationsObj) => {
    try {
      const dedup = {};
      Object.keys(notificationsObj).forEach((subcategoryId) => {
        const seen = new Set();
        dedup[subcategoryId] = notificationsObj[subcategoryId].filter((n) => {
          if (seen.has(n.id)) return false;
          seen.add(n.id);
          return true;
        });
        if (dedup[subcategoryId].length === 0) delete dedup[subcategoryId];
      });
      if (Object.keys(dedup).length === 0)
        localStorage.removeItem("categoryNotifications");
      else localStorage.setItem("categoryNotifications", JSON.stringify(dedup));

      // cross-tab (storage) + same-tab custom event
      try {
        window.dispatchEvent(new Event("storage"));
      } catch {}
      try {
        window.dispatchEvent(new Event("localNotificationsUpdate"));
      } catch {}
    } catch (err) {
      console.error("Error saving notifications:", err);
    }
  }, []);

  const loadNotifications = useCallback(() => {
    try {
      const stored =
        JSON.parse(localStorage.getItem("categoryNotifications")) || {};
      const dedup = {};
      let totalUnread = 0;
      Object.keys(stored).forEach((subcategoryId) => {
        const seen = new Set();
        dedup[subcategoryId] = (stored[subcategoryId] || []).filter((n) => {
          if (seen.has(n.id)) return false;
          seen.add(n.id);
          return true;
        });
        totalUnread += dedup[subcategoryId].filter((n) => !n.read).length;
      });
      setNotifications(dedup);
      setTotalUnreadCount(totalUnread);
      setHasNewAnnouncement(totalUnread > 0);
    } catch (err) {
      console.error("Error loading notifications:", err);
    }
  }, []);

  const generateMessageId = useCallback((message) => {
    return `announcement-${
      message.data?.id || message.timestamp || Date.now()
    }`;
  }, []);

  const handleNewAnnouncement = useCallback(
    (message) => {
      const messageId = generateMessageId(message);
      if (processedMessageIds.current.has(messageId)) return;
      processedMessageIds.current.add(messageId);
      if (processedMessageIds.current.size > 100) {
        processedMessageIds.current = new Set(
          Array.from(processedMessageIds.current).slice(-100)
        );
      }

      const subcategoryId =
        message.data?.subcategory ||
        message.channel?.split(":").pop() ||
        "general";
      const notification = {
        id: messageId,
        title: message.data?.title || "New Announcement",
        content: message.data?.description || message.data?.content || "",
        timestamp: message.timestamp || Date.now(),
        read: false,
        subcategoryId,
        templeid: message.data?.templeid,
        ...message.data,
      };

      setNotifications((prev) => {
        const updated = { ...prev };
        if (!updated[subcategoryId]) updated[subcategoryId] = [];
        if (updated[subcategoryId].some((n) => n.id === notification.id))
          return prev;
        updated[subcategoryId] = [
          notification,
          ...updated[subcategoryId],
        ].slice(0, 50);
        saveNotifications(updated);
        setTotalUnreadCount((p) => p + 1);
        setHasNewAnnouncement(true);
        playNotificationSound();
        return updated;
      });
    },
    [generateMessageId, saveNotifications, playNotificationSound]
  );

  const resetNotifications = useCallback(() => {
    setNotifications((prev) => {
      const updated = { ...prev };
      let hasChanges = false;
      Object.keys(updated).forEach((cat) => {
        if (Array.isArray(updated[cat])) {
          updated[cat] = updated[cat].map((n) => {
            if (!n.read) {
              hasChanges = true;
              return { ...n, read: true };
            }
            return n;
          });
        }
      });
      if (hasChanges) saveNotifications(updated);
      return updated;
    });
    setTotalUnreadCount(0);
    setHasNewAnnouncement(false);
  }, [saveNotifications]);

  const markAsRead = useCallback(
    (subcategoryId, clearRead = true) => {
      setNotifications((prev) => {
        const updated = { ...prev };
        const categoryNotifications = updated[subcategoryId] || [];
        const hasUnread = categoryNotifications.some((n) => !n.read);
        if (hasUnread || clearRead) {
          const readMarked = categoryNotifications.map((n) => ({
            ...n,
            read: true,
          }));
          if (clearRead) {
            const unread = readMarked.filter((n) => !n.read); // will be none
            if (unread.length > 0) updated[subcategoryId] = unread;
            else delete updated[subcategoryId];
          } else {
            updated[subcategoryId] = readMarked;
          }
          saveNotifications(updated);
        }
        let totalUnread = 0;
        Object.values(updated).forEach((notifs) => {
          totalUnread += notifs.filter((n) => !n.read).length;
        });
        setTotalUnreadCount(totalUnread);
        setHasNewAnnouncement(totalUnread > 0);
        return updated;
      });
    },
    [saveNotifications]
  );

  // getNotifications now returns in-memory state
  const getNotifications = useCallback(
    (subcategoryId) => {
      return notifications[subcategoryId] || [];
    },
    [notifications]
  );

  // ---------------------------
  // fetch user from server
  // ---------------------------
  const fetchUser = useCallback(
    async (options = { force: false, token: null }) => {
      try {
        const token = options.token || jwt;
        if (!token) {
          console.warn("fetchUser: no JWT available");
          return null;
        }
        const res = await getUserData();
        const normalized = normalizeUserData(res);
        setUser(normalized);
        localStorage.setItem("user", JSON.stringify(normalized));
        setIsAuthenticated(true);
        localStorage.setItem("authenticated", "true");
        setProfiles((prev) => {
          const copy = { ...(prev || {}) };
          copy[normalized?.id] = { jwt: token, user: normalized };
          localStorage.setItem("profiles", JSON.stringify(copy));
          localStorage.setItem("activeprofile", normalized?.id);
          return copy;
        });
        return normalized;
      } catch (err) {
        console.error("Failed to fetch /users/me:", err);
        if (err?.response?.status === 401) {
          logout();
        }
        return null;
      }
    },
    [jwt]
  );

  // ---------------------------
  // login / logout / profile helpers
  // ---------------------------
  const login = async (jwtToken, userFromAuthResponse = null) => {
    try {
      setJwt(jwtToken);
      localStorage.setItem("jwt", jwtToken);

      if (userFromAuthResponse) {
        const temp = normalizeUserData(userFromAuthResponse);
        setUser(temp);
      }

      const fresh = await fetchUser({ token: jwtToken, force: true });
      setProfileUpdated(false);

      setProfiles((prev) => {
        const updated = { ...(prev || {}) };
        if (fresh) updated[fresh.id] = { jwt: jwtToken, user: fresh };
        localStorage.setItem("profiles", JSON.stringify(updated));
        localStorage.setItem(
          "activeprofile",
          fresh?.id ?? (userFromAuthResponse?.id || null)
        );
        return updated;
      });

      setIsAuthenticated(true);
      return { jwt: jwtToken, user: fresh || userFromAuthResponse || null };
    } catch (err) {
      console.error("login error:", err);
      throw err;
    }
  };

  const logout = () => {
    setJwt(null);
    setUser(null);
    setIsAuthenticated(false);
    setProfileUpdated(false);
    setNotifications({});
    setTotalUnreadCount(0);
    setHasNewAnnouncement(false);
    setProfiles({});
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    localStorage.setItem("authenticated", "false");
    localStorage.removeItem("activeprofile");
    localStorage.removeItem("familyId");
    localStorage.removeItem("categoryNotifications");
  };

  const updateProfile = async (updatedData = {}, opts = { refetch: false }) => {
    if (opts.refetch) {
      await fetchUser();
      setProfileUpdated(true);
      return;
    }
    setUser((prev) => {
      const merged = { ...prev, ...updatedData };
      localStorage.setItem("user", JSON.stringify(merged));
      setProfileUpdated((p) => !p);
      return merged;
    });
  };

  const addProfile = ({ jwt: profileJwt, user: profileUser }) => {
    const updatedProfiles = {
      ...profiles,
      [profileUser?.id]: { jwt: profileJwt, user: profileUser },
    };
    setProfiles(updatedProfiles);
    localStorage.setItem("profiles", JSON.stringify(updatedProfiles));
    localStorage.setItem("activeprofile", profileUser?.id);
  };

  const removeProfile = (profileId) => {
    const { [profileId]: _, ...rest } = profiles;
    setProfiles(rest);
    localStorage.setItem("profiles", JSON.stringify(rest));
    if (localStorage.getItem("activeprofile") === profileId) {
      localStorage.removeItem("activeprofile");
    }
  };

  const selectProfile = async (profileId, profileData, currentProfileId) => {
    const profileJwt = profileData["jwt"];
    const profileUser = profileData["user"];

    setJwt(profileJwt);
    localStorage.setItem("jwt", profileJwt);
    const fresh = await fetchUser({ token: profileJwt, force: true });
    if (fresh) {
      setUser(fresh);
      localStorage.setItem("user", JSON.stringify(fresh));
      localStorage.setItem("activeprofile", currentProfileId);
    } else {
      setUser(profileUser);
      localStorage.setItem("user", JSON.stringify(profileUser));
      localStorage.setItem("activeprofile", currentProfileId);
    }
  };

  const forceRefreshUser = async () => {
    return await fetchUser({ force: true });
  };

  const updateUserField = (key, value) => {
    setUser((prev) => {
      const updated = { ...prev, [key]: value };
      localStorage.setItem("user", JSON.stringify(updated));
      setProfileUpdated((p) => !p);
      return updated;
    });
  };

  // persist auth state to localStorage
  useEffect(() => {
    try {
      if (isAuthenticated && jwt && user) {
        localStorage.setItem("jwt", jwt);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("authenticated", "true");
        localStorage.setItem("familyId", user?.family?.id);
      } else if (!isAuthenticated) {
        localStorage.removeItem("jwt");
        localStorage.removeItem("user");
        localStorage.setItem("authenticated", "false");
      }
    } catch (error) {
      console.error("Error syncing auth state with localStorage:", error);
    }
  }, [isAuthenticated, jwt, user]);

  // ---------------------------
  // Ably subscriptions - robust version
  // ---------------------------
  useEffect(() => {
    if (!user?.id) return;

    let mounted = true;
    const subscribedAnnouncementChannels = [];

    const roleChannel = ably.channels.get(`userrole:${user.id}`);
    const statusChannel = ably.channels.get(`userstatus:${user.id}`);
    const communityRoleChannel = ably.channels.get(
      `communityuserroles:${user.id}`
    );

    const handleRoleMessage = (msg) => {
      if (msg.data?.userrole) updateUserField("userrole", msg.data.userrole);
    };

    const handleStatusMessage = (msg) => {
      if (msg.data?.userstatus)
        updateUserField("userstatus", msg.data.userstatus);
    };

    const handleCommunityRoleMessage = (msg) => {
      const newRoles = Array.isArray(msg.data?.userroles)
        ? msg.data.userroles
        : [];
      const removedId = msg.data?.removedSubcategoryId;

      setUser((prev) => {
        const existingRoles = Array.isArray(prev.userroles)
          ? prev.userroles
          : [];
        const filtered = removedId
          ? existingRoles.filter(
              (r) =>
                (r?.subcategory?.id ?? r?.subcategoryId ?? r?.subcategory) !==
                removedId
            )
          : existingRoles;
        const merged = [...filtered];
        for (const incoming of newRoles) {
          const incomingId =
            incoming?.subcategory?.id ?? incoming?.subcategoryId ?? null;
          if (!incomingId) continue;
          if (
            !merged.some(
              (r) =>
                (r?.subcategory?.id ?? r?.subcategoryId ?? r?.subcategory) ===
                incomingId
            )
          )
            merged.push(incoming);
        }
        const same = JSON.stringify(existingRoles) === JSON.stringify(merged);
        if (same) return prev;
        const updated = { ...prev, userroles: merged };
        localStorage.setItem("user", JSON.stringify(updated));
        setProfileUpdated((p) => !p);
        return updated;
      });
    };

    roleChannel.subscribe("temple-request", handleRoleMessage);
    statusChannel.subscribe("temple-request", handleStatusMessage);
    communityRoleChannel.subscribe(
      "temple-request",
      handleCommunityRoleMessage
    );

    (async () => {
      try {
        // prefer client-side populated roles
        let roles = Array.isArray(user.userroles) ? user.userroles : [];
        const templeId =
          user?.temples?.length > 0 ? user.temples[0]?.id : user?.temples;

        // fallback: fetch user roles from server if client roles empty
        if ((!roles || roles.length === 0) && user?.id) {
          try {
            const resp = await getUserRole(); // adapt service to return roles array or { data: [...] }
            // normalize possible shapes
            if (Array.isArray(resp)) roles = resp;
            else if (Array.isArray(resp?.data)) roles = resp.data;
            else if (Array.isArray(resp?.userroles)) roles = resp.userroles;
            else roles = resp || [];
          } catch (err) {
            console.warn(
              "Unable to fetch user roles from server, continuing with local roles",
              err
            );
          }
        }

        if (!mounted) return;

        if (roles && roles.length && templeId) {
          roles.forEach((role) => {
            const tid =
              role?.temple?.id ?? role?.templeid ?? role?.temple ?? null;
            const sid =
              role?.subcategory?.id ??
              role?.subcategoryid ??
              role?.subcategory ??
              null;
            if (!tid || !sid) {
              console.warn("Skipping role (missing ids):", role);
              return;
            }
            const channelName = `announcements:temple:${tid}:subcategory:${sid}`;
            const channel = ably.channels.get(channelName);
            channel.subscribe("new-announcement", handleNewAnnouncement);
            subscribedAnnouncementChannels.push({
              channel,
              handler: handleNewAnnouncement,
            });
          });
        }

        // init notifications from storage
        loadNotifications();
      } catch (err) {
        console.error("Error setting up announcement subscriptions:", err);
      }
    })();

    return () => {
      mounted = false;
      try {
        roleChannel.unsubscribe("temple-request", handleRoleMessage);
      } catch (e) {}
      try {
        statusChannel.unsubscribe("temple-request", handleStatusMessage);
      } catch (e) {}
      try {
        communityRoleChannel.unsubscribe(
          "temple-request",
          handleCommunityRoleMessage
        );
      } catch (e) {}
      subscribedAnnouncementChannels.forEach(({ channel, handler }) => {
        try {
          channel.unsubscribe("new-announcement", handler);
        } catch (e) {}
      });
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      processedMessageIds.current.clear();
    };
    // intentionally include stable callbacks; user.* used only to trigger re-run
  }, [
    user?.id,
    user?.userroles,
    user?.temples,
    handleNewAnnouncement,
    loadNotifications,
  ]);

  // listen for storage broadcast events (kept)
  useEffect(() => {
    const handleStorageChange = () => {
      loadNotifications();
    };
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("localNotificationsUpdate", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        "localNotificationsUpdate",
        handleStorageChange
      );
    };
  }, [loadNotifications]);

  // On app init: if JWT exists, set header and fetch user
  useEffect(() => {
    const token = localStorage.getItem("jwt") || jwt;
    if (token) {
      setJwt(token);
      fetchUser({ token }).catch((e) => {
        console.warn("Initial fetchUser failed", e);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once

  // ---------------------------
  // expose context
  // ---------------------------
  const contextValue = {
    jwt,
    user,
    isAuthenticated,
    profileUpdated,
    setProfileUpdated,
    profiles,
    isAccountActive,
    login,
    logout,
    updateProfile,
    addProfile,
    removeProfile,
    selectProfile,
    setProfiles,
    setIsAccountActive,
    setUser,
    updateUserField,
    forceRefreshUser,
    notifications,
    totalUnreadCount,
    hasNewAnnouncement,
    getNotifications,
    markAsRead,
    resetNotifications,
    saveNotifications, // exposing for debug/use if needed
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
