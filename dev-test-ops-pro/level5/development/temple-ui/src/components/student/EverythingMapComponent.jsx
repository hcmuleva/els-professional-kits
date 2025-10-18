import React, { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Button,
  SearchBar,
  List,
  Avatar,
  Tag,
  NavBar,
  Toast,
  Tabs,
  Selector,
} from "antd-mobile";
import {
  EnvironmentOutline,
  LocationOutline,
  UnorderedListOutline,
  GlobalOutline,
  FilterOutline,
  AddOutline,
  MinusOutline,
} from "antd-mobile-icons";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getFilteredBusinessData } from "../../services/business";

// Haversine formula to calculate distance in km between two points
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Default icon for current location
const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

export const EverythingMapComponent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { maptype } = useParams();

  const selectedBusinessType =
    location.state?.selectedBusiness?.type || location.state?.businessType;

  const [myLocation, setMyLocation] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);
  const [radiusFilteredBusinesses, setRadiusFilteredBusinesses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("map");
  const [selectedRadius, setSelectedRadius] = useState(["all"]); // Default to "all"
  const [isManualView, setIsManualView] = useState(false); // New state to track manual view changes
  const mapRef = useRef(null);

  const warmColors = {
    primary: "#d2691e",
    secondary: "#daa520",
    accent: "#cd853f",
    background: "#fef7e7",
    cardBg: "#ffffff",
    textPrimary: "#5d4037",
    textSecondary: "#8d6e63",
    border: "#f4e4bc",
    success: "#52c41a",
    warning: "#faad14",
    error: "#ff4d4f",
  };

  const polylineColors = [
    "#d2691e",
    "#daa520",
    "#cd853f",
    "#52c41a",
    "#faad14",
  ];

  const radiusOptions = [
    { label: "All", value: "all" },
    { label: "5 km", value: "5" },
    { label: "10 km", value: "10" },
    { label: "15 km", value: "15" },
    { label: "20 km", value: "20" },
  ];

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setMyLocation({ lat: coords.latitude, lng: coords.longitude });
      },
      (error) => {
        console.warn("Geolocation error:", error);
        setMyLocation({ lat: 23.2599, lng: 77.4126 });
        Toast.show({
          icon: "loading",
          content: "Using default location (Bhopal)",
          duration: 2000,
        });
      }
    );
  }, []);

  useEffect(() => {
    const fetchBusinesses = async () => {
      if (!selectedBusinessType) {
        setError("No business type provided");
        Toast.show({ icon: "fail", content: "No business type provided" });
        setLoading(true);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const data = await getFilteredBusinessData(selectedBusinessType);

        if (data?.data && Array.isArray(data.data)) {
          setBusinesses(data.data);
          setFilteredBusinesses(data.data);

          if (data.data.length === 0) {
            Toast.show({
              icon: "loading",
              content: `No ${selectedBusinessType} businesses found`,
              duration: 3000,
            });
          }
        } else {
          throw new Error("Invalid business data received");
        }
      } catch (err) {
        console.error("Error fetching businesses:", err);
        setError(err.message || "Failed to load businesses");
        Toast.show({
          icon: "fail",
          content: `Failed to load ${selectedBusinessType} businesses`,
        });
        setBusinesses([]);
        setFilteredBusinesses([]);
      } finally {
        setLoading(false);
      }
    };

    if (selectedBusinessType) {
      fetchBusinesses();
    }
  }, [selectedBusinessType]);

  // Filter businesses by search query
  useEffect(() => {
    if (!searchQuery) {
      setFilteredBusinesses(businesses);
      return;
    }

    const filtered = businesses.filter((item) => {
      const business = item.attributes;
      const ownerDetails = getOwnerDetails(business.users_permissions_user);
      const searchFields = [
        business.name?.toLowerCase(),
        business.type?.toLowerCase(),
        business.subtype?.toLowerCase(),
        business.category?.toLowerCase(),
        ownerDetails?.name?.toLowerCase(),
        ownerDetails?.gotra?.toLowerCase(),
      ].filter(Boolean);

      return searchFields.some((field) =>
        field.includes(searchQuery.toLowerCase())
      );
    });

    setFilteredBusinesses(filtered);
  }, [searchQuery, businesses]);

  // Filter businesses by radius
  useEffect(() => {
    if (!myLocation || !filteredBusinesses.length) {
      setRadiusFilteredBusinesses(filteredBusinesses);
      return;
    }

    if (selectedRadius.includes("all")) {
      setRadiusFilteredBusinesses(filteredBusinesses);
      return;
    }

    // Get the smallest radius for filtering (if multiple are selected)
    const minRadius = Math.min(
      ...selectedRadius.filter((r) => r !== "all").map(Number) // ✅ convert to number only here
    );

    const filtered = filteredBusinesses.filter((item) => {
      const business = item.attributes;
      const address = business.address?.data?.attributes;
      if (!address?.latitude || !address?.longitude) return false;

      const distance = calculateDistance(
        myLocation.lat,
        myLocation.lng,
        address.latitude,
        address.longitude
      );

      return distance <= minRadius; // Use minRadius for filtering
    });

    setRadiusFilteredBusinesses(filtered);

    // Show toast if no businesses are found within the radius
    if (filtered.length === 0) {
      Toast.show({
        icon: "info",
        content: `No businesses found within ${minRadius} km`,
        duration: 2000,
      });
    }
  }, [filteredBusinesses, selectedRadius, myLocation]);

  const getOwnerDetails = (user) => {
    if (!user?.data?.attributes) return null;
    const userData = user.data.attributes;
    return {
      name: `${userData.first_name || ""} ${userData.last_name || ""}`.trim(),
      gotra: userData.gotra,
      father: userData.father,
      gender: userData.gender,
    };
  };

  const formatAddress = (address) => {
    if (!address?.data?.attributes) return "Address not available";
    const addr = address.data.attributes;
    const parts = [
      addr.housename,
      addr.landmark,
      addr.village,
      addr.tehsil,
      addr.district,
      addr.state,
      addr.pincode ? `PIN: ${addr.pincode}` : null,
      addr.country,
    ].filter(Boolean);
    return parts.join(", ");
  };

  const formatPhone = (business) => {
    const phones = [
      business.mobile_number_1,
      business.mobile_number_2,
      business.mobile_number_3,
    ].filter(Boolean);
    return phones.length > 0 ? phones.join(", ") : null;
  };

  const handleRelocateToMe = () => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setMyLocation({ lat: coords.latitude, lng: coords.longitude });
        if (mapRef.current) {
          mapRef.current.setView([coords.latitude, coords.longitude], 14);
          setIsManualView(true); // Mark as manual view
        }
        Toast.show({
          icon: "success",
          content: "Location updated",
          duration: 1500,
        });
      },
      () => {
        Toast.show({ icon: "fail", content: "Unable to get your location" });
      }
    );
  };

  const handleJumpToBusiness = (lat, lng) => {
    if (mapRef.current && lat && lng) {
      mapRef.current.setView([lat, lng], 16);
      setActiveTab("map");
      setIsManualView(true); // Mark as manual view to prevent auto-fit
      Toast.show({
        icon: "success",
        content: "Jumped to business location",
        duration: 1500,
      });
    } else {
      Toast.show({ icon: "fail", content: "Business location not available" });
    }
  };

  // Zoom in/out handlers
  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.zoomIn();
      setIsManualView(true); // Mark as manual view
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.zoomOut();
      setIsManualView(true); // Mark as manual view
    }
  };

  // Auto-fit map to show all businesses
  const fitMapToBounds = () => {
    if (!mapRef.current || !myLocation || radiusFilteredBusinesses.length === 0)
      return;

    const bounds = L.latLngBounds();
    bounds.extend([myLocation.lat, myLocation.lng]);

    radiusFilteredBusinesses.forEach((item) => {
      const address = item.attributes.address?.data?.attributes;
      if (address?.latitude && address?.longitude) {
        bounds.extend([address.latitude, address.longitude]);
      }
    });

    mapRef.current.fitBounds(bounds, { padding: [20, 20] });
  };

  // Auto-fit when businesses are loaded, but only if not manually viewed
  useEffect(() => {
    if (
      radiusFilteredBusinesses.length > 0 &&
      myLocation &&
      activeTab === "map" &&
      !isManualView // Only fit bounds if not manually viewed
    ) {
      setTimeout(fitMapToBounds, 1000);
    }
  }, [radiusFilteredBusinesses, myLocation, activeTab, isManualView]);

  const renderMapView = () => (
    <div style={{ height: "100%", width: "100%", position: "relative" }}>
      {/* Map Controls */}
      <div
        style={{
          position: "absolute",
          top: "12px",
          left: "12px",
          right: "12px",
          zIndex: 1000,
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
        }}
      >
        <Button
          style={{
            background: warmColors.primary,
            border: "none",
            borderRadius: "8px",
            color: "white",
            fontWeight: "600",
            fontSize: "12px",
            height: "36px",
            minWidth: "36px",
            padding: "0",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
          onClick={handleRelocateToMe}
        >
          <LocationOutline style={{ fontSize: "16px" }} />
        </Button>
        {/* Zoom In Button */}
        <Button
          style={{
            background: warmColors.primary,
            border: "none",
            borderRadius: "8px",
            color: "white",
            fontWeight: "600",
            fontSize: "12px",
            height: "36px",
            minWidth: "36px",
            padding: "0",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
          onClick={handleZoomIn}
        >
          <AddOutline style={{ fontSize: "16px" }} />
        </Button>
        {/* Zoom Out Button */}
        <Button
          style={{
            background: warmColors.primary,
            border: "none",
            borderRadius: "8px",
            color: "white",
            fontWeight: "600",
            fontSize: "12px",
            height: "36px",
            minWidth: "36px",
            padding: "0",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
          onClick={handleZoomOut}
        >
          <MinusOutline style={{ fontSize: "16px" }} />
        </Button>
        {radiusFilteredBusinesses.length > 0 && (
          <Button
            style={{
              background: warmColors.secondary,
              border: "none",
              borderRadius: "8px",
              color: "white",
              fontWeight经销商: "600",
              fontSize: "10px",
              height: "36px",
              padding: "0 8px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            }}
            onClick={() => {
              fitMapToBounds();
              setIsManualView(false); // Allow auto-fit after clicking "Fit All"
            }}
          >
            Fit All
          </Button>
        )}
      </div>

      {/* Radius Filter */}
      <div
        style={{
          position: "absolute",
          top: "60px",
          left: "12px",
          right: "12px",
          zIndex: 1000,
        }}
      >
        <div
          style={{
            background: warmColors.cardBg,
            borderRadius: "8px",
            padding: "8px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              fontSize: "12px",
              color: warmColors.textPrimary,
              marginBottom: "4px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <FilterOutline style={{ fontSize: "12px" }} />
            Radius Filter:
          </div>
          <Selector
            options={radiusOptions}
            value={selectedRadius}
            multiple={false}
            onChange={(values, extend) => {
              // Case: "all" was selected and user taps something else
              if (selectedRadius.includes("all") && values.length > 1) {
                const newValues = values.filter((v) => v !== "all");
                console.log("Selected Radius:", newValues);
                setSelectedRadius(newValues);
              }
              // Case: only "all" selected or reset
              else if (values.length === 0 || values.includes("all")) {
                console.log("Selected Radius:", ["all"]);
                setSelectedRadius(["all"]);
              }
              // Normal multi-select without "all"
              else {
                console.log("Selected Radius:", values);
                setSelectedRadius(values);
              }
            }}
            style={{
              "--adm-selector-border-radius": "6px",
              "--adm-selector-check-mark-color": warmColors.primary,
              "--adm-selector-item-padding": "4px 8px",
              fontSize: "11px",
            }}
          />
        </div>
      </div>

      {/* Map */}
      <MapContainer
        center={[myLocation.lat, myLocation.lng]}
        zoom={14}
        style={{ height: "100%", width: "100%", zIndex: 1 }} // Ensure zIndex for map
        zoomControl={false}
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />

        <Marker position={[myLocation.lat, myLocation.lng]} icon={defaultIcon}>
          <Popup>
            <div
              style={{
                textAlign: "center",
                fontWeight: "600",
                fontSize: "14px",
                color: warmColors.textPrimary,
              }}
            >
              📍 You are here
            </div>
          </Popup>
        </Marker>

        {radiusFilteredBusinesses.map((item, index) => {
          const business = item.attributes;
          const address = business.address?.data?.attributes;
          const lat = address?.latitude || 23.2599;
          const lng = address?.longitude || 77.4126;
          const distance = calculateDistance(
            myLocation.lat,
            myLocation.lng,
            lat,
            lng
          ).toFixed(2);
          const ownerDetails = getOwnerDetails(business.users_permissions_user);

          const customIcon = L.divIcon({
            className: "custom-business-icon",
            html: `<div style="
              width: 36px;
              height: 36px;
              border-radius: 50%;
              background: ${warmColors.primary};
              border: 2px solid ${warmColors.secondary};
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 12px;
              font-weight: bold;
              box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            ">
              ${business.name?.charAt(0) || "B"}
            </div>`,
            iconSize: [36, 36],
            iconAnchor: [18, 18],
          });

          return (
            <React.Fragment key={item.id}>
              <Marker position={[lat, lng]} icon={customIcon}>
                <Popup>
                  <div style={{ minWidth: "180px", textAlign: "center" }}>
                    <div
                      style={{
                        fontWeight: "600",
                        marginBottom: "4px",
                        fontSize: "14px",
                        color: warmColors.textPrimary,
                      }}
                    >
                      {business.name || "Unknown Business"}
                    </div>
                    <div
                      style={{
                        color: warmColors.textSecondary,
                        fontSize: "11px",
                        marginBottom: "4px",
                      }}
                    >
                      {business.type || "Unspecified"}
                    </div>
                    <div
                      style={{
                        color: warmColors.textSecondary,
                        fontSize: "11px",
                        marginBottom: "8px",
                      }}
                    >
                      📍 {distance} km away
                    </div>
                    {ownerDetails?.name && (
                      <div
                        style={{
                          color: warmColors.textSecondary,
                          fontSize: "11px",
                        }}
                      >
                        Owner: {ownerDetails.name}
                      </div>
                    )}
                    {formatPhone(business) && (
                      <div
                        style={{
                          color: warmColors.textSecondary,
                          fontSize: "11px",
                        }}
                      >
                        Phone: {formatPhone(business)}
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>
              <Polyline
                positions={[
                  [myLocation.lat, myLocation.lng],
                  [lat, lng],
                ]}
                pathOptions={{
                  color: polylineColors[index % polylineColors.length],
                  weight: 2,
                  opacity: 0.6,
                  dashArray: "5, 10",
                }}
              />
            </React.Fragment>
          );
        })}
      </MapContainer>
    </div>
  );

  const renderListView = () => (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: warmColors.background,
      }}
    >
      <div style={{ padding: "12px 16px", flexShrink: 0 }}>
        <SearchBar
          placeholder={`Search ${selectedBusinessType || "businesses"}...`}
          value={searchQuery}
          onChange={setSearchQuery}
          style={{
            background: warmColors.cardBg,
            borderRadius: "12px",
            border: `1px solid ${warmColors.border}`,
            fontSize: "14px",
          }}
        />
      </div>

      <div style={{ padding: "0 16px 12px", flexShrink: 0 }}>
        <div
          style={{
            background: warmColors.cardBg,
            borderRadius: "8px",
            padding: "12px",
            border: `1px solid ${warmColors.border}`,
          }}
        >
          <div
            style={{
              fontSize: "12px",
              color: warmColors.textPrimary,
              marginBottom: "8px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <FilterOutline style={{ fontSize: "12px" }} />
            Show businesses within:
          </div>
          <Selector
            options={radiusOptions}
            value={selectedRadius}
            multiple={false}
            onChange={(values, extend) => {
              // Case: "all" was selected and user taps something else
              if (selectedRadius.includes("all") && values.length > 1) {
                const newValues = values.filter((v) => v !== "all");
                console.log("Selected Radius:", newValues);
                setSelectedRadius(newValues);
              }
              // Case: only "all" selected or reset
              else if (values.length === 0 || values.includes("all")) {
                console.log("Selected Radius:", ["all"]);
                setSelectedRadius(["all"]);
              }
              // Normal multi-select without "all"
              else {
                console.log("Selected Radius:", values);
                setSelectedRadius(values);
              }
            }}
            style={{
              "--adm-selector-border-radius": "6px",
              "--adm-selector-check-mark-color": warmColors.primary,
              "--adm-selector-item-padding": "6px 12px",
              fontSize: "12px",
            }}
          />
        </div>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "0 16px 16px",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {radiusFilteredBusinesses.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px 20px",
              color: warmColors.textSecondary,
              fontSize: "14px",
            }}
          >
            {searchQuery
              ? `No businesses found matching "${searchQuery}"`
              : selectedRadius.length > 0 && !selectedRadius.includes("all")
              ? `No ${
                  selectedBusinessType || "businesses"
                } found within ${Math.min(
                  ...selectedRadius.filter((r) => r !== "all")
                )} km`
              : `No ${selectedBusinessType || "businesses"} found in this area`}
          </div>
        ) : (
          <List style={{ background: "transparent" }}>
            {radiusFilteredBusinesses.map((item) => {
              const business = item.attributes;
              const address = business.address?.data?.attributes;
              const lat = address?.latitude || 23.2599;
              const lng = address?.longitude || 77.4126;
              const distance = calculateDistance(
                myLocation.lat,
                myLocation.lng,
                lat,
                lng
              ).toFixed(2);
              const ownerDetails = getOwnerDetails(
                business.users_permissions_user
              );
              const phoneNumber = formatPhone(business);

              return (
                <List.Item
                  key={item.id}
                  style={{
                    background: warmColors.cardBg,
                    marginBottom: "8px",
                    borderRadius: "12px",
                    padding: "12px",
                    border: `1px solid ${warmColors.border}`,
                    boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
                  }}
                  prefix={
                    <div
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "50%",
                        background: `${warmColors.primary}20`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: `2px solid ${warmColors.primary}`,
                      }}
                    >
                      {business.name?.charAt(0) || "B"}
                    </div>
                  }
                  description={
                    <div>
                      <div
                        style={{
                          color: warmColors.textSecondary,
                          fontSize: "12px",
                          marginBottom: "4px",
                        }}
                      >
                        {formatAddress(business.address)}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <Tag
                          color={warmColors.primary}
                          style={{
                            fontSize: "9px",
                            margin: 0,
                            padding: "2px 6px",
                          }}
                        >
                          {business.type || "Unspecified"}
                        </Tag>
                        <span
                          style={{
                            fontSize: "11px",
                            color: warmColors.textSecondary,
                            display: "flex",
                            alignItems: "center",
                            gap: "2px",
                          }}
                        >
                          <EnvironmentOutline style={{ fontSize: "10px" }} />
                          {distance} km
                        </span>
                      </div>
                      {phoneNumber && (
                        <div
                          style={{
                            color: warmColors.textSecondary,
                            fontSize: "12px",
                            marginTop: "4px",
                          }}
                        >
                          Phone: {phoneNumber}
                        </div>
                      )}
                    </div>
                  }
                  extra={
                    <Button
                      size="small"
                      style={{
                        background: warmColors.primary,
                        border: "none",
                        borderRadius: "6px",
                        color: "white",
                        fontSize: "11px",
                        fontWeight: "600",
                        padding: "4px 10px",
                        height: "28px",
                        minWidth: "50px",
                      }}
                      onClick={() => handleJumpToBusiness(lat, lng)}
                    >
                      View on Map
                    </Button>
                  }
                >
                  <div
                    style={{
                      fontWeight: "600",
                      fontSize: "14px",
                      color: warmColors.textPrimary,
                    }}
                  >
                    {business.name || "Unknown Business"}
                    {ownerDetails?.name && (
                      <span style={{ fontWeight: "normal", fontSize: "12px" }}>
                        {" "}
                        (Owner: {ownerDetails.name})
                      </span>
                    )}
                  </div>
                </List.Item>
              );
            })}
          </List>
        )}
      </div>
    </div>
  );

  if (loading || !myLocation) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          background: warmColors.background,
          color: warmColors.textPrimary,
          fontSize: "16px",
          padding: "20px",
          textAlign: "center",
          gap: "16px",
        }}
      >
        <div>
          Loading{" "}
          {selectedBusinessType ? `${selectedBusinessType} businesses` : "map"}
          ...
        </div>
        {selectedBusinessType && (
          <div style={{ fontSize: "14px", opacity: 0.7 }}>
            Business Type: {selectedBusinessType}
          </div>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          background: warmColors.background,
          color: warmColors.error,
          fontSize: "16px",
          padding: "20px",
          textAlign: "center",
          gap: "16px",
        }}
      >
        <div>Error: {error}</div>
        <Button
          color="primary"
          onClick={() => navigate(-1)}
          style={{ background: warmColors.primary }}
        >
          Go Back
        </Button>
      </div>
    );
  }

  const tabItems = [
    {
      key: "map",
      title: (
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <GlobalOutline />
          Map
        </div>
      ),
    },
    {
      key: "list",
      title: (
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <UnorderedListOutline />
          List ({radiusFilteredBusinesses.length})
        </div>
      ),
    },
  ];

  return (
    <div
      style={{
        height: `75dvh`,
        width: "100vw",
        background: warmColors.background,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <NavBar
        style={{
          backgroundColor: warmColors.primary,
          color: "white",
          "--adm-color-text": "white",
          flexShrink: 0,
        }}
        onBack={() => navigate(-1)}
      >
        {selectedBusinessType
          ? `${selectedBusinessType} Businesses`
          : "Business Map"}
      </NavBar>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          "--adm-color-primary": warmColors.primary,
          "--adm-tabs-header-height": "44px",
        }}
      >
        {tabItems.map((item) => (
          <Tabs.Tab title={item.title} key={item.key}>
            <div
              style={{
                height: "calc(75dvh - 100px)", // Adjusted height to prevent overflow
                overflow: "hidden",
              }}
            >
              {item.key === "map" ? renderMapView() : renderListView()}
            </div>
          </Tabs.Tab>
        ))}
      </Tabs>
    </div>
  );
};
