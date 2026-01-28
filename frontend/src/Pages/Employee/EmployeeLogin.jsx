// import React from "react";
// import { Row, Col, Form, Input, Button, Card, message } from "antd";
// import { UserOutlined, LockOutlined } from "@ant-design/icons";
// import Api from "../../Api";
// import { useNavigate } from "react-router-dom";

// function EmployeeLogin() {
//   const navigate = useNavigate();

//   const onFinish = async (values) => {
//     try {
//       const res = await Api.post("/employee/login", values);
//       message.success(res.data.message);

//       localStorage.setItem("employeeToken", res.data.token);
//       localStorage.setItem("employeeData", JSON.stringify(res.data.employee));
//       localStorage.setItem("role", "employee");

//       navigate("/employee");
//     } catch (err) {
//       message.error(err.response?.data?.message || "Login failed");
//     }
//   };

//   return (
//     <Row style={{ minHeight: "100vh" }}>
//       {/* Left Image Section */}
//       <Col
//         xs={0}
//         md={12}
//         style={{
//           backgroundImage:
//             "url('https://img.freepik.com/free-vector/flat-design-office-printer-illustration_23-2150268487.jpg?t=st=1769076484~exp=1769080084~hmac=1287415717ba0f1ac5e5668fcf51e61950c084998c7fb127bb3677a7d4e76a16&w=2000')",
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//         }}
//       />

//       {/* Right Login Section */}
//       <Col
//         xs={24}
//         md={12}
//         style={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//         }}
//       >
//         <Card title="Employee Login" style={{ width: 350 }}>
//           <Form layout="vertical" onFinish={onFinish}>
//             <Form.Item
//               name="emailOrPhone"
//               label="Email or Phone"
//               rules={[{ required: true, message: "Enter email or phone" }]}
//             >
//               <Input prefix={<UserOutlined />} />
//             </Form.Item>

//             <Form.Item
//               name="password"
//               label="Password"
//               rules={[{ required: true, message: "Enter password" }]}
//             >
//               <Input.Password prefix={<LockOutlined />} />
//             </Form.Item>

//             <Button type="primary" htmlType="submit" block>
//               Login
//             </Button>
//           </Form>
//         </Card>
//       </Col>
//     </Row>
//   );
// }

// export default EmployeeLogin;import React, { useState, useEffect } from "react";

import { Row, Col, Form, Input, Button, Card, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import Api from "../../Api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";

function EmployeeLogin() {
  const navigate = useNavigate();
  const [step, setStep] = useState("login"); // login | otp | reset
  const [email, setEmail] = useState("");
  const [otpTime, setOtpTime] = useState(0); // countdown in seconds

  // OTP countdown effect
  useEffect(() => {
    let timer;
    if (otpTime > 0) {
      timer = setTimeout(() => setOtpTime(otpTime - 1), 1000);
    } else if (otpTime === 0 && step === "reset") {
      message.warning("OTP expired! Please resend OTP.");
      setStep("otp"); // go back to OTP send step
    }
    return () => clearTimeout(timer);
  }, [otpTime, step]);

  const onLogin = async (values) => {
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

  const sendOtp = async (values) => {
    try {
      const mail = values.email.trim().toLowerCase();
      const res = await Api.post("/employee/reset-otp", { email: mail }); // ✅ correct endpoint
      setEmail(mail);
      message.success("OTP sent to your email");

      setStep("reset");
      setOtpTime(60); // start 1-minute countdown
    } catch (err) {
      message.error(err.response?.data?.msg || "OTP send failed");
    }
  };

  const resetPassword = async (values) => {
    try {
      await Api.post("/employee/reset-pass", {
        email,
        otp: values.otp.trim(),
        newPassword: values.password.trim(),
      });

      message.success("Password reset successful");
      setStep("login"); // back to login
    } catch (err) {
      message.error(err.response?.data?.msg || "Reset failed");
    }
  };

  return (
    <Row style={{ minHeight: "100vh" }}>
      <Col
        xs={0}
        md={12}
        style={{
          backgroundImage:
            "url('https://img.freepik.com/free-vector/flat-design-office-printer-illustration_23-2150268487.jpg')",
          backgroundSize: "cover",
        }}
      />

      <Col
        xs={24}
        md={12}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Card title="Employee Login" style={{ width: 380 }}>
          {/* Login Form */}
          {step === "login" && (
            <>
              <Form layout="vertical" onFinish={onLogin}>
                <Form.Item
                  name="emailOrPhone"
                  label="Email or Phone"
                  rules={[{ required: true }]}
                >
                  <Input prefix={<UserOutlined />} />
                </Form.Item>

                <Form.Item
                  name="password"
                  label="Password"
                  rules={[{ required: true }]}
                >
                  <Input.Password prefix={<LockOutlined />} />
                </Form.Item>

                <Button type="primary" htmlType="submit" block>
                  Login
                </Button>
              </Form>

              <p
                style={{
                  textAlign: "right",
                  marginTop: 10,
                  color: "#1677ff",
                  cursor: "pointer",
                }}
                onClick={() => setStep("otp")}
              >
                Forgot Password?
              </p>
            </>
          )}

          {/* Send OTP Form */}
          {step === "otp" && (
            <Form layout="vertical" onFinish={sendOtp}>
              <Form.Item
                name="email"
                label="Registered Email"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Button type="primary" htmlType="submit" block>
                Send OTP
              </Button>

              <p
                style={{ marginTop: 10, cursor: "pointer" }}
                onClick={() => setStep("login")}
              >
                Back to Login
              </p>
            </Form>
          )}

          {/* Reset Password Form */}
          {step === "reset" && (
            <>
              <p style={{ color: "red", marginBottom: 10 }}>
                OTP expires in: {otpTime} sec
              </p>

              <Form layout="vertical" onFinish={resetPassword}>
                <Form.Item name="otp" label="OTP" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>

                <Form.Item
                  name="password"
                  label="New Password"
                  rules={[{ required: true }]}
                >
                  <Input.Password />
                </Form.Item>

                <Button type="primary" htmlType="submit" block>
                  Reset Password
                </Button>
              </Form>

              <p
                style={{ marginTop: 10, cursor: "pointer" }}
                onClick={() => setStep("login")}
              >
                Back to Login
              </p>
            </>
          )}
        </Card>
      </Col>
    </Row>
  );
}

export default EmployeeLogin;
