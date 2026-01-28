// // // import React, { useState } from "react";
// // // import { Form, Input, Button, Card, message, Spin } from "antd";
// // // import { Link, useNavigate } from "react-router-dom";

// // // function Login() {
// // //   const navigate = useNavigate();
// // //   const [loading, setLoading] = useState(false);

// // //   const onFinish = async (values) => {
// // //     setLoading(true);
// // //     try {
// // //       const payload = {
// // //         email: values.email,
// // //         password: values.password,
// // //       };

// // //       const res = await fetch("http://localhost:8000/api/user/login", {
// // //         method: "POST",
// // //         headers: { "Content-Type": "application/json" },
// // //         body: JSON.stringify(payload),
// // //       });

// // //       const data = await res.json();
// // //       console.log("DATA FROM BACKEND:", data);

// // //       if (res.ok) {
// // //         message.success("Login successful");

// // //         // Save user info in localStorage
// // //         localStorage.setItem("token", data.token);
// // //         localStorage.setItem("UserID", data.user.id);
// // //         localStorage.setItem("email", data.user.email);
// // //         localStorage.setItem("name", data.user.name);
// // //         localStorage.setItem("role", data.user.role);

// // //         // Redirect after a short delay
// // //         setTimeout(() => {
// // //           navigate("/user"); // redirect to user dashboard
// // //         }, 1500);
// // //       } else {
// // //         message.error(data.msg || "Login failed");
// // //       }
// // //     } catch (err) {
// // //       console.error(err);
// // //       message.error("Server error. Try again later.");
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   return (
// // //     <div
// // //       style={{
// // //         minHeight: "100vh",
// // //         display: "flex",
// // //         justifyContent: "center",
// // //         alignItems: "center",
// // //         background: "#f5f7fa",
// // //         padding: "20px",
// // //       }}
// // //     >
// // //       <Spin spinning={loading}>
// // //         <Card
// // //           title="Sign In"
// // //           headStyle={{ textAlign: "center", fontWeight: 600, fontSize: 18 }}
// // //           style={{
// // //             width: 380,
// // //             borderRadius: 12,
// // //             boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
// // //             padding: 20,
// // //           }}
// // //         >
// // //           <Form layout="vertical" onFinish={onFinish}>
// // //             <Form.Item
// // //               label="Email"
// // //               name="email"
// // //               rules={[
// // //                 { required: true, message: "Please enter email" },
// // //                 { type: "email", message: "Enter valid email" },
// // //               ]}
// // //             >
// // //               <Input placeholder="Enter email" />
// // //             </Form.Item>

// // //             <Form.Item
// // //               label="Password"
// // //               name="password"
// // //               rules={[{ required: true, message: "Please enter password" }]}
// // //             >
// // //               <Input.Password placeholder="Enter password" />
// // //             </Form.Item>

// // //             <Button type="primary" htmlType="submit" block>
// // //               Login
// // //             </Button>

// // //             <p style={{ marginTop: 12, textAlign: "center" }}>
// // //               Don't have an account? <Link to="/signup">Sign Up</Link>
// // //             </p>
// // //           </Form>
// // //         </Card>
// // //       </Spin>
// // //     </div>
// // //   );
// // // }

// // // export default Login;

// // import React, { useState, useEffect } from "react";
// // import { Form, Input, Button, Card, message, Spin } from "antd";
// // import { Link, useNavigate } from "react-router-dom";

// // function Login() {
// //   const [loading, setLoading] = useState(false);
// //   const [forgotPassword, setForgotPassword] = useState(false); // toggle forgot password
// //   const [otpSent, setOtpSent] = useState(false);
// //   const [otpTimer, setOtpTimer] = useState(0); // in seconds

// //   const [email, setEmail] = useState(""); // store email for OTP

// //   const navigate = useNavigate();
// //   // OTP countdown timer
// //   useEffect(() => {
// //     let interval;
// //     if (otpTimer > 0) {
// //       interval = setInterval(() => {
// //         setOtpTimer((prev) => prev - 1);
// //       }, 1000);
// //     }
// //     return () => clearInterval(interval);
// //   }, [otpTimer]);

// //   // Login submit
// //   const handleLogin = async (values) => {
// //     setLoading(true);
// //     try {
// //       const res = await fetch("http://localhost:8000/api/user/login", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify(values),
// //       });
// //       const data = await res.json();
// //       if (res.ok) {
// //         message.success("Login successful");
// //         localStorage.setItem("token", data.token);
// //         localStorage.setItem("UserID", data.user.id);
// //         localStorage.setItem("email", data.user.email);
// //         localStorage.setItem("name", data.user.name);
// //         localStorage.setItem("role", data.user.role);

// //         setTimeout(() => {
// //           navigate("/user"); // redirect to user dashboard
// //         }, 1500);
// //       } else {
// //         message.error(data.msg || "Login failed");
// //       }
// //     } catch (err) {
// //       message.error("Server error. Try again later.");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // Send OTP for forgot password
// //   const sendOtp = async () => {
// //     if (!email) return message.error("Enter your email first");
// //     setLoading(true);
// //     try {
// //       const res = await fetch("http://localhost:8000/api/send-otp-email", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ email }),
// //       });
// //       const data = await res.json();
// //       if (res.ok) {
// //         message.success("OTP sent. Valid for 1 minute");
// //         setOtpSent(true);
// //         setOtpTimer(60); // 1 minute countdown
// //       } else {
// //         message.error(data.msg || "Failed to send OTP");
// //       }
// //     } catch (err) {
// //       message.error("Server error. Try again later.");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // Reset password with OTP
// //   const resetPassword = async (values) => {
// //     if (otpTimer <= 0) return message.error("OTP expired. Resend OTP");
// //     setLoading(true);
// //     try {
// //       const res = await fetch("http://localhost:8000/api/reset-password", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({
// //           email,
// //           otp: values.otp,
// //           newPassword: values.newPassword,
// //         }),
// //       });
// //       const data = await res.json();
// //       if (res.ok) {
// //         message.success("Password reset successful");
// //         setForgotPassword(false);
// //         setOtpSent(false);
// //       } else {
// //         message.error(data.msg || "Failed to reset password");
// //       }
// //     } catch (err) {
// //       message.error("Server error. Try again later.");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div
// //       style={{
// //         minHeight: "100vh",
// //         display: "flex",
// //         justifyContent: "center",
// //         alignItems: "center",
// //         background: "#f5f7fa",
// //         padding: 20,
// //       }}
// //     >
// //       <Spin spinning={loading}>
// //         <Card
// //           title={forgotPassword ? "Forgot Password" : "Sign In"}
// //           headStyle={{ textAlign: "center", fontWeight: 600, fontSize: 18 }}
// //           style={{
// //             width: 380,
// //             borderRadius: 12,
// //             boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
// //             padding: 20,
// //           }}
// //         >
// //           {!forgotPassword ? (
// //             <Form layout="vertical" onFinish={handleLogin}>
// //               <Form.Item
// //                 label="Email"
// //                 name="email"
// //                 rules={[
// //                   { required: true, message: "Please enter email" },
// //                   { type: "email", message: "Enter valid email" },
// //                 ]}
// //               >
// //                 <Input />
// //               </Form.Item>

// //               <Form.Item
// //                 label="Password"
// //                 name="password"
// //                 rules={[{ required: true, message: "Please enter password" }]}
// //               >
// //                 <Input.Password />
// //               </Form.Item>

// //               <Button type="primary" htmlType="submit" block>
// //                 Login
// //               </Button>

// //               <p style={{ marginTop: 12, textAlign: "center" }}>
// //                 <span
// //                   style={{ color: "#1890ff", cursor: "pointer" }}
// //                   onClick={() => setForgotPassword(true)}
// //                 >
// //                   Forgot Password?
// //                 </span>
// //               </p>
// //             </Form>
// //           ) : (
// //             <Form layout="vertical" onFinish={resetPassword}>
// //               <Form.Item
// //                 label="Email"
// //                 name="email"
// //                 rules={[
// //                   { required: true, message: "Enter your email" },
// //                   { type: "email", message: "Enter valid email" },
// //                 ]}
// //               >
// //                 <Input
// //                   value={email}
// //                   onChange={(e) => setEmail(e.target.value)}
// //                   disabled={otpSent} // disable after sending OTP
// //                 />
// //               </Form.Item>

// //               <Button
// //                 type="primary"
// //                 block
// //                 onClick={sendOtp}
// //                 disabled={otpTimer > 0}
// //                 style={{ marginBottom: 12 }}
// //               >
// //                 {otpTimer > 0 ? `Resend OTP in ${otpTimer}s` : "Send OTP"}
// //               </Button>

// //               {otpSent && (
// //                 <>
// //                   <Form.Item
// //                     label="OTP"
// //                     name="otp"
// //                     rules={[{ required: true, message: "Enter OTP" }]}
// //                   >
// //                     <Input />
// //                   </Form.Item>

// //                   <Form.Item
// //                     label="New Password"
// //                     name="newPassword"
// //                     rules={[{ required: true, message: "Enter new password" }]}
// //                   >
// //                     <Input.Password />
// //                   </Form.Item>

// //                   <Button type="primary" htmlType="submit" block>
// //                     Reset Password
// //                   </Button>
// //                 </>
// //               )}

// //               <p
// //                 style={{
// //                   marginTop: 12,
// //                   textAlign: "center",
// //                   cursor: "pointer",
// //                 }}
// //                 onClick={() => setForgotPassword(false)}
// //               >
// //                 Back to Login
// //               </p>
// //             </Form>
// //           )}
// //         </Card>
// //         <p style={{ marginTop: 12, textAlign: "center" }}>
// //           Don't have an account? <Link to="/signup">Sign Up</Link>{" "}
// //         </p>
// //       </Spin>
// //     </div>
// //   );
// // }

// // export default Login;
// import React, { useState, useEffect } from "react";
// import { Form, Input, Button, message, Spin } from "antd";
// import { Link, useNavigate } from "react-router-dom";

// function Login() {
//   const [loading, setLoading] = useState(false);
//   const [forgotPassword, setForgotPassword] = useState(false);
//   const [otpSent, setOtpSent] = useState(false);
//   const [otpTimer, setOtpTimer] = useState(0);
//   const [email, setEmail] = useState("");

//   const navigate = useNavigate();

//   useEffect(() => {
//     let interval;
//     if (otpTimer > 0) {
//       interval = setInterval(() => setOtpTimer(prev => prev - 1), 1000);
//     }
//     return () => clearInterval(interval);
//   }, [otpTimer]);

//   const handleLogin = async (values) => {
//     setLoading(true);
//     try {
//       const res = await fetch("http://localhost:8000/api/user/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(values),
//       });
//       const data = await res.json();
//       if (res.ok) {
//         message.success("Login successful");
//         localStorage.setItem("token", data.token);
//         localStorage.setItem("UserID", data.user.id);
//         localStorage.setItem("email", data.user.email);
//         localStorage.setItem("name", data.user.name);
//         localStorage.setItem("role", data.user.role);
//         setTimeout(() => navigate("/user"), 1500);
//       } else {
//         message.error(data.msg || "Login failed");
//       }
//     } catch {
//       message.error("Server error. Try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const sendOtp = async () => {
//     if (!email) return message.error("Enter your email first");
//     setLoading(true);
//     try {
//       const res = await fetch("http://localhost:8000/api/send-otp-email", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email }),
//       });
//       const data = await res.json();
//       if (res.ok) {
//         message.success("OTP sent. Valid for 1 minute");
//         setOtpSent(true);
//         setOtpTimer(60);
//       } else {
//         message.error(data.msg || "Failed to send OTP");
//       }
//     } catch {
//       message.error("Server error. Try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetPassword = async (values) => {
//     if (otpTimer <= 0) return message.error("OTP expired. Resend OTP");
//     setLoading(true);
//     try {
//       const res = await fetch("http://localhost:8000/api/reset-password", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, otp: values.otp, newPassword: values.newPassword }),
//       });
//       const data = await res.json();
//       if (res.ok) {
//         message.success("Password reset successful");
//         setForgotPassword(false);
//         setOtpSent(false);
//       } else {
//         message.error(data.msg || "Failed to reset password");
//       }
//     } catch {
//       message.error("Server error. Try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ display: "flex", minHeight: "100vh" }}>
//       {/* Left Section */}
//       <div style={{
//         flex: 1,
//         backgroundColor: "#007bff",
//         color: "#fff",
//         display: "flex",
//         flexDirection: "column",
//         justifyContent: "center",
//         alignItems: "center",
//         padding: 40,
//       }}>
//         <h2 style={{ fontWeight: "bold", marginBottom: 20 }}>BOOTSTRAP BRAIN</h2>
//         <p style={{ fontSize: 18, maxWidth: 400, textAlign: "center", lineHeight: 1.6 }}>
//           We make digital products that drive you to stand out.
//         </p>
//         <p style={{ maxWidth: 400, textAlign: "center", fontSize: 14, opacity: 0.8 }}>
//           We write words, take photos, make videos, and interact with artificial intelligence.
//         </p>
//       </div>

//       {/* Right Section */}
//       <div style={{
//         flex: 1,
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         background: "#f5f7fa",
//         padding: 40,
//       }}>
//         <Spin spinning={loading}>
//           <div style={{
//             width: 380,
//             padding: 30,
//             borderRadius: 12,
//             background: "#fff",
//             boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
//           }}>
//             <h2 style={{ textAlign: "center", marginBottom: 20 }}>
//               {forgotPassword ? "Forgot Password" : "Sign In"}
//             </h2>

//             {!forgotPassword ? (
//               <Form layout="vertical" onFinish={handleLogin}>
//                 <Form.Item label="Email" name="email" rules={[
//                   { required: true, message: "Please enter email" },
//                   { type: "email", message: "Enter valid email" }
//                 ]}>
//                   <Input />
//                 </Form.Item>

//                 <Form.Item label="Password" name="password" rules={[
//                   { required: true, message: "Please enter password" }
//                 ]}>
//                   <Input.Password />
//                 </Form.Item>

//                 <Button type="primary" htmlType="submit" block style={{ backgroundColor: "#007bff", borderColor: "#007bff" }}>
//                   Log in now
//                 </Button>

//                 <p style={{ textAlign: "center", marginTop: 12 }}>
//                   <span
//                     style={{ color: "#007bff", cursor: "pointer" }}
//                     onClick={() => setForgotPassword(true)}
//                   >
//                     Forgot Password?
//                   </span>
//                 </p>
//               </Form>
//             ) : (
//               <Form layout="vertical" onFinish={resetPassword}>
//                 <Form.Item label="Email" name="email" rules={[
//                   { required: true, message: "Enter your email" },
//                   { type: "email", message: "Enter valid email" }
//                 ]}>
//                   <Input value={email} onChange={(e) => setEmail(e.target.value)} disabled={otpSent} />
//                 </Form.Item>

//                 <Button
//                   type="primary"
//                   block
//                   onClick={sendOtp}
//                   disabled={otpTimer > 0}
//                   style={{ marginBottom: 12, backgroundColor: "#007bff", borderColor: "#007bff" }}
//                 >
//                   {otpTimer > 0 ? `Resend OTP in ${otpTimer}s` : "Send OTP"}
//                 </Button>

//                 {otpSent && <>
//                   <Form.Item label="OTP" name="otp" rules={[{ required: true, message: "Enter OTP" }]}>
//                     <Input />
//                   </Form.Item>

//                   <Form.Item label="New Password" name="newPassword" rules={[{ required: true, message: "Enter new password" }]}>
//                     <Input.Password />
//                   </Form.Item>

//                   <Button type="primary" htmlType="submit" block style={{ backgroundColor: "#007bff", borderColor: "#007bff" }}>
//                     Reset Password
//                   </Button>
//                 </>}

//                 <p style={{ marginTop: 12, textAlign: "center", cursor: "pointer" }} onClick={() => setForgotPassword(false)}>
//                   Back to Login
//                 </p>
//               </Form>
//             )}

//             <p style={{ marginTop: 12, textAlign: "center" }}>
//               Don't have an account? <Link to="/signup" style={{ color: "#007bff" }}>Sign Up</Link>
//             </p>
//           </div>
//         </Spin>
//       </div>
//     </div>
//   );
// }

// export default Login;
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
    // <div
    //   style={{
    //     minHeight: "100vh",
    //     background: "#0052cc", // exact blue from the image
    //     display: "flex",
    //     alignItems: "center",
    //     padding: "0 40px",
    //   }}
    // >
    //   <Spin spinning={loading}>
    //     <Row
    //       gutter={[64, 0]}
    //       align="middle"
    //       style={{ width: "100%", maxWidth: 1100, margin: "0 auto" }}
    //     >
    //       {/* Left side - Text & Branding */}
    //       <Col xs={24} lg={12}>
    //         <div style={{ color: "white", paddingRight: 40 }}>
    //           <h1
    //             style={{
    //               fontSize: "3.2rem",
    //               fontWeight: 700,
    //               marginBottom: 24,
    //               lineHeight: 1.2,
    //             }}
    //           >
    //             We make digital products that
    //             <br />
    //             drive you to stand out.
    //           </h1>

    //           <p style={{ fontSize: "1.2rem", opacity: 0.9, marginBottom: 32 }}>
    //             We write words, take photos, make videos, and interact with
    //             <br />
    //             artificial intelligence.
    //           </p>

    //           <div
    //             style={{ fontSize: "3rem", letterSpacing: -4, opacity: 0.6 }}
    //           >
    //             •••••••
    //           </div>
    //         </div>
    //       </Col>

    //       {/* Right side - Login Card */}
    //       <Col xs={24} lg={12}>
    //         <Card
    //           style={{
    //             borderRadius: 12,
    //             boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    //             padding: "32px 40px",
    //             background: "white",
    //           }}
    //         >
    //           {!forgotPassword ? (
    //             <>
    //               <div style={{ textAlign: "center", marginBottom: 32 }}>
    //                 <h2
    //                   style={{ fontSize: 28, fontWeight: 600, marginBottom: 8 }}
    //                 >
    //                   Sign in
    //                 </h2>
    //                 <p style={{ color: "#666", marginBottom: 0 }}>
    //                   Don't have an account?{" "}
    //                   <Link
    //                     to="/signup"
    //                     style={{ color: "#0052cc", fontWeight: 500 }}
    //                   >
    //                     Sign up
    //                   </Link>
    //                 </p>
    //               </div>

    //               <Form layout="vertical" onFinish={handleLogin}>
    //                 <Form.Item
    //                   name="email"
    //                   rules={[
    //                     { required: true, message: "Please enter email" },
    //                     { type: "email", message: "Enter valid email" },
    //                   ]}
    //                 >
    //                   <Input size="large" placeholder="Email" />
    //                 </Form.Item>

    //                 <Form.Item
    //                   name="password"
    //                   rules={[
    //                     { required: true, message: "Please enter password" },
    //                   ]}
    //                 >
    //                   <Input.Password size="large" placeholder="Password" />
    //                 </Form.Item>

    //                 <Form.Item name="remember" valuePropName="checked">
    //                   <Checkbox>Keep me logged in</Checkbox>
    //                 </Form.Item>

    //                 <Button
    //                   type="primary"
    //                   htmlType="submit"
    //                   size="large"
    //                   block
    //                   style={{
    //                     height: 48,
    //                     fontSize: 16,
    //                     background: "#0052cc",
    //                     borderColor: "#0052cc",
    //                   }}
    //                 >
    //                   Log in now
    //                 </Button>

    //                 <div style={{ textAlign: "center", margin: "16px 0" }}>
    //                   <span
    //                     style={{ color: "#0052cc", cursor: "pointer" }}
    //                     onClick={() => setForgotPassword(true)}
    //                   >
    //                     Forgot password
    //                   </span>
    //                 </div>

    //                 <Divider plain>Or continue with</Divider>

    //                 <div
    //                   style={{
    //                     display: "flex",
    //                     justifyContent: "center",
    //                     gap: 24,
    //                   }}
    //                 >
    //                   <Button
    //                     shape="circle"
    //                     icon={<GoogleOutlined style={{ fontSize: 20 }} />}
    //                     size="large"
    //                   />
    //                   <Button
    //                     shape="circle"
    //                     icon={<FacebookOutlined style={{ fontSize: 20 }} />}
    //                     size="large"
    //                   />
    //                   <Button
    //                     shape="circle"
    //                     icon={<AppleOutlined style={{ fontSize: 20 }} />}
    //                     size="large"
    //                   />
    //                 </div>
    //               </Form>
    //             </>
    //           ) : (
    //             <Form layout="vertical" onFinish={resetPassword}>
    //               <div style={{ textAlign: "center", marginBottom: 24 }}>
    //                 <h2 style={{ fontSize: 24, fontWeight: 600 }}>
    //                   Reset Password
    //                 </h2>
    //               </div>

    //               <Form.Item
    //                 label="Email"
    //                 name="email"
    //                 rules={[
    //                   { required: true, message: "Enter your email" },
    //                   { type: "email", message: "Enter valid email" },
    //                 ]}
    //               >
    //                 <Input
    //                   size="large"
    //                   value={email}
    //                   onChange={(e) => setEmail(e.target.value)}
    //                   disabled={otpSent}
    //                 />
    //               </Form.Item>

    //               <Button
    //                 type="primary"
    //                 block
    //                 size="large"
    //                 onClick={sendOtp}
    //                 disabled={otpTimer > 0}
    //                 style={{
    //                   marginBottom: 16,
    //                   background: "#0052cc",
    //                   borderColor: "#0052cc",
    //                 }}
    //               >
    //                 {otpTimer > 0 ? `Resend OTP in ${otpTimer}s` : "Send OTP"}
    //               </Button>

    //               {otpSent && (
    //                 <>
    //                   <Form.Item
    //                     label="OTP"
    //                     name="otp"
    //                     rules={[{ required: true, message: "Enter OTP" }]}
    //                   >
    //                     <Input size="large" />
    //                   </Form.Item>

    //                   <Form.Item
    //                     label="New Password"
    //                     name="newPassword"
    //                     rules={[
    //                       { required: true, message: "Enter new password" },
    //                     ]}
    //                   >
    //                     <Input.Password size="large" />
    //                   </Form.Item>

    //                   <Button
    //                     type="primary"
    //                     htmlType="submit"
    //                     block
    //                     size="large"
    //                     style={{
    //                       background: "#0052cc",
    //                       borderColor: "#0052cc",
    //                     }}
    //                   >
    //                     Reset Password
    //                   </Button>
    //                 </>
    //               )}

    //               <div style={{ textAlign: "center", marginTop: 16 }}>
    //                 <span
    //                   style={{ color: "#0052cc", cursor: "pointer" }}
    //                   onClick={() => setForgotPassword(false)}
    //                 >
    //                   Back to Login
    //                 </span>
    //               </div>
    //             </Form>
    //           )}
    //         </Card>
    //       </Col>
    //     </Row>
    //   </Spin>
    // </div>

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
