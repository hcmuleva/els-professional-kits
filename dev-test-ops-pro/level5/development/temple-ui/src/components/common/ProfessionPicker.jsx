import React, { useState, useMemo } from "react";
import {
  Popup,
  SearchBar,
  List,
  Button,
  Space,
  NavBar,
  Empty,
} from "antd-mobile";
import {
  RightOutline,
  DownOutline,
  UpOutline,
  CheckOutline,
} from "antd-mobile-icons";

const ProfessionPicker = ({
  value = [],
  onChange,
  placeholder = "Select professions...",
  professions,
  multiSelect = true,
  onSelectionConfirm,
}) => {
  const [visible, setVisible] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedItems, setSelectedItems] = useState(value || []);
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const [hasChanges, setHasChanges] = useState(false);

  // Map profession types from API response
  const professionTypes = useMemo(() => {
    if (!professions?.data) return [];
    return professions.data.map((item) => ({
      name: item.attributes.profession_name,
      type: item.attributes.type,
      structure: item.attributes.profession_type,
    }));
  }, [professions]);

  // Generate all paths for search functionality
  const getAllPaths = useMemo(() => {
    const paths = [];

    professionTypes.forEach((profType) => {
      if (!profType.structure?.categories) return;

      profType.structure.categories.forEach((category) => {
        category.subcategories.forEach((subcategory) => {
          subcategory.roles.forEach((role) => {
            paths.push({
              professionType: profType.name,
              professionTypeCode: profType.type,
              category: category.name,
              subcategory: subcategory.name,
              role: role,
              fullPath: `${profType.name} > ${category.name} > ${subcategory.name} > ${role}`,
              searchText:
                `${profType.name} ${category.name} ${subcategory.name} ${role}`.toLowerCase(),
            });
          });
        });
      });
    });

    return paths;
  }, [professionTypes]);

  // Filter paths based on search
  const filteredPaths = useMemo(() => {
    if (!searchValue) return getAllPaths;
    return getAllPaths.filter((path) =>
      path.searchText.includes(searchValue.toLowerCase())
    );
  }, [getAllPaths, searchValue]);

  // Check if item is selected
  const isSelected = (path) => {
    if (!Array.isArray(selectedItems)) return false;
    return selectedItems.some(
      (item) =>
        item.professionTypeCode === path.professionTypeCode &&
        item.category === path.category &&
        item.subcategory === path.subcategory &&
        item.role === path.role
    );
  };

  // Toggle selection
  const toggleSelection = (path) => {
    let newSelection;

    if (multiSelect) {
      if (isSelected(path)) {
        newSelection = selectedItems.filter(
          (item) =>
            !(
              item.professionTypeCode === path.professionTypeCode &&
              item.category === path.category &&
              item.subcategory === path.subcategory &&
              item.role === path.role
            )
        );
      } else {
        newSelection = [
          ...selectedItems,
          {
            professionType: path.professionType,
            professionTypeCode: path.professionTypeCode,
            category: path.category,
            subcategory: path.subcategory,
            role: path.role,
          },
        ];
      }
    } else {
      // Single select mode
      newSelection = isSelected(path)
        ? []
        : [
            {
              professionType: path.professionType,
              professionTypeCode: path.professionTypeCode,
              category: path.category,
              subcategory: path.subcategory,
              role: path.role,
            },
          ];
    }

    setSelectedItems(newSelection);
    setHasChanges(true);
  };

  // Clear all selections
  const clearAll = () => {
    setSelectedItems([]);
    setHasChanges(true);
  };

  // Toggle node expansion
  const toggleNode = (nodeId) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  // Handle confirm action
  const handleConfirm = () => {
    onChange?.(selectedItems);
    onSelectionConfirm?.(selectedItems);
    setHasChanges(false);
    setVisible(false);
  };

  // Handle cancel action
  const handleCancel = () => {
    setSelectedItems(value || []);
    setHasChanges(false);
    setVisible(false);
  };

  // Render search results
  const renderSearchResults = () => (
    <div
      style={{
        height: "calc(100vh - 200px)",
        overflowY: "auto",
        paddingBottom: "20px",
      }}
    >
      {filteredPaths.length === 0 ? (
        <Empty description="No matching professions found" />
      ) : (
        <List>
          {filteredPaths.map((path, index) => (
            <List.Item
              key={index}
              onClick={() => toggleSelection(path)}
              style={{
                backgroundColor: isSelected(path) ? "#e6f4ff" : "#fff",
                borderLeft: isSelected(path) ? "4px solid #1677ff" : "none",
              }}
              extra={
                <div
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    border: isSelected(path) ? "none" : "2px solid #d9d9d9",
                    backgroundColor: isSelected(path)
                      ? "#1677ff"
                      : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {isSelected(path) && (
                    <CheckOutline style={{ color: "#fff", fontSize: "14px" }} />
                  )}
                </div>
              }
            >
              <div>
                <div
                  style={{
                    fontWeight: "500",
                    color: "#000",
                    marginBottom: "4px",
                  }}
                >
                  {path.role}
                </div>
                <div style={{ fontSize: "12px", color: "#999" }}>
                  {path.professionType} → {path.category} → {path.subcategory}
                </div>
              </div>
            </List.Item>
          ))}
        </List>
      )}
    </div>
  );

  // Render tree view
  const renderTreeView = () => (
    <div
      style={{
        height: "calc(100vh - 200px)",
        overflowY: "auto",
        paddingBottom: "20px",
      }}
    >
      <List>
        {professionTypes.map((profType) => (
          <React.Fragment key={profType.type}>
            <List.Item
              onClick={() => toggleNode(`profType-${profType.type}`)}
              arrow={
                expandedNodes.has(`profType-${profType.type}`) ? (
                  <UpOutline />
                ) : (
                  <DownOutline />
                )
              }
            >
              <div style={{ fontWeight: "600", color: "#000" }}>
                {profType.name}
              </div>
            </List.Item>

            {expandedNodes.has(`profType-${profType.type}`) &&
              profType.structure?.categories?.map((category) => (
                <React.Fragment key={`${profType.type}-${category.name}`}>
                  <List.Item
                    onClick={() =>
                      toggleNode(`category-${profType.type}-${category.name}`)
                    }
                    arrow={
                      expandedNodes.has(
                        `category-${profType.type}-${category.name}`
                      ) ? (
                        <UpOutline />
                      ) : (
                        <DownOutline />
                      )
                    }
                    style={{ paddingLeft: "16px" }}
                  >
                    <div style={{ fontWeight: "500", color: "#333" }}>
                      {category.name}
                    </div>
                  </List.Item>

                  {expandedNodes.has(
                    `category-${profType.type}-${category.name}`
                  ) &&
                    category.subcategories.map((subcategory) => (
                      <React.Fragment
                        key={`${profType.type}-${category.name}-${subcategory.name}`}
                      >
                        <List.Item
                          onClick={() =>
                            toggleNode(
                              `subcategory-${profType.type}-${category.name}-${subcategory.name}`
                            )
                          }
                          arrow={
                            expandedNodes.has(
                              `subcategory-${profType.type}-${category.name}-${subcategory.name}`
                            ) ? (
                              <UpOutline />
                            ) : (
                              <DownOutline />
                            )
                          }
                          style={{ paddingLeft: "32px" }}
                        >
                          <div style={{ color: "#666" }}>
                            {subcategory.name}
                          </div>
                        </List.Item>

                        {expandedNodes.has(
                          `subcategory-${profType.type}-${category.name}-${subcategory.name}`
                        ) &&
                          subcategory.roles.map((role) => {
                            const path = {
                              professionType: profType.name,
                              professionTypeCode: profType.type,
                              category: category.name,
                              subcategory: subcategory.name,
                              role: role,
                            };

                            return (
                              <List.Item
                                key={`${profType.type}-${category.name}-${subcategory.name}-${role}`}
                                onClick={() => toggleSelection(path)}
                                style={{
                                  paddingLeft: "48px",
                                  backgroundColor: isSelected(path)
                                    ? "#e6f4ff"
                                    : "#fff",
                                  borderLeft: isSelected(path)
                                    ? "4px solid #1677ff"
                                    : "none",
                                }}
                                extra={
                                  <div
                                    style={{
                                      width: "24px",
                                      height: "24px",
                                      borderRadius: "50%",
                                      border: isSelected(path)
                                        ? "none"
                                        : "2px solid #d9d9d9",
                                      backgroundColor: isSelected(path)
                                        ? "#1677ff"
                                        : "transparent",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    {isSelected(path) && (
                                      <CheckOutline
                                        style={{
                                          color: "#fff",
                                          fontSize: "14px",
                                        }}
                                      />
                                    )}
                                  </div>
                                }
                              >
                                <div style={{ color: "#666" }}>{role}</div>
                              </List.Item>
                            );
                          })}
                      </React.Fragment>
                    ))}
                </React.Fragment>
              ))}
          </React.Fragment>
        ))}
      </List>
    </div>
  );

  // Get display text for the trigger button
  const getDisplayText = () => {
    if (selectedItems.length === 0) return placeholder;
    if (selectedItems.length === 1) console.log(selectedItems, "selectedItems");
    return `${selectedItems[0].professionTypeCode}: ${selectedItems[0].category}`;
    return `${selectedItems.length} professions selected`;
  };

  // Get display description for selected items
  const getDisplayDescription = () => {
    if (selectedItems.length <= 1) return null;
    return selectedItems.map((item) => item.role).join(", ");
  };

  return (
    <div style={{ width: "100%", margin: 0, padding: 0 }}>
      {/* Picker trigger */}
      <div
        onClick={() => setVisible(true)}
        style={{
          border: "1px solid #d9d9d9",
          borderRadius: "8px",
          padding: "16px",
          backgroundColor: "#fff",
          cursor: "pointer",
          minHeight: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 1px  алю2px rgba(0,0,0,0.04)",
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <span
            style={{
              fontSize: "16px",
              display: "block",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              color: selectedItems.length > 0 ? "#000" : "#999",
              fontWeight: selectedItems.length > 0 ? "500" : "normal",
            }}
          >
            {getDisplayText()}
          </span>
          {selectedItems.length > 1 && (
            <div
              style={{
                fontSize: "14px",
                color: "#999",
                marginTop: "4px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {getDisplayDescription()}
            </div>
          )}
        </div>
        <RightOutline
          style={{
            color: "#999",
            fontSize: "18px",
            marginLeft: "12px",
            flexShrink: 0,
          }}
        />
      </div>

      {/* Mobile Popup */}
      <Popup
        visible={visible}
        onMaskClick={handleCancel}
        position="right"
        bodyStyle={{
          width: "100vw",
          height: "100vh",
          padding: 0,
        }}
      >
        <div
          style={{ display: "flex", flexDirection: "column", height: "100vh" }}
        >
          {/* Header */}
          <NavBar
            onBack={handleCancel}
            style={{
              backgroundColor: "#fff",
              borderBottom: "1px solid #f0f0f0",
            }}
          >
            {multiSelect ? "Select Professions" : "Select Profession"}
          </NavBar>

          {/* Search and controls section */}
          <div
            style={{
              padding: "16px",
              borderBottom: "1px solid #f0f0f0",
              backgroundColor: "#fff",
            }}
          >
            <SearchBar
              placeholder="Search professions..."
              value={searchValue}
              onChange={setSearchValue}
              onClear={() => setSearchValue("")}
              style={{ marginBottom: "12px" }}
            />

            {/* Selection info and clear button */}
            {selectedItems.length > 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: "14px",
                }}
              >
                <span style={{ color: "#666" }}>
                  {selectedItems.length}{" "}
                  {multiSelect ? "professions" : "profession"} selected
                </span>
                {multiSelect && (
                  <Button
                    size="small"
                    fill="none"
                    color="primary"
                    onClick={clearAll}
                  >
                    Clear All
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Content section */}
          <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
            {searchValue ? renderSearchResults() : renderTreeView()}
          </div>

          {/* Fixed bottom action buttons */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: "16px",
              borderTop: "1px solid #f0f0f0",
              backgroundColor: "#fff",
              boxShadow: "0 -2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <Space block direction="horizontal" style={{ width: "100%" }}>
              <Button
                block
                size="large"
                fill="outline"
                onClick={handleCancel}
                style={{ flex: 1 }}
              >
                Cancel
              </Button>
              <Button
                block
                size="large"
                color="primary"
                onClick={handleConfirm}
                disabled={selectedItems.length === 0}
                style={{ flex: 1 }}
              >
                Confirm ({selectedItems.length})
              </Button>
            </Space>
          </div>
        </div>
      </Popup>
    </div>
  );
};

export default ProfessionPicker;
