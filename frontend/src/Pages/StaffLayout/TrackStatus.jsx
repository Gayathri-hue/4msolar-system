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

      if (statusFilter) {
        setFilteredEnquiries(res.data.filter((e) => e.status === statusFilter));
      } else {
        setFilteredEnquiries(res.data);
      }
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
    if (statusFilter) {
      setFilteredEnquiries(enquiries.filter((e) => e.status === statusFilter));
    } else {
      setFilteredEnquiries(enquiries);
    }
  }, [statusFilter, enquiries]);

  const getStatusColor = (status) => {
    if (status === "Completed") return "green";
    if (status === "In Progress") return "orange";
    return "blue";
  };

  return (
    <div className="trackstatus-page">
      <h2>Track Your Enquiries</h2>

      <div className="trackstatus-filters">
        <Select
          placeholder="Filter by status"
          value={statusFilter || undefined}
          onChange={(value) => setStatusFilter(value)}
          allowClear
        >
          <Option value="In Progress">In Progress</Option>
          <Option value="Completed">Completed</Option>
          <Option value="Assigned">Assigned</Option>
        </Select>

        <Button
          type="primary"
          onClick={() => {
            setStatusFilter("");
            fetchMyEnquiries();
          }}
        >
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="trackstatus-spinner">
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[20, 20]}>
          {filteredEnquiries.map((item) => (
            <Col xs={24} sm={12} md={8} lg={6} key={item._id}>
              <Card
                className="trackstatus-card"
                hoverable
                title={item.fullName}
              >
                <p>
                  <b>Mobile:</b> {item.mobile}
                </p>
                <p>
                  <b>Type:</b> {item.enquiryType}
                </p>
                <p>
                  <b>System:</b> {item.systemType}
                </p>
                <p>
                  <b>Capacity:</b> {item.capacity}
                </p>
                <p>
                  <b>Status:</b>{" "}
                  <Tag color={getStatusColor(item.status)}>{item.status}</Tag>
                </p>
                <p>
                  <b>Applied:</b>{" "}
                  {new Date(item.appliedDate).toLocaleDateString()}
                </p>
                <p>
                  <b>Delivery:</b> {new Date(item.dueDate).toLocaleDateString()}
                </p>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default TrackStatus;
