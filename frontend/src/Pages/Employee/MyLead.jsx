import React, { useEffect, useState } from "react";
import Api from "../../Api";
import { Card, Row, Col, Tag } from "antd";
import { useNavigate } from "react-router-dom";

function MyLead() {
  const [leads, setLeads] = useState([]);
  console.log("leads", leads);
  const employee = JSON.parse(localStorage.getItem("employeeData"));
  console.log("employee", employee);

  const navigate = useNavigate();
  useEffect(() => {
    fetchMyLeads();
  }, []);

  const fetchMyLeads = async () => {
    try {
      console.log("Employee ID:", employee._id);

      const res = await Api.get(`/employee/get/mylead/${employee._id}`);
      console.log("My Leads Response:", res.data);

      setLeads(res.data);
    } catch (error) {
      console.error("Error fetching my leads:", error);
    }
  };
  const getStatusColor = (status) => {
    if (status === "New") return "blue";
    if (status === "Contacted") return "orange";
    if (status === "Closed") return "green";
    return "default";
  };

  return (
    <div>
      <Row gutter={[16, 16]}>
        {leads.map((lead) => (
          <Col xs={24} sm={12} md={8} lg={6} key={lead._id}>
            <Card
              hoverable
              style={{
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                transition: "all 0.3s ease",
              }}
              onClick={() => navigate(`/employee/lead/${lead._id}`)}
              bodyStyle={{ padding: "16px" }}
            >
              <h3 style={{ marginBottom: 8 }}>{lead.name}</h3>
              <p>📞 {lead.phone}</p>
              <p>📍 {lead.location || "Not Mentioned"}</p>
              <p>📍 {lead.email || "Not Mentioned"}</p>

              <p>📍 {lead.referrer || "Not Mentioned"}</p>

              <Tag color={getStatusColor(lead.status)}>{lead.status}</Tag>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default MyLead;
