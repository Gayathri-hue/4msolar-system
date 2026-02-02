// import React, { useState } from "react";
// import { Form, Input, Button, Select, message, Row, Col } from "antd";
// import Api from "../../Api";
// import { useNavigate } from "react-router-dom";
// import BackButton from "./BackButton";

// const { Option } = Select;

// function PostEnquiryForm() {
//   const [loading, setLoading] = useState(false);
//   const userId = localStorage.getItem("UserID"); // login user id
//   const navigate = useNavigate();

//   const onFinish = async (values) => {
//     try {
//       setLoading(true);

//       // Add customer id manually if needed
//       values.customer = userId;

//       await Api.post("/enquiry/createenquiry", values);

//       message.success("Enquiry submitted successfully");

//       // Redirect after submission
//       navigate("/user/enquiryform");
//     } catch (err) {
//       console.error(err);
//       message.error("Failed to submit enquiry");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ maxWidth: 800, margin: "auto" }}>
//       <BackButton />

//       <h2>Post Enquiry</h2>

//       <Form layout="vertical" onFinish={onFinish}>
//         {/* Hidden customer id field */}
//         <Form.Item name="customer" initialValue={userId} hidden>
//           <Input value={userId} disabled />
//         </Form.Item>

//         <Row gutter={16}>
//           <Col span={12}>
//             <Form.Item
//               name="fullName"
//               label="Full Name"
//               rules={[{ required: true }]}
//             >
//               <Input />
//             </Form.Item>
//           </Col>

//           <Col span={12}>
//             <Form.Item
//               name="mobile"
//               label="Mobile"
//               rules={[{ required: true }]}
//             >
//               <Input />
//             </Form.Item>
//           </Col>
//         </Row>

//         <Row gutter={16}>
//           <Col span={12}>
//             <Form.Item name="email" label="Email">
//               <Input />
//             </Form.Item>
//           </Col>

//           <Col span={12}>
//             <Form.Item
//               name="enquiryType"
//               label="Enquiry Type"
//               rules={[{ required: true }]}
//             >
//               <Select placeholder="Select enquiry type">
//                 <Option value="New Solar Installation">
//                   New Solar Installation
//                 </Option>
//                 <Option value="Solar Repair / Service">
//                   Solar Repair / Service
//                 </Option>
//                 <Option value="Rooftop Inspection">Rooftop Inspection</Option>
//                 <Option value="Battery / Inverter Issue">
//                   Battery / Inverter Issue
//                 </Option>
//               </Select>
//             </Form.Item>
//           </Col>
//         </Row>

//         <Row gutter={16}>
//           <Col span={12}>
//             <Form.Item name="systemType" label="System Type">
//               <Select placeholder="Select system type">
//                 <Option value="On-Grid">On-Grid</Option>
//                 <Option value="Off-Grid">Off-Grid</Option>
//                 <Option value="Hybrid">Hybrid</Option>
//               </Select>
//             </Form.Item>
//           </Col>

//           <Col span={12}>
//             <Form.Item name="capacity" label="Capacity">
//               <Input placeholder="ex: 3KW, 5KW" />
//             </Form.Item>
//           </Col>
//         </Row>

//         <Form.Item name="address" label="Address">
//           <Input.TextArea rows={3} />
//         </Form.Item>

//         <Form.Item name="message" label="Message">
//           <Input.TextArea rows={3} />
//         </Form.Item>

//         <Button type="primary" htmlType="submit" loading={loading}>
//           Submit Enquiry
//         </Button>
//       </Form>
//     </div>
//   );
// }

// export default PostEnquiryForm;

import React, { useState } from "react";
import { Form, Input, Button, Select, message, Row, Col, Upload } from "antd";
import Api from "../../Api";
import { useNavigate } from "react-router-dom";
import BackButton from "./BackButton";
import "../../styles/layouts/EnquiryForm.scss";
// import submit from "../../../public/Image/Screenshot (451).png";

const { Option } = Select;

function PostEnquiryForm() {
  const [loading, setLoading] = useState(false);
  const [enquiryType, setEnquiryType] = useState("");
  const [siteVisit, setSiteVisit] = useState("");
  const userId = localStorage.getItem("UserID");
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      setLoading(true);

      const formData = new FormData();

      // Append all fields EXCEPT image
      for (const key in values) {
        if (key !== "image" && values[key] !== undefined) {
          formData.append(key, values[key]);
        }
      }

      // Append real file
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput && fileInput.files[0]) {
        formData.append("image", fileInput.files[0]);
      }

      formData.append("customer", userId);

      await Api.post("/enquiry/createenquiry", formData);

      message.success("Enquiry submitted successfully");
      navigate("/user/dashboard");
    } catch (err) {
      console.error(err);
      message.error("Failed to submit enquiry");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div style={{ padding: "40px 20px", maxWidth: 1200, margin: "0 auto" }}>
        <h2 className="front-title">Post Enquiry</h2>

        <div className="enquiry-form">
          <Form layout="vertical" onFinish={onFinish} form={form}>
            {/* <Form.Item name="customer" initialValue={userId} hidden>
              <Input />
            </Form.Item> */}

            {/* Row 1 - 3 columns */}
            <Row gutter={[16, 24]}>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  name="fullName"
                  label="Full Name"
                  rules={[
                    { required: true, message: "Please enter your name" },
                  ]}
                >
                  <Input placeholder="Enter your full name" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  name="mobile"
                  label="Mobile Number"
                  rules={[
                    { required: true, message: "Please enter mobile number" },
                  ]}
                >
                  <Input placeholder="10 digit mobile number" maxLength={10} />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={8}>
                <Form.Item name="email" label="Email">
                  <Input placeholder="example@email.com" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={24}>
                <Form.Item name="address" label="Address">
                  <Input.TextArea rows={3} placeholder="Full address here..." />
                </Form.Item>
              </Col>
            </Row>

            {/* Row 2 - 3 columns */}
            <Row gutter={[16, 24]}>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  name="enquiryType"
                  label="Enquiry Type"
                  rules={[
                    { required: true, message: "Please select enquiry type" },
                  ]}
                >
                  <Select
                    placeholder="Select enquiry type"
                    onChange={(value) => setEnquiryType(value)}
                  >
                    <Option value="New Solar Power Plant Installation">
                      New Solar Power Plant Installation
                    </Option>
                    <Option value="Solar Power Plant Service">
                      Solar Power Plant Service
                    </Option>
                    <Option value="Operation & Maintanence Service">
                      Operation & Maintanence Service
                    </Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  name="category"
                  label="Category"
                  rules={[
                    { required: true, message: "Please select Category" },
                  ]}
                >
                  <Select placeholder="Select category">
                    <Option value="residential">Residential</Option>
                    <Option value="commercial">Commercial</Option>
                    <Option value="industrial">Industrial</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  name="systemType"
                  label="System Type"
                  rules={[
                    { required: true, message: "Please select System Type" },
                  ]}
                >
                  <Select placeholder="Select system type">
                    <Option value="On-Grid">On-Grid</Option>
                    <Option value="Off-Grid">Off-Grid</Option>
                    <Option value="Hybrid">Hybrid</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            {enquiryType === "New Solar Power Plant Installation" && (
              <>
                <Row gutter={[16, 24]}>
                  <Col xs={24} sm={12} md={8}>
                    <Form.Item
                      name="capacity"
                      label="Capacity (kW)"
                      rules={[
                        { required: true, message: "Please select Capacity" },
                      ]}
                    >
                      <Input placeholder="e.g. 5" suffix="kW" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} md={8}>
                    <Form.Item
                      name="roofType"
                      label="Roof Type"
                      rules={[
                        { required: true, message: "Please select Capacity" },
                      ]}
                    >
                      <Select>
                        <Option value="rcc">RCC</Option>
                        <Option value="Sheet">Sheet </Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} md={8}>
                    <Form.Item name="roofArea" label="Roof Area">
                      <Input placeholder="e.g. 800" suffix="sq ft" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={[16, 24]}>
                  <Col xs={24} sm={12} md={8}>
                    <Form.Item
                      name="ebServiceNo"
                      label="EB Service Number"
                      rules={[
                        { required: true, message: "Please select ServiceNo" },
                      ]}
                    >
                      <Input placeholder="Your EB consumer number" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} md={8}>
                    <Form.Item name="image" label="Site / Problem Photo">
                      <Input type="file" accept="image/*" name="image" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} md={8}>
                    <Form.Item name="siteVisit" label="Need Site Visit?">
                      <Select onChange={(v) => setSiteVisit(v)}>
                        <Option value="true">Yes</Option>
                        <Option value="false">No</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                {siteVisit === "true" && (
                  <Row gutter={16}>
                    <Col span={24}>
                      <Form.Item
                        name="siteVisitDateTime"
                        label="Preferred Site Visit Date & Time"
                      >
                        <Input type="datetime-local" />
                      </Form.Item>
                    </Col>
                  </Row>
                )}

                <Row gutter={16}>
                  <Col span={24}>
                    <Form.Item
                      name="googleLocation"
                      label="Current Location (Lat, Long)"
                      rules={[
                        {
                          required: true,
                          message: "Please allow location access",
                        },
                      ]}
                    >
                      <Input
                        placeholder="Click to get your current location"
                        readOnly
                        onClick={() => {
                          if (navigator.geolocation) {
                            navigator.geolocation.getCurrentPosition(
                              (position) => {
                                const lat = position.coords.latitude;
                                const lng = position.coords.longitude;

                                form.setFieldsValue({
                                  googleLocation: `${lat}, ${lng}`,
                                });
                              },
                              () => {
                                message.error("Location access denied");
                              },
                            );
                          } else {
                            message.error("Geolocation not supported");
                          }
                        }}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={24}>
                    <Form.Item name="message" label="Additional Message">
                      <Input.TextArea
                        rows={4}
                        placeholder="Any other details..."
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </>
            )}

            {enquiryType === "Solar Power Plant Service" && (
              <>
                <Row gutter={[16, 24]}>
                  <Col xs={24} sm={12} md={8}>
                    <Form.Item
                      name="capacity"
                      label="Installed Capacity"
                      rules={[
                        { required: true, message: "Please select Capacity" },
                      ]}
                    >
                      <Input placeholder="e.g. 5" suffix="kW" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} md={8}>
                    <Form.Item
                      name="roofType"
                      label="Roof Type"
                      rules={[
                        { required: true, message: "Please select Roof Type" },
                      ]}
                    >
                      <Select>
                        <Option value="rcc">RCC</Option>
                        <Option value="Sheet">Sheet</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} md={8}>
                    <Form.Item name="preferredTime" label="Preferred Time">
                      <Select>
                        <Option value="Morning">Morning</Option>
                        <Option value="Afternoon">Afternoon</Option>
                        <Option value="Evening">Evening</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={[16, 24]}>
                  <Col xs={24} sm={12} md={8}>
                    <Form.Item
                      name="preferredDateTime"
                      label="Preferred Date"
                      rules={[
                        {
                          required: true,
                          message: "Please select Prefered Date",
                        },
                      ]}
                    >
                      <Input type="datetime-local" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} md={8}>
                    <Form.Item label="Upload Image" name="image">
                      <Input type="file" />
                    </Form.Item>
                    {/* <Form.Item
                      name="image"
                      label="Site / Problem Photo"
                      valuePropName="file"
                      getValueFromEvent={(e) => e}
                    >
                      <Upload beforeUpload={() => false} maxCount={1}>
                        <Button>Select Image</Button>
                      </Upload>
                    </Form.Item> */}
                  </Col>

                  <Col xs={24} sm={12} md={8}>
                    <Form.Item
                      name="googleLocation"
                      label="Current Location (Lat, Long)"
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: "Please allow location access",
                      //   },
                      // ]}
                    >
                      <Input
                        placeholder="Click to get your current location"
                        readOnly
                        onClick={() => {
                          if (navigator.geolocation) {
                            navigator.geolocation.getCurrentPosition(
                              (position) => {
                                const lat = position.coords.latitude;
                                const lng = position.coords.longitude;

                                form.setFieldsValue({
                                  googleLocation: `${lat}, ${lng}`,
                                });
                              },
                              () => {
                                message.error("Location access denied");
                              },
                            );
                          } else {
                            message.error("Geolocation not supported");
                          }
                        }}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={[16, 24]}>
                  <Col xs={24} sm={12} md={8}>
                    <Form.Item
                      name="productType"
                      label="Product Type"
                      rules={[
                        {
                          required: true,
                          message: "Please select a product type",
                        },
                      ]}
                    >
                      <Select
                        style={{ width: "100%" }}
                        placeholder="Select Product Type"
                      >
                        <Option value="Solar Panel">Solar Panel</Option>
                        <Option value="Inverter">Inverter</Option>
                        <Option value="DB Box">DB Box</Option>
                        <Option value="Cable">Cable</Option>
                        <Option value="Module Mounting Structure">
                          Module Mounting Structure
                        </Option>
                        <Option value="Other">Other</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={8}>
                    <Form.Item
                      name="issueDescription"
                      label="Describe the Issue"
                    >
                      <Input.TextArea
                        rows={4}
                        placeholder="Problem details..."
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} md={8}>
                    {" "}
                    <Form.Item name="message" label="Additional Notes">
                      <Input.TextArea rows={3} />
                    </Form.Item>
                  </Col>
                </Row>
              </>
            )}

            {enquiryType === "Operation & Maintanence Service" && (
              <>
                <Row gutter={[16, 24]}>
                  <Col xs={24} sm={12} md={8}>
                    <Form.Item
                      name="capacity"
                      label="Installed Capacity"
                      rules={[
                        { required: true, message: "Please select Capacity" },
                      ]}
                    >
                      <Input placeholder="e.g. 5" suffix="kW" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} md={8}>
                    <Form.Item
                      name="roofType"
                      label="Roof Type"
                      rules={[
                        { required: true, message: "Please select Roof Type" },
                      ]}
                    >
                      <Select>
                        <Option value="rcc">RCC</Option>
                        <Option value="Sheet">Sheet </Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} md={8}>
                    <Form.Item name="siteVisit" label="Need Site Visit?">
                      <Select onChange={(v) => setSiteVisit(v)}>
                        <Option value="true">Yes</Option>
                        <Option value="false">No</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                {siteVisit === "true" && (
                  <Row gutter={16}>
                    <Col span={24}>
                      <Form.Item
                        name="siteVisitDateTime"
                        label="Preferred Site Visit Date & Time"
                      >
                        <Input type="datetime-local" />
                      </Form.Item>
                    </Col>
                  </Row>
                )}

                <Row gutter={16}>
                  <Col span={24}>
                    <Form.Item
                      name="googleLocation"
                      label="Current Location (Lat, Long)"
                      rules={[
                        {
                          required: true,
                          message: "Please allow location access",
                        },
                      ]}
                    >
                      <Input
                        placeholder="Click to get your current location"
                        readOnly
                        onClick={() => {
                          if (navigator.geolocation) {
                            navigator.geolocation.getCurrentPosition(
                              (position) => {
                                const lat = position.coords.latitude;
                                const lng = position.coords.longitude;

                                form.setFieldsValue({
                                  googleLocation: `${lat}, ${lng}`,
                                });
                              },
                              () => {
                                message.error("Location access denied");
                              },
                            );
                          } else {
                            message.error("Geolocation not supported");
                          }
                        }}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={24}>
                    <Form.Item name="message" label="Maintenance Requirements">
                      <Input.TextArea
                        rows={4}
                        placeholder="What kind of service do you need?..."
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </>
            )}

            <div style={{ marginTop: 40, textAlign: "center" }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
                style={{ minWidth: 200 }}
              >
                Submit Enquiry
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
}

export default PostEnquiryForm;
