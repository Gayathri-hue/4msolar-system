import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Upload,
  Card,
  Row,
  Col,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Api from "../../Api";

const { TextArea } = Input;
const { Option } = Select;

function ServiceRequest() {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  const onFinish = async (values) => {
    try {
      const payload = {
        customerId: localStorage.getItem("UserID"),
        complaintType: values.type,
        priority: values.priority,
        description: values.description,
      };

      await Api.post("/complaint/service-request", payload);

      message.success("Complaint submitted successfully!");
      form.resetFields();
      setFileList([]);
    } catch (error) {
      message.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <Row justify="center">
      <Col xs={24} sm={24} md={18} lg={14} xl={12}>
        <Card
          title="Raise a Service Request"
          bordered={false}
          style={{
            borderRadius: "16px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          }}
        >
          <Form layout="vertical" form={form} onFinish={onFinish}>
            <Form.Item
              label="Complaint Type"
              name="type"
              rules={[{ required: true }]}
            >
              <Select placeholder="Select complaint">
                <Option value="installation">Installation Issue</Option>
                <Option value="maintenance">Maintenance Issue</Option>
                <Option value="power">Power Issue</Option>
                <Option value="billing">Billing Issue</Option>
                <Option value="other">Other</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Priority"
              name="priority"
              rules={[{ required: true }]}
            >
              <Select>
                <Option value="low">Low</Option>
                <Option value="medium">Medium</Option>
                <Option value="high">High</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Issue Description"
              name="description"
              rules={[{ required: true }]}
            >
              <TextArea rows={4} />
            </Form.Item>

            <Button type="primary" htmlType="submit" block size="large">
              Submit Complaint
            </Button>
          </Form>
        </Card>
      </Col>
    </Row>
  );
}

export default ServiceRequest;
