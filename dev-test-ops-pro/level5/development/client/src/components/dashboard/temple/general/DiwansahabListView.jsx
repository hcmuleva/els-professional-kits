import React from "react";
import { Avatar, Button } from "antd-mobile";
import { CalendarOutline } from "antd-mobile-icons";

export default function DiwansahabListView({
  divans,
  isAdmin,
  handleEdit,
  setShowForm,
}) {
  return (
    <div style={{ margin: "0 auto" }}>
      {/* Admin Add Button */}
      {isAdmin && (
        <div style={{ marginBottom: "16px", textAlign: "right" }}>
          <Button
            color="primary"
            size="small"
            onClick={() => setShowForm(true)}
            style={{
              borderRadius: "20px",
              padding: "8px 16px",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            दीवान साहब को जोड़े
          </Button>
        </div>
      )}

      {/* Divan List */}
      {divans?.data?.length > 0 ? (
        divans.data.map((divan) => (
          <div
            key={divan.id}
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              padding: "12px",
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              marginBottom: "12px",
              gap: "12px",
              position: "relative",
            }}
          >
            <Avatar
              src={
                divan.attributes?.image ||
                "https://demo.adminkit.io/img/avatars/avatar-4.jpg"
              }
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "8px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
              }}
            />
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "#1f2937",
                  marginBottom: "6px",
                }}
              >
                {divan.attributes?.name || "अज्ञात"}
              </div>
              <div
                style={{
                  fontSize: "14px",
                  color: "#6b7280",
                  marginBottom: "4px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <CalendarOutline style={{ color: "#ff6b6b" }} />
                <span>जन्मतिथि: {divan.attributes?.dob || "N/A"}</span>
              </div>
              <div
                style={{
                  fontSize: "14px",
                  color: "#6b7280",
                  marginBottom: "4px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <CalendarOutline style={{ color: "#ff6b6b" }} />
                <span>पुण्यतिथि: {divan.attributes?.dol || "N/A"}</span>
              </div>
              <div
                style={{
                  fontSize: "14px",
                  color: "#6b7280",
                }}
              >
                क्रम संख्या: {divan.attributes?.number || "-"}
              </div>
            </div>

            {/* Admin Edit Button */}
            {isAdmin && (
              <Button
                fill="none"
                size="mini"
                onClick={() => handleEdit(divan.attributes)}
                style={{
                  position: "absolute",
                  top: "8px",
                  right: "8px",
                  minWidth: "auto",
                  padding: "4px",
                }}
              >
                संपादित करें
              </Button>
            )}
          </div>
        ))
      ) : (
        <div
          style={{
            textAlign: "center",
            color: "#6b7280",
            fontSize: "16px",
            padding: "20px",
          }}
        >
          कोई दीवान उपलब्ध नहीं है
        </div>
      )}
    </div>
  );
}
