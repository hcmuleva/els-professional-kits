import React, { useState, useEffect, useMemo } from "react";
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

const OrganizationPicker = ({
  value = [],
  onChange,
  placeholder = "Select academic program...",
  organizations,
  multiSelect = false,
  onSelectionConfirm,
}) => {
  const [visible, setVisible] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedItems, setSelectedItems] = useState(value || []);
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const [hasChanges, setHasChanges] = useState(false);

  // Process organization data into a hierarchical structure
  const organizationData = useMemo(() => {
    if (!organizations?.data) return [];
    return organizations.data.map((item) => ({
      id: item.id,
      name: item.attributes.name,
      description: item.attributes.description,
      academic: item.attributes.academic,
    }));
  }, [organizations]);

  // Get all paths for search functionality
  const getAllPaths = useMemo(() => {
    const paths = [];

    organizationData.forEach((org) => {
      if (!org.academic?.academic?.offering) return;

      const orgType = org.academic.academic.type;
      const offerings = org.academic.academic.offering;

      Object.entries(offerings).forEach(([offeringKey, offeringValue]) => {
        const level = offeringValue.level;
        const branches = offeringValue.branches || [];

        branches.forEach((branch) => {
          paths.push({
            orgId: org.id,
            orgName: org.name,
            orgDescription: org.description,
            type: orgType,
            offering: offeringKey,
            level: level,
            branch: branch,
            fullPath: `${org.name} > ${orgType} > ${offeringKey} (${level}) > ${branch}`,
            searchText:
              `${org.name} ${orgType} ${offeringKey} ${level} ${branch}`.toLowerCase(),
          });
        });
      });
    });

    return paths;
  }, [organizationData]);

  // Filter paths based on search
  const filteredPaths = useMemo(() => {
    if (!searchValue) return getAllPaths;
    return getAllPaths.filter((path) =>
      path.searchText.includes(searchValue.toLowerCase())
    );
  }, [getAllPaths, searchValue]);

  // Check if item is selected
  const isSelected = (path) => {
    return selectedItems.some(
      (item) =>
        item.orgId === path.orgId &&
        item.type === path.type &&
        item.offering === path.offering &&
        item.level === path.level &&
        item.branch === path.branch
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
              item.orgId === path.orgId &&
              item.type === path.type &&
              item.offering === path.offering &&
              item.level === path.level &&
              item.branch === path.branch
            )
        );
      } else {
        newSelection = [
          ...selectedItems,
          {
            orgId: path.orgId,
            orgName: path.orgName,
            orgDescription: path.orgDescription,
            type: path.true,
            level: path.level,
            branch: path.branch,
            fullPath: path.fullPath,
          },
        ];
      }
    } else {
      // Single select mode
      newSelection = isSelected(path)
        ? []
        : [
            {
              orgId: path.orgId,
              orgName: path.orgName,
              orgDescription: path.orgDescription,
              type: path.type,
              offering: path.offering,
              level: path.level,
              branch: path.branch,
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
        <Empty description="No matching programs found" />
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
                  {path.branch}
                </div>
                <div style={{ fontSize: "12px", color: "#999" }}>
                  {path.orgName} → {path.type} → {path.offering} ({path.level})
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
        {organizationData.map((org) => (
          <React.Fragment key={org.id}>
            <List.Item
              onClick={() => toggleNode(`org-${org.id}`)}
              arrow={
                expandedNodes.has(`org-${org.id}`) ? (
                  <DownOutline />
                ) : (
                  <UpOutline />
                )
              }
            >
              <div>
                <div style={{ fontWeight: "600", color: "#000" }}>
                  {org.name}
                </div>
                {org.description && (
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#999",
                      marginTop: "2px",
                    }}
                  >
                    {org.description}
                  </div>
                )}
              </div>
            </List.Item>

            {expandedNodes.has(`org-${org.id}`) &&
              org.academic?.academic?.type && (
                <List.Item
                  onClick={() => toggleNode(`type-${org.id}`)}
                  arrow={
                    expandedNodes.has(`type-${org.id}`) ? (
                      <DownOutline />
                    ) : (
                      <UpOutline />
                    )
                  }
                  style={{ paddingLeft: "16px" }}
                >
                  <div>
                    <div style={{ fontWeight: "500", color: "#333" }}>
                      {org.academic.academic.type.toUpperCase()}
                    </div>
                  </div>
                </List.Item>
              )}

            {expandedNodes.has(`type-${org.id}`) &&
              org.academic?.academic?.offering &&
              Object.entries(org.academic.academic.offering).map(
                ([offeringKey, offeringValue]) => (
                  <React.Fragment key={`${org.id}-${offeringKey}`}>
                    <List.Item
                      onClick={() =>
                        toggleNode(`offering-${org.id}-${offeringKey}`)
                      }
                      arrow={
                        expandedNodes.has(
                          `offering-${org.id}-${offeringKey}`
                        ) ? (
                          <DownOutline />
                        ) : (
                          <UpOutline />
                        )
                      }
                      style={{ paddingLeft: "32px" }}
                    >
                      <div>
                        <div style={{ fontWeight: "500", color: "#333" }}>
                          {offeringKey.toUpperCase()} ({offeringValue.level})
                        </div>
                      </div>
                    </List.Item>

                    {expandedNodes.has(`offering-${org.id}-${offeringKey}`) &&
                      offeringValue.branches?.map((branch) => {
                        const path = {
                          orgId: org.id,
                          orgName: org.name,
                          orgDescription: org.description,
                          type: org.academic.academic.type,
                          offering: offeringKey,
                          level: offeringValue.level,
                          branch: branch,
                        };

                        return (
                          <List.Item
                            key={`${org.id}-${offeringKey}-${branch}`}
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
                                    style={{ color: "#fff", fontSize: "14px" }}
                                  />
                                )}
                              </div>
                            }
                          >
                            <div style={{ color: "#666" }}>{branch}</div>
                          </List.Item>
                        );
                      })}
                  </React.Fragment>
                )
              )}
          </React.Fragment>
        ))}
      </List>
    </div>
  );

  // Get display text for the trigger button
  const getDisplayText = () => {
    if (selectedItems.length === 0) return placeholder;
    if (selectedItems.length === 1)
      return `${
        selectedItems[0].orgName
      }: ${selectedItems[0].offering.toUpperCase()} (${
        selectedItems[0].level
      }) - ${selectedItems[0].branch}`;
    return `${selectedItems.length} programs selected`;
  };

  // Get display description for selected items
  const getDisplayDescription = () => {
    if (selectedItems.length <= 1) return null;
    return selectedItems
      .map(
        (item) =>
          `${item.orgName} - ${item.offering.toUpperCase()} (${item.level}) - ${
            item.branch
          }`
      )
      .join(", ");
  };

  return (
    <div style={{ width: "100%" }}>
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
          boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
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
            {multiSelect ? "Select Programs" : "Select Program"}
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
              placeholder="Search programs..."
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
                  {selectedItems.length} {multiSelect ? "programs" : "program"}{" "}
                  selected
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

export default OrganizationPicker;
