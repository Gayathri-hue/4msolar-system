// import React, { useEffect, useState } from "react";
// import { Table, Tag, Button, Popconfirm, message } from "antd";
// import Api from "../../Api";

// function MyLead() {
//   const [leads, setLeads] = useState([]);

//   const fetchLeads = () => {
//     const token = localStorage.getItem("employeeToken");
//     Api.get("/employee/myleads", {
//       headers: { Authorization: `Bearer ${token}` },
//     }).then((res) => setLeads(res.data));
//   };

//   useEffect(() => {
//     fetchLeads();
//   }, []);

//   const handleDelete = async (id) => {
//     try {
//       await Api.delete(`/enquiry/deleteoneenquiry/${id}`);
//       message.success("Lead deleted successfully");
//       fetchLeads();
//     } catch (err) {
//       message.error("Delete failed");
//     }
//   };

//   const handleEdit = (record) => {
//     // Navigate to edit page with ID
//     // example: /admin/edit-lead/123
//     window.location.href = `/enquiry/updateoneenquiry/${record._id}`;
//   };

//   const columns = [
//     {
//       title: "Enquiry ID",
//       dataIndex: "_id",
//     },
//     {
//       title: "Customer ID",
//       dataIndex: "customer",
//     },
//     {
//       title: "Customer Name",
//       dataIndex: "fullName",
//     },
//     {
//       title: "Mobile",
//       dataIndex: "mobile",
//     },
//     {
//       title: "Email",
//       dataIndex: "email",
//     },
//     {
//       title: "Address",
//       dataIndex: "address",
//     },
//     {
//       title: "Mobile",
//       dataIndex: "mobile",
//     },
//     {
//       title: "System Type",
//       dataIndex: "systemType",
//     },
//     {
//       title: "Enquiry Type",
//       dataIndex: "enquiryType",
//     },
//     {
//       title: "Cpacity",
//       dataIndex: "capacity",
//     },
//     {
//       title: "Monthly EBBILL",
//       dataIndex: "monthlyEBBill",
//     },
//     {
//       title: "Roof Type",
//       dataIndex: "roofType",
//     },
//     {
//       title: "Roof Area",
//       dataIndex: "roofArea",
//     },
//     {
//       title: "Description",
//       dataIndex: "issueDescription",
//     },

//     {
//       title: "Image",
//       dataIndex: "image",
//       render: (url) =>
//         url ? (
//           <a href={url} target="_blank" rel="noopener noreferrer">
//             View
//           </a>
//         ) : (
//           "No Image"
//         ),
//     },

//     {
//       title: "Prefereed Time",
//       dataIndex: "preferredTime",
//     },
//     {
//       title: "Message",
//       dataIndex: "message",
//     },
//     {
//       title: "Assigned Date",
//       dataIndex: "createdAt",
//       render: (date) => new Date(date).toLocaleDateString(),
//     },
//     {
//       title: "Due Date",
//       dataIndex: "dueDate",
//       render: (date) => new Date(date).toLocaleDateString(),
//     },
//     {
//       title: "Status",
//       dataIndex: "status",
//       render: (status) => {
//         let color = status === "Completed" ? "green" : "orange";
//         return <Tag color={color}>{status}</Tag>;
//       },
//     },
//     {
//       title: "Action",
//       render: (_, record) => (
//         <>
//           <Button
//             type="link"
//             onClick={() => handleEdit(record)}
//             style={{ color: "#1677ff" }}
//           >
//             Edit
//           </Button>

//           <Popconfirm
//             title="Are you sure delete this lead?"
//             onConfirm={() => handleDelete(record._id)}
//             okText="Yes"
//             cancelText="No"
//           >
//             <Button type="link" danger>
//               Delete
//             </Button>
//           </Popconfirm>
//         </>
//       ),
//     },
//   ];

//   return (
//     <div style={{ padding: 20 }}>
//       <h2>My Assigned Leads</h2>
//       <Table
//         columns={columns}
//         dataSource={leads}
//         rowKey="_id"
//         pagination={{ pageSize: 5 }}
//         scroll={{ x: "max-content" }}
//       />
//     </div>
//   );
// }

// export default MyLead;

import React, { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Button,
  Popconfirm,
  message,
  Modal,
  Form,
  Input,
  Select,
} from "antd";
import Api from "../../Api";

const { Option } = Select;

function MyLead() {
  const [leads, setLeads] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [form] = Form.useForm();

  const fetchLeads = () => {
    const token = localStorage.getItem("employeeToken");
    Api.get("/employee/myleads", {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => setLeads(res.data));
  };

  useEffect(() => {
    fetchLeads();
  }, []);

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

  // DELETE
  const handleDelete = async (id) => {
    try {
      await Api.delete(`/enquiry/deleteoneenquiry/${id}`);
      message.success("Lead deleted successfully");
      fetchLeads();
    } catch (err) {
      message.error("Delete failed");
    }
  };

  // EDIT OPEN MODAL
  const handleEdit = (record) => {
    setEditingLead(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  // UPDATE
  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      await Api.put(`/enquiry/updateoneenquiry/${editingLead._id}`, values);
      message.success("Lead updated successfully");
      setIsModalOpen(false);
      fetchLeads();
    } catch (err) {
      message.error("Update failed");
    }
  };

  const columns = [
    { title: "Customer ID", dataIndex: "customer" },
    { title: "Order ID", dataIndex: "_id" },

    { title: "Customer Name", dataIndex: "fullName" },
    { title: "Mobile", dataIndex: "mobile" },
    { title: "Email", dataIndex: "email" },
    { title: "System Type", dataIndex: "systemType" },
    { title: "Enquiry Type", dataIndex: "enquiryType" },
    { title: "Capacity", dataIndex: "capacity" },
    { title: " EB ServiceNo", dataIndex: "ebServiceNo" },
    { title: "Roof Type", dataIndex: "roofType" },
    { title: "Roof Area", dataIndex: "roofArea" },
    { title: "Site Visit", dataIndex: "siteVisit" },

    { title: "Site Visit Date&Time", dataIndex: "siteVisitDateTime" },

    { title: "Google Location", dataIndex: "googleLocation" },

    { title: "Issue Description", dataIndex: "issueDescription" },
    { title: "Product Type", dataIndex: "productType" },

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
      title: "Applied Date & Time",
      dataIndex: "appliedDate",
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: "Due Date & Time",
      dataIndex: "dueDate",
      render: (text) => new Date(text).toLocaleString(),
    },

    {
      title: "Status",
      dataIndex: "status",
      render: (status) => {
        let color = status === "Completed" ? "green" : "orange";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Action",
      render: (_, record) => (
        <>
          <Popconfirm
            title="Are you sure you want to download your enquiry?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => downloadEnquiry(record._id)}
          >
            <Button type="primary">Download Lead Enquiry</Button>
          </Popconfirm>
          <Button type="link" onClick={() => handleEdit(record)}>
            Edit
          </Button>

          <Popconfirm
            title="Are you sure you want to delete this lead?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2 className="front-title">My Assigned Leads</h2>

      <Table
        columns={columns}
        dataSource={leads}
        rowKey="_id"
        pagination={{ pageSize: 5 }}
        scroll={{ x: "max-content" }}
      />

      <Modal
        title="Edit Lead"
        open={isModalOpen}
        onOk={handleUpdate}
        onCancel={() => setIsModalOpen(false)}
        okText="Update"
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
              <Option value="  New Solar Power Plant Installation">
                New Solar Power Plant Installation
              </Option>
              <Option value="  Solar Power Plant Service">
                Solar Power Plant Service
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

export default MyLead;
