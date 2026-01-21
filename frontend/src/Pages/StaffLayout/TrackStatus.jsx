import React, { useState } from "react";
import { Steps, Card, Select, Button } from "antd";

const { Step } = Steps;
const { Option } = Select;

function TrackStatus() {
  // Example leads (In real project, fetch from API)
  const leads = [
    {
      id: "ENQ001",
      service: "Solar Panel Installation",
      status: "In Progress",
    },
    { id: "ENQ002", service: "Battery Storage", status: "New" },
    { id: "ENQ003", service: "Maintenance", status: "Closed" },
  ];

  const [selectedLead, setSelectedLead] = useState(null);

  // Map status to step index
  const statusToStep = {
    New: 0,
    "In Progress": 1,
    Closed: 2,
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Track Lead Status</h2>

      {/* Select a lead to track */}
      <Select
        placeholder="Select Enquiry"
        style={{ width: 250, marginBottom: 20 }}
        onChange={(id) => {
          const lead = leads.find((l) => l.id === id);
          setSelectedLead(lead);
        }}
      >
        {leads.map((lead) => (
          <Option key={lead.id} value={lead.id}>
            {lead.id} - {lead.service}
          </Option>
        ))}
      </Select>

      {/* Show status steps */}
      {selectedLead && (
        <Card style={{ width: 500 }}>
          <h3>{selectedLead.service}</h3>
          <Steps current={statusToStep[selectedLead.status]}>
            <Step title="New" description="Lead created" />
            <Step title="In Progress" description="Work started" />
            <Step title="Closed" description="Completed" />
          </Steps>
          <p style={{ marginTop: 20 }}>
            Current Status: <b>{selectedLead.status}</b>
          </p>
        </Card>
      )}
    </div>
  );
}

export default TrackStatus;
