import React from "react";
import { Form, Input, Button, Card, message } from "antd";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const payload = {
        email: values.email,
        password: values.password,
      };

      const res = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      console.log("DATA FROM BACKEND:", data);

      if (res.ok) {
        message.success("Login successful");

        localStorage.setItem("token", data.token);
        localStorage.setItem("UserID", data.user.id);
        localStorage.setItem("email", data.user.email);
        localStorage.setItem("name", data.user.name);

        if (data.user.role === "staff") {
          navigate("/staff");
        } else if (data.user.role === "admin") {
          navigate("/admin");
        }
      } else {
        message.error(data.msg || "Login failed");
      }
    } catch (err) {
      console.error(err);
      message.error("Server error. Try again later.");
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
      <Card
        title="Sign in"
        headStyle={{ textAlign: "center", fontWeight: "600", fontSize: "18px" }}
        style={{
          width: "380px",
          borderRadius: "12px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "20px",
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

          <p style={{ marginTop: "12px", textAlign: "center" }}>
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </Form>
      </Card>
    </div>
  );
}

export default Login;
