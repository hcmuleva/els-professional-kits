import React, { useState, useEffect, useContext } from "react";
import {
  Button,
  Form,
  Input,
  Picker,
  Toast,
  Card,
  SearchBar,
  Dialog,
  Divider,
} from "antd-mobile";
import {
  AddOutline,
  TeamOutline,
  EditSOutline,
  DeleteOutline,
  SearchOutline,
} from "antd-mobile-icons";
import { AuthContext } from "../../../contexts/AuthContext";
import {
  createCommittee,
  deleteCommittee,
  getCommittee,
  getCommitteeData,
  updateCommittee,
} from "../../../services/committee";
import { useNavigate } from "react-router-dom";

const AdminCommittees = ({ orgId }) => {
  const { user } = useContext(AuthContext);
  const [committeeData, setCommitteeData] = useState(null);
  const [committees, setCommittees] = useState([]);
  const [filteredCommittees, setFilteredCommittees] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingCommittee, setEditingCommittee] = useState(null);
  const [searchText, setSearchText] = useState("");

  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  const [createData, setCreateData] = useState({
    name: "",
    type: null,
    subtype: null,
  });

  const [editData, setEditData] = useState({
    name: "",
    type: null,
    subtype: null,
  });

  const [pickers, setPickers] = useState({
    createType: { visible: false, searchText: "" },
    createSubtype: { visible: false, searchText: "" },
    editType: { visible: false, searchText: "" },
    editSubtype: { visible: false, searchText: "" },
  });

  // Initialize data
  useEffect(() => {
    fetchInitialData();
  }, []);

  // Filter committees based on search
  useEffect(() => {
    if (!searchText.trim()) {
      setFilteredCommittees(committees);
    } else {
      const filtered = committees.filter((committee) => {
        const displayData = formatCommitteeForDisplay(committee);
        const searchLower = searchText.toLowerCase();
        return (
          displayData.committeeName.toLowerCase().includes(searchLower) ||
          displayData.type.toLowerCase().includes(searchLower) ||
          displayData.subtype.toLowerCase().includes(searchLower)
        );
      });
      setFilteredCommittees(filtered);
    }
  }, [searchText, committees]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [typesRes, committeesRes] = await Promise.all([
        getCommitteeData(),
        getCommittee(),
      ]);

      setCommitteeData(typesRes);
      setCommittees(committeesRes?.data || []);
    } catch (error) {
      Toast.show({
        content: "Failed to load data",
        position: "top",
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshCommittees = async () => {
    try {
      const committeesRes = await getCommittee();
      setCommittees(committeesRes?.data || []);
    } catch (error) {
      Toast.show({
        content: "Failed to refresh committees",
        position: "top",
      });
    }
  };

  // Helper functions
  const getCommitteeTypes = (searchText = "") => {
    if (!committeeData?.data?.[0]?.attributes?.types_data?.committees) {
      return [];
    }

    const allTypes = committeeData.data[0].attributes.types_data.committees.map(
      (committee) => ({
        label: committee.type.charAt(0).toUpperCase() + committee.type.slice(1),
        value: committee.type,
      })
    );

    if (searchText.trim()) {
      return allTypes.filter((type) =>
        type.label.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    return allTypes;
  };

  const getSubtypes = (selectedTypeValue, searchText = "") => {
    if (
      !selectedTypeValue ||
      !committeeData?.data?.[0]?.attributes?.types_data?.committees
    ) {
      return [];
    }

    const typeData =
      committeeData.data[0].attributes.types_data.committees.find(
        (committee) => committee.type === selectedTypeValue
      );

    const allSubtypes =
      typeData?.subtypes?.map((subtype) => ({
        label: subtype.name.charAt(0).toUpperCase() + subtype.name.slice(1),
        value: subtype.name,
      })) || [];

    if (searchText.trim()) {
      return allSubtypes.filter((subtype) =>
        subtype.label.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    return allSubtypes;
  };

  const formatCommitteeForDisplay = (committee) => ({
    id: committee.id,
    committeeName: committee.attributes?.committee_name || "",
    type: committee.attributes?.type || "",
    subtype: committee.attributes?.subtype || "",
    createdAt: committee.attributes?.createdAt || new Date().toISOString(),
  });

  const getDisplayText = (value, placeholder) => {
    if (!value) return placeholder;
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  // Picker helpers
  const updatePicker = (pickerKey, updates) => {
    setPickers((prev) => ({
      ...prev,
      [pickerKey]: { ...prev[pickerKey], ...updates },
    }));
  };

  const closePicker = (pickerKey) => {
    updatePicker(pickerKey, { visible: false, searchText: "" });
  };

  // Form handlers
  const handleCreateCommittee = async () => {
    if (!createData.name.trim()) {
      Toast.show({ content: "Please enter committee name", position: "top" });
      return;
    }
    if (!createData.type) {
      Toast.show({ content: "Please select committee type", position: "top" });
      return;
    }
    if (!createData.subtype) {
      Toast.show({
        content: "Please select committee subtype",
        position: "top",
      });
      return;
    }

    try {
      setLoading(true);
      await createCommittee({
        committee_name: createData.name,
        type: createData.type,
        subtype: createData.subtype,
        creator: user?.id,
      });

      await refreshCommittees();
      resetCreateForm();
      Toast.show({
        content: "Committee created successfully!",
        position: "top",
      });
    } catch (error) {
      Toast.show({ content: "Failed to create committee", position: "top" });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCommittee = async () => {
    if (!editData.name.trim()) {
      Toast.show({ content: "Please enter committee name", position: "top" });
      return;
    }
    if (!editData.type) {
      Toast.show({ content: "Please select committee type", position: "top" });
      return;
    }
    if (!editData.subtype) {
      Toast.show({
        content: "Please select committee subtype",
        position: "top",
      });
      return;
    }

    try {
      setLoading(true);
      await updateCommittee(
        {
          committee_name: editData.name,
          type: editData.type,
          subtype: editData.subtype,
        },
        editingCommittee.id
      );

      await refreshCommittees();
      resetEditForm();
      Toast.show({
        content: "Committee updated successfully!",
        position: "top",
      });
    } catch (error) {
      Toast.show({ content: "Failed to update committee", position: "top" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCommittee = (committee) => {
    Dialog.confirm({
      content: `Are you sure you want to delete "${committee.attributes?.committee_name}"?`,
      onConfirm: async () => {
        try {
          setLoading(true);
          await deleteCommittee(committee.id);
          await refreshCommittees();
          Toast.show({
            content: "Committee deleted successfully!",
            position: "top",
          });
        } catch (error) {
          Toast.show({
            content: "Failed to delete committee",
            position: "top",
          });
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handleEditCommittee = (committee) => {
    setEditingCommittee(committee);
    setEditData({
      name: committee.attributes?.committee_name || "",
      type: committee.attributes?.type || null,
      subtype: committee.attributes?.subtype || null,
    });
    setShowEditForm(true);
  };

  const handleViewGroup = (committee) => {
    // console.log("Navigate to committee:", committee);
    // Navigation logic here
    navigate(`/committee/${orgId}/${committee.id}`);
  };

  // Form reset functions
  const resetCreateForm = () => {
    setShowCreateForm(false);
    form.resetFields();
    setCreateData({ name: "", type: null, subtype: null });
  };

  const resetEditForm = () => {
    setShowEditForm(false);
    setEditingCommittee(null);
    editForm.resetFields();
    setEditData({ name: "", type: null, subtype: null });
  };

  // Reset subtype when type changes
  useEffect(() => {
    setCreateData((prev) => ({ ...prev, subtype: null }));
  }, [createData.type]);

  useEffect(() => {
    setEditData((prev) => ({ ...prev, subtype: null }));
  }, [editData.type]);

  // Custom Picker Header Component
  const CustomPickerHeader = ({
    searchText,
    onSearchChange,
    placeholder,
    onClear,
  }) => (
    <div
      style={{
        padding: "12px 16px",
        borderBottom: "1px solid #f0f0f0",
        backgroundColor: "#fff",
      }}
    >
      <SearchBar
        placeholder={placeholder}
        value={searchText}
        onChange={onSearchChange}
        onClear={onClear}
        style={{
          "--background": "#f5f5f5",
          "--border-radius": "20px",
          "--height": "36px",
        }}
      />
    </div>
  );

  // Render form field component
  const FormField = ({
    label,
    value,
    placeholder,
    onClick,
    required = false,
  }) => (
    <Form.Item label={label} required={required}>
      <div
        style={{
          padding: "12px 16px",
          border: "1px solid #d9d9d9",
          borderRadius: "8px",
          background: "#fff",
          minHeight: "44px",
          display: "flex",
          alignItems: "center",
          fontSize: "14px",
          color: value ? "#333" : "#999",
          cursor: "pointer",
        }}
        onClick={onClick}
      >
        {getDisplayText(value, placeholder)}
      </div>
    </Form.Item>
  );

  // Check admin access
  if (!user || user.userrole !== "ADMIN") {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <p style={{ color: "#ff4d4f", fontSize: "16px" }}>
          Access denied. Admin privileges required.
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: "12px", minHeight: "100vh", paddingBottom: "80px" }}>
      {/* Header */}
      <div style={{ marginBottom: "16px", padding: "4px 0" }}>
        <h2
          style={{
            margin: 0,
            color: "#ff6b35",
            fontSize: "18px",
            fontWeight: "600",
          }}
        >
          Committee Management
        </h2>
        <p style={{ margin: "4px 0 0 0", color: "#666", fontSize: "13px" }}>
          Create and manage committee groups
        </p>
      </div>

      {/* Action Buttons */}
      {!showCreateForm && !showEditForm && (
        <div style={{ marginBottom: "16px" }}>
          <Button
            color="primary"
            size="large"
            style={{
              background: "#ff6b35",
              borderColor: "#ff6b35",
              width: "100%",
              height: "44px",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: "500",
              marginBottom: "12px",
            }}
            onClick={() => setShowCreateForm(true)}
            loading={loading}
          >
            <AddOutline style={{ marginRight: "6px", fontSize: "16px" }} />
            Create New Committee
          </Button>

          {/* Search Bar */}
          {committees.length > 0 && (
            <SearchBar
              placeholder="Search committees..."
              value={searchText}
              onChange={setSearchText}
              style={{
                "--background": "#f5f5f5",
                "--border-radius": "12px",
                "--height": "40px",
              }}
            />
          )}
        </div>
      )}

      {/* Create Form */}
      {showCreateForm && (
        <Card
          style={{
            marginBottom: "16px",
            borderRadius: "12px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
            border: "1px solid #f0f0f0",
          }}
        >
          <div style={{ padding: "16px" }}>
            <h3
              style={{
                margin: "0 0 16px 0",
                color: "#333",
                fontSize: "16px",
                fontWeight: "600",
              }}
            >
              Create New Committee
            </h3>

            <Form
              form={form}
              layout="vertical"
              style={{ "--adm-color-primary": "#ff6b35" }}
            >
              <Form.Item label="Committee Name" required>
                <Input
                  placeholder="Enter committee name"
                  value={createData.name}
                  onChange={(value) =>
                    setCreateData((prev) => ({ ...prev, name: value }))
                  }
                  style={{
                    "--font-size": "14px",
                    "--placeholder-color": "#999",
                    minHeight: "44px",
                  }}
                />
              </Form.Item>

              <FormField
                label="Committee Type"
                value={createData.type}
                placeholder="Select committee type"
                onClick={() => updatePicker("createType", { visible: true })}
                required
              />

              {createData.type && (
                <FormField
                  label="Committee Subtype"
                  value={createData.subtype}
                  placeholder="Select committee subtype"
                  onClick={() =>
                    updatePicker("createSubtype", { visible: true })
                  }
                  required
                />
              )}

              <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
                <Button
                  style={{
                    flex: 1,
                    height: "44px",
                    borderRadius: "8px",
                    fontSize: "14px",
                  }}
                  onClick={resetCreateForm}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  style={{
                    flex: 1,
                    background: "#ff6b35",
                    borderColor: "#ff6b35",
                    height: "44px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                  onClick={handleCreateCommittee}
                  loading={loading}
                >
                  Create Committee
                </Button>
              </div>
            </Form>
          </div>
        </Card>
      )}

      {/* Edit Form */}
      {showEditForm && editingCommittee && (
        <Card
          style={{
            marginBottom: "16px",
            borderRadius: "12px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
            border: "1px solid #f0f0f0",
          }}
        >
          <div style={{ padding: "16px" }}>
            <h3
              style={{
                margin: "0 0 16px 0",
                color: "#333",
                fontSize: "16px",
                fontWeight: "600",
              }}
            >
              Edit Committee
            </h3>

            <Form
              form={editForm}
              layout="vertical"
              style={{ "--adm-color-primary": "#ff6b35" }}
            >
              <Form.Item label="Committee Name" required>
                <Input
                  placeholder="Enter committee name"
                  value={editData.name}
                  onChange={(value) =>
                    setEditData((prev) => ({ ...prev, name: value }))
                  }
                  style={{
                    "--font-size": "14px",
                    "--placeholder-color": "#999",
                    minHeight: "44px",
                  }}
                />
              </Form.Item>

              <FormField
                label="Committee Type"
                value={editData.type}
                placeholder="Select committee type"
                onClick={() => updatePicker("editType", { visible: true })}
                required
              />

              {editData.type && (
                <FormField
                  label="Committee Subtype"
                  value={editData.subtype}
                  placeholder="Select committee subtype"
                  onClick={() => updatePicker("editSubtype", { visible: true })}
                  required
                />
              )}

              <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
                <Button
                  style={{
                    flex: 1,
                    height: "44px",
                    borderRadius: "8px",
                    fontSize: "14px",
                  }}
                  onClick={resetEditForm}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  style={{
                    flex: 1,
                    background: "#ff6b35",
                    borderColor: "#ff6b35",
                    height: "44px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                  onClick={handleUpdateCommittee}
                  loading={loading}
                >
                  Update Committee
                </Button>
              </div>
            </Form>
          </div>
        </Card>
      )}

      {/* Committee List */}
      {!showCreateForm && !showEditForm && (
        <>
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <div style={{ color: "#ff6b35", fontSize: "14px" }}>
                Loading committees...
              </div>
            </div>
          ) : filteredCommittees.length > 0 ? (
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    color: "#333",
                    fontSize: "16px",
                    fontWeight: "600",
                  }}
                >
                  Committees
                </h3>
                <span style={{ color: "#666", fontSize: "13px" }}>
                  {searchText
                    ? `${filteredCommittees.length} of ${committees.length}`
                    : committees.length}{" "}
                  total
                </span>
              </div>

              {filteredCommittees.map((committee) => {
                const displayCommittee = formatCommitteeForDisplay(committee);
                return (
                  <Card
                    key={committee.id}
                    style={{
                      marginBottom: "8px",
                      borderRadius: "12px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                      border: "1px solid #f0f0f0",
                    }}
                  >
                    <div style={{ padding: "12px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          marginBottom: "8px",
                        }}
                      >
                        <div
                          style={{
                            backgroundColor: "#fff2ed",
                            borderRadius: "8px",
                            padding: "6px",
                            marginRight: "10px",
                            minWidth: "32px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <TeamOutline
                            style={{ fontSize: "16px", color: "#ff6b35" }}
                          />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h4
                            style={{
                              margin: "0 0 4px 0",
                              color: "#333",
                              fontSize: "15px",
                              fontWeight: "500",
                              lineHeight: "1.2",
                            }}
                          >
                            {displayCommittee.committeeName}
                          </h4>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#666",
                              marginBottom: "4px",
                            }}
                          >
                            <span
                              style={{ color: "#ff6b35", fontWeight: "500" }}
                            >
                              {getDisplayText(displayCommittee.type, "")}
                            </span>
                            {" • "}
                            <span>
                              {getDisplayText(displayCommittee.subtype, "")}
                            </span>
                          </div>
                          <div style={{ fontSize: "11px", color: "#999" }}>
                            Created:{" "}
                            {new Date(
                              displayCommittee.createdAt
                            ).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          marginTop: "8px",
                        }}
                      >
                        <Button
                          size="small"
                          color="primary"
                          fill="outline"
                          style={{
                            borderColor: "#ff6b35",
                            color: "#ff6b35",
                            flex: 1,
                            height: "36px",
                            fontSize: "13px",
                            fontWeight: "500",
                          }}
                          onClick={() => handleViewGroup(committee)}
                        >
                          View Group
                        </Button>
                        <Button
                          size="small"
                          fill="outline"
                          style={{
                            borderColor: "#1890ff",
                            color: "#1890ff",
                            minWidth: "36px",
                            height: "36px",
                            padding: "0 8px",
                          }}
                          onClick={() => handleEditCommittee(committee)}
                        >
                          <EditSOutline style={{ fontSize: "14px" }} />
                        </Button>
                        <Button
                          size="small"
                          fill="outline"
                          style={{
                            borderColor: "#ff4d4f",
                            color: "#ff4d4f",
                            minWidth: "36px",
                            height: "36px",
                            padding: "0 8px",
                          }}
                          onClick={() => handleDeleteCommittee(committee)}
                        >
                          <DeleteOutline style={{ fontSize: "14px" }} />
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                color: "#666",
              }}
            >
              <div
                style={{
                  backgroundColor: "#f8f8f8",
                  borderRadius: "50%",
                  width: "80px",
                  height: "80px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}
              >
                <TeamOutline style={{ fontSize: "32px", color: "#ddd" }} />
              </div>
              <p
                style={{ margin: "0 0 8px 0", fontSize: "16px", color: "#333" }}
              >
                {searchText
                  ? "No matching committees found"
                  : "No committees created yet"}
              </p>
              <p style={{ margin: 0, fontSize: "13px", color: "#999" }}>
                {searchText
                  ? "Try adjusting your search terms"
                  : "Click 'Create New Committee' to get started"}
              </p>
            </div>
          )}
        </>
      )}

      {/* Pickers */}
      <Picker
        columns={[getCommitteeTypes(pickers.createType.searchText)]}
        visible={pickers.createType.visible}
        onClose={() => closePicker("createType")}
        onConfirm={(value) => {
          setCreateData((prev) => ({ ...prev, type: value[0] }));
          closePicker("createType");
        }}
        onCancel={() => closePicker("createType")}
        title="Select Committee Type"
        renderHeader={() => (
          <CustomPickerHeader
            searchText={pickers.createType.searchText}
            onSearchChange={(text) =>
              updatePicker("createType", { searchText: text })
            }
            placeholder="Search committee types..."
            onClear={() => updatePicker("createType", { searchText: "" })}
          />
        )}
      />

      <Picker
        columns={[
          getSubtypes(createData.type, pickers.createSubtype.searchText),
        ]}
        visible={pickers.createSubtype.visible}
        onClose={() => closePicker("createSubtype")}
        onConfirm={(value) => {
          setCreateData((prev) => ({ ...prev, subtype: value[0] }));
          closePicker("createSubtype");
        }}
        onCancel={() => closePicker("createSubtype")}
        title="Select Committee Subtype"
        renderHeader={() => (
          <CustomPickerHeader
            searchText={pickers.createSubtype.searchText}
            onSearchChange={(text) =>
              updatePicker("createSubtype", { searchText: text })
            }
            placeholder="Search subtypes..."
            onClear={() => updatePicker("createSubtype", { searchText: "" })}
          />
        )}
      />

      <Picker
        columns={[getCommitteeTypes(pickers.editType.searchText)]}
        visible={pickers.editType.visible}
        onClose={() => closePicker("editType")}
        onConfirm={(value) => {
          setEditData((prev) => ({ ...prev, type: value[0] }));
          closePicker("editType");
        }}
        onCancel={() => closePicker("editType")}
        title="Select Committee Type"
        renderHeader={() => (
          <CustomPickerHeader
            searchText={pickers.editType.searchText}
            onSearchChange={(text) =>
              updatePicker("editType", { searchText: text })
            }
            placeholder="Search committee types..."
            onClear={() => updatePicker("editType", { searchText: "" })}
          />
        )}
      />

      <Picker
        columns={[getSubtypes(editData.type, pickers.editSubtype.searchText)]}
        visible={pickers.editSubtype.visible}
        onClose={() => closePicker("editSubtype")}
        onConfirm={(value) => {
          setEditData((prev) => ({ ...prev, subtype: value[0] }));
          closePicker("editSubtype");
        }}
        onCancel={() => closePicker("editSubtype")}
        title="Select Committee Subtype"
        renderHeader={() => (
          <CustomPickerHeader
            searchText={pickers.editSubtype.searchText}
            onSearchChange={(text) =>
              updatePicker("editSubtype", { searchText: text })
            }
            placeholder="Search subtypes..."
            onClear={() => updatePicker("editSubtype", { searchText: "" })}
          />
        )}
      />
    </div>
  );
};

export default AdminCommittees;
