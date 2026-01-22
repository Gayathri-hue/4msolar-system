import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Card,
  Drawer,
  Form,
  Input,
  DatePicker,
  Space,
  Popconfirm,
  message,
  Modal,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Api from "../../Api";
import dayjs from "dayjs";

function Employee() {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [search, setSearch] = useState("");
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  const fetchEmployees = async () => {
    const res = await Api.get("/admin/getemployee");
    setData(res.data);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // CREATE
  const handleCreate = async (values) => {
    try {
      const payload = { ...values, dob: values.dob.format("YYYY-MM-DD") };
      await Api.post("/admin/createemployee", payload);
      message.success("Employee Created");
      setOpen(false);
      form.resetFields();
      fetchEmployees();
    } catch (err) {
      message.error(err.response?.data?.message || "Error");
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    await Api.delete(`/admin/employee/${id}`);
    message.success("Employee Deleted");
    fetchEmployees();
  };

  // OPEN EDIT MODAL
  const openEditModal = (record) => {
    setEditingEmployee(record);
    editForm.setFieldsValue({
      ...record,
      dob: record.dob ? dayjs(record.dob) : null,
    });
    setEditOpen(true);
  };

  // UPDATE
  const handleUpdate = async (values) => {
    try {
      const payload = {
        ...values,
        dob: values.dob ? values.dob.format("YYYY-MM-DD") : null,
      };

      await Api.put(`/admin/employee/${editingEmployee._id}`, payload);
      message.success("Employee Updated");
      setEditOpen(false);
      fetchEmployees();
    } catch (err) {
      message.error("Update failed");
    }
  };

  const filteredData = data.filter((emp) =>
    emp.name.toLowerCase().includes(search.toLowerCase()),
  );

  const columns = [
    { title: "Name", dataIndex: "name" },
    { title: "Emp ID", dataIndex: "employeeId" },
    { title: "Email", dataIndex: "email" },
    { title: "Phone", dataIndex: "phone" },
    { title: "Branch", dataIndex: "branch" },
    { title: "Location", dataIndex: "location" },
    {
      title: "Action",
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => openEditModal(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Delete employee?"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="Employee List"
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setOpen(true)}
        >
          Create Employee
        </Button>
      }
    >
      <Input.Search
        placeholder="Search by name"
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: 16, maxWidth: 300 }}
      />

      <Table
        columns={columns}
        scroll={{ x: "max-content" }}
        dataSource={filteredData}
        rowKey="_id"
      />

      {/* CREATE DRAWER */}
      <Drawer
        title="Create Employee"
        width={window.innerWidth < 768 ? "100%" : 480}
        open={open}
        onClose={() => setOpen(false)}
      >
        <Form layout="vertical" form={form} onFinish={handleCreate}>
          <Form.Item name="name" label="Name" required>
            <Input />
          </Form.Item>
          <Form.Item name="employeeId" label="Employee ID" required>
            <Input />
          </Form.Item>
          <Form.Item name="dob" label="DOB">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="branch" label="Branch">
            <Input />
          </Form.Item>
          <Form.Item name="location" label="Location">
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" required>
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Phone" required>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Password" required>
            <Input.Password />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            Save
          </Button>
        </Form>
      </Drawer>

      {/* EDIT MODAL */}
      <Modal
        title="Edit Employee"
        open={editOpen}
        onCancel={() => setEditOpen(false)}
        footer={null}
      >
        <Form layout="vertical" form={editForm} onFinish={handleUpdate}>
          <Form.Item name="name" label="Name">
            <Input />
          </Form.Item>
          <Form.Item name="employeeId" label="Employee ID">
            <Input />
          </Form.Item>
          <Form.Item name="dob" label="DOB">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="branch" label="Branch">
            <Input />
          </Form.Item>
          <Form.Item name="location" label="Location">
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Phone">
            <Input />
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            Update
          </Button>
        </Form>
      </Modal>
    </Card>
  );
}

export default Employee;
