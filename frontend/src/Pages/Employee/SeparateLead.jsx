import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Api from "../../Api";
import { Card, Row, Col, Tag } from "antd";

function SeparateLead() {
  const { leadId } = useParams(); // lead._id from MyLead
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        // ✅ Use the correct base route: /enquiry/
        const res = await Api.get(`/enquiry/getcustomerenquiries/${leadId}`);
        setEnquiries(res.data);
      } catch (err) {
        console.error("Error fetching enquiries:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEnquiries();
  }, [leadId]);

  const getStatusColor = (status) => {
    if (status === "New") return "blue";
    if (status === "Contacted") return "orange";
    if (status === "Closed") return "green";
    return "default";
  };

  if (loading) return <div>Loading enquiries...</div>;
  if (enquiries.length === 0) return <div>No enquiries submitted yet.</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Enquiries Submitted by Lead</h2>
      <Row gutter={[16, 16]}>
        {enquiries.map((enquiry) => (
          <Col xs={24} sm={12} md={8} lg={6} key={enquiry._id}>
            <Card
              hoverable
              style={{
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                transition: "all 0.3s ease",
              }}
              bodyStyle={{ padding: "16px" }}
            >
              <h3 style={{ marginBottom: 8 }}>{enquiry.fullName}</h3>
              <p>📞 {enquiry.mobile}</p>
              <p>📧 {enquiry.email || "Not Mentioned"}</p>
              <p>🏠 {enquiry.address || "Not Mentioned"}</p>
              <p>💡 {enquiry.enquiryType}</p>
              <p>⚙️ {enquiry.systemType || "Not Mentioned"}</p>
              <p>📝 {enquiry.issueDescription || "Not Mentioned"}</p>
              <p>
                ⏰ Preferred Time: {enquiry.preferredTime || "Not Mentioned"}
              </p>
              <Tag color={getStatusColor(enquiry.status)}>{enquiry.status}</Tag>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default SeparateLead;
