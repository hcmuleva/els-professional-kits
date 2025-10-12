import { Select, Input, Slider, Row, Col, Button } from "antd";
import { useState } from "react";

const { Option } = Select;

const FilterBar = ({ onFilter }) => {
  const [gender, setGender] = useState();
  const [ageRange, setAgeRange] = useState([5, 100]);
  const [search, setSearch] = useState("");

  const handleApply = () => {
    onFilter({
      gender,
      minAge: ageRange[0],
      maxAge: ageRange[1],
      search,
    });
  };

  return (
    <Row gutter={16} style={{ marginBottom: 16 }}>
      <Col>
        <Select
          placeholder="Gender"
          allowClear
          style={{ width: 120 }}
          onChange={setGender}
        >
          <Option value="male">Male</Option>
          <Option value="female">Female</Option>
        </Select>
      </Col>
      <Col>
        <Slider
          range
          min={5}
          max={100}
          value={ageRange}
          onChange={setAgeRange}
          style={{ width: 200 }}
        />
      </Col>
      <Col>
        <Input.Search
          placeholder="Search name/email"
          onSearch={handleApply}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 200 }}
        />
      </Col>
      <Col>
        <Button onClick={handleApply}>Apply Filters</Button>
      </Col>
    </Row>
  );
};

export  default FilterBar;