import React, { useState } from "react";
import { Form, Input, Button, Select, message, Row, Col } from "antd";
import Api from "../../Api";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

function PostEnquiryForm() {
  const [loading, setLoading] = useState(false);
  const userId = localStorage.getItem("UserID"); // login user id
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      setLoading(true);

      // Add customer id manually if needed
      values.customer = userId;

      await Api.post("/enquiry/createenquiry", values);

      message.success("Enquiry submitted successfully");

      // Redirect after submission
      navigate("/user/enquiryform");
    } catch (err) {
      console.error(err);
      message.error("Failed to submit enquiry");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "auto" }}>
      <h2>Post Enquiry</h2>

      <Form layout="vertical" onFinish={onFinish}>
        {/* Hidden customer id field */}
        <Form.Item name="customer" initialValue={userId} hidden>
          <Input value={userId} disabled />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="fullName"
              label="Full Name"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="mobile"
              label="Mobile"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="email" label="Email">
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="enquiryType"
              label="Enquiry Type"
              rules={[{ required: true }]}
            >
              <Select placeholder="Select enquiry type">
                <Option value="New Solar Installation">
                  New Solar Installation
                </Option>
                <Option value="Solar Repair / Service">
                  Solar Repair / Service
                </Option>
                <Option value="Rooftop Inspection">Rooftop Inspection</Option>
                <Option value="Battery / Inverter Issue">
                  Battery / Inverter Issue
                </Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="systemType" label="System Type">
              <Select placeholder="Select system type">
                <Option value="On-Grid">On-Grid</Option>
                <Option value="Off-Grid">Off-Grid</Option>
                <Option value="Hybrid">Hybrid</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="capacity" label="Capacity">
              <Input placeholder="ex: 3KW, 5KW" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="address" label="Address">
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item name="message" label="Message">
          <Input.TextArea rows={3} />
        </Form.Item>

        <Button type="primary" htmlType="submit" loading={loading}>
          Submit Enquiry
        </Button>
      </Form>
    </div>
  );
}

export default PostEnquiryForm;
