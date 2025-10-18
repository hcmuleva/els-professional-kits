import React, { useState, useCallback } from "react";
import { Button, DatePicker } from "antd-mobile";

const now = new Date();

function DatePickerYear({ value, onChange, placeholder = "Select Year" }) {
  const [visible, setVisible] = useState(false);

  const labelRenderer = useCallback((type, data) => {
    return type === "year" ? `${data}` : data;
  }, []);

  const handleConfirm = (val) => {
    if (onChange) {
      onChange(val.getFullYear());
    }
    setVisible(false);
  };

  const getButtonText = () => {
    if (value) {
      return `${value}`;
    }
    return placeholder;
  };

  return (
    <>
      <Button
        onClick={() => setVisible(true)}
        style={{
          minWidth: "120px",
          textAlign: "left",
          background: value ? "#e6f7ff" : "#f5f5f5",
          color: value ? "#1890ff" : "#666",
        }}
      >
        {getButtonText()}
      </Button>

      <DatePicker
        title="Select Year"
        visible={visible}
        precision="year"
        defaultValue={value ? new Date(value, 0, 1) : now}
        max={now}
        onClose={() => setVisible(false)}
        onConfirm={handleConfirm}
        renderLabel={labelRenderer}
      />
    </>
  );
}

export default DatePickerYear;
