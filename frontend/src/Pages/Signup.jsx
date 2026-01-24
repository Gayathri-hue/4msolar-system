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

function Signup() {
  const navigate = useNavigate();
  const { Option } = Select;
  const [loading, setLoading] = useState(false);
  const [showCustomReferrer, setShowCustomReferrer] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const dob = values.dob.format("YYYY-MM-DD");

      // If custom referrer is shown, take that value
      const referrerValue = showCustomReferrer
        ? values.referrerDetails
        : values.referrer;

      const payload = {
        name: values.name,
        dob,
        phone: values.phone,
        role: values.role,

        email: values.email,
        password: values.password,
        referrer: showCustomReferrer ? "Other" : values.referrer,
        referrerDetails: showCustomReferrer ? values.referrerDetails : "",
      };

      const res = await fetch("http://localhost:8000/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        message.success(`${data.msg}`);
        setTimeout(() => {
          navigate("/login");
        }, 1500);
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

  const handleReferrerChange = (value) => {
    // Show input if user selects "Other"
    setShowCustomReferrer(value === "Other");
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
          headStyle={{ textAlign: "center", fontWeight: 600, fontSize: 18 }}
          style={{
            width: 400,
            borderRadius: 12,
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
            padding: 20,
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
              <Input placeholder="Enter phone number" maxLength={10} />
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

            {/* Referrer dropdown */}
            <Form.Item label="Referrer" name="referrer" initialValue="Other">
              <Select onChange={handleReferrerChange}>
                <Option value="Instagram">Instagram</Option>
                <Option value="Facebook">Facebook</Option>
                <Option value="Twitter">Twitter</Option>
                <Option value="Youtube">Youtube</Option>
                <Option value="Other">Other</Option>
              </Select>
            </Form.Item>

            {/* Custom input for referrer */}
            {showCustomReferrer && (
              <Form.Item
                label="Referrer Details"
                name="referrerDetails"
                rules={[{ required: true, message: "Enter referrer details" }]}
              >
                <Input placeholder="Enter referrer name or phone" />
              </Form.Item>
            )}

            <Button type="primary" htmlType="submit" block>
              Sign Up
            </Button>

            <p style={{ marginTop: 12, textAlign: "center" }}>
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </Form>
        </Card>
      </Spin>
    </div>
  );
}

export default Signup;
