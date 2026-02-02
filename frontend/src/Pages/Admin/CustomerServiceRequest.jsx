import React, { useEffect, useState } from "react";
import { Table, Tag, Image, Spin, message } from "antd";
import Api from "../../Api.js";

function CustomerServiceRequest() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await Api.get("/complaint/get-service-request");

      if (res.data?.success) {
        setRequests(res.data.data || []);
      } else {
        message.warning(res.data?.message || "Unexpected response");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      const status = err.response?.status;
      if (status === 401 || status === 403) {
        message.error("Session expired. Please login again.");
      } else {
        message.error("Failed to load your service requests");
      }
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Lead ID",
      key: "leadId",
      render: (_, record) => record.customerId?.leadId || null,
    },
    {
      title: "Customer Name",
      key: "customerName",
      render: (_, record) => record.customerId?.name || null,
    },
    {
      title: "Complaint Type",
      dataIndex: "complaintType",
      key: "type",
      render: (type) =>
        type ? type.charAt(0).toUpperCase() + type.slice(1) : null,
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      width: 110,
      render: (priority) => {
        if (!priority) return null;
        let color = "blue";
        if (priority === "high") color = "red";
        if (priority === "low") color = "green";
        return <Tag color={color}>{priority.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      render: (text) => text || null,
    },
    {
      title: "Submitted On",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 160,
      render: (date) => (date ? new Date(date).toLocaleString("en-IN") : null),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
  ];

  return (
    <div style={{ padding: "16px" }}>
      <h2 className="front-title">My Service Requests</h2>
      <Spin spinning={loading} tip="Loading your requests...">
        <Table
          columns={columns}
          dataSource={requests}
          rowKey="_id"
          pagination={{ pageSize: 10, showSizeChanger: false }}
          locale={{ emptyText: "No service requests found" }}
          scroll={{ x: "max-content" }}
        />
      </Spin>
    </div>
  );
}

export default CustomerServiceRequest;
