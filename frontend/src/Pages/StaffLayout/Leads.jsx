import React, { useState } from "react";
import { Table, Tag, Button, Input, Select, Modal } from "antd";

const { Option } = Select;

function Leads() {
  const [searchText, setSearchText] = useState(""); // service search
  const [statusFilter, setStatusFilter] = useState(""); // status filter
  const [selectedLead, setSelectedLead] = useState(null); // clicked lead
  const [isModalVisible, setIsModalVisible] = useState(false); // modal visibility

  const data = [
    {
      key: 1,
      id: "ENQ001",
      service: "Solar Panel Installation",
      staff: "Arun",
      status: "In Progress",
      date: "20-01-2026",
      details: "Customer wants 4kW solar system on rooftop.",
    },
    {
      key: 2,
      id: "ENQ002",
      service: "Battery Storage",
      staff: "Priya",
      status: "New",
      date: "18-01-2026",
      details: "Looking for backup battery for home solar system.",
    },
    {
      key: 3,
      id: "ENQ003",
      service: "Maintenance",
      staff: "Karthik",
      status: "Closed",
      date: "15-01-2026",
      details: "Quarterly maintenance completed for 5kW system.",
    },
  ];

  // Filtered data based on search and status
  const filteredData = data.filter(
    (item) =>
      item.service.toLowerCase().includes(searchText.toLowerCase()) &&
      (statusFilter ? item.status === statusFilter : true),
  );

  // Open modal on View click
  const handleView = (record) => {
    setSelectedLead(record);
    setIsModalVisible(true);
  };

  // Table columns
  const columns = [
    { title: "Enquiry ID", dataIndex: "id", key: "id" },
    { title: "Service", dataIndex: "service", key: "service" },
    { title: "Assigned Staff", dataIndex: "staff", key: "staff" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const color =
          status === "New"
            ? "gold"
            : status === "In Progress"
              ? "blue"
              : "green";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    { title: "Last Updated", dataIndex: "date", key: "date" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button type="link" onClick={() => handleView(record)}>
          View
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2>My Enquiries / Leads</h2>

      {/* Filters */}
      <div style={{ marginBottom: 16, display: "flex", gap: 10 }}>
        <Input
          placeholder="Search Service"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 200 }}
        />
        <Select
          placeholder="Filter Status"
          value={statusFilter}
          onChange={(value) => setStatusFilter(value)}
          allowClear
          style={{ width: 150 }}
        >
          <Option value="New">New</Option>
          <Option value="In Progress">In Progress</Option>
          <Option value="Closed">Closed</Option>
        </Select>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={filteredData}
        pagination={{ pageSize: 5 }}
      />

      {/* Modal for viewing details */}
      <Modal
        title={`Lead Details - ${selectedLead?.id || ""}`}
        open={isModalVisible} // AntD v5 uses "open" instead of "visible"
        onCancel={() => setIsModalVisible(false)}
        footer={<Button onClick={() => setIsModalVisible(false)}>Close</Button>}
      >
        {selectedLead && (
          <div>
            <p>
              <b>Service:</b> {selectedLead.service}
            </p>
            <p>
              <b>Assigned Staff:</b> {selectedLead.staff}
            </p>
            <p>
              <b>Status:</b> {selectedLead.status}
            </p>
            <p>
              <b>Last Updated:</b> {selectedLead.date}
            </p>
            <p>
              <b>Details:</b> {selectedLead.details}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Leads;
