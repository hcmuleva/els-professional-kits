import React, { useEffect, useState } from "react";
import { Card, Button, Select, Row, Col } from "antd";
import {
  getUnauthorizedTempleLists,
  UserToTemple,
} from "../../services/temple";
import { AuthContext, useAuth } from "../../contexts/AuthContext";
import TempleCard from "./TempleCard";

const { Option } = Select;

export default function TempleListForJoinRequest() {
  const [temples, setTemples] = useState([]);
  const [filteredTemples, setFilteredTemples] = useState([]);
  const [stateFilter, setStateFilter] = useState(null);
  const [districtFilter, setDistrictFilter] = useState(null);
  const [tehsilFilter, setTehsilFilter] = useState(null);
  const { user } = useAuth(AuthContext);
  useEffect(() => {
    const fetchTemples = async () => {
      try {
        const res = await getUnauthorizedTempleLists();
        const data = res?.data || [];
        setTemples(data);
        setFilteredTemples(data);
      } catch (error) {
        console.error("Failed to fetch temples", error);
      }
    };

    fetchTemples();
  }, []);

  const getUnique = (key) => {
    return [
      ...new Set(
        temples
          .map((t) => t.attributes?.address?.data?.attributes?.[key])
          .filter(Boolean)
      ),
    ];
  };

  const handleFilterChange = () => {
    let filtered = temples;

    if (stateFilter) {
      filtered = filtered.filter(
        (t) => t.attributes.address?.data?.attributes?.state === stateFilter
      );
    }

    if (districtFilter) {
      filtered = filtered.filter(
        (t) =>
          t.attributes.address?.data?.attributes?.district === districtFilter
      );
    }

    if (tehsilFilter) {
      filtered = filtered.filter(
        (t) => t.attributes.address?.data?.attributes?.tehsil === tehsilFilter
      );
    }

    setFilteredTemples(filtered);
  };

  useEffect(() => {
    handleFilterChange();
  }, [stateFilter, districtFilter, tehsilFilter]);

  const joinTemple = async (templeid) => {
    console.log(
      " TempleId",
      templeid,
      " And userid",
      user.id,
      " Status = PENDING"
    );
    try {
      const resp = await UserToTemple({
        data: { requeststatus: "PENDING", user: user.id, temple: templeid },
      });
      console.log("respon", resp);
    } catch (error) {
      console.error("Failed to fetch temples", error);
    }
  };
  return (
    <div style={{ padding: 16 }}>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Select
            allowClear
            placeholder="Select State"
            onChange={setStateFilter}
            style={{ width: "100%" }}
          >
            {getUnique("state").map((state) => (
              <Option key={state} value={state}>
                {state}
              </Option>
            ))}
          </Select>
        </Col>
        <Col span={6}>
          <Select
            allowClear
            placeholder="Select District"
            onChange={setDistrictFilter}
            style={{ width: "100%" }}
          >
            {getUnique("district").map((district) => (
              <Option key={district} value={district}>
                {district}
              </Option>
            ))}
          </Select>
        </Col>
        <Col span={6}>
          <Select
            allowClear
            placeholder="Select Tehsil"
            onChange={setTehsilFilter}
            style={{ width: "100%" }}
          >
            {getUnique("tehsil").map((tehsil) => (
              <Option key={tehsil} value={tehsil}>
                {tehsil}
              </Option>
            ))}
          </Select>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {filteredTemples.map((temple) => {
          //   const { id, attributes } = temple;
          //   const { title, subtitle, address } = attributes;
          //   const addr = address?.data?.attributes || {};
          return <TempleCard temple={temple} />;
          //   return (
          //     <Col key={id} xs={24} sm={12} md={8} lg={6}>
          //       <Card title={title} extra={subtitle}>
          //         <p><strong>State:</strong> {addr.state}</p>
          //         <p><strong>District:</strong> {addr.district}</p>
          //         <p><strong>Tehsil:</strong> {addr.tehsil}</p>
          //         <Button type="primary"  onClick={()=>{
          //             joinTemple(temple.id)
          //         }}>Join</Button>
          //       </Card>
          //     </Col>
          //   );
        })}
      </Row>
    </div>
  );
}
