import React from "react";
import ProfileCard from "../../components/user/propfile/ProfileCard";

export default function Profile() {
  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
      backgroundColor: "#FAFAFA",
      padding: "0",
    },
    profileSection: {
      flex: 1,
      width: "100%",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.profileSection}>
        <ProfileCard />
      </div>
    </div>
  );
}
