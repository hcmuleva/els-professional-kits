import { useEffect, useState } from "react";
import BusinessForm from "./BusinessForm";
import BusinessCard from "./BusinessCard";
import { useAuth } from "../../../../contexts/AuthContext";
import { getBusiness, deleteBusiness } from "../../../../services/business";
import { deleteUserAddress } from "../../../../services/address";
import { Dialog, Toast } from "antd-mobile";
import AddressModal from "../../../common/AddressModal";

export default function BusinessCardList() {
  const [businesses, setBusinesses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState(null);
  const { user } = useAuth();
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedAddressType, setSelectedAddressType] = useState([]);
  const [editingAddress, setEditingAddress] = useState(null);
  const [selectedBusinessId, setSelectedBusinessId] = useState(null);
  const [selectedBusinessData, setSelectedBusinessData] = useState(null);

  const handleAddBusiness = () => {
    setEditingBusiness(null);
    setShowForm(true);
  };

  const fetchBusinessData = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const response = await getBusiness(user?.id);
      if (response?.data) {
        console.log("Business data fetched successfully:", response.data);
        setBusinesses(response.data);
      } else {
        setBusinesses([]);
      }
    } catch (error) {
      console.error("Error fetching business data:", error);
      setBusinesses([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinessData();
  }, [user?.id]);

  const handleEditBusiness = (business) => {
    console.log("Editing business:", business);
    console.log("Business attributes:", business.attributes);

    // Create a properly structured editing object
    const editingBusiness = {
      id: business.id,
      name: business.attributes?.name || "",
      description: business.attributes?.description || "",
      type: business.attributes?.type || "",
      role: business.attributes?.role || "",
      mobile_number_1: business.attributes?.mobile_number_1 || "",
      mobile_number_2: business.attributes?.mobile_number_2 || "",
      mobile_number_3: business.attributes?.mobile_number_3 || "",
      websiteurl: business.attributes?.websiteurl || "",
      businessid: business.attributes?.businessid || "",
      // Add any other fields that might be missing
    };

    console.log("Structured editing business:", editingBusiness);
    setEditingBusiness(editingBusiness);
    setShowForm(true);
  };

  const handleDeleteBusiness = async (businessId) => {
    if (!businessId) {
      Toast.show({
        content: "Invalid business ID",
        icon: "fail",
        position: "center",
      });
      return;
    }

    Dialog.confirm({
      content:
        "Are you sure you want to delete this business? This will also delete all associated addresses.",
      confirmText: "Delete",
      cancelText: "Cancel",
      onConfirm: async () => {
        try {
          await deleteBusiness(businessId);
          Toast.show({
            content: "Business deleted successfully",
            icon: "success",
            position: "center",
          });
          // Remove the business from the state
          setBusinesses((prevBusinesses) =>
            prevBusinesses.filter((business) => business.id !== businessId)
          );
        } catch (error) {
          Toast.show({
            content: "Failed to delete business",
            icon: "fail",
            position: "center",
          });
          console.error("Error deleting business:", error);
        }
      },
    });
  };

  const handleAddAddressToBusiness = (business) => {
    console.log("Adding address for business:", business);
    setSelectedBusinessId(business.id);
    setEditingAddress(null);
    setSelectedAddressType(["BUSINESS"]);
    setSelectedBusinessData(business);
    setShowAddressModal(true);
  };

  const handleEditAddress = (address, businessId) => {
    console.log("Editing address:", address, "for business:", businessId);
    const business = businesses.find((biz) => biz.id === businessId);
    setSelectedBusinessId(businessId);
    setEditingAddress({ id: address.id, ...address });
    setSelectedAddressType([address.addresstype || "BUSINESS"]);
    setSelectedBusinessData(business || null);
    setShowAddressModal(true);
  };

  const handleAddressSaved = (savedAddress, businessId) => {
    console.log("Address saved:", savedAddress, "for business:", businessId);
    // Update businesses state with the new address
    setBusinesses((prevBusinesses) =>
      prevBusinesses.map((biz) =>
        biz.id === businessId
          ? {
              ...biz,
              attributes: {
                ...biz.attributes,
                address: {
                  data: {
                    id: savedAddress.id,
                    attributes: {
                      addresstype: savedAddress.addresstype,
                      tehsil: savedAddress.tehsil,
                      district: savedAddress.district,
                      state: savedAddress.state,
                      country: savedAddress.country,
                      pincode: savedAddress.pincode,
                      latitude: savedAddress.latitude,
                      longitude: savedAddress.longitude,
                      landmark: savedAddress.landmark,
                      village: savedAddress.village,
                      housename: savedAddress.housename,
                      address_raw: savedAddress.address_raw,
                    },
                  },
                },
              },
            }
          : biz
      )
    );
    // Fetch updated business data
    fetchBusinessData();
    setShowAddressModal(false);
    setEditingAddress(null);
    setSelectedAddressType([]);
    setSelectedBusinessId(null);
    setSelectedBusinessData(null);
  };

  const handleDeleteAddress = async (addressId) => {
    if (!addressId) {
      Toast.show({
        content: "Invalid address ID",
        icon: "fail",
        position: "center",
      });
      return;
    }
    Dialog.confirm({
      content: "Are you sure you want to delete this address?",
      confirmText: "Delete",
      cancelText: "Cancel",
      onConfirm: async () => {
        try {
          await deleteUserAddress(addressId);
          Toast.show({
            content: "Address deleted successfully",
            icon: "success",
            position: "center",
          });
          fetchBusinessData();
        } catch (error) {
          Toast.show({
            content: "Failed to delete address",
            icon: "fail",
            position: "center",
          });
          console.error("Error deleting address:", error);
        }
      },
    });
  };

  const formatAddress = (address) => {
    if (!address) return null;
    const parts = [
      address.housename,
      address.address_raw,
      address.village,
      address.landmark,
      address.tehsil,
      address.district,
      address.state,
      address.country,
      address.pincode,
    ].filter(Boolean);
    return parts.join(", ");
  };

  const getAddressesForBusiness = (businessId) => {
    const business = businesses.find((biz) => biz.id === businessId);
    if (business?.attributes?.address?.data) {
      return [
        {
          id: business.attributes.address.data.id,
          ...business.attributes.address.data.attributes,
        },
      ];
    }
    return [];
  };

  const handleCloseForm = (shouldRefresh = false) => {
    setShowForm(false);
    setEditingBusiness(null);
    if (shouldRefresh) {
      fetchBusinessData();
    }
  };

  const handleCloseAddressModal = () => {
    setShowAddressModal(false);
    setEditingAddress(null);
    setSelectedAddressType([]);
    setSelectedBusinessId(null);
    setSelectedBusinessData(null);
  };

  return (
    <div
      style={{
        backgroundColor: "#f9fafb",
        minHeight: "100vh",
        padding: "0",
        margin: "0",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Header */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          marginBottom: "32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <p
            style={{
              fontSize: "16px",
              color: "#6b7280",
              margin: "0",
            }}
          >
            {businesses.length} business{businesses.length !== 1 ? "es" : ""}{" "}
            registered
          </p>
        </div>
        <button
          onClick={handleAddBusiness}
          style={{
            padding: "12px 24px",
            fontSize: "16px",
            fontWeight: "600",
            border: "none",
            borderRadius: "8px",
            backgroundColor: "#ea5a47",
            color: "#ffffff",
            cursor: "pointer",
            transition: "background-color 0.2s ease",
            outline: "none",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "#dc4a37";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "#ea5a47";
          }}
        >
          बिजनेस जोड़े
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            textAlign: "center",
            padding: "40px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              border: "4px solid #f3f4f6",
              borderTop: "4px solid #ea5a47",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 16px",
            }}
          ></div>
          <p style={{ color: "#6b7280" }}>Loading businesses...</p>
        </div>
      )}

      {/* Business Cards Grid */}
      {!isLoading && businesses.length > 0 && (
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "grid",
            // gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
            gap: "24px",
            justifyItems: "center",
          }}
        >
          {businesses.map((business) => (
            <BusinessCard
              key={business.id}
              business={business}
              onEdit={() => handleEditBusiness(business)}
              onDelete={() => handleDeleteBusiness(business.id)}
              onAddAddress={() => handleAddAddressToBusiness(business)}
              onEditAddress={(address) =>
                handleEditAddress(address, business.id)
              }
              onDeleteAddress={handleDeleteAddress}
              formatAddress={formatAddress}
              getAddressesForBusiness={() =>
                getAddressesForBusiness(business.id)
              }
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && businesses.length === 0 && (
        <div
          style={{
            maxWidth: "400px",
            margin: "80px auto",
            textAlign: "center",
            padding: "40px",
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              backgroundColor: "#f3f4f6",
              borderRadius: "50%",
              margin: "0 auto 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              color: "#9ca3af",
            }}
          >
            📋
          </div>
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#1f2937",
              margin: "0 0 8px 0",
            }}
          >
            No businesses yet
          </h3>
          <p
            style={{
              fontSize: "14px",
              color: "#6b7280",
              margin: "0 0 24px 0",
            }}
          >
            Get started by adding your first business card
          </p>
          <button
            onClick={handleAddBusiness}
            style={{
              padding: "10px 20px",
              fontSize: "14px",
              fontWeight: "600",
              border: "none",
              borderRadius: "6px",
              backgroundColor: "#ea5a47",
              color: "#ffffff",
              cursor: "pointer",
              transition: "background-color 0.2s ease",
            }}
          >
            Add Business
          </button>
        </div>
      )}

      {showForm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              maxWidth: "90vw",
              maxHeight: "90vh",
              overflow: "auto",
            }}
          >
            <BusinessForm
              editingBusiness={editingBusiness}
              onClose={handleCloseForm}
            />
          </div>
        </div>
      )}

      {/* Address Modal */}
      {showAddressModal && (
        <AddressModal
          visible={showAddressModal}
          onClose={handleCloseAddressModal}
          addressType={selectedAddressType[0]}
          typeKey="businesses"
          typeId={selectedBusinessId}
          initialAddress={editingAddress}
          businessData={selectedBusinessData}
          onAddressSaved={(savedAddress) =>
            handleAddressSaved(savedAddress, selectedBusinessId)
          }
        />
      )}

      {/* Add CSS animation for loading spinner */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}
