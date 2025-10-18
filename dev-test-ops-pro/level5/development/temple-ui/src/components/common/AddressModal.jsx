import { Form, Input, Button, Modal, message } from "antd";
import React, { useEffect, useState } from "react";
import { getPincode } from "../../services/pincode";
import { createAddress, updateAddress } from "../../services/address";
import { useAuth } from "../../contexts/AuthContext";

export default function AddressModal({
  visible,
  onClose,
  addressType,
  typeKey,
  typeId,
  initialAddress,
  onAddressSaved,
}) {
  const [form] = Form.useForm();
  const { user } = useAuth();
  const [location, setLocation] = useState({ latitude: null, longitude: null });

  useEffect(() => {
    if (initialAddress) {
      form.setFieldsValue({
        landmark: initialAddress.landmark,
        pincode: initialAddress.pincode?.toString(),
        city: initialAddress.tehsil,
        district: initialAddress.district,
        state: initialAddress.state,
        country: initialAddress?.country || "India",
        latitude: initialAddress.latitude?.toString(),
        longitude: initialAddress.longitude?.toString(),
        village: initialAddress.village,
        housename: initialAddress.housename,
        address_raw: initialAddress.address_raw,
      });
      setLocation({
        latitude: initialAddress.latitude || null,
        longitude: initialAddress.longitude || null,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ country: "India" });
      setLocation({ latitude: null, longitude: null });
    }
  }, [initialAddress, form]);

  const handlePincodeChange = async () => {
    const pincode = form.getFieldValue("pincode");
    if (/^\d{6}$/.test(pincode)) {
      try {
        const res = await getPincode(pincode);
        if (res?.data?.length) {
          const attrs = res.data[0].attributes;
          form.setFieldsValue({
            city: attrs.taluk || "",
            district: attrs.districtName || "",
            state: attrs.stateName || "",
          });
        } else {
          message.error("Pincode not found.");
        }
      } catch {
        message.error("Failed to fetch location.");
      }
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          form.setFieldsValue({
            latitude: latitude.toString(),
            longitude: longitude.toString(),
          });

          message.success("Location fetched!");
        },
        () => {
          message.error("Failed to get location.");
        }
      );
    } else {
      message.error("Geolocation not supported.");
    }
  };

  const handleSubmit = async (values) => {
    const payload = {
      addresstype: addressType,
      landmark: values.landmark,
      pincode: values.pincode,
      tehsil: values.city,
      district: values.district,
      state: values.state,
      country: values.country,
      village: values.village,
      housename: values.housename,
      address_raw: values.address_raw,
      [typeKey]: typeId,
      users: user?.id,
      latitude: location.latitude,
      longitude: location.longitude,
    };

    try {
      let savedAddress;
      if (initialAddress?.id) {
        const response = await updateAddress(initialAddress.id, payload);
        savedAddress = response.data;
        message.success("Address updated.");
      } else {
        const response = await createAddress(payload);
        savedAddress = response.data;
        message.success("Address saved.");
      }
      form.resetFields();
      onAddressSaved?.(savedAddress);
      onClose();
    } catch {
      message.error("Failed to save address.");
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      style={{ maxWidth: "360px", width: "0%", margin: "0 auto" }}
      bodyStyle={{
        padding: "0",
        background: "#fff7ed",
        borderRadius: "8px",
        height: "75vh",
        display: "flex",
        flexDirection: "column",
        margin: "0",
      }}
    >
      <div
        style={{
          // flex: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ country: "India" }}
          style={{
            // flex: 1,
            overflow: "auto",
            // padding: "8px",
          }}
        >
          <Form.Item
            name="pincode"
            label={
              <span
                style={{
                  color: "#9a3412",
                  fontSize: "13px",
                  fontWeight: "600",
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                पिन कोड
              </span>
            }
            rules={[{ pattern: /^[0-9]{6}$/, message: "6 अंकों का पिन कोड" }]}
            style={{ marginBottom: "8px" }}
          >
            <Input
              placeholder="6 अंकों का पिन कोड"
              maxLength={6}
              onChange={handlePincodeChange}
              style={{
                borderRadius: "4px",
                border: "1px solid #fed7aa",
                backgroundColor: "#fff7ed",
                fontSize: "14px",
                padding: "6px",
                width: "100%",
              }}
            />
          </Form.Item>

          <Form.Item
            name="housename"
            label={
              <span
                style={{
                  color: "#9a3412",
                  fontSize: "13px",
                  fontWeight: "600",
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                मकान का नाम
              </span>
            }
            style={{ marginBottom: "8px" }}
          >
            <Input
              placeholder="मकान का नाम"
              style={{
                borderRadius: "4px",
                border: "1px solid #fed7aa",
                backgroundColor: "#fff7ed",
                fontSize: "14px",
                padding: "6px",
                width: "100%",
              }}
            />
          </Form.Item>

          <Form.Item
            name="village"
            label={
              <span
                style={{
                  color: "#9a3412",
                  fontSize: "13px",
                  fontWeight: "600",
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                गाँव
              </span>
            }
            style={{ marginBottom: "8px" }}
          >
            <Input
              placeholder="गाँव का नाम"
              style={{
                borderRadius: "4px",
                border: "1px solid #fed7aa",
                backgroundColor: "#fff7ed",
                fontSize: "14px",
                padding: "6px",
                width: "100%",
              }}
            />
          </Form.Item>

          <Form.Item
            name="landmark"
            label={
              <span
                style={{
                  color: "#9a3412",
                  fontSize: "13px",
                  fontWeight: "600",
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                लैंडमार्क
              </span>
            }
            style={{ marginBottom: "8px" }}
          >
            <Input
              placeholder="लैंडमार्क"
              style={{
                borderRadius: "4px",
                border: "1px solid #fed7aa",
                backgroundColor: "#fff7ed",
                fontSize: "14px",
                padding: "6px",
                width: "100%",
              }}
            />
          </Form.Item>

          <Form.Item
            name="city"
            label={
              <span
                style={{
                  color: "#9a3412",
                  fontSize: "13px",
                  fontWeight: "600",
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                तहसील
              </span>
            }
            style={{ marginBottom: "8px" }}
          >
            <Input
              placeholder="तहसील"
              style={{
                borderRadius: "4px",
                border: "1px solid #fed7aa",
                backgroundColor: "#fff7ed",
                fontSize: "14px",
                padding: "6px",
                width: "100%",
              }}
            />
          </Form.Item>

          <Form.Item
            name="district"
            label={
              <span
                style={{
                  color: "#9a3412",
                  fontSize: "13px",
                  fontWeight: "600",
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                जिला
              </span>
            }
            style={{ marginBottom: "8px" }}
          >
            <Input
              placeholder="जिला"
              style={{
                borderRadius: "4px",
                border: "1px solid #fed7aa",
                backgroundColor: "#fff7ed",
                fontSize: "14px",
                padding: "6px",
                width: "100%",
              }}
            />
          </Form.Item>

          <Form.Item
            name="state"
            label={
              <span
                style={{
                  color: "#9a3412",
                  fontSize: "13px",
                  fontWeight: "600",
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                राज्य
              </span>
            }
            style={{ marginBottom: "8px" }}
          >
            <Input
              placeholder="राज्य"
              style={{
                borderRadius: "4px",
                border: "1px solid #fed7aa",
                backgroundColor: "#fff7ed",
                fontSize: "14px",
                padding: "6px",
                width: "100%",
              }}
            />
          </Form.Item>

          <Form.Item
            name="country"
            label={
              <span
                style={{
                  color: "#9a3412",
                  fontSize: "13px",
                  fontWeight: "600",
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                देश
              </span>
            }
            style={{ marginBottom: "8px" }}
          >
            <Input
              placeholder="देश"
              style={{
                borderRadius: "4px",
                border: "1px solid #fed7aa",
                backgroundColor: "#fff7ed",
                fontSize: "14px",
                padding: "6px",
                width: "100%",
              }}
            />
          </Form.Item>

          <Form.Item
            name="latitude"
            label={
              <span
                style={{
                  color: "#9a3412",
                  fontSize: "13px",
                  fontWeight: "600",
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                अक्षांश
              </span>
            }
            style={{ marginBottom: "8px" }}
          >
            <Input
              placeholder="अक्षांश"
              style={{
                borderRadius: "4px",
                border: "1px solid #fed7aa",
                backgroundColor: "#fff7ed",
                fontSize: "14px",
                padding: "6px",
                width: "100%",
              }}
            />
          </Form.Item>

          <Form.Item
            name="longitude"
            label={
              <span
                style={{
                  color: "#9a3412",
                  fontSize: "13px",
                  fontWeight: "600",
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                देशांतर
              </span>
            }
            style={{ marginBottom: "8px" }}
          >
            <Input
              placeholder="देशांतर"
              style={{
                borderRadius: "4px",
                border: "1px solid #fed7aa",
                backgroundColor: "#fff7ed",
                fontSize: "14px",
                padding: "6px",
                width: "100%",
              }}
            />
          </Form.Item>

          <Form.Item
            name="address_raw"
            label={
              <span
                style={{
                  color: "#9a3412",
                  fontSize: "13px",
                  fontWeight: "600",
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                पता
              </span>
            }
            style={{ marginBottom: "8px" }}
          >
            <Input
              placeholder="पूरा पता"
              style={{
                borderRadius: "4px",
                border: "1px solid #fed7aa",
                backgroundColor: "#fff7ed",
                fontSize: "14px",
                padding: "6px",
                width: "100%",
              }}
            />
          </Form.Item>
        </Form>

        {/* Fixed button container at bottom */}
        <div
          style={{
            background: "#fff7ed",
            padding: "8px",
            borderTop: "1px solid #fed7aa",
            display: "flex",
            gap: "6px",
            boxShadow: "0 -2px 4px rgba(0,0,0,0.1)",
            flexShrink: 0,
          }}
        >
          <Button
            onClick={handleGetLocation}
            style={{
              flex: 1,
              fontSize: "13px",
              padding: "6px",
              borderRadius: "4px",
              background: "#9a3412",
              color: "#fff",
              border: "none",
              height: "32px",
            }}
          >
            📍 लोकेशन
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            form={form}
            onClick={() => form.submit()}
            style={{
              flex: 1,
              fontSize: "13px",
              padding: "6px",
              borderRadius: "4px",
              background: "#9a3412",
              color: "#fff",
              border: "none",
              height: "32px",
            }}
          >
            {initialAddress ? "एडिट" : "सेव"}
          </Button>
          <Button
            onClick={onClose}
            style={{
              flex: 1,
              fontSize: "13px",
              padding: "6px",
              borderRadius: "4px",
              border: "1px solid #9a3412",
              background: "#fff7ed",
              color: "#9a3412",
              height: "32px",
            }}
          >
            कैंसिल
          </Button>
        </div>
      </div>
    </Modal>
  );
}
