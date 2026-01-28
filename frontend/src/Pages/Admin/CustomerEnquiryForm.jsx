import React, { useEffect, useState } from "react";
import {
  Table,
  Input,
  Button,
  Space,
  Popconfirm,
  Modal,
  Form,
  Select,
  DatePicker,
  message,
  Image,
} from "antd";
import Api from "../../Api";
import dayjs from "dayjs";

const { Option } = Select;

function CustomerEnquiry() {
  const [enquiries, setEnquiries] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [editEnquiry, setEditEnquiry] = useState(null);
  const [form] = Form.useForm();

  // Fetch all enquiries
  const fetchEnquiries = async () => {
    try {
      const res = await Api.get("/enquiry/getallenquiry");
      setEnquiries(res.data);
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch enquiries");
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  // Delete enquiry
  const handleDelete = async (id) => {
    try {
      await Api.delete(`/enquiry/deleteoneenquiry/${id}`);
      message.success("Enquiry deleted");
      fetchEnquiries();
    } catch (err) {
      message.error("Delete failed");
    }
  };

  const downloadEnquiry = async (enquiryId) => {
    try {
      const res = await Api.get(`/enquiry/download/${enquiryId}`, {
        responseType: "blob", // PDF binary
      });

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "My_Enquiry.pdf";
      link.click();

      message.success("PDF downloaded successfully");
    } catch (err) {
      console.error(err);
      message.error("Failed to download PDF");
    }
  };

  // Open edit modal
  const handleEdit = (record) => {
    setEditEnquiry(record);
    form.setFieldsValue({
      ...record,
      appliedDate: dayjs(record.appliedDate),
    });
  };

  // Update enquiry
  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        appliedDate: values.appliedDate.format("YYYY-MM-DD"),
      };
      await Api.put(`/enquiry/updateoneenquiry/${editEnquiry._id}`, payload);
      message.success("Enquiry updated");
      setEditEnquiry(null);
      fetchEnquiries();
    } catch (err) {
      message.error("Update failed");
    }
  };
  const filteredData = enquiries.filter((e) => {
    const search = searchText.toLowerCase();
    return (
      e.fullName.toLowerCase().includes(search) || // filter by name
      (e._id ?? "").toLowerCase().includes(search) || // filter by Enquiry ID
      (e.customer ?? "").toLowerCase().includes(search) // filter by Customer ID
    );
  });

  const statusColors = {
    Assigned: "orange",
    "In Progress": "blue",
    Completed: "green",
  };

  const columns = [
    { title: "ID", dataIndex: "_id" },

    { title: "Customer ID", dataIndex: "customer" },
    { title: "Full Name", dataIndex: "fullName" },
    { title: "Mobile", dataIndex: "mobile" },
    { title: "Email", dataIndex: "email" },
    { title: "Address", dataIndex: "address" },
    { title: "Enquiry Type", dataIndex: "enquiryType" },
    { title: "System Type", dataIndex: "systemType" },
    { title: "Capacity", dataIndex: "capacity" },
    { title: " EB ServiceNo", dataIndex: "ebServiceNo" },
    { title: "Roof Type", dataIndex: "roofType" },
    { title: "Roof Area", dataIndex: "roofArea" },
    { title: "Site Visit", dataIndex: "siteVisit" },
    { title: "Site Visit Date&Time", dataIndex: "siteVisitDateTime" },
    { title: "Product Type", dataIndex: "productType" },

    { title: "Google Location", dataIndex: "googleLocation" },

    { title: "Issue Description", dataIndex: "issueDescription" },
    {
      title: "Image",
      dataIndex: "image",
      render: (url) =>
        url ? (
          <a href={url} target="_blank" rel="noopener noreferrer">
            View
          </a>
        ) : (
          "No Image"
        ),
    },

    { title: "Preferred Time", dataIndex: "preferredTime" },
    { title: "Preferred Date&Time", dataIndex: "preferredDateTime" },

    { title: "Message", dataIndex: "message" },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => (
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: statusColors[status] || "gray",
              display: "inline-block",
            }}
          />
          {status}
        </span>
      ),
    },
    {
      title: "Applied Date",
      dataIndex: "appliedDate",
      render: (date) => dayjs(date).format("YYYY-MM-DD"),
    },
    {
      title: "Action",
      render: (_, record) => (
        <Space>
          <Popconfirm
            title="Are you sure you want to download your enquiry?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => downloadEnquiry(record._id)}
          >
            <Button type="primary">Download Customer enquiry</Button>
          </Popconfirm>
          <Button type="primary" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Delete Enquiry?"
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
    <div style={{ width: "100%", overflowX: "auto", padding: "16px" }}>
      <h2
        style={{
          marginBottom: "20px",
          display: "flex",
          justifyContent: "center",
          fontSize: "22px",
          fontWeight: "bold",
        }}
      >
        Customer Enquiries List
      </h2>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: 15,
        }}
      >
        <Input
          placeholder="Search by Name or Customer ID"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300, marginLeft: "auto" }}
        />
      </div>

      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="_id"
        scroll={{ x: "max-content" }}
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title="Edit Enquiry"
        open={!!editEnquiry}
        onOk={handleUpdate}
        onCancel={() => setEditEnquiry(null)}
        width={800}
      >
        <Form layout="vertical" form={form}>
          <Form.Item name="customer" label="Customer ID">
            <Input disabled />
          </Form.Item>

          <Form.Item name="_id" label="Order ID">
            <Input disabled />
          </Form.Item>

          <Form.Item name="appliedDate" label="Applied Date">
            <Input disabled />
          </Form.Item>

          <Form.Item name="dueDate" label="Due Date">
            <Input disabled />
          </Form.Item>

          <Form.Item name="fullName" label="Customer Name">
            <Input />
          </Form.Item>

          <Form.Item name="mobile" label="Mobile">
            <Input />
          </Form.Item>

          <Form.Item name="email" label="Email">
            <Input />
          </Form.Item>

          <Form.Item name="capacity" label="Capacity (kW)">
            <Input />
          </Form.Item>

          <Form.Item name="roofType" label="Roof Type">
            <Select>
              <Option value="RCC">RCC</Option>
              <Option value="Sheet">Sheet</Option>
            </Select>
          </Form.Item>

          <Form.Item name="roofArea" label="Roof Area">
            <Input />
          </Form.Item>

          <Form.Item name="ebServiceNo" label="EB Service No">
            <Input />
          </Form.Item>

          <Form.Item name="googleLocation" label="Google Location">
            <Input />
          </Form.Item>

          <Form.Item name="issueDescription" label="Issue Description">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item name="preferredTime" label="Preferred Time">
            <Input />
          </Form.Item>

          <Form.Item name="message" label="Message">
            <Input.TextArea rows={2} />
          </Form.Item>

          <Form.Item name="enquiryType" label="Enquiry Type">
            <Select>
              <Option value="  New Solar Power Plan Installation">
                New Solar Power Plan Installation
              </Option>
              <Option value="  Solar Power Plan Service">
                Solar Power Plan Service
              </Option>
              <Option value="Operation & Maintanence Service">
                Operation & Maintanence Service
              </Option>
            </Select>
          </Form.Item>

          <Form.Item name="systemType" label="System Type">
            <Select>
              <Option value="On-Grid">On-Grid</Option>
              <Option value="Off-Grid">Off-Grid</Option>
              <Option value="Hybrid">Hybrid</Option>
            </Select>
          </Form.Item>

          <Form.Item name="status" label="Status">
            <Select>
              <Option value="Assigned">Assigned</Option>
              <Option value="In Progress">In Progress</Option>
              <Option value="Completed">Completed</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default CustomerEnquiry;
