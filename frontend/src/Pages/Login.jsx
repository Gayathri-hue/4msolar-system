// import React, { useState } from "react";
// import { Form, Input, Button, Card, message, Spin } from "antd";
// import { Link, useNavigate } from "react-router-dom";

// function Login() {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);

//   const onFinish = async (values) => {
//     setLoading(true);
//     try {
//       const payload = {
//         email: values.email,
//         password: values.password,
//       };

//       const res = await fetch("http://localhost:8000/api/user/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();
//       console.log("DATA FROM BACKEND:", data);

//       if (res.ok) {
//         message.success("Login successful");

//         // Save user info in localStorage
//         localStorage.setItem("token", data.token);
//         localStorage.setItem("UserID", data.user.id);
//         localStorage.setItem("email", data.user.email);
//         localStorage.setItem("name", data.user.name);
//         localStorage.setItem("role", data.user.role);

//         // Redirect after a short delay
//         setTimeout(() => {
//           navigate("/user"); // redirect to user dashboard
//         }, 1500);
//       } else {
//         message.error(data.msg || "Login failed");
//       }
//     } catch (err) {
//       console.error(err);
//       message.error("Server error. Try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         background: "#f5f7fa",
//         padding: "20px",
//       }}
//     >
//       <Spin spinning={loading}>
//         <Card
//           title="Sign In"
//           headStyle={{ textAlign: "center", fontWeight: 600, fontSize: 18 }}
//           style={{
//             width: 380,
//             borderRadius: 12,
//             boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
//             padding: 20,
//           }}
//         >
//           <Form layout="vertical" onFinish={onFinish}>
//             <Form.Item
//               label="Email"
//               name="email"
//               rules={[
//                 { required: true, message: "Please enter email" },
//                 { type: "email", message: "Enter valid email" },
//               ]}
//             >
//               <Input placeholder="Enter email" />
//             </Form.Item>

//             <Form.Item
//               label="Password"
//               name="password"
//               rules={[{ required: true, message: "Please enter password" }]}
//             >
//               <Input.Password placeholder="Enter password" />
//             </Form.Item>

//             <Button type="primary" htmlType="submit" block>
//               Login
//             </Button>

//             <p style={{ marginTop: 12, textAlign: "center" }}>
//               Don't have an account? <Link to="/signup">Sign Up</Link>
//             </p>
//           </Form>
//         </Card>
//       </Spin>
//     </div>
//   );
// }

// export default Login;

import React, { useState, useEffect } from "react";
import { Form, Input, Button, Card, message, Spin } from "antd";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [loading, setLoading] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false); // toggle forgot password
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0); // in seconds

  const [email, setEmail] = useState(""); // store email for OTP

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

  // Login submit
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
        localStorage.setItem("email", data.user.email);
        localStorage.setItem("name", data.user.name);
        localStorage.setItem("role", data.user.role);

        setTimeout(() => {
          navigate("/user"); // redirect to user dashboard
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

  // Send OTP for forgot password
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
        setOtpTimer(60); // 1 minute countdown
      } else {
        message.error(data.msg || "Failed to send OTP");
      }
    } catch (err) {
      message.error("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Reset password with OTP
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
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f7fa",
        padding: 20,
      }}
    >
      <Spin spinning={loading}>
        <Card
          title={forgotPassword ? "Forgot Password" : "Sign In"}
          headStyle={{ textAlign: "center", fontWeight: 600, fontSize: 18 }}
          style={{
            width: 380,
            borderRadius: 12,
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
            padding: 20,
          }}
        >
          {!forgotPassword ? (
            <Form layout="vertical" onFinish={handleLogin}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please enter email" },
                  { type: "email", message: "Enter valid email" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: "Please enter password" }]}
              >
                <Input.Password />
              </Form.Item>

              <Button type="primary" htmlType="submit" block>
                Login
              </Button>

              <p style={{ marginTop: 12, textAlign: "center" }}>
                <span
                  style={{ color: "#1890ff", cursor: "pointer" }}
                  onClick={() => setForgotPassword(true)}
                >
                  Forgot Password?
                </span>
              </p>
            </Form>
          ) : (
            <Form layout="vertical" onFinish={resetPassword}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Enter your email" },
                  { type: "email", message: "Enter valid email" },
                ]}
              >
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={otpSent} // disable after sending OTP
                />
              </Form.Item>

              <Button
                type="primary"
                block
                onClick={sendOtp}
                disabled={otpTimer > 0}
                style={{ marginBottom: 12 }}
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
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label="New Password"
                    name="newPassword"
                    rules={[{ required: true, message: "Enter new password" }]}
                  >
                    <Input.Password />
                  </Form.Item>

                  <Button type="primary" htmlType="submit" block>
                    Reset Password
                  </Button>
                </>
              )}

              <p
                style={{
                  marginTop: 12,
                  textAlign: "center",
                  cursor: "pointer",
                }}
                onClick={() => setForgotPassword(false)}
              >
                Back to Login
              </p>
            </Form>
          )}
        </Card>
        <p style={{ marginTop: 12, textAlign: "center" }}>
          Don't have an account? <Link to="/signup">Sign Up</Link>{" "}
        </p>
      </Spin>
    </div>
  );
}

export default Login;
