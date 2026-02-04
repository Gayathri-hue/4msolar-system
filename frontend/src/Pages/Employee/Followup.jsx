import React, { useEffect, useState } from "react";
import { Card, Row, Col, Tag, Spin, message, Empty, Typography } from "antd";
import { CalendarOutlined, ClockCircleOutlined } from "@ant-design/icons";
import Api from "../../Api";

const { Title, Text } = Typography;

function Followup() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFollowups = async () => {
    try {
      const token = localStorage.getItem("employeeToken");
      if (!token) throw new Error("No token found");

      const res = await Api.get("/employee/myleads", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Only In Progress leads
      const progressLeads = res.data.filter(
        (lead) => lead.status === "In Progress",
      );

      setLeads(progressLeads);
    } catch (err) {
      console.error("Followup fetch error:", err);
      message.error("Failed to load followups");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowups();
  }, []);

  const getDueStatus = (dueDate) => {
    if (!dueDate) return { text: "No Due", color: "default" };

    const now = new Date();
    const due = new Date(dueDate);

    const isToday =
      due.getDate() === now.getDate() &&
      due.getMonth() === now.getMonth() &&
      due.getFullYear() === now.getFullYear();

    if (due < now) return { text: "Overdue", color: "red" };
    if (isToday) return { text: "Due Today", color: "orange" };
    return { text: "Upcoming", color: "blue" };
  };

  const getDueTagProps = (dueDate) => {
    const { text, color } = getDueStatus(dueDate);
    return { children: text, color };
  };

  return (
    <div style={{ padding: "24px", maxWidth: "1600px", margin: "0 auto" }}>
      <Title level={3} style={{ marginBottom: 28, fontWeight: 600 }}>
        Follow-ups
      </Title>

      <Spin spinning={loading} tip="Loading follow-ups...">
        {leads.length === 0 && !loading ? (
          <Empty
            description="No follow-ups available right now"
            style={{ margin: "80px 0" }}
          />
        ) : (
          <Row gutter={[16, 24]}>
            {leads.map((lead) => {
              const dueInfo = getDueStatus(lead.dueDate);

              return (
                <Col xs={24} sm={12} md={8} lg={6} xl={6} key={lead._id}>
                  <Card
                    hoverable
                    bordered={false}
                    style={{
                      height: "100%",
                      borderRadius: 12,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                      background: "#fff",
                      transition: "all 0.3s",
                    }}
                    bodyStyle={{ padding: "20px 24px" }}
                    onClick={() => {
                      // Optional: navigate to lead detail page
                      // history.push(`/leads/${lead._id}`);
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                      }}
                    >
                      <div>
                        <Text type="secondary" style={{ fontSize: "0.85rem" }}>
                          Lead ID • {lead.leadId || "—"}
                        </Text>
                        <div style={{ marginTop: 4 }}>
                          <Text strong style={{ fontSize: "1.05rem" }}>
                            {lead.fullName || "—"}
                          </Text>
                        </div>
                      </div>

                      <div
                        style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
                      >
                        <Tag color="blue" style={{ borderRadius: 20 }}>
                          {lead.status}
                        </Tag>
                      </div>

                      <div style={{ marginTop: 8 }}>
                        <Text type="secondary" style={{ fontSize: "0.9rem" }}>
                          <CalendarOutlined /> Applied:{" "}
                          {lead.appliedDate
                            ? new Date(lead.appliedDate).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                },
                              )
                            : "—"}
                        </Text>
                      </div>

                      {lead.dueDate && (
                        <div>
                          <Text type="secondary" style={{ fontSize: "0.9rem" }}>
                            <CalendarOutlined /> Due:{" "}
                            {new Date(lead.dueDate).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )}{" "}
                            {lead.dueDate && (
                              <Tag
                                icon={<ClockCircleOutlined />}
                                {...getDueTagProps(lead.dueDate)}
                                style={{ borderRadius: 20 }}
                              />
                            )}
                          </Text>
                        </div>
                      )}

                      {/* You can add more fields like phone, email, last comment etc. */}
                    </div>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}
      </Spin>
    </div>
  );
}

export default Followup;
