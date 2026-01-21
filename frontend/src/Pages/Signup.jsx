import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  DatePicker,
  Select,
  message,
  Spin,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";

function Signup() {
  const navigate = useNavigate();
  const { Option } = Select;
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const dob = values.dob.format("YYYY-MM-DD");

      const payload = {
        name: values.name,
        dob,
        phone: values.phone,
        email: values.email,
        password: values.password,
        role: values.role,
        employeeId: values.employeeId || "", // blank for auto-generate
        branch: values.branch,
      };

      const res = await fetch("http://localhost:8000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        message.success(`${data.msg}. Employee ID: ${data.employeeId}`);
        setTimeout(() => navigate("/"), 1000);
      } else {
        message.error(data.msg);
      }
    } catch (err) {
      console.error(err);
      message.error("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f7fa",
        padding: "20px",
      }}
    >
      <Spin spinning={loading}>
        <Card
          title="Sign Up"
          headStyle={{
            textAlign: "center",
            fontWeight: "600",
            fontSize: "18px",
          }}
          style={{
            width: "400px",
            borderRadius: "12px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
            padding: "20px",
          }}
        >
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Full Name"
              name="name"
              rules={[{ required: true, message: "Enter your name" }]}
            >
              <Input placeholder="Enter full name" />
            </Form.Item>

            <Form.Item
              label="Date of Birth"
              name="dob"
              rules={[{ required: true, message: "Select date of birth" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              label="Phone Number"
              name="phone"
              rules={[
                { required: true, message: "Enter phone number" },
                { len: 10, message: "Phone number must be 10 digits" },
              ]}
            >
              <Input placeholder="Enter phone number" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Enter email" },
                { type: "email", message: "Enter valid email" },
              ]}
            >
              <Input placeholder="Enter email" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Enter password" }]}
              hasFeedback
            >
              <Input.Password placeholder="Enter password" />
            </Form.Item>

            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              dependencies={["password"]}
              hasFeedback
              rules={[
                { required: true, message: "Confirm password" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value)
                      return Promise.resolve();
                    return Promise.reject("Passwords do not match");
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Confirm password" />
            </Form.Item>

            <Form.Item
              label="Role"
              name="role"
              rules={[{ required: true, message: "Select role" }]}
            >
              <Select placeholder="Select role">
                <Option value="admin">Admin</Option>
                <Option value="staff">Staff</Option>
              </Select>
            </Form.Item>

            <Form.Item label="Employee ID" name="employeeId">
              <Input placeholder="Leave blank for auto-generate" />
            </Form.Item>

            <Form.Item
              label="Branch"
              name="branch"
              rules={[{ required: true, message: "Enter branch" }]}
            >
              <Input placeholder="Enter branch" />
            </Form.Item>

            <Button type="primary" htmlType="submit" block>
              Sign Up
            </Button>

            <p style={{ marginTop: "12px", textAlign: "center" }}>
              Already have an account? <Link to="/">Login</Link>
            </p>
          </Form>
        </Card>
      </Spin>
    </div>
  );
}

export default Signup;
