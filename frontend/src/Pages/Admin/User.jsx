import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Input,
  Space,
  Modal,
  Form,
  DatePicker,
  Select,
} from "antd";
import Api from "../../Api";
import dayjs from "dayjs";
import { Popconfirm } from "antd";

const { Option } = Select;

function User() {
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [editUser, setEditUser] = useState(null);
  const [showOther, setShowOther] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await Api.get("/all-users");
    setUsers(res.data);
  };

  const handleDelete = async (id) => {
    await Api.delete(`/delete-user/${id}`);
    fetchUsers();
  };

  const handleEdit = (record) => {
    setEditUser(record);
    setShowOther(record.referrer === "Other");

    form.setFieldsValue({
      ...record,
      dob: dayjs(record.dob),
    });
  };

  const handleUpdate = async () => {
    const values = await form.validateFields();

    const payload = {
      ...values,
      dob: values.dob.format("YYYY-MM-DD"),
      referrerDetails:
        values.referrer === "Other" ? values.referrerDetails : "",
    };

    await Api.put(`/update-user/${editUser._id}`, payload);
    setEditUser(null);
    fetchUsers();
  };

  const filteredData = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchText.toLowerCase()) ||
      u.phone.includes(searchText),
  );

  const columns = [
    { title: "Name", dataIndex: "name" },
    { title: "Email", dataIndex: "email" },
    {
      title: "DOB",
      dataIndex: "dob",
      render: (dob) => dayjs(dob).format("YYYY-MM-DD"),
    },
    { title: "Phone", dataIndex: "phone" },
    {
      title: "Referrer",
      dataIndex: "referrer",
      render: (_, record) => {
        if (record.referrer === "Other") {
          return (
            <span>
              <b>Other</b>
              {record.referrerDetails ? ` (${record.referrerDetails})` : ""}
            </span>
          );
        }
        return record.referrer;
      },
    },

    {
      title: "Action",
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => handleEdit(record)}>
            Edit
          </Button>

          <Popconfirm
            title="Delete User"
            description="Are you sure you want to delete this user?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "100%",
        overflowX: "auto", // 👈 tablet la scroll allow
        padding: "10px",
      }}
    >
      <h2
        style={{
          marginBottom: "20px",
          display: "flex",
          justifyContent: "center",
          fontSize: "22px",
          fontWeight: "bold",
        }}
      >
        Customer List
      </h2>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: 15,
        }}
      >
        <Input
          placeholder="Search by Name or Phone"
          style={{ width: 300, marginLeft: "auto" }}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="_id"
        pagination={{ pageSize: 5 }}
        scroll={{ x: "max-content" }}
      />

      <Modal
        title="Edit User"
        open={!!editUser}
        onOk={handleUpdate}
        onCancel={() => setEditUser(null)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name">
            <Input />
          </Form.Item>

          <Form.Item name="email" label="Email">
            <Input />
          </Form.Item>

          <Form.Item name="dob" label="DOB">
            <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item name="phone" label="Phone">
            <Input />
          </Form.Item>

          <Form.Item name="referrer" label="Referrer">
            <Select onChange={(val) => setShowOther(val === "Other")}>
              <Option value="Instagram">Instagram</Option>
              <Option value="Facebook">Facebook</Option>
              <Option value="Twitter">Twitter</Option>
              <Option value="Youtube">Youtube</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>

          {showOther && (
            <Form.Item
              name="referrerDetails"
              label="Other Referrer (Name / Phone)"
            >
              <Input placeholder="Enter person name or phone number" />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
}

export default User;
