import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Tag,
  Select,
  Spin,
  Button,
  Empty,
  Card,
  Tooltip,
} from "antd";
import {
  FilePdfOutlined,
  FileTextOutlined,
  SafetyCertificateOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import Api from "../../Api";
import "../../styles/layouts/TrackStatus.scss";

const { Option } = Select;

function TrackStatus() {
  const [loading, setLoading] = useState(false);
  const [enquiries, setEnquiries] = useState([]);
  const [filteredEnquiries, setFilteredEnquiries] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");

  const fetchMyEnquiries = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem("UserID");
      if (!userId) throw new Error("User not logged in");
      const res = await Api.get(`/enquiry/getcustomerenquiries/${userId}`);
      setEnquiries(res.data || []);
      setFilteredEnquiries(res.data || []);
    } catch (err) {
      console.error("Error fetching enquiries:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyEnquiries();
  }, []);

  useEffect(() => {
    if (!statusFilter) {
      setFilteredEnquiries(enquiries);
    } else {
      setFilteredEnquiries(enquiries.filter((e) => e.status === statusFilter));
    }
  }, [statusFilter, enquiries]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "success";
      case "In Progress":
        return "processing";
      case "Assigned":
        return "warning";
      default:
        return "default";
    }
  };

  const downloadFile = async (url, fileName) => {
    if (!url) return;
    try {
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName || "document";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("File download failed:", err);
    }
  };

  const downloadInvoice = async (enquiryId) => {
    try {
      const response = await Api.get(`/enquiry/invoice/download/${enquiryId}`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Invoice-${enquiryId.slice(-8)}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Invoice download failed:", error);
    }
  };

  const downloadAgreement = async (enquiryId) => {
    try {
      const response = await Api.get(
        `/enquiry/agreement/download/${enquiryId}`,
        {
          responseType: "blob",
        },
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Agreement-${enquiryId.slice(-8)}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Agreement download failed:", error);
    }
  };

  const downloadWarranty = async (enquiryId) => {
    try {
      const response = await Api.get(
        `/enquiry/warranty/download/${enquiryId}`,
        {
          responseType: "blob",
        },
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Warranty-${enquiryId.slice(-8)}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Warranty download failed:", error);
    }
  };

  return (
    <div className="track-status-container">
      <div className="page-header">
        <h1>My Solar Enquiries</h1>
        <p>Track status, view details and download important documents</p>
      </div>

      <div className="filter-section">
        <Select
          placeholder="Filter by Status"
          value={statusFilter || undefined}
          onChange={setStatusFilter}
          allowClear
          style={{ width: 180 }}
          size="large"
        >
          <Option value="Assigned">Assigned</Option>
          <Option value="In Progress">In Progress</Option>
          <Option value="Completed">Completed</Option>
        </Select>

        <Button
          type="primary"
          icon={<ReloadOutlined />}
          onClick={() => {
            setStatusFilter("");
            fetchMyEnquiries();
          }}
          size="large"
        >
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="loading-wrapper">
          <Spin size="large" tip="Loading your enquiries..." />
        </div>
      ) : filteredEnquiries.length === 0 ? (
        <Empty
          description={
            statusFilter
              ? `No enquiries with status "${statusFilter}"`
              : "You haven't submitted any enquiries yet"
          }
          className="empty-state"
        >
          <Button type="primary" onClick={fetchMyEnquiries}>
            Refresh List
          </Button>
        </Empty>
      ) : (
        <Row gutter={[16, 24]}>
          {filteredEnquiries.map((enq) => {
            const cardDisabled = !enq.amount; // ✅ disable card if no amount
            return (
              <Col xs={24} sm={12} md={12} lg={8} key={enq._id}>
                <Card
                  hoverable={!cardDisabled}
                  className={`enquiry-card ${cardDisabled ? "disabled" : ""}`}
                  bodyStyle={{
                    padding: "20px",
                    opacity: cardDisabled ? 0.6 : 1,
                  }}
                >
                  <div className="card-header">
                    <h3>{enq.fullName || "Customer"}</h3>
                    <Tag
                      color={getStatusColor(enq.status)}
                      className="status-tag"
                    >
                      {enq.status || "Unknown"}
                    </Tag>
                  </div>

                  <div className="card-details">
                    <div className="detail-item">
                      <span className="label">Enquiry Type</span>
                      <span>{enq.enquiryType || "—"}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">System</span>
                      <span>{enq.systemType || "—"}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Capacity</span>
                      <span>{enq.capacity || "—"}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Applied On</span>
                      <span>
                        {enq.appliedDate
                          ? new Date(enq.appliedDate).toLocaleDateString(
                              "en-IN",
                            )
                          : "—"}
                      </span>
                    </div>
                  </div>

                  <div className="amount-section">
                    <div className="amount-label">Total Amount</div>
                    <div className="amount-value">
                      {enq.amount
                        ? `₹ ${enq.amount.toLocaleString("en-IN")}`
                        : "Not Quoted Yet"}
                    </div>
                  </div>

                  <div className="download-section">
                    <Tooltip title="Download Invoice">
                      <Button
                        type="primary"
                        icon={<FilePdfOutlined />}
                        onClick={() => downloadInvoice(enq._id)}
                        disabled={cardDisabled}
                        block
                      >
                        Invoice
                      </Button>
                    </Tooltip>

                    <Tooltip title="Download Agreement Document">
                      <Button
                        icon={<FileTextOutlined />}
                        onClick={() => downloadAgreement(enq._id)}
                        disabled={cardDisabled}
                        block
                      >
                        Agreement
                      </Button>
                    </Tooltip>

                    <Tooltip title="Download Warranty Certificate">
                      <Button
                        icon={<SafetyCertificateOutlined />}
                        onClick={() => downloadWarranty(enq._id)}
                        disabled={cardDisabled}
                        block
                      >
                        Warranty
                      </Button>
                    </Tooltip>
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
    </div>
  );
}

export default TrackStatus;
