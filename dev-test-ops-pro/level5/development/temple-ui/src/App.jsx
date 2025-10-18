import { BrowserRouter as Router } from "react-router-dom";
import { useEffect } from "react";
import { SplashScreen } from "@capacitor/splash-screen"; // ✅ import SplashScreen

import { AuthProvider } from "./contexts/AuthContext";
import QueryProvider from "./provider/QueryProvider";
import AppRoutes from "./app/AppRoutes";

import enUS from "antd-mobile/es/locales/en-US";
import { ConfigProvider } from "antd-mobile";
import DeepLinkHandler from "./DeepLinkHandler";
import UserDeepLinkHandler from "./UserDeepLinkHandler";

export default function App() {
  // ✅ Hide Splash Screen when app mounts
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <ConfigProvider locale={enUS}>
      <QueryProvider>
        <Router>
          <AuthProvider>
            <UserDeepLinkHandler/>
            <DeepLinkHandler />
            <AppRoutes />
          </AuthProvider>
        </Router>
      </QueryProvider>
    </ConfigProvider>
  );
}
