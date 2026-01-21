import React, { useState } from "react";
import { Form, Input, Button, Card, message, Spin } from "antd";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const payload = {
        email: values.email,
        password: values.password,
      };

      const res = await fetch("http://localhost:8000/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("DATA FROM BACKEND:", data);

      if (res.ok) {
        message.success("Login successful");

        // Save user info in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("UserID", data.user.id);
        localStorage.setItem("email", data.user.email);
        localStorage.setItem("name", data.user.name);

        // Redirect after a short delay
        setTimeout(() => {
          navigate("/user"); // redirect to user dashboard
        }, 1500);
      } else {
        message.error(data.msg || "Login failed");
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
          title="Sign In"
          headStyle={{ textAlign: "center", fontWeight: 600, fontSize: 18 }}
          style={{
            width: 380,
            borderRadius: 12,
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
            padding: 20,
          }}
        >
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please enter email" },
                { type: "email", message: "Enter valid email" },
              ]}
            >
              <Input placeholder="Enter email" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Please enter password" }]}
            >
              <Input.Password placeholder="Enter password" />
            </Form.Item>

            <Button type="primary" htmlType="submit" block>
              Login
            </Button>

            <p style={{ marginTop: 12, textAlign: "center" }}>
              Don't have an account? <Link to="/signup">Sign Up</Link>
            </p>
          </Form>
        </Card>
      </Spin>
    </div>
  );
}

export default Login;
