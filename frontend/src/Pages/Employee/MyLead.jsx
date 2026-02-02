// import React, { useEffect, useState } from "react";
// import {
//   Table,
//   Tag,
//   Button,
//   Popconfirm,
//   message,
//   Modal,
//   Form,
//   Input,
//   Select,
// } from "antd";
// import Api from "../../Api";

// const { Option } = Select;

// function MyLead() {
//   const [leads, setLeads] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingLead, setEditingLead] = useState(null);
//   const [filteredLeads, setFilteredLeads] = useState([]);
//   const [searchText, setSearchText] = useState("");
//   const [form] = Form.useForm();

//   const fetchLeads = () => {
//     const token = localStorage.getItem("employeeToken");
//     Api.get("/employee/myleads", {
//       headers: { Authorization: `Bearer ${token}` },
//     }).then((res) => setLeads(res.data));
//   };

//   useEffect(() => {
//     fetchLeads();
//   }, []);

//   const downloadEnquiry = async (enquiryId) => {
//     try {
//       const res = await Api.get(`/enquiry/download/${enquiryId}`, {
//         responseType: "blob", // PDF binary
//       });

//       const blob = new Blob([res.data], { type: "application/pdf" });
//       const url = window.URL.createObjectURL(blob);

//       const link = document.createElement("a");
//       link.href = url;
//       link.download = "My_Enquiry.pdf";
//       link.click();

//       message.success("PDF downloaded successfully");
//     } catch (err) {
//       console.error(err);
//       message.error("Failed to download PDF");
//     }
//   };

//   // DELETE
//   const handleDelete = async (id) => {
//     try {
//       await Api.delete(`/enquiry/deleteoneenquiry/${id}`);
//       message.success("Lead deleted successfully");
//       fetchLeads();
//     } catch (err) {
//       message.error("Delete failed");
//     }
//   };

//   // EDIT OPEN MODAL
//   const handleEdit = (record) => {
//     setEditingLead(record);
//     form.setFieldsValue(record);
//     setIsModalOpen(true);
//   };

//   // UPDATE
//   const handleUpdate = async () => {
//     try {
//       const values = await form.validateFields();
//       await Api.put(`/enquiry/updateoneenquiry/${editingLead._id}`, values);
//       message.success("Lead updated successfully");
//       setIsModalOpen(false);
//       fetchLeads();
//     } catch (err) {
//       message.error("Update failed");
//     }
//   };

//   const columns = [
//     { title: "Customer ID", dataIndex: "customer" },
//     { title: "Lead ID", dataIndex: "leadId" },

//     { title: "Order ID", dataIndex: "_id" },

//     { title: "Customer Name", dataIndex: "fullName" },
//     { title: "Mobile", dataIndex: "mobile" },
//     { title: "Email", dataIndex: "email" },
//     { title: "System Type", dataIndex: "systemType" },
//     { title: "Enquiry Type", dataIndex: "enquiryType" },
//     { title: "Capacity", dataIndex: "capacity" },
//     { title: " EB ServiceNo", dataIndex: "ebServiceNo" },
//     { title: "Roof Type", dataIndex: "roofType" },
//     { title: "Total Amount", dataIndex: "amount" },
//     { title: "Roof Area", dataIndex: "roofArea" },

//     { title: "Site Visit", dataIndex: "siteVisit" },

//     { title: "Site Visit Date&Time", dataIndex: "siteVisitDateTime" },

//     { title: "Google Location", dataIndex: "googleLocation" },

//     { title: "Issue Description", dataIndex: "issueDescription" },
//     { title: "Product Type", dataIndex: "productType" },

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

//     { title: "Preferred Time", dataIndex: "preferredTime" },
//     { title: "Preferred Date&Time", dataIndex: "preferredDateTime" },

//     { title: "Message", dataIndex: "message" },
//     {
//       title: "Applied Date & Time",
//       dataIndex: "appliedDate",
//       render: (text) => new Date(text).toLocaleString(),
//     },
//     {
//       title: "Due Date & Time",
//       dataIndex: "dueDate",
//       render: (text) => new Date(text).toLocaleString(),
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
//           <Popconfirm
//             title="Are you sure you want to download your enquiry?"
//             okText="Yes"
//             cancelText="No"
//             onConfirm={() => downloadEnquiry(record._id)}
//           >
//             <Button type="primary">Download Lead Enquiry</Button>
//           </Popconfirm>
//           <Button type="link" onClick={() => handleEdit(record)}>
//             Edit
//           </Button>

//           <Popconfirm
//             title="Are you sure you want to delete this lead?"
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

//   const handleSearch = (value) => {
//     setSearchText(value);
//     const filtered = leads.filter((lead) =>
//       lead.fullName.toLowerCase().includes(value.toLowerCase()),
//     );
//     setFilteredLeads(filtered);
//   };

//   return (
//     <div style={{ padding: 20 }}>
//       <h2 className="front-title">My Assigned Leads</h2>

//       <div style={{ marginBottom: 16, display: "flex", alignItems: "center" }}>
//         <Input
//           placeholder="Search by Customer Name"
//           value={searchText}
//           onChange={(e) => handleSearch(e.target.value)}
//           style={{ width: 250, marginRight: 16 }}
//         />
//         <Button onClick={() => handleSearch(searchText)}>Search</Button>
//         <Button style={{ marginLeft: 8 }} onClick={() => handleSearch("")}>
//           Reset
//         </Button>
//       </div>
//       <Table
//         columns={columns}
//         dataSource={filteredLeads}
//         rowKey="_id"
//         pagination={{ pageSize: 5 }}
//         scroll={{ x: "max-content" }}
//       />

//       <Modal
//         title="Edit Lead"
//         open={isModalOpen}
//         onOk={handleUpdate}
//         onCancel={() => setIsModalOpen(false)}
//         okText="Update"
//       >
//         <Form layout="vertical" form={form}>
//           <Form.Item name="customer" label="Customer ID">
//             <Input disabled />
//           </Form.Item>

//           <Form.Item name="_id" label="Order ID">
//             <Input disabled />
//           </Form.Item>

//           <Form.Item name="appliedDate" label="Applied Date">
//             <Input disabled />
//           </Form.Item>

//           <Form.Item name="dueDate" label="Due Date">
//             <Input disabled />
//           </Form.Item>

//           <Form.Item name="fullName" label="Customer Name">
//             <Input />
//           </Form.Item>

//           <Form.Item name="mobile" label="Mobile">
//             <Input />
//           </Form.Item>

//           <Form.Item name="email" label="Email">
//             <Input />
//           </Form.Item>

//           <Form.Item name="capacity" label="Capacity (kW)">
//             <Input />
//           </Form.Item>

//           <Form.Item name="roofType" label="Roof Type">
//             <Select>
//               <Option value="RCC">RCC</Option>
//               <Option value="Sheet">Sheet</Option>
//             </Select>
//           </Form.Item>

//           <Form.Item name="roofArea" label="Roof Area">
//             <Input />
//           </Form.Item>

//           <Form.Item name="ebServiceNo" label="EB Service No">
//             <Input />
//           </Form.Item>

//           <Form.Item name="googleLocation" label="Google Location">
//             <Input />
//           </Form.Item>

//           <Form.Item name="issueDescription" label="Issue Description">
//             <Input.TextArea rows={3} />
//           </Form.Item>

//           <Form.Item name="preferredTime" label="Preferred Time">
//             <Input />
//           </Form.Item>

//           <Form.Item name="message" label="Message">
//             <Input.TextArea rows={2} />
//           </Form.Item>

//           <Form.Item name="enquiryType" label="Enquiry Type">
//             <Select>
//               <Option value="  New Solar Power Plant Installation">
//                 New Solar Power Plant Installation
//               </Option>
//               <Option value="  Solar Power Plant Service">
//                 Solar Power Plant Service
//               </Option>
//               <Option value="Operation & Maintanence Service">
//                 Operation & Maintanence Service
//               </Option>
//             </Select>
//           </Form.Item>

//           <Form.Item name="systemType" label="System Type">
//             <Select>
//               <Option value="On-Grid">On-Grid</Option>
//               <Option value="Off-Grid">Off-Grid</Option>
//               <Option value="Hybrid">Hybrid</Option>
//             </Select>
//           </Form.Item>

//           <Form.Item name="status" label="Status">
//             <Select>
//               <Option value="Assigned">Assigned</Option>
//               <Option value="In Progress">In Progress</Option>
//               {/* <Option value="Completed">Completed</Option> */}
//             </Select>
//           </Form.Item>
//         </Form>
//       </Modal>
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
  Spin,
} from "antd";
import Api from "../../Api";

const { Option } = Select;

function MyLead() {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);

  const [form] = Form.useForm();

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("employeeToken");
      const res = await Api.get("/employee/myleads", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeads(res.data);
      setFilteredLeads(res.data);
    } catch (err) {
      console.error(err);
      message.error("Failed to load leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Search across multiple fields
  const handleSearch = (value) => {
    setSearchText(value);
    if (!value.trim()) {
      setFilteredLeads(leads);
      return;
    }

    const lowerValue = value.toLowerCase();
    const filtered = leads.filter((lead) =>
      [
        lead.fullName,
        lead.mobile,
        lead.email,
        lead._id,
        lead.leadId,
        lead.ebServiceNo,
        lead.googleLocation,
      ]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(lowerValue)),
    );

    setFilteredLeads(filtered);
  };

  const downloadEnquiry = async (enquiryId) => {
    try {
      const res = await Api.get(`/enquiry/download/${enquiryId}`, {
        responseType: "blob",
      });

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Enquiry_${enquiryId}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);

      message.success("PDF downloaded");
    } catch (err) {
      console.error(err);
      message.error("Failed to download PDF");
    }
  };

  const handleDelete = async (id) => {
    try {
      await Api.delete(`/enquiry/deleteoneenquiry/${id}`);
      message.success("Lead deleted");
      fetchLeads();
    } catch (err) {
      console.error(err);
      message.error("Delete failed");
    }
  };

  const handleEdit = (record) => {
    setEditingLead(record);
    form.setFieldsValue({
      ...record,
      // make sure dates are strings if needed
      appliedDate: record.appliedDate
        ? new Date(record.appliedDate).toISOString().slice(0, 16)
        : "",
      dueDate: record.dueDate
        ? new Date(record.dueDate).toISOString().slice(0, 16)
        : "",
    });
    setIsModalOpen(true);
  };

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      await Api.put(`/enquiry/updateoneenquiry/${editingLead._id}`, values);
      message.success("Lead updated successfully");
      setIsModalOpen(false);
      fetchLeads();
    } catch (err) {
      console.error(err);
      message.error("Update failed");
    }
  };

  const columns = [
    { title: "Lead ID", dataIndex: "leadId" },
    { title: "Order ID", dataIndex: "_id" },
    { title: "Customer Name", dataIndex: "fullName" },
    { title: "Mobile", dataIndex: "mobile" },
    { title: "Email", dataIndex: "email" },
    { title: "System Type", dataIndex: "systemType" },
    { title: "Enquiry Type", dataIndex: "enquiryType" },
    { title: "Capacity (kW)", dataIndex: "capacity" },
    { title: "EB Service No", dataIndex: "ebServiceNo" },
    { title: "Roof Type", dataIndex: "roofType" },
    { title: "Roof Area", dataIndex: "roofArea" },
    { title: "Total Amount", dataIndex: "amount" },
    {
      title: "Status",
      dataIndex: "status",

      render: (status) => (
        <Tag
          color={
            status === "Completed"
              ? "green"
              : status === "In Progress"
                ? "blue"
                : "orange"
          }
        >
          {status || "Assigned"}
        </Tag>
      ),
    },
    {
      title: "Applied",
      dataIndex: "appliedDate",

      render: (text) => (text ? new Date(text).toLocaleString() : "-"),
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",

      render: (text) => (text ? new Date(text).toLocaleString() : "-"),
    },
    {
      title: "Image",
      dataIndex: "image",

      render: (url) =>
        url ? (
          <a href={url} target="_blank" rel="noopener noreferrer">
            View
          </a>
        ) : (
          "-"
        ),
    },
    {
      title: "Action",

      render: (_, record) => (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Button
            type="primary"
            size="small"
            onClick={() => downloadEnquiry(record._id)}
          >
            Download
          </Button>
          <Button type="link" size="small" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Delete this lead?"
            description="This action cannot be undone."
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button type="link" danger size="small">
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px", background: "#fff", minHeight: "100%" }}>
      <h2 style={{ marginBottom: 20 }}>My Assigned Leads</h2>

      <div
        style={{ marginBottom: 16, display: "flex", gap: 12, flexWrap: "wrap" }}
      >
        <Input
          placeholder="Search by name, mobile, email, ID..."
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 300 }}
          allowClear
        />
        <Button type="primary" onClick={() => handleSearch(searchText)}>
          Search
        </Button>
        <Button onClick={() => handleSearch("")}>Reset</Button>
      </div>

      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={filteredLeads}
          rowKey="_id"
          pagination={{ pageSize: 7, showSizeChanger: true }}
          scroll={{ x: "max-content", y: "65vh" }}
          bordered
        />
      </Spin>

      {/* Edit Modal */}
      <Modal
        title="Edit Lead"
        open={isModalOpen}
        onOk={handleUpdate}
        okText="Save Changes"
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        width={900}
      >
        <Form layout="vertical" form={form}>
          <Form.Item name="_id" label="Order ID" hidden>
            <Input disabled />
          </Form.Item>

          <Form.Item name="customer" label="Customer ID">
            <Input disabled />
          </Form.Item>

          <Form.Item
            name="fullName"
            label="Customer Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="mobile" label="Mobile" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="email" label="Email">
            <Input />
          </Form.Item>

          <Form.Item name="capacity" label="Capacity (kW)">
            <Input type="number" />
          </Form.Item>

          <Form.Item name="systemType" label="System Type">
            <Select>
              <Option value="On-Grid">On-Grid</Option>
              <Option value="Off-Grid">Off-Grid</Option>
              <Option value="Hybrid">Hybrid</Option>
            </Select>
          </Form.Item>

          <Form.Item name="enquiryType" label="Enquiry Type">
            <Select>
              <Option value="New Solar Power Plant Installation">
                New Installation
              </Option>
              <Option value="Solar Power Plant Service">Service</Option>
              <Option value="Operation & Maintenance Service">
                O&M Service
              </Option>
            </Select>
          </Form.Item>

          <Form.Item name="roofType" label="Roof Type">
            <Select>
              <Option value="RCC">RCC</Option>
              <Option value="Sheet">Sheet</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>

          <Form.Item name="roofArea" label="Roof Area (sq ft)">
            <Input type="number" />
          </Form.Item>

          <Form.Item name="ebServiceNo" label="EB Service Number">
            <Input />
          </Form.Item>

          <Form.Item name="googleLocation" label="Google Location Link">
            <Input />
          </Form.Item>

          <Form.Item
            name="issueDescription"
            label="Issue / Requirement Description"
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item name="preferredDateTime" label="Preferred Date & Time">
            <Input type="datetime-local" />
          </Form.Item>

          <Form.Item name="message" label="Additional Message">
            <Input.TextArea rows={2} />
          </Form.Item>

          <Form.Item name="status" label="Status">
            <Select>
              <Option value="Assigned">Assigned</Option>
              <Option value="In Progress">In Progress</Option>
              {/* <Option value="Completed">Completed</Option> */}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default MyLead;
