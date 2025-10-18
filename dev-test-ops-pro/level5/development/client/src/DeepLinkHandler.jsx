import { useEffect } from "react";
import { App, PluginListenerHandle } from "@capacitor/app";
import { useNavigate } from "react-router-dom";
import { Capacitor } from "@capacitor/core";

export default function TempleDeepLinkHandler() {
  const navigate = useNavigate();

  // Extract temple ID from different URL formats
  const extractTempleId = (url: string): string | null => {
    try {
      console.log("🔍 Analyzing deep link URL:", url);

      // Handle custom scheme URLs (temple://register?templeId=123)
      if (url.startsWith("temple://")) {
        const urlObj = new URL(url.replace("temple://", "https://dummy.com/"));
        const templeId = urlObj.searchParams.get("templeId");
        if (templeId) {
          console.log("✅ Temple ID from custom scheme:", templeId);
          return templeId;
        }
      }

      // Handle HTTPS URLs (https://emeelan.com/templeservice/123)
      if (url.startsWith("https://") || url.startsWith("http://")) {
        const urlObj = new URL(url);

        // Extract from path: /templeservice/123
        if (urlObj.pathname.includes("/templeservice/")) {
          const pathParts = urlObj.pathname.split("/");
          const templeServiceIndex = pathParts.findIndex(
            (part) => part === "templeservice"
          );
          if (
            templeServiceIndex >= 0 &&
            templeServiceIndex + 1 < pathParts.length
          ) {
            const templeId = pathParts[templeServiceIndex + 1];
            console.log("✅ Temple ID from URL path:", templeId);
            return templeId;
          }
        }

        // Extract from query params: ?templeId=123
        const templeId = urlObj.searchParams.get("templeId");
        if (templeId) {
          console.log("✅ Temple ID from query params:", templeId);
          return templeId;
        }
      }

      console.log("❌ No temple ID found in URL");
      return null;
    } catch (error) {
      console.error("❌ Error parsing deep link URL:", error);
      return null;
    }
  };

  // Store temple ID with metadata
  const storeTempleId = (templeId: string, source: string) => {
    try {
      const timestamp = Date.now();
      const data = {
        templeId,
        source,
        timestamp,
        used: false,
      };

      localStorage.setItem("deep_link_templeId", templeId);
      localStorage.setItem("deep_link_data", JSON.stringify(data));
      localStorage.setItem("pending_temple_id", templeId);

      console.log("💾 Temple ID stored:", data);
    } catch (error) {
      console.error("❌ Error storing temple ID:", error);
    }
  };

  // Handle temple ID and navigate
  const handleTempleId = (templeId: string, source: string) => {
    console.log("🎯 Processing temple ID:", templeId, "from:", source);

    // Store the temple ID
    storeTempleId(templeId, source);

    // Navigate to register page
    navigate(`/register?templeId=${templeId}&source=deeplink`, {
      replace: true,
      state: { fromDeepLink: true, templeId },
    });
  };

  // Check for stored temple ID on app startup
  const checkStoredTempleId = () => {
    try {
      const storedData = localStorage.getItem("deep_link_data");
      if (storedData) {
        const data = JSON.parse(storedData);
        const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;

        // Only use if it's recent and unused
        if (data.timestamp > fiveMinutesAgo && !data.used) {
          console.log("🔄 Found recent unused temple ID:", data);
          handleTempleId(data.templeId, "stored");
        } else {
          console.log("🗑️ Stored temple ID expired or used, cleaning up");
          clearStoredTempleId();
        }
      }
    } catch (error) {
      console.error("❌ Error checking stored temple ID:", error);
    }
  };

  const clearStoredTempleId = () => {
    try {
      localStorage.removeItem("deep_link_templeId");
      localStorage.removeItem("deep_link_data");
      localStorage.removeItem("pending_temple_id");
      console.log("🗑️ Cleared stored temple IDs");
    } catch (error) {
      console.error("❌ Error clearing stored temple ID:", error);
    }
  };

  useEffect(() => {
    let listener: PluginListenerHandle | undefined;

    const setupDeepLinkHandling = async () => {
      try {
        if (Capacitor.isNativePlatform()) {
          console.log("📱 Setting up deep link handling for native platform");

          // Check if app was launched with a URL (cold start)
          const launchUrl = await App.getLaunchUrl();
          if (launchUrl?.url) {
            console.log("🚀 App launched with URL:", launchUrl.url);
            const templeId = extractTempleId(launchUrl.url);
            if (templeId) {
              handleTempleId(templeId, "launch");
              return; // Don't check stored ID if we have a launch URL
            }
          }

          // Set up listener for deep links while app is running
          const listenerHandle = await App.addListener(
            "appUrlOpen",
            (event) => {
              console.log("🔗 Deep link received:", event.url);
              const templeId = extractTempleId(event.url);
              if (templeId) {
                handleTempleId(templeId, "runtime");
              }
            }
          );

          listener = listenerHandle;

          // Check for stored temple ID only if no launch URL
          checkStoredTempleId();
        } else {
          console.log("🌐 Web platform - checking URL and stored data");

          // Handle web platform
          const currentUrl = window.location.href;
          const templeId = extractTempleId(currentUrl);
          if (templeId) {
            handleTempleId(templeId, "web");
          } else {
            checkStoredTempleId();
          }
        }
      } catch (error) {
        console.error("❌ Error setting up deep link handling:", error);
      }
    };

    setupDeepLinkHandling();

    return () => {
      if (listener) {
        console.log("🧹 Cleaning up deep link listener");
        listener.remove();
      }
    };
  }, [navigate]);

  return null;
}

// Utility functions for use in other components
export const getStoredTempleId = (): string | null => {
  try {
    return localStorage.getItem("deep_link_templeId");
  } catch (error) {
    console.error("❌ Error getting stored temple ID:", error);
    return null;
  }
};

export const getStoredTempleData = (): any | null => {
  try {
    const data = localStorage.getItem("deep_link_data");
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("❌ Error getting stored temple data:", error);
    return null;
  }
};

export const markTempleIdAsUsed = () => {
  try {
    const storedData = localStorage.getItem("deep_link_data");
    if (storedData) {
      const data = JSON.parse(storedData);
      data.used = true;
      localStorage.setItem("deep_link_data", JSON.stringify(data));
      console.log("✅ Temple ID marked as used");
    }
  } catch (error) {
    console.error("❌ Error marking temple ID as used:", error);
  }
};

export const clearStoredTempleId = () => {
  try {
    localStorage.removeItem("deep_link_templeId");
    localStorage.removeItem("deep_link_data");
    localStorage.removeItem("pending_temple_id");
    console.log("🗑️ Cleared stored temple IDs");
  } catch (error) {
    console.error("❌ Error clearing stored temple ID:", error);
  }
};