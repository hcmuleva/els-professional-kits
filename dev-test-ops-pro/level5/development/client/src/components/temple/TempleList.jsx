import { CloseOutline, SearchOutline } from "antd-mobile-icons";
import { useEffect, useMemo, useState } from "react";
import { getTempleLists } from "../../services/temple";
import TempleCard from "./TempleCard";

export default function TempleList() {
  const [temples, setTemples] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Theme colors
  const theme = {
    primary: "#FF7A00",
    secondary: "#FFB800",
    white: "#FFFFFF",
    lightGray: "#F8F8F8",
    mediumGray: "#E0E0E0",
    textDark: "#333333",
    textMedium: "#666666",
    textLight: "#999999",
  };

  useEffect(() => {
    try {
      const getTempleList = async () => {
        setIsLoading(true);
        const res = await getTempleLists();
        setTemples(res.data);
        setIsLoading(false);
      };
      getTempleList();
    } catch (error) {
      console.error("ERROR", error);
      setIsLoading(false);
    }
  }, []);

  // Implement search functionality
  const filteredTemples = useMemo(() => {
    if (!search) return temples;

    try {
      const lowerSearch = search.toLowerCase().trim();

      return temples.filter((temple) => {
        try {
          // Handle both direct and nested (Strapi) structures
          const templeData = temple.attributes || temple;

          // Search by name
          const name = templeData.title?.toString().toLowerCase();
          if (name?.includes(lowerSearch)) return true;

          // Search by address
          const addressParts = [
            templeData.village,
            templeData.tehsil,
            templeData.district,
            templeData.state,
            templeData.addressLine1,
            templeData.addressLine2,
            templeData.pincode,
          ]
            .filter(Boolean)
            .map((p) => p.toString().toLowerCase());

          return addressParts.some((part) => part.includes(lowerSearch));
        } catch (e) {
          console.error("Error processing temple:", temple, e);
          return false;
        }
      });
    } catch (error) {
      console.error("Search error:", error);
      return temples; // Fallback to showing all
    }
  }, [temples, search]);
  return (
    <div
      style={{
        padding: "16px 20px",
        backgroundColor: theme.white,
        minHeight: "100vh",
      }}
    >
      {/* Enhanced Search Bar */}
      <div
        style={{
          position: "relative",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: theme.lightGray,
            borderRadius: "12px",
            padding: "12px 16px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
          }}
        >
          <SearchOutline
            style={{
              fontSize: "22px",
              color: theme.textMedium,
              marginRight: "12px",
            }}
          />
          <input
            type="text"
            placeholder="Search by temple name, location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              border: "none",
              background: "transparent",
              width: "100%",
              fontSize: "16px",
              color: theme.textDark,
              outline: "none",
              padding: "4px 0",
            }}
          />
          {search && (
            <CloseOutline
              style={{
                fontSize: "18px",
                color: theme.textLight,
                cursor: "pointer",
              }}
              onClick={() => setSearch("")}
            />
          )}
        </div>
      </div>

      {/* Rest of your component remains the same */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          margin: "0px 5px 20px 5px",
        }}
      >
        {/* ... existing filter/sort buttons ... */}
      </div>

      <div
        style={{
          marginBottom: "16px",
          fontSize: "14px",
          color: theme.textMedium,
        }}
      >
        {filteredTemples.length} temples found
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "16px",
        }}
      >
        {filteredTemples?.map((temple) => (
          <TempleCard key={temple.id} temple={temple} />
        ))}
      </div>

      {!isLoading && filteredTemples?.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "60px 0",
            color: theme.textMedium,
          }}
        >
          <div
            style={{
              fontSize: "40px",
              marginBottom: "16px",
            }}
          >
            🏛️
          </div>
          <h3
            style={{
              margin: "0 0 8px 0",
              color: theme.textDark,
              fontSize: "18px",
            }}
          >
            No temples found
          </h3>
          <p
            style={{
              margin: "0",
              color: theme.textLight,
              fontSize: "14px",
            }}
          >
            Try adjusting your search or filters
          </p>
        </div>
      )}

      {isLoading && (
        <div
          style={{
            textAlign: "center",
            padding: "40px 0",
            color: theme.textMedium,
          }}
        >
          Loading temples...
        </div>
      )}
    </div>
  );
}
