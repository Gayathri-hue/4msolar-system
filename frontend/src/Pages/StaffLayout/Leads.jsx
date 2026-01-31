import React, { useEffect, useState } from "react";
import { Table, Tag, Spin, Select, Button, Space, Popconfirm } from "antd";
import Api from "../../Api";
import { useNavigate } from "react-router-dom";
import "../../styles/layouts/EnquiryForm.scss";

const { Option } = Select;

function Leads() {
  const [loading, setLoading] = useState(false);
  const [enquiries, setEnquiries] = useState([]);
  const [filteredEnquiries, setFilteredEnquiries] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const navigate = useNavigate();

  // const fetchMyEnquiries = async () => {
  //   try {
  //     setLoading(true);
  //     const userId = localStorage.getItem("UserID");
  //     const res = await Api.get(`/enquiry/getcustomerenquiries/${userId}`);
  //     setEnquiries(res.data);
  //     setFilteredEnquiries(res.data);
  //   } catch (err) {
  //     console.error("Error fetching my enquiries", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const fetchMyEnquiries = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem("UserID");
      const res = await Api.get(`/enquiry/getcustomerenquiries/${userId}`);

      const onlySolarPlan = res.data.filter(
        (enq) => enq.enquiryType === "New Solar Power Plant Installation",
      );

      setEnquiries(onlySolarPlan);
      setFilteredEnquiries(onlySolarPlan);
    } catch (err) {
      console.error("Error fetching my enquiries", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyEnquiries();
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

  // Filter enquiries whenever statusFilter changes
  useEffect(() => {
    if (statusFilter) {
      setFilteredEnquiries(
        enquiries.filter((enq) => enq.status === statusFilter),
      );
    } else {
      setFilteredEnquiries(enquiries);
    }
  }, [statusFilter, enquiries]);

  const columns = [
    { title: "Customer ID", dataIndex: "customer" },
    { title: "Order ID", dataIndex: "_id" },

    { title: "Name", dataIndex: "fullName" },
    { title: "Mobile", dataIndex: "mobile" },
    { title: "Email", dataIndex: "email" },
    { title: "Address", dataIndex: "address" },

    { title: "Enquiry Type", dataIndex: "enquiryType" },
    { title: "EB Service No", dataIndex: "ebServiceNo" },
    { title: "Category", dataIndex: "category" },

    { title: "System", dataIndex: "systemType" },
    { title: "Capacity", dataIndex: "capacity" },
    { title: "Roof Type", dataIndex: "roofType" },
    { title: "Roof Area", dataIndex: "roofArea" },

    {
      title: "Site Visit",
      dataIndex: "siteVisit",
      render: (value) => (value ? "Yes" : "No"),
    },

    {
      title: "Site Visit Date & Time",
      dataIndex: "siteVisitDateTime",
      render: (dateTime) =>
        dateTime
          ? new Date(dateTime).toLocaleString("en-IN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })
          : "Not Scheduled",
    },

    { title: "Google Location", dataIndex: "googleLocation" },
    { title: "Message", dataIndex: "message" },

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

    {
      title: "Status",
      dataIndex: "status",
      render: (status) => {
        let color = "blue";
        if (status === "Completed") color = "green";
        if (status === "In Progress") color = "orange";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Applied Date",
      dataIndex: "appliedDate",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Delivered date",
      dataIndex: "dueDate",
      render: (date) => new Date(date).toLocaleDateString(),
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
            <Button type="primary">Download your enquiry</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2 className="front-title">New Solar Power Plant Installation</h2>

      <div className="filter-create-wrapper">
        {/* Status Filter */}
        <Select
          placeholder="Filter by status"
          style={{ width: 200 }}
          value={statusFilter || undefined}
          onChange={(value) => setStatusFilter(value)}
          allowClear
        >
          <Option value="In Progress">In Progress</Option>
          <Option value="Completed">Completed</Option>
          <Option value="Assigned">Assigned</Option>
        </Select>

        {/* Create Enquiry Button */}
        <Button
          type="primary"
          onClick={() => navigate("/user/postform")}
          className="btn-create-enquiry"
        >
          Create Enquiry
        </Button>
      </div>

      {loading ? (
        <Spin />
      ) : (
        <Table
          columns={columns}
          dataSource={filteredEnquiries}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: "max-content" }}
        />
      )}
    </div>
  );
}

export default Leads;
