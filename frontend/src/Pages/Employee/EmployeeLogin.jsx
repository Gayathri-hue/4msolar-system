import React from "react";
import { Row, Col, Form, Input, Button, Card, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import Api from "../../Api";
import { useNavigate } from "react-router-dom";

function EmployeeLogin() {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const res = await Api.post("/employee/login", values);
      message.success(res.data.message);

      localStorage.setItem("employeeToken", res.data.token);
      localStorage.setItem("employeeData", JSON.stringify(res.data.employee));
      localStorage.setItem("role", "employee");

      navigate("/employee");
    } catch (err) {
      message.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <Row style={{ minHeight: "100vh" }}>
      {/* Left Image Section */}
      <Col
        xs={0}
        md={12}
        style={{
          backgroundImage:
            "url('https://img.freepik.com/free-vector/flat-design-office-printer-illustration_23-2150268487.jpg?t=st=1769076484~exp=1769080084~hmac=1287415717ba0f1ac5e5668fcf51e61950c084998c7fb127bb3677a7d4e76a16&w=2000')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Right Login Section */}
      <Col
        xs={24}
        md={12}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Card title="Employee Login" style={{ width: 350 }}>
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              name="emailOrPhone"
              label="Email or Phone"
              rules={[{ required: true, message: "Enter email or phone" }]}
            >
              <Input prefix={<UserOutlined />} />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: "Enter password" }]}
            >
              <Input.Password prefix={<LockOutlined />} />
            </Form.Item>

            <Button type="primary" htmlType="submit" block>
              Login
            </Button>
          </Form>
        </Card>
      </Col>
    </Row>
  );
}

export default EmployeeLogin;
