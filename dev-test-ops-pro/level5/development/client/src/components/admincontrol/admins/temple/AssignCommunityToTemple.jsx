import React, { useEffect, useState } from "react";
import { Spin, Select, message } from "antd";
import {
  getAssignedUnAssginedSubcategories,
  updateTempleSubcategories,
} from "../../../../services/community";
import { getAllCategory } from "../../../../services/category";
import CustomTransfer from "./community/CustomTransfer";

const warmColors = {
  primary: "#8B4513",
  secondary: "#A0522D",
  accent: "#CD853F",
  background: "#FAFAFA",
  cardBg: "#FFFFFF",
  textPrimary: "#2C2C2C",
  textSecondary: "#666666",
  border: "#E8E8E8",
  error: "#D32F2F",
  success: "#2E7D32",
};

export default function AssignCommunityToTemple({ id, onClose }) {
  const [data, setData] = useState([]);
  const [targetKeys, setTargetKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [oldAssignment, setOldAssignment] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAllCategory();
        const formatted =
          res?.data?.map((cat) => ({
            label: `${cat?.attributes?.name} (${cat?.attributes?.name_hi})`,
            value: cat.id,
          })) || [];
        setCategories(formatted);
      } catch (err) {
        console.error("Error fetching categories", err);
        message.error("Failed to fetch categories");
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchSubcategories = async () => {
      if (!selectedCategoryId) return;

      setLoading(true);
      try {
        const response = await getAssignedUnAssginedSubcategories(
          id,
          selectedCategoryId
        );
        const assigned = response?.assigned || [];
        const unassigned = response?.unassigned || [];
        setOldAssignment(assigned.map((item) => item.id.toString()));
        const combinedData = [...assigned, ...unassigned].map((item) => ({
          key: item.id.toString(),
          title: item.name,
          fullItem: item,
        }));

        setData(combinedData);
        setTargetKeys(assigned.map((item) => item.id.toString()));
      } catch (err) {
        console.error("Error fetching subcategories", err);
        message.error("Failed to fetch subcategories");
      } finally {
        setLoading(false);
      }
    };

    fetchSubcategories();
  }, [id, selectedCategoryId]);

  const handleSave = async (nextTargetKeys) => {
    const assignedItems = data.filter((item) =>
      nextTargetKeys.includes(item.key)
    );
    const newElements = assignedItems.filter(
      (item) => !oldAssignment.includes(item.key)
    );
    const removedElement = oldAssignment.filter(
      (id) => !nextTargetKeys.includes(id)
    );
    const existingElements = assignedItems.filter((item) =>
      oldAssignment.includes(item.key)
    );

    const newItems = newElements.map((item) => parseInt(item.key, 10));
    const removedItems = removedElement.map((id) => parseInt(id, 10));
    const existingItems = existingElements.map((item) =>
      parseInt(item.key, 10)
    );

    try {
      await updateTempleSubcategories(
        newItems,
        existingItems,
        removedItems,
        parseInt(id, 10)
      );
      message.success("Subcategories updated successfully");
      onClose();
    } catch (err) {
      console.error("Error updating subcategories", err);
      message.error(
        err?.response?.data?.error?.message || "Failed to update subcategories"
      );
    }
  };

  return (
    <div
      style={{
        padding: "24px",
        backgroundColor: warmColors.background,
        minHeight: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `radial-gradient(circle at 25% 25%, ${warmColors.primary}08 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, ${warmColors.accent}08 0%, transparent 50%)`,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        <h2
          style={{
            color: warmColors.textPrimary,
            fontWeight: "700",
            marginBottom: "24px",
            textAlign: "center",
            background: `linear-gradient(135deg, ${warmColors.primary} 0%, ${warmColors.secondary} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          मंदिर को कम्युनिटी असाइन करें
        </h2>
        <div style={{ marginBottom: "24px" }}>
          <Select
            placeholder="कैटेगरी चुनें"
            options={categories}
            value={selectedCategoryId}
            onChange={setSelectedCategoryId}
            style={{
              width: "100%",
              borderRadius: "12px",
              border: `2px solid ${warmColors.border}`,
              backgroundColor: warmColors.cardBg,
              fontSize: "16px",
            }}
            dropdownStyle={{ borderRadius: "12px" }}
          />
        </div>
        <CustomTransfer
          dataSource={data}
          targetKeys={targetKeys}
          onFinish={handleSave}
          onCancel={onClose}
          titles={["अनअसाइन्ड", "असाइन्ड"]}
          render={(item) => item.title}
        />
      </div>
    </div>
  );
}
