import { Select } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import { getTemplesWithAddress } from "../../services/temple";

const { Option } = Select;

const TempleSelect = ({ onChange }) => {
  const [temples, setTemples] = useState([]);

  useEffect(() => {
    const fetchTemples = async () => {
      try {
        const response = await getTemplesWithAddress();
        const items = response.data?.data || [];
        setTemples(response);
      } catch (err) {
        console.error("Error fetching temples:", err);
      }
    };

    fetchTemples();
  }, []);
  const handleChange = (value, option) => {
    // Pass both value (id) and label to parent
    onChange(value, option);
  };
  return (
    <Select
      showSearch
      allowClear
      style={{ width: "100%" }}
      placeholder="Select a temple"
      onChange={handleChange}
      filterOption={(input, option) =>
        option?.label?.toLowerCase()?.includes(input.toLowerCase())
      }
      options={temples.map((t) => ({
        value: t.id,
        label: t.attributes.title_hi || t.attributes.title,
      }))}
    />
  );
};

export default TempleSelect;
