import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
  useImperativeHandle,
} from "react";
import { AuthContext } from "../../contexts/AuthContext";
import ably from "../../utils/ablyClient";
import PropTypes from "prop-types";

const AnnouncementManager = (
  { onNotificationCountChange, onNewAnnouncementChange },
  ref
) => {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState({});
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);
  const [hasNewAnnouncement, setHasNewAnnouncement] = useState(false);
  const processedMessageIds = useRef(new Set());
  const audioContextRef = useRef(null);
  const userroles = user?.userroles || [];
  const templeId =
    user?.temples?.length > 0
      ? user.temples[0]?.id
      : Array.isArray(user?.temples)
      ? null
      : user?.temples;

  // Play notification sound
  const playNotificationSound = useCallback(() => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext ||
          window.webkitAudioContext)();
      }
      const audioContext = audioContextRef.current;
      if (audioContext.state === "suspended") {
        console.log("📢 AudioContext is suspended, waiting for user gesture");
        const resumeAudio = () => {
          audioContext.resume().then(() => {
            console.log("📢 AudioContext resumed");
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            oscillator.frequency.value = 800;
            oscillator.type = "sine";
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(
              0.1,
              audioContext.currentTime + 0.1
            );
            gainNode.gain.exponentialRampToValueAtTime(
              0.01,
              audioContext.currentTime + 0.5
            );
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
          });
          document.removeEventListener("click", resumeAudio);
        };
        document.addEventListener("click", resumeAudio);
      } else {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.frequency.value = 800;
        oscillator.type = "sine";
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(
          0.1,
          audioContext.currentTime + 0.1
        );
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 0.5
        );
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
      }
    } catch (error) {
      console.error("📢 Audio notification not supported:", error);
    }
  }, []);

  // Generate unique message ID
  const generateMessageId = useCallback((message) => {
    return `announcement-${
      message.data?.id || message.timestamp || Date.now()
    }`;
  }, []);

  // Save notifications to localStorage
  const saveNotifications = useCallback((notifications) => {
    try {
      const deduplicated = {};
      Object.keys(notifications).forEach((subcategoryId) => {
        const seenIds = new Set();
        deduplicated[subcategoryId] = notifications[subcategoryId].filter(
          (notif) => {
            if (seenIds.has(notif.id)) return false;
            seenIds.add(notif.id);
            return true;
          }
        );
      });
      localStorage.setItem(
        "categoryNotifications",
        JSON.stringify(deduplicated)
      );
      console.log("📢 Saved notifications:", deduplicated);
      window.dispatchEvent(new Event("storage"));
    } catch (error) {
      console.error("📢 Error saving notifications:", error);
    }
  }, []);

  // Load notifications from localStorage
  const loadNotifications = useCallback(() => {
    try {
      const stored =
        JSON.parse(localStorage.getItem("categoryNotifications")) || {};
      const deduplicated = {};
      Object.keys(stored).forEach((subcategoryId) => {
        const seenIds = new Set();
        deduplicated[subcategoryId] = (stored[subcategoryId] || []).filter(
          (notif) => {
            if (seenIds.has(notif.id)) return false;
            seenIds.add(notif.id);
            return true;
          }
        );
      });

      setNotifications(deduplicated);
      let total = 0;
      Object.values(deduplicated).forEach((categoryNotifs) => {
        if (Array.isArray(categoryNotifs)) {
          total += categoryNotifs.filter((notif) => !notif.read).length;
        }
      });

      setTotalUnreadCount(total);
      setHasNewAnnouncement(total > 0);
      console.log("📢 Loaded notifications:", {
        total,
        notifications: deduplicated,
      });
    } catch (error) {
      console.error("📢 Error loading notifications:", error);
    }
  }, []);

  // Handle new announcement from Ably
  const handleNewAnnouncement = useCallback(
    (message) => {
      const messageId = generateMessageId(message);
      if (processedMessageIds.current.has(messageId)) {
        console.log("📢 Duplicate message ignored:", messageId);
        return;
      }

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
        if (
          updated[subcategoryId].some((notif) => notif.id === notification.id)
        ) {
          console.log("📢 Notification already exists:", notification.id);
          return prev;
        }

        updated[subcategoryId] = [
          notification,
          ...updated[subcategoryId],
        ].slice(0, 50);
        saveNotifications(updated);
        setTotalUnreadCount((prev) => prev + 1);
        setHasNewAnnouncement(true);
        playNotificationSound();
        console.log("📢 Processed new announcement:", {
          messageId,
          subcategoryId,
          title: notification.title,
        });
        return updated;
      });
    },
    [generateMessageId, saveNotifications, playNotificationSound]
  );

  // Reset notifications
  const resetNotifications = useCallback(() => {
    setNotifications((prev) => {
      const updated = { ...prev };
      let hasChanges = false;
      Object.keys(updated).forEach((categoryId) => {
        if (Array.isArray(updated[categoryId])) {
          updated[categoryId] = updated[categoryId].map((notif) => {
            if (!notif.read) {
              hasChanges = true;
              return { ...notif, read: true };
            }
            return notif;
          });
        }
      });
      if (hasChanges) saveNotifications(updated);
      return updated;
    });
    setTotalUnreadCount(0);
    setHasNewAnnouncement(false);
  }, [saveNotifications]);

  // Mark notifications as read for a specific category
  const markAsRead = useCallback(
    (subcategoryId) => {
      setNotifications((prev) => {
        const updated = { ...prev };
        const categoryNotifications = updated[subcategoryId] || [];
        const hasUnread = categoryNotifications.some((notif) => !notif.read);
        if (hasUnread) {
          updated[subcategoryId] = categoryNotifications.map((notif) => ({
            ...notif,
            read: true,
          }));
          saveNotifications(updated);
          setTotalUnreadCount(
            (prev) =>
              prev - categoryNotifications.filter((notif) => !notif.read).length
          );
          setHasNewAnnouncement(
            Object.values(updated).some((notifs) =>
              notifs.some((notif) => !notif.read)
            )
          );
        }
        return updated;
      });
    },
    [saveNotifications]
  );

  // Get notifications for a category
  const getNotifications = useCallback((subcategoryId) => {
    const stored =
      JSON.parse(localStorage.getItem("categoryNotifications")) || {};
    const notifications = stored[subcategoryId] || [];
    console.log(
      `📢 Manager: getNotifications for subcategory ${subcategoryId}:`,
      notifications
    );
    return notifications;
  }, []);

  // Expose methods and data via ref
  useImperativeHandle(
    ref,
    () => ({
      getNotifications,
      markAsRead,
      resetNotifications,
      getTotalUnreadCount: () => totalUnreadCount,
      getHasNewAnnouncement: () => hasNewAnnouncement,
    }),
    [
      getNotifications,
      markAsRead,
      resetNotifications,
      totalUnreadCount,
      hasNewAnnouncement,
    ]
  );

  // Setup Ably channels
  useEffect(() => {
    if (!user?.id || !userroles?.length || !templeId) {
      console.log("📢 No user, roles, or templeId, skipping setup");
      return;
    }

    const channels = [];
    userroles.forEach((role) => {
      const { templeid, subcategoryid } = role;
      if (!templeid || !subcategoryid) {
        console.warn("📢 Missing templeId or subcategoryId for role:", role);
        return;
      }

      const channelName = `announcements:temple:${templeid}:subcategory:${subcategoryid}`;
      const channel = ably.channels.get(channelName);
      channel.subscribe("new-announcement", handleNewAnnouncement);
      channels.push({ channel, handler: handleNewAnnouncement });
      console.log(`📢 Subscribed to ${channelName}`);
    });

    // Load notifications from localStorage
    loadNotifications();

    // Cleanup on unmount
    return () => {
      channels.forEach(({ channel, handler }) => {
        channel.unsubscribe("new-announcement", handler);
        console.log(`📢 Unsubscribed from ${channel.name}`);
      });
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
        console.log("📢 Closed AudioContext");
      }
      processedMessageIds.current.clear();
      console.log("📢 Cleared processedMessageIds");
    };
  }, [user?.id, userroles, templeId, handleNewAnnouncement, loadNotifications]);

  // Listen for storage changes
  useEffect(() => {
    const handleStorageChange = () => {
      console.log("📢 Storage changed, reloading notifications");
      loadNotifications();
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [loadNotifications]);

  // Notify parent of changes
  useEffect(() => {
    onNotificationCountChange?.(totalUnreadCount);
    onNewAnnouncementChange?.(hasNewAnnouncement);
  }, [
    totalUnreadCount,
    hasNewAnnouncement,
    onNotificationCountChange,
    onNewAnnouncementChange,
  ]);

  return null;
};

AnnouncementManager.propTypes = {
  onNotificationCountChange: PropTypes.func,
  onNewAnnouncementChange: PropTypes.func,
};

export default React.forwardRef(AnnouncementManager);
