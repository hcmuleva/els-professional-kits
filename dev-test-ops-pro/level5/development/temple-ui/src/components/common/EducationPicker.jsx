import React, { useState, useEffect, useMemo } from "react";
import {
  Popup,
  SearchBar,
  List,
  Button,
  Space,
  NavBar,
  Empty,
  Input,
  Form,
} from "antd-mobile";
import {
  RightOutline,
  DownOutline,
  UpOutline,
  CheckOutline,
} from "antd-mobile-icons";

const EducationPicker = ({
  value = null,
  onChange,
  placeholder = "Select education...",
  educations,
  multiSelect = false,
  onSelectionConfirm,
}) => {
  const [visible, setVisible] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedItems, setSelectedItems] = useState(
    value ? (multiSelect ? value : [value]) : []
  );
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const [hasChanges, setHasChanges] = useState(false);
  const [customEducation, setCustomEducation] = useState({
    level: "",
    branch: "",
  });
  const [showCustomForm, setShowCustomForm] = useState(false);

  // Sync selectedItems with value prop
  useEffect(() => {
    setSelectedItems(value ? (multiSelect ? value : [value]) : []);
  }, [value, multiSelect]);

  // Get all education types
  const educationTypes = useMemo(() => {
    if (!educations?.data) {
      // Handle old educationData structure for compatibility
      if (Array.isArray(educations)) {
        return educations.map((item) => ({
          name: item.level,
          type: item.level,
          structure: {
            levels: [{ name: item.level, branches: [item.branch] }],
          },
        }));
      }
      return [];
    }
    return educations.data.map((item) => ({
      name: item.attributes.type,
      type: item.attributes.type,
      structure: {
        levels: item.attributes.typedata.typeData.levels.map((level) => ({
          name: level.name,
          branches: level.branches,
        })),
      },
    }));
  }, [educations]);

  // Get all paths for search functionality
  const getAllPaths = useMemo(() => {
    const paths = [];
    educationTypes.forEach((eduType) => {
      if (!eduType.structure?.levels) return;
      eduType.structure.levels.forEach((level) => {
        level.branches.forEach((branch) => {
          paths.push({
            educationType: eduType.name,
            educationTypeCode: eduType.type,
            level: level.name,
            branch: branch,
            fullPath: `${eduType.name} > ${level.name} > ${branch}`,
            searchText: `${eduType.name} ${level.name} ${branch}`.toLowerCase(),
          });
        });
      });
    });
    return paths;
  }, [educationTypes]);

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
        item.educationTypeCode === path.educationTypeCode &&
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
              item.educationTypeCode === path.educationTypeCode &&
              item.level === path.level &&
              item.branch === path.branch
            )
        );
      } else {
        newSelection = [
          ...selectedItems,
          {
            educationType: path.educationType,
            educationTypeCode: path.educationTypeCode,
            level: path.level,
            branch: path.branch,
          },
        ];
      }
    } else {
      newSelection = isSelected(path)
        ? []
        : [
            {
              educationType: path.educationType,
              educationTypeCode: path.educationTypeCode,
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

  // Handle custom education
  const handleCustomEducation = () => {
    if (customEducation.level && customEducation.branch) {
      const customPath = {
        educationType: "Custom",
        educationTypeCode: "CUSTOM",
        level: customEducation.level,
        branch: customEducation.branch,
      };
      let newSelection;
      if (multiSelect) {
        newSelection = [...selectedItems, customPath];
      } else {
        newSelection = [customPath];
      }
      setSelectedItems(newSelection);
      setCustomEducation({
        level: "",
        branch: "",
      });
      setShowCustomForm(false);
      setHasChanges(true);
    }
  };

  // Handle confirm action
  const handleConfirm = () => {
    const result = multiSelect ? selectedItems : selectedItems[0] || null;
    // Transform output to match old code's expected format
    onChange?.(
      multiSelect
        ? result
        : result
        ? { level: result.level, branch: result.branch }
        : null
    );
    onSelectionConfirm?.(result);
    setHasChanges(false);
    setVisible(false);
  };

  // Handle cancel action
  const handleCancel = () => {
    setSelectedItems(value ? (multiSelect ? value : [value]) : []);
    setHasChanges(false);
    setVisible(false);
    setShowCustomForm(false);
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
        <Empty description="No matching education found" />
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
                  {path.level} - {path.branch}
                </div>
                <div style={{ fontSize: "10px", color: "#ccc" }}>
                  {path.educationType}
                </div>
              </div>
            </List.Item>
          ))}
        </List>
      )}
    </div>
  );

  // Render custom education form
  const renderCustomForm = () => (
    <div
      style={{
        height: "calc(100vh - 200px)",
        overflowY: "auto",
        padding: "16px",
      }}
    >
      <div
        style={{ marginBottom: "16px", fontSize: "16px", fontWeight: "600" }}
      >
        Add Custom Education
      </div>
      <Form layout="vertical">
        <Form.Item label="Level *" style={{ marginBottom: "16px" }}>
          <Input
            placeholder="e.g., Undergraduate, Postgraduate"
            value={customEducation.level}
            onChange={(val) =>
              setCustomEducation((prev) => ({ ...prev, level: val }))
            }
          />
        </Form.Item>
        <Form.Item label="Branch *" style={{ marginBottom: "16px" }}>
          <Input
            placeholder="e.g., MBBS, Computer Science"
            value={customEducation.branch}
            onChange={(val) =>
              setCustomEducation((prev) => ({ ...prev, branch: val }))
            }
          />
        </Form.Item>
        <Space direction="vertical" block>
          <Button
            block
            color="primary"
            onClick={handleCustomEducation}
            disabled={!customEducation.level || !customEducation.branch}
          >
            Add Custom Education
          </Button>
          <Button block fill="outline" onClick={() => setShowCustomForm(false)}>
            Back to List
          </Button>
        </Space>
      </Form>
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
        {educationTypes.map((eduType) => (
          <React.Fragment key={eduType.type}>
            <List.Item
              onClick={() => toggleNode(`eduType-${eduType.type}`)}
              arrow={
                expandedNodes.has(`eduType-${eduType.type}`) ? (
                  <DownOutline />
                ) : (
                  <UpOutline />
                )
              }
            >
              <div style={{ fontWeight: "600", color: "#000" }}>
                {eduType.name}
              </div>
            </List.Item>
            {expandedNodes.has(`eduType-${eduType.type}`) &&
              eduType.structure?.levels?.map((level) => (
                <React.Fragment key={`${eduType.type}-${level.name}`}>
                  <List.Item
                    onClick={() =>
                      toggleNode(`level-${eduType.type}-${level.name}`)
                    }
                    arrow={
                      expandedNodes.has(
                        `level-${eduType.type}-${level.name}`
                      ) ? (
                        <DownOutline />
                      ) : (
                        <UpOutline />
                      )
                    }
                    style={{ paddingLeft: "16px" }}
                  >
                    <div style={{ fontWeight: "500", color: "#333" }}>
                      {level.name}
                    </div>
                  </List.Item>
                  {expandedNodes.has(`level-${eduType.type}-${level.name}`) &&
                    level.branches.map((branch) => {
                      const path = {
                        educationType: eduType.name,
                        educationTypeCode: eduType.type,
                        level: level.name,
                        branch: branch,
                      };
                      return (
                        <List.Item
                          key={`${eduType.type}-${level.name}-${branch}`}
                          onClick={() => toggleSelection(path)}
                          style={{
                            paddingLeft: "32px",
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
              ))}
          </React.Fragment>
        ))}
      </List>
    </div>
  );

  // Get display text for the trigger button
  const getDisplayText = () => {
    if (selectedItems.length === 0) return placeholder;
    if (selectedItems.length === 1) {
      const item = selectedItems[0];
      return `${item.level} - ${item.branch}`;
    }
    return `${selectedItems.length} education qualifications selected`;
  };

  // Get display description for selected items
  const getDisplayDescription = () => {
    if (selectedItems.length <= 1) return null;
    return selectedItems
      .map((item) => `${item.level} - ${item.branch}`)
      .join(", ");
  };

  return (
    <div style={{ width: "100%", padding: "0", margin: "0" }}>
      <div
        onClick={() => setVisible(true)}
        style={{
          width: "100%",
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
          <NavBar
            onBack={handleCancel}
            style={{
              backgroundColor: "#fff",
              borderBottom: "1px solid #f0f0f0",
            }}
          >
            {multiSelect ? "Select Education" : "Select Education"}
          </NavBar>
          {!showCustomForm && (
            <div
              style={{
                padding: "16px",
                borderBottom: "1px solid #f0f0f0",
                backgroundColor: "#fff",
              }}
            >
              <SearchBar
                placeholder="Search education..."
                value={searchValue}
                onChange={setSearchValue}
                onClear={() => setSearchValue("")}
                style={{ marginBottom: "12px" }}
              />
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
                    {multiSelect ? "qualifications" : "qualification"} selected
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
          )}
          <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
            {searchValue ? renderSearchResults() : renderTreeView()}
          </div>
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

export default EducationPicker;
