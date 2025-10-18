import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { FooterMain } from "./FooterMain";

export default function MainLayout() {
  return (
    <div
      style={{
        height: "100dvh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Fixed Header */}
      <div
        style={{
          flexShrink: 0, // Prevents header from shrinking
          height: "120px", // Adjust to your header's actual height
        }}
      >
        <Header />
      </div>

      {/* Main Content Area - grows to fill available space */}
      <div
        style={{
          flex: 1,
          overflow: "auto", // Enables scrolling when content overflows
          minHeight: 0, // Important: allows flex item to shrink below content size
        }}
      >
        <Outlet />
      </div>

      {/* Fixed Footer */}
      <div
        style={{
          flexShrink: 0, // Prevents footer from shrinking
          height: "100px", // Adjust to your footer's actual height
        }}
      >
        <FooterMain />
      </div>
    </div>
  );
}
