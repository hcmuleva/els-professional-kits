import { useContext, useState } from "react";
import { AnnouncementsViewer } from "./AnnouncementViewer";
import { CreateAnnouncements } from "./CreateAnnouncements";
import { AuthContext } from "../../../contexts/AuthContext";

export default function AnnouncementsSection() {
  const { user } = useContext(AuthContext);
  const [templeId] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAnnouncementCreated = () => {
    // Refresh the announcements list
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div
      style={{
        background: "#f5f5f5",
        minHeight: "100vh",
        paddingBottom: "20px",
      }}
    >
      {user?.userrole === "ADMIN" && (
        <CreateAnnouncements
          user={user}
          templeId={templeId}
          onAnnouncementCreated={handleAnnouncementCreated}
        />
      )}

      <AnnouncementsViewer key={refreshKey} user={user} templeId={templeId} />
    </div>
  );
}
