import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  message,
  Spin,
  Row,
  Col,
  Checkbox,
  Divider,
} from "antd";
import {
  GoogleOutlined,
  FacebookOutlined,
  AppleOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [loading, setLoading] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  // OTP countdown timer
  useEffect(() => {
    let interval;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  // Login submit (your original logic)
  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (res.ok) {
        message.success("Login successful");
        localStorage.setItem("token", data.token);
        localStorage.setItem("UserID", data.user.id);
        localStorage.setItem("leadId", data.user.leadId);
        localStorage.setItem("email", data.user.email);
        localStorage.setItem("name", data.user.name);
        localStorage.setItem("role", data.user.role);
        setTimeout(() => {
          navigate("/user");
        }, 1500);
      } else {
        message.error(data.msg || "Login failed");
      }
    } catch (err) {
      message.error("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Send OTP for forgot password (your original logic)
  const sendOtp = async () => {
    if (!email) return message.error("Enter your email first");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/send-otp-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        message.success("OTP sent. Valid for 1 minute");
        setOtpSent(true);
        setOtpTimer(60);
      } else {
        message.error(data.msg || "Failed to send OTP");
      }
    } catch (err) {
      message.error("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Reset password with OTP (your original logic)
  const resetPassword = async (values) => {
    if (otpTimer <= 0) return message.error("OTP expired. Resend OTP");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp: values.otp,
          newPassword: values.newPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        message.success("Password reset successful");
        setForgotPassword(false);
        setOtpSent(false);
      } else {
        message.error(data.msg || "Failed to reset password");
      }
    } catch (err) {
      message.error("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        // background: "#0052cc",
        background: "linear-gradient(135deg, #3a8017e6   0%, #0052cc 100%)",

        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px 20px",
      }}
    >
      <Spin spinning={loading}>
        <Row
          gutter={[32, 48]}
          align="middle"
          justify="center"
          style={{ width: "100%", maxWidth: 1200, margin: "0 auto" }}
        >
          <Col
            xs={0}
            sm={10}
            md={12}
            lg={12}
            style={{ display: "flex", alignItems: "center" }}
          >
            <div style={{ color: "white", paddingRight: "max(24px, 5vw)" }}>
              <h1
                style={{
                  fontSize: "clamp(2.1rem, 5.5vw, 3.4rem)",
                  fontWeight: 700,
                  marginBottom: 20,
                  lineHeight: 1.2,
                }}
              >
                Welcome to 4M Solar System
              </h1>
              <p
                style={{
                  fontSize: "clamp(1rem, 3vw, 1.18rem)",
                  opacity: 0.9,
                  marginBottom: 28,
                }}
              >
                Harness the power of the sun,
                <br />
                simplify your energy management.
              </p>
              <div
                style={{ fontSize: "2.8rem", letterSpacing: -6, opacity: 0.55 }}
              >
                •••••••
              </div>
            </div>
          </Col>

          <Col xs={24} sm={20} md={18} lg={12} xl={10}>
            <Card
              style={{
                borderRadius: 12,
                boxShadow: "0 10px 40px rgba(0,0,0,0.22)",
                padding: "clamp(16px, 5vw, 40px) clamp(20px, 6vw, 48px)",
                background: "white",
              }}
            >
              {!forgotPassword ? (
                <>
                  <div style={{ textAlign: "center", marginBottom: 32 }}>
                    <h2
                      style={{
                        fontSize: "clamp(1.8rem, 5vw, 2.1rem)",
                        fontWeight: 600,
                        marginBottom: 8,
                      }}
                    >
                      Sign in
                    </h2>
                    <p
                      style={{
                        color: "#555",
                        marginBottom: 0,
                        fontSize: "0.95rem",
                      }}
                    >
                      Don't have an account?{" "}
                      <Link
                        to="/signup"
                        style={{ color: "#0052cc", fontWeight: 500 }}
                      >
                        Sign up
                      </Link>
                    </p>
                  </div>

                  <Form layout="vertical" onFinish={handleLogin}>
                    <Form.Item
                      name="email"
                      rules={[
                        { required: true, message: "Please enter email" },
                        { type: "email", message: "Enter valid email" },
                      ]}
                    >
                      <Input size="large" placeholder="Email" />
                    </Form.Item>

                    <Form.Item
                      name="password"
                      rules={[
                        { required: true, message: "Please enter password" },
                      ]}
                    >
                      <Input.Password size="large" placeholder="Password" />
                    </Form.Item>

                    <Form.Item name="remember" valuePropName="checked">
                      <Checkbox>Keep me logged in</Checkbox>
                    </Form.Item>

                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      block
                      style={{
                        height: 48,
                        fontSize: 16,
                        background: "#0052cc",
                        borderColor: "#0052cc",
                      }}
                    >
                      Log in now
                    </Button>

                    <div style={{ textAlign: "center", margin: "16px 0" }}>
                      <span
                        style={{
                          color: "#0052cc",
                          cursor: "pointer",
                          fontSize: "0.95rem",
                        }}
                        onClick={() => setForgotPassword(true)}
                      >
                        Forgot password?
                      </span>
                    </div>

                    <Divider plain>Or continue with</Divider>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: 16,
                      }}
                    >
                      <Button
                        shape="circle"
                        icon={<GoogleOutlined />}
                        size="large"
                      />
                      <Button
                        shape="circle"
                        icon={<FacebookOutlined />}
                        size="large"
                      />
                      <Button
                        shape="circle"
                        icon={<AppleOutlined />}
                        size="large"
                      />
                    </div>
                  </Form>
                </>
              ) : (
                <Form layout="vertical" onFinish={resetPassword}>
                  <div style={{ textAlign: "center", marginBottom: 24 }}>
                    <h2
                      style={{
                        fontSize: "clamp(1.6rem, 4.5vw, 1.9rem)",
                        fontWeight: 600,
                      }}
                    >
                      Reset Password
                    </h2>
                  </div>

                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: "Enter your email" },
                      { type: "email", message: "Enter valid email" },
                    ]}
                  >
                    <Input
                      size="large"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={otpSent}
                    />
                  </Form.Item>

                  <Button
                    type="primary"
                    block
                    size="large"
                    onClick={sendOtp}
                    disabled={otpTimer > 0}
                    style={{
                      marginBottom: 16,
                      height: 48,
                      background: "#0052cc",
                      borderColor: "#0052cc",
                    }}
                  >
                    {otpTimer > 0 ? `Resend OTP in ${otpTimer}s` : "Send OTP"}
                  </Button>

                  {otpSent && (
                    <>
                      <Form.Item
                        label="OTP"
                        name="otp"
                        rules={[{ required: true, message: "Enter OTP" }]}
                      >
                        <Input size="large" />
                      </Form.Item>

                      <Form.Item
                        label="New Password"
                        name="newPassword"
                        rules={[
                          { required: true, message: "Enter new password" },
                        ]}
                      >
                        <Input.Password size="large" />
                      </Form.Item>

                      <Button
                        type="primary"
                        htmlType="submit"
                        block
                        size="large"
                        style={{
                          height: 48,
                          background: "#0052cc",
                          borderColor: "#0052cc",
                        }}
                      >
                        Reset Password
                      </Button>
                    </>
                  )}

                  <div style={{ textAlign: "center", marginTop: 16 }}>
                    <span
                      style={{
                        color: "#0052cc",
                        cursor: "pointer",
                        fontSize: "0.95rem",
                      }}
                      onClick={() => setForgotPassword(false)}
                    >
                      ← Back to Login
                    </span>
                  </div>
                </Form>
              )}
            </Card>
          </Col>
        </Row>
      </Spin>
    </div>
  );
}

export default Login;
