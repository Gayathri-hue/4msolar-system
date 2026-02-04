import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, Row, Col, message, Upload } from "antd";
import Api from "../../Api";
import { UploadOutlined } from "@ant-design/icons";

const { Option } = Select;

function CreateCustomerEnquiry() {
  const [form] = Form.useForm();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [enquiryType, setEnquiryType] = useState("");
  const [siteVisit, setSiteVisit] = useState("");

  // Fetch all customers for dropdown
  useEffect(() => {
    async function fetchCustomers() {
      try {
        const res = await Api.get("/all-users"); // Make sure backend returns only customers
        setCustomers(res.data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchCustomers();
  }, []);

  const handleFinish = async (values) => {
    setLoading(true);

    try {
      // Very important block – array problem solve pannum
      let customerId = values.customer;

      if (Array.isArray(customerId)) {
        if (customerId.length === 0) {
          message.error("Customer select pannu da!");
          return;
        }
        customerId = customerId[0]; // first one eduthuko
        console.warn("Array vandhuchu da – first value eduthen:", customerId);

        // UI-la fix pannidu (important!)
        form.setFieldsValue({ customer: customerId });
      }

      if (!customerId) {
        message.error("Customer select pannala!");
        return;
      }

      const formData = new FormData();

      // customer-a first-la append pannidu
      formData.append("customer", customerId);

      // Inside handleFinish, after creating formData

      // Normal fields (skip image & customer)
      Object.keys(values).forEach((key) => {
        if (key === "customer" || key === "image") return;

        const value = values[key];
        if (value !== undefined && value !== null && value !== "") {
          formData.append(key, value);
        }
      });

      // Handle image properly
      if (values.image && values.image.length > 0) {
        const file = values.image[0].originFileObj; // ← this is the real File
        if (file) {
          formData.append("image", file);
          console.log("Appending file →", file.name, file.size); // debug
        }
      } else {
        console.log("No image selected");
      }

      await Api.post("/enquiry/createenquiry", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      message.success("Enquiry create successfully");
      form.resetFields();
      form.setFieldsValue({ customer: undefined }); // extra safety
    } catch (err) {
      console.error(err);
      message.error("Enquiry error");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <h2 className="front-title">Admin: Create Enquiry for Customer</h2>
      <Form
        layout="vertical"
        onFinish={handleFinish}
        form={form}
        initialValues={{ customer: "", enquiryType: "" }}
      >
        <Form.Item
          label="Customer"
          name="customer"
          rules={[{ required: true, message: "Customer select pannu da" }]}
        >
          <Select
            placeholder="Select Customer"
            allowClear
            showSearch
            optionFilterProp="children"
            // mode podadha da – single select dhan venum
          >
            {customers.map((cust) => (
              <Option key={cust._id} value={cust._id}>
                {cust.fullName} ({cust.email})
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Row gutter={[16, 24]}>
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              name="fullName"
              label="Full Name"
              rules={[{ required: true, message: "Please enter your name" }]}
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
              rules={[{ required: true, message: "Please select Category" }]}
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
              rules={[{ required: true, message: "Please select System Type" }]}
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
                <Col xs={24} sm={12} md={8}>
                  <Form.Item
                    name="image"
                    label="Site / Problem Photo"
                    valuePropName="fileList"
                    getValueFromEvent={(e) =>
                      Array.isArray(e) ? e : e?.fileList || []
                    }
                    rules={[{ required: true, message: "Please upload photo" }]}
                  >
                    <Upload
                      beforeUpload={() => false}
                      maxCount={1}
                      accept="image/*"
                      listType="picture"
                    >
                      <Button icon={<UploadOutlined />}>Choose Image</Button>
                    </Upload>
                  </Form.Item>
                </Col>
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
                  <Input.TextArea rows={4} placeholder="Any other details..." />
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
                <Form.Item
                  name="image"
                  label="Upload Image"
                  valuePropName="fileList"
                  getValueFromEvent={(e) =>
                    Array.isArray(e) ? e : e?.fileList || []
                  }
                  rules={[{ required: true, message: "Image upload pannu da" }]} // optional
                >
                  <Upload
                    beforeUpload={() => false} // ← stops auto-upload / prevents axios/fetch confusion
                    maxCount={1}
                    accept="image/*"
                    listType="picture" // shows thumbnail preview – nice UX
                  >
                    <Button icon={<UploadOutlined />}>Choose Image</Button>
                  </Upload>
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={8}>
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
                <Form.Item name="issueDescription" label="Describe the Issue">
                  <Input.TextArea rows={4} placeholder="Problem details..." />
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
  );
}

export default CreateCustomerEnquiry;
