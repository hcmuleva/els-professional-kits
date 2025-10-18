import { useEffect } from "react";
import { App, PluginListenerHandle } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import { useNavigate, useLocation } from "react-router-dom";

export default function UserDeepLinkHandler() {
  const navigate = useNavigate();
  const location = useLocation();

  const extractUserId = (url: string): string | null => {
    try {
      console.log("🔍 Analyzing deep link URL (user):", url);
      const urlObj = new URL(url);

      // Match /share/user/:userid
      if (urlObj.pathname.includes("/share/user/")) {
        const pathParts = urlObj.pathname.split("/");
        const userIndex = pathParts.findIndex((part) => part === "user");
        if (userIndex >= 0 && userIndex + 1 < pathParts.length) {
          const userId = pathParts[userIndex + 1];
          console.log("✅ User ID from path:", userId);
          return userId;
        }
      }

      // Optional query param version ?userId=123
      const userId = urlObj.searchParams.get("userId");
      if (userId) {
        console.log("✅ User ID from query params:", userId);
        return userId;
      }

      console.log("❌ No user ID found");
      return null;
    } catch (err) {
      console.error("❌ Error parsing user deep link:", err);
      return null;
    }
  };

  const handleUserId = (userId: string, source: string) => {
    console.log("🎯 Processing user ID:", userId, "from:", source);
    if (!location.pathname.includes(`/share/user/${userId}`)) {
      navigate(`/share/user/${userId}`, {
        replace: true,
        state: { fromDeepLink: true, userId },
      });
    }
  };

  useEffect(() => {
    let listener: PluginListenerHandle | undefined;

    const setup = async () => {
      if (Capacitor.isNativePlatform()) {
        const launchUrl = await App.getLaunchUrl();
        if (launchUrl?.url) {
          const userId = extractUserId(launchUrl.url);
          if (userId) {
            handleUserId(userId, "launch");
            return;
          }
        }

        const handle = await App.addListener("appUrlOpen", (event) => {
          console.log("🔗 User deep link received:", event.url);
          const userId = extractUserId(event.url);
          if (userId) handleUserId(userId, "runtime");
        });
        listener = handle;
      } else {
        const currentUrl = window.location.href;
        const userId = extractUserId(currentUrl);
        if (userId) handleUserId(userId, "web");
      }
    };

    setup();

    return () => {
      if (listener) listener.remove();
    };
  }, [navigate, location.pathname]);

  return null;
}
    