import React from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Api from "../../Api.js";

const { Title } = Typography;

function AdminLogin() {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const res = await Api.post("/admin/adminlogin", {
        email: values.email,
        password: values.password,
      });

      message.success("Admin login successful");

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("adminEmail", res.data.email);
      localStorage.setItem("role", "admin");

      navigate("/admin");
    } catch (err) {
      message.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={styles.container}>
      <Card style={styles.card}>
        <Title level={3} style={{ textAlign: "center" }}>
          Admin Login
        </Title>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter admin email" },
              { type: "email", message: "Enter valid email" },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="admin@4msolar.com" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter password" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter password"
            />
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            Login
          </Button>
        </Form>
      </Card>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "#25259f",

    backgroundImage: `
      linear-gradient(rgb(11 89 206 / 95%), rgb(11 89 206 / 91%)),
      url("https://img.freepik.com/premium-psd/enter-world-imagination-3d-fun-kids_1013393-15.jpg?ga=GA1.1.957273099.1723532135&w=740&q=80")
    `,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  },
  card: {
    width: 360,
    borderRadius: 12,
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  },
};

export default AdminLogin;
