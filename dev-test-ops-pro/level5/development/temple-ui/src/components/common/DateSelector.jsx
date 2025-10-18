import { DatePicker, Toast } from "antd-mobile";
import React, { useState, useEffect } from "react";

const formatDateToDisplay = (date, format = "DD-MM-YYYY") => {
  if (!date) return "";
  const d = date.getDate().toString().padStart(2, "0");
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const y = date.getFullYear();

  switch (format) {
    case "DD-MM-YYYY":
      return `${d}-${m}-${y}`;
    case "MM-YYYY":
      return `${m}-${y}`;
    case "YYYY":
      return `${y}`;
    case "YYYY-MM-DD":
    default:
      return `${y}-${m}-${d}`;
  }
};

const parseDateString = (str) => {
  if (!str) return null;
  const [y, m, d] = str.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return isNaN(dt.getTime()) ? null : dt;
};

const TITLE_MAP = {
  dob: "Date of Birth",
  dol: "Date of Passing",
  start_date: "Start Date",
  end_date: "End Date",
};

const DateSelector = ({
  fieldKey,
  customdata,
  setCustomdata,
  setFormData,
  placeholder,
  displayFormat = "DD-MM-YYYY", // <- default display format here
}) => {
  const [visible, setVisible] = useState(false);
  const rawValue =
    typeof customdata === "object" ? customdata?.[fieldKey] : customdata;

  const [internalValue, setInternalValue] = useState(parseDateString(rawValue));

  useEffect(() => {
    const raw =
      typeof customdata === "object" ? customdata?.[fieldKey] : customdata;
    setInternalValue(parseDateString(raw));
  }, [customdata, fieldKey]);

  const handleConfirm = (date) => {
    if (!date) return;

    const formatted = formatDateToDisplay(date, "YYYY-MM-DD"); // fixed line
    setInternalValue(date);

    if (typeof customdata === "object") {
      setCustomdata((prev) => ({
        ...prev,
        [fieldKey]: formatted,
      }));
    } else {
      setCustomdata(formatted);
    }

    if (setFormData) {
      setFormData((prev) => ({
        ...prev,
        [fieldKey]: formatted,
      }));
    }

    Toast.show(
      `Selected ${TITLE_MAP[fieldKey] || placeholder || "Date"}: ${formatted}`
    );
    setVisible(false);
  };

  const today = new Date();
  const minDate = new Date(today.getFullYear() - 100, 0, 1);
  const maxDate = today;

  return (
    <>
      <div
        onClick={() => setVisible(true)}
        style={{
          padding: "8px 12px",
          // border: "1px solid #ccc",

          borderRadius: 4,
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        {internalValue
          ? formatDateToDisplay(internalValue, displayFormat)
          : `Select ${TITLE_MAP[fieldKey] || placeholder || "Date"}`}
      </div>

      <DatePicker
        title={`Select ${TITLE_MAP[fieldKey] || placeholder || "Date"}`}
        visible={visible}
        onClose={() => setVisible(false)}
        onConfirm={handleConfirm}
        precision="day"
        value={internalValue}
        min={minDate}
        max={maxDate}
      />
    </>
  );
};

export default DateSelector;
