import React, { useEffect, useState } from "react";
import { Card, Row, Col, Tag, Select, Spin, Button } from "antd";
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
      const res = await Api.get(`/enquiry/getcustomerenquiries/${userId}`);
      setEnquiries(res.data);
      setFilteredEnquiries(res.data); // will be filtered in next useEffect
    } catch (err) {
      console.error("Error fetching enquiries", err);
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
      return;
    }
    setFilteredEnquiries(enquiries.filter((e) => e.status === statusFilter));
  }, [statusFilter, enquiries]);

  const getStatusVariant = (status) => {
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

  return (
    <div className="enquiry-track-wrapper">
      <div className="front-title">
        <h2>Track Your Enquiries</h2>
        <p className="subtitle">View and monitor the status of your requests</p>
      </div>

      <div className="filter-bar">
        <Select
          placeholder="Filter by status"
          value={statusFilter || undefined}
          onChange={setStatusFilter}
          allowClear
          className="status-select"
        >
          <Option value="In Progress">In Progress</Option>
          <Option value="Completed">Completed</Option>
          <Option value="Assigned">Assigned</Option>
        </Select>

        <Button
          className="refresh-btn" // <-- unique custom class
          type="primary"
          onClick={() => {
            setStatusFilter("");
            fetchMyEnquiries();
          }}
        >
          Refresh List
        </Button>
      </div>

      {loading ? (
        <div className="loading-center">
          <Spin size="large" />
        </div>
      ) : filteredEnquiries.length === 0 ? (
        <div className="empty-state">
          <p>
            No enquiries found{" "}
            {statusFilter ? `with status "${statusFilter}"` : ""}
          </p>
        </div>
      ) : (
        <Row gutter={[16, 24]} className="enquiries-grid">
          {filteredEnquiries.map((enq) => (
            <Col
              xs={24} // always full width on extra small
              sm={12} // 2 columns from ~640px
              md={8} // 3 columns from ~768px
              lg={8} // 4 columns from ~992px
              key={enq._id}
            >
              <div className="enquiry-card">
                <div className="card-top-section">
                  <h3>{enq.fullName || "—"}</h3>
                  <Tag
                    className="enquiry-status-badge"
                    color={getStatusVariant(enq.status)}
                  >
                    {enq.status}
                  </Tag>
                </div>

                <div className="enquiry-details">
                  <div className="detail-row">
                    <div className="detail-label">Mobile</div>
                    <div className="detail-value">{enq.mobile || "—"}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Enquiry Type</div>
                    <div className="detail-value">{enq.enquiryType || "—"}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">System</div>
                    <div className="detail-value">{enq.systemType || "—"}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Capacity</div>
                    <div className="detail-value">{enq.capacity || "—"}</div>
                  </div>

                  <div className="dates-section">
                    <div className="detail-row">
                      <div className="detail-label">Applied On</div>
                      <div className="detail-value">
                        {enq.appliedDate
                          ? new Date(enq.appliedDate).toLocaleDateString()
                          : "—"}
                      </div>
                    </div>
                    <div className="detail-row">
                      <div className="detail-label">Due Date</div>
                      <div className="detail-value">
                        {enq.dueDate
                          ? new Date(enq.dueDate).toLocaleDateString()
                          : "—"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default TrackStatus;
