import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  Upload,
  message,
  Tabs,
  Spin,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { TabPane } = Tabs;
const { Option } = Select;

function Profile() {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const [editForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const data = await getUserProfile(); // your API call
        setProfile(data);
        setImageUrl(data.profileImage || null);

        // Prefill edit form
        editForm.setFieldsValue({
          name: data.name,
          dob: dayjs(data.dob),
          phone: data.phone,
          email: data.email,
          role: data.role,
          branch: data.branch,
        });
      } catch (err) {
        message.error("Failed to fetch profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [editForm]);

  const handleEditSubmit = async (values) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        dob: values.dob.format("YYYY-MM-DD"),
        profileImage: imageUrl,
      };
      await updateUserProfile(payload);
      message.success("Profile updated successfully!");
      setProfile({ ...profile, ...payload });
    } catch (err) {
      message.error("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (values) => {
    setLoading(true);
    try {
      await changeUserPassword(values);
      message.success("Password changed successfully!");
      passwordForm.resetFields();
    } catch (err) {
      message.error("Failed to change password.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = ({ file }) => {
    const reader = new FileReader();
    reader.onload = () => setImageUrl(reader.result);
    reader.readAsDataURL(file);
    return false; // prevent auto upload
  };

  if (!profile)
    return (
      <Spin size="large" style={{ display: "block", margin: "50px auto" }} />
    );

  return (
    <div style={{ padding: "20px", maxWidth: 900, margin: "0 auto" }}>
      {/* Profile Card */}
      <Card
        style={{
          borderRadius: "12px",
          marginBottom: 20,
          textAlign: "center",
          boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
        }}
      >
        <img
          src={imageUrl || "/default-avatar.png"}
          alt="Profile"
          style={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            objectFit: "cover",
            marginBottom: 10,
          }}
        />
        <h2 style={{ margin: 0 }}>{profile.name}</h2>
        <p style={{ color: "#888" }}>{profile.role}</p>
      </Card>

      {/* Tabs */}
      <Card
        style={{
          borderRadius: "12px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
        }}
      >
        <Tabs defaultActiveKey="1" type="line">
          {/* Details Tab */}
          <TabPane tab="Details" key="1">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <strong>Name:</strong> {profile.name}
              </Col>
              <Col span={12}>
                <strong>Date of Birth:</strong>{" "}
                {dayjs(profile.dob).format("DD-MM-YYYY")}
              </Col>
              <Col span={12}>
                <strong>Email:</strong> {profile.email}
              </Col>
              <Col span={12}>
                <strong>Phone:</strong> {profile.phone}
              </Col>
              <Col span={12}>
                <strong>Role:</strong> {profile.role}
              </Col>
              <Col span={12}>
                <strong>Branch:</strong> {profile.branch}
              </Col>
            </Row>
          </TabPane>

          {/* Edit Profile Tab */}
          <TabPane tab="Edit Profile" key="2">
            <Form layout="vertical" form={editForm} onFinish={handleEditSubmit}>
              <Form.Item label="Profile Image">
                <Upload
                  beforeUpload={handleUpload}
                  showUploadList={false}
                  accept="image/*"
                >
                  <Button icon={<UploadOutlined />}>Upload Image</Button>
                </Upload>
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt="profile"
                    style={{
                      marginTop: 10,
                      width: 100,
                      height: 100,
                      borderRadius: "50%",
                    }}
                  />
                )}
              </Form.Item>

              <Form.Item
                label="Full Name"
                name="name"
                rules={[{ required: true, message: "Enter name" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Date of Birth"
                name="dob"
                rules={[{ required: true, message: "Select DOB" }]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item
                label="Phone"
                name="phone"
                rules={[{ required: true }, { len: 10, message: "10 digits" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true }, { type: "email" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item label="Role" name="role" rules={[{ required: true }]}>
                <Select>
                  <Option value="admin">Admin</Option>
                  <Option value="staff">Staff</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Branch"
                name="branch"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>

              <Button type="primary" htmlType="submit" block>
                Update Profile
              </Button>
            </Form>
          </TabPane>

          {/* Change Password Tab */}
          <TabPane tab="Change Password" key="3">
            <Form
              layout="vertical"
              form={passwordForm}
              onFinish={handlePasswordSubmit}
            >
              <Form.Item
                label="Current Password"
                name="currentPassword"
                rules={[{ required: true, message: "Enter current password" }]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                label="New Password"
                name="newPassword"
                rules={[{ required: true, message: "Enter new password" }]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                label="Confirm New Password"
                name="confirmPassword"
                dependencies={["newPassword"]}
                rules={[
                  { required: true, message: "Confirm password" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("newPassword") === value)
                        return Promise.resolve();
                      return Promise.reject("Passwords do not match");
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Button type="primary" htmlType="submit" block>
                Change Password
              </Button>
            </Form>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
}

export default Profile;
