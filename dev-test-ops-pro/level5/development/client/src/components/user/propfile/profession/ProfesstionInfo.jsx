import React, { useContext, useEffect, useState } from "react";
import ProfessionPicker from "../../../common/ProfessionPicker";
import {
  getProfessionTypes,
  getUserProfession,
  setUserProfession,
  updateUserProfession,
  deleteUserProfession,
} from "../../../../services/profession";
import { Button, Card, Dialog, Form, Space, Toast } from "antd-mobile";
import { EditSOutline, DeleteOutline } from "antd-mobile-icons";
import { AuthContext } from "../../../../contexts/AuthContext";
import { deleteUserAddress } from "../../../../services/address";
import AddressModal from "../../../common/AddressModal";

export default function ProfessionInfo() {
  const addressTypeOptions = [
    { label: "Profession Address", value: "PROFESSION" },
  ];

  const [form] = Form.useForm();
  const { user } = useContext(AuthContext);
  const userId = user?.id;
  const [professionsData, setProfessionsData] = useState([]);
  const [customData, setCustomData] = useState({});
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedAddressType, setSelectedAddressType] = useState([]);
  const [editingAddress, setEditingAddress] = useState(null);
  const [userProfessions, setUserProfessions] = useState([]);
  const [selectedProfessionId, setSelectedProfessionId] = useState(null);
  const [selectedProfessionData, setSelectedProfessionData] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProfessionId, setEditingProfessionId] = useState(null);

  const fetchUserProfessions = async () => {
    try {
      const res = await getUserProfession(userId);
      const mappedProfessions = Array.isArray(res.data)
        ? res.data.map((prof) => ({
            id: prof.id,
            type: prof.attributes.type || "",
            category: prof.attributes.category || "",
            subcategory: prof.attributes.subcategory || "",
            role: prof.attributes.role || "",
            profession_type: prof.attributes.profession_type || "",
            address: prof.attributes.address?.data
              ? {
                  id: prof.attributes.address.data.id,
                  addresstype:
                    prof.attributes.address.data.attributes.addresstype || "",
                  housename:
                    prof.attributes.address.data.attributes.housename || null,
                  landmark:
                    prof.attributes.address.data.attributes.landmark || null,
                  tehsil: prof.attributes.address.data.attributes.tehsil || "",
                  village:
                    prof.attributes.address.data.attributes.village || null,
                  district:
                    prof.attributes.address.data.attributes.district || "",
                  state: prof.attributes.address.data.attributes.state || "",
                  pincode:
                    prof.attributes.address.data.attributes.pincode || null,
                  latitude:
                    prof.attributes.address.data.attributes.latitude || null,
                  longitude:
                    prof.attributes.address.data.attributes.longitude || null,
                  country:
                    prof.attributes.address.data.attributes.country || "",
                  address_raw:
                    prof.attributes.address.data.attributes.address_raw || null,
                }
              : null,
          }))
        : [];
      setUserProfessions(mappedProfessions);
    } catch (error) {
      console.error("Failed to fetch user professions:", error);
      Toast.show({
        content: "Failed to load profession data",
        icon: "fail",
      });
      setUserProfessions([]);
    }
  };

  const handleDeleteAddress = async (addressId) => {
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
          });
          fetchUserProfessions();
        } catch (error) {
          Toast.show({
            content: "Failed to delete address",
            icon: "fail",
          });
        }
      },
    });
  };

  const handleAddAddressToProfession = (professionId) => {
    setSelectedProfessionId(professionId);
    setEditingAddress(null);
    setSelectedAddressType(["PROFESSION"]);
    const profession = userProfessions.find((prof) => prof.id === professionId);
    setSelectedProfessionData(profession || null);
    setShowAddressModal(true);
  };

  const handleEditAddress = (address, professionId) => {
    setSelectedProfessionId(professionId);
    setEditingAddress(address);
    setSelectedAddressType([address.addresstype]);
    const profession = userProfessions.find((prof) => prof.id === professionId);
    setSelectedProfessionData(profession || null);
    setShowAddressModal(true);
  };

  const handleAddressSaved = (savedAddress) => {
    setUserProfessions((prevProfessions) =>
      prevProfessions.map((prof) =>
        prof.id === selectedProfessionId
          ? {
              ...prof,
              address: {
                id: savedAddress.id,
                addresstype: savedAddress.addresstype,
                housename: savedAddress.housename || null,
                landmark: savedAddress.landmark || null,
                tehsil: savedAddress.tehsil || "",
                village: savedAddress.village || null,
                district: savedAddress.district || "",
                state: savedAddress.state || "",
                pincode: savedAddress.pincode || null,
                latitude: savedAddress.latitude || null,
                longitude: savedAddress.longitude || null,
                country: savedAddress.country || "",
                address_raw: savedAddress.address_raw || null,
              },
            }
          : prof
      )
    );
    fetchUserProfessions();
    setShowAddressModal(false);
    setEditingAddress(null);
    setSelectedAddressType([]);
    setSelectedProfessionId(null);
    setSelectedProfessionData(null);
  };

  const handleEditProfession = (professionId) => {
    const profession = userProfessions.find((prof) => prof.id === professionId);
    if (!profession) {
      Toast.show({
        content: "Profession not found",
        icon: "fail",
      });
      return;
    }

    form.resetFields();
    const professionData = {
      professionTypeCode: profession.profession_type,
      type: profession.type,
      category: profession.category,
      subcategory: profession.subcategory,
      role: profession.role,
    };

    setCustomData({
      profession: [professionData],
    });

    setEditingProfessionId(professionId);
    setShowForm(true);
  };

  const handleDeleteProfession = async (professionId) => {
    Dialog.confirm({
      content:
        "Are you sure you want to delete this profession? This will also delete its associated address.",
      confirmText: "Delete",
      cancelText: "Cancel",
      onConfirm: async () => {
        try {
          const profession = userProfessions.find(
            (prof) => prof.id === professionId
          );

          await deleteUserProfession(professionId);

          if (profession?.address?.id) {
            try {
              await deleteUserAddress(profession.address.id);
              console.log("Address deleted successfully with profession");
            } catch (addressError) {
              console.error("Failed to delete address:", addressError);
            }
          }

          Toast.show({
            content: "Profession deleted successfully",
            icon: "success",
          });

          fetchUserProfessions();

          if (editingProfessionId === professionId) {
            setEditingProfessionId(null);
            setShowForm(false);
            setCustomData({});
            form.resetFields();
          }
        } catch (error) {
          console.error("Failed to delete profession:", error);
          Toast.show({
            content: "Failed to delete profession",
            icon: "fail",
          });
        }
      },
    });
  };

  const handleProfessionChange = (selectedItems) => {
    const profession =
      Array.isArray(selectedItems) && selectedItems.length > 0
        ? selectedItems[0]
        : null;
    setCustomData((prev) => ({
      ...prev,
      profession,
    }));
  };

  const handleProfessionSubmit = async () => {
    if (!customData.profession) {
      Toast.show({
        content: "Profession is required",
        icon: "fail",
      });
      return;
    }

    const professionPayload = {
      profession_type: customData.profession.professionTypeCode,
      profession_type_code: customData.profession.professionTypeCode,
      type: customData.profession.type,
      category: customData.profession.category,
      subcategory: customData.profession.subcategory,
      role: customData.profession.role,
      user: userId,
    };

    try {
      if (editingProfessionId) {
        await updateUserProfession(editingProfessionId, professionPayload);
        Toast.show({
          content: "Profession updated successfully",
          icon: "success",
        });
      } else {
        await setUserProfession(professionPayload);
        Toast.show({
          content: "Profession added successfully",
          icon: "success",
        });
      }

      fetchUserProfessions();
      setCustomData({ profession: null });
      setShowForm(false);
      setEditingProfessionId(null);
      form.resetFields();
    } catch (error) {
      console.error("Failed to save profession:", error);
      Toast.show({
        content: editingProfessionId
          ? "Failed to update profession"
          : "Failed to add profession",
        icon: "fail",
      });
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingProfessionId(null);
    setCustomData({ profession: null });
    form.resetFields();
  };

  const formatAddress = (address) => {
    if (!address) return "No address available";
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
    return parts.length > 0 ? parts.join(", ") : "No address details";
  };

  const getAddressesForProfession = (professionId) => {
    const profession = userProfessions.find((prof) => prof.id === professionId);
    return profession?.address ? [profession.address] : [];
  };

  useEffect(() => {
    const getProfessionDataAndUserProfessions = async () => {
      try {
        const [profRes, userProfRes] = await Promise.all([
          getProfessionTypes(),
          getUserProfession(userId),
        ]);
        setProfessionsData(profRes || []);
        const mappedProfessions = Array.isArray(userProfRes.data)
          ? userProfRes.data.map((prof) => ({
              id: prof.id,
              type: prof.attributes.type || "",
              category: prof.attributes.category || "",
              subcategory: prof.attributes.subcategory || "",
              role: prof.attributes.role || "",
              profession_type: prof.attributes.profession_type || "",
              address: prof.attributes.address?.data
                ? {
                    id: prof.attributes.address.data.id,
                    addresstype:
                      prof.attributes.address.data.attributes.addresstype || "",
                    housename:
                      prof.attributes.address.data.attributes.housename || null,
                    landmark:
                      prof.attributes.address.data.attributes.landmark || null,
                    tehsil:
                      prof.attributes.address.data.attributes.tehsil || "",
                    village:
                      prof.attributes.address.data.attributes.village || null,
                    district:
                      prof.attributes.address.data.attributes.district || "",
                    state: prof.attributes.address.data.attributes.state || "",
                    pincode:
                      prof.attributes.address.data.attributes.pincode || null,
                    latitude:
                      prof.attributes.address.data.attributes.latitude || null,
                    longitude:
                      prof.attributes.address.data.attributes.longitude || null,
                    country:
                      prof.attributes.address.data.attributes.country || "",
                    address_raw:
                      prof.attributes.address.data.attributes.address_raw ||
                      null,
                  }
                : null,
            }))
          : [];
        setUserProfessions(mappedProfessions);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        Toast.show({
          content: "Failed to load profession data",
          icon: "fail",
        });
      }
    };
    getProfessionDataAndUserProfessions();
  }, [userId]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "8px",
        backgroundColor: "#fff7ed",
        minHeight: "100vh",
        overflowY: "auto",
        maxWidth: "360px",
        margin: "0 auto",
      }}
    >
      {!showForm && (
        <Button
          block
          style={{
            background: "#9a3412",
            border: "none",
            borderRadius: "6px",
            fontSize: "14px",
            fontWeight: "600",
            color: "#fff",
            padding: "8px",
            marginBottom: "12px",
            width: "100%",
            height: "36px",
          }}
          onClick={() => {
            setShowForm(true);
            setEditingProfessionId(null);
            setCustomData({});
            form.resetFields();
          }}
        >
          Add New Profession
        </Button>
      )}

      {showForm && (
        <div
          style={{
            width: "100%",
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            padding: "12px",
            marginBottom: "12px",
            border: "1px solid #fed7aa",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              backgroundColor: "#9a3412",
              color: "#fff",
              padding: "8px",
              borderRadius: "6px",
              fontSize: "16px",
              fontWeight: "600",
              textAlign: "center",
              marginBottom: "12px",
            }}
          >
            {editingProfessionId ? "Edit Profession" : "Add New Profession"}
          </div>
          <Form
            form={form}
            layout="vertical"
            footer={
              <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                <Button
                  block
                  color="primary"
                  onClick={handleProfessionSubmit}
                  disabled={!customData.profession}
                  style={{
                    flex: 1,
                    background: "#9a3412",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#fff",
                    height: "36px",
                    opacity: !customData.profession ? 0.6 : 1,
                  }}
                >
                  {editingProfessionId ? "Update" : "Add"}
                </Button>
                <Button
                  block
                  onClick={handleCancelForm}
                  style={{
                    flex: 1,
                    background: "#fff7ed",
                    border: "1px solid #9a3412",
                    borderRadius: "6px",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#9a3412",
                    height: "36px",
                  }}
                >
                  Cancel
                </Button>
              </div>
            }
          >
            <Form.Item style={{ marginBottom: "12px" }}>
              <ProfessionPicker
                value={customData.profession || null}
                onChange={handleProfessionChange}
                professions={professionsData}
                multiSelect={false}
                placeholder="Select your current profession"
              />
            </Form.Item>
          </Form>
        </div>
      )}

      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <h2
          style={{
            fontSize: "18px",
            fontWeight: "600",
            color: "#9a3412",
            textAlign: "center",
            margin: "8px 0",
          }}
        >
          Your Professions
        </h2>

        {userProfessions.length === 0 ? (
          <Card
            style={{
              textAlign: "center",
              padding: "16px",
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              border: "1px solid #fed7aa",
              color: "#6b7280",
              fontSize: "14px",
            }}
          >
            No professions added yet. Use the form above to add one.
          </Card>
        ) : (
          userProfessions.map((profession) => (
            <Card
              key={profession.id}
              style={{
                backgroundColor: "#f5e7db",
                borderRadius: "8px",
                padding: "12px",
                border: "1px solid #fed7aa",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#9a3412",
                    margin: 0,
                  }}
                >
                  🏢 {profession.type || "Profession"}
                </h3>
                <div style={{ display: "flex", gap: "6px" }}>
                  <Button
                    size="small"
                    style={{
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      background: "#3b82f6",
                      color: "#fff",
                      border: "none",
                    }}
                    onClick={() => handleEditProfession(profession.id)}
                  >
                    <EditSOutline fontSize={12} /> Edit
                  </Button>
                  <Button
                    size="small"
                    style={{
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      background: "#b91c1c",
                      color: "#fff",
                      border: "none",
                    }}
                    onClick={() => handleDeleteProfession(profession.id)}
                  >
                    <DeleteOutline fontSize={12} /> Delete
                  </Button>
                  <Button
                    size="small"
                    style={{
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      background: "#f97316",
                      color: "#fff",
                      border: "none",
                    }}
                    onClick={() => handleAddAddressToProfession(profession.id)}
                  >
                    + Address
                  </Button>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                {profession.type && (
                  <div
                    style={{
                      backgroundColor: "#fff7ed",
                      borderRadius: "4px",
                      padding: "8px",
                      border: "1px solid #fed7aa",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "#9a3412",
                        marginBottom: "4px",
                      }}
                    >
                      Type
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        color: "#3f3f46",
                      }}
                    >
                      {profession.type}
                    </div>
                  </div>
                )}
                {profession.category && (
                  <div
                    style={{
                      backgroundColor: "#fff7ed",
                      borderRadius: "4px",
                      padding: "8px",
                      border: "1px solid #fed7aa",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "#9a3412",
                        marginBottom: "4px",
                      }}
                    >
                      Category
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        color: "#3f3f46",
                      }}
                    >
                      {profession.category}
                    </div>
                  </div>
                )}
                {profession.subcategory && (
                  <div
                    style={{
                      backgroundColor: "#fff7ed",
                      borderRadius: "4px",
                      padding: "8px",
                      border: "1px solid #fed7aa",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "#9a3412",
                        marginBottom: "4px",
                      }}
                    >
                      Subcategory
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        color: "#3f3f46",
                      }}
                    >
                      {profession.subcategory}
                    </div>
                  </div>
                )}
                {profession.role && (
                  <div
                    style={{
                      backgroundColor: "#fff7ed",
                      borderRadius: "4px",
                      padding: "8px",
                      border: "1px solid #fed7aa",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "#9a3412",
                        marginBottom: "4px",
                      }}
                    >
                      Role
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        color: "#3f3f46",
                      }}
                    >
                      {profession.role}
                    </div>
                  </div>
                )}
                {profession.profession_type && (
                  <div
                    style={{
                      backgroundColor: "#fff7ed",
                      borderRadius: "4px",
                      padding: "8px",
                      border: "1px solid #fed7aa",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "#9a3412",
                        marginBottom: "4px",
                      }}
                    >
                      Profession Type
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        color: "#3f3f46",
                      }}
                    >
                      {profession.profession_type}
                    </div>
                  </div>
                )}
              </div>

              <div
                style={{
                  marginTop: "12px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <h4
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#9a3412",
                      margin: 0,
                    }}
                  >
                    📍 Addresses
                  </h4>
                </div>
                {getAddressesForProfession(profession.id).length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "8px",
                      backgroundColor: "#fff7ed",
                      borderRadius: "4px",
                      color: "#9a3412",
                      fontSize: "13px",
                      border: "1px solid #fed7aa",
                    }}
                  >
                    No addresses added
                  </div>
                ) : (
                  getAddressesForProfession(profession.id).map((address) => (
                    <Card
                      key={address.id}
                      style={{
                        marginBottom: "8px",
                        borderRadius: "6px",
                        backgroundColor: "#ffffff",
                        border: "1px solid #fed7aa",
                        padding: "8px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "6px",
                        }}
                      >
                        <span
                          style={{
                            background: "#059669",
                            color: "#fff",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "10px",
                            fontWeight: "600",
                          }}
                        >
                          {addressTypeOptions.find(
                            (opt) => opt.value === address.addresstype
                          )?.label ||
                            address.addresstype ||
                            "N/A"}
                        </span>
                        <div style={{ display: "flex", gap: "6px" }}>
                          <Button
                            size="small"
                            style={{
                              padding: "4px 8px",
                              borderRadius: "4px",
                              fontSize: "12px",
                              background: "#3b82f6",
                              color: "#fff",
                              border: "none",
                            }}
                            onClick={() =>
                              handleEditAddress(address, profession.id)
                            }
                          >
                            <EditSOutline fontSize={12} /> Edit
                          </Button>
                          <Button
                            size="small"
                            style={{
                              padding: "4px 8px",
                              borderRadius: "4px",
                              fontSize: "12px",
                              background: "#b91c1c",
                              color: "#fff",
                              border: "none",
                            }}
                            onClick={() => handleDeleteAddress(address.id)}
                          >
                            <DeleteOutline fontSize={12} /> Delete
                          </Button>
                        </div>
                      </div>
                      <div
                        style={{
                          fontSize: "13px",
                          color: "#3f3f46",
                        }}
                      >
                        {formatAddress(address)}
                      </div>
                      {address.latitude && address.longitude && (
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#6b7280",
                            marginTop: "6px",
                          }}
                        >
                          📍 {address.latitude.toFixed(4)},{" "}
                          {address.longitude.toFixed(4)}
                        </div>
                      )}
                    </Card>
                  ))
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      <AddressModal
        visible={showAddressModal}
        onClose={() => {
          setShowAddressModal(false);
          setEditingAddress(null);
          setSelectedAddressType([]);
          setSelectedProfessionId(null);
          setSelectedProfessionData(null);
        }}
        addressType={selectedAddressType[0]}
        typeKey="user_profession"
        typeId={selectedProfessionId}
        initialAddress={editingAddress}
        professionData={selectedProfessionData}
        onAddressSaved={handleAddressSaved}
      />
    </div>
  );
}
