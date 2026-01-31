import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Select, Tag, message } from "antd";
import Api from "../../Api";

const { Option } = Select;

function AssignWork() {
  const [enquiries, setEnquiries] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔹 fetch enquiries
  const fetchEnquiries = async () => {
    const res = await Api.get("/enquiry/getallenquiry");
    setEnquiries(res.data);
  };

  // 🔹 fetch employees
  const fetchEmployees = async () => {
    const res = await Api.get("/admin/getemployee");
    setEmployees(res.data);
  };

  useEffect(() => {
    fetchEnquiries();
    fetchEmployees();
  }, []);

  // 🔹 open modal
  const openAssignModal = (record) => {
    setSelectedEnquiry(record);
    setSelectedEmployee(null);
    setOpen(true);
  };

  // 🔹 assign action
  const handleAssign = async () => {
    if (!selectedEmployee) {
      message.warning("Please select employee");
      return;
    }

    try {
      setLoading(true);

      await Api.post("/admin/assign-enquiry", {
        enquiryId: selectedEnquiry._id,
        employeeId: selectedEmployee,
      });

      message.success("Employee assigned successfully");
      setOpen(false);
      fetchEnquiries();
    } catch (err) {
      message.error("Assign failed");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Customer",
      dataIndex: "fullName",
    },
    {
      title: "CustomerID",
      dataIndex: "customer",
    },
    {
      title: "Enquiry Type",
      dataIndex: "enquiryType",
    },
    {
      title: "Mobile",
      dataIndex: "mobile",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => (
        <Tag color={status === "Assigned" ? "blue" : "green"}>{status}</Tag>
      ),
    },
    {
      title: "Action",
      render: (_, record) =>
        record.assignedEmployee ? (
          <Tag color="green">Assigned</Tag>
        ) : (
          <Button type="primary" onClick={() => openAssignModal(record)}>
            Assign
          </Button>
        ),
    },
  ];

  return (
    <div style={{ padding: 16 }}>
      <h2 className="front-title ">Assign Work</h2>

      <Table
        columns={columns}
        dataSource={enquiries}
        rowKey="_id"
        pagination={{ pageSize: 5 }}
        scroll={{ x: 600 }}
      />

      <Modal
        title="Assign Enquiry"
        open={open}
        onOk={handleAssign}
        onCancel={() => setOpen(false)}
        confirmLoading={loading}
        okText="Assign"
      >
        <p>
          <strong>Customer:</strong> {selectedEnquiry?.fullName}
        </p>

        <Select
          style={{ width: "100%" }}
          placeholder="Select Employee"
          onChange={(value) => setSelectedEmployee(value)}
        >
          {employees.map((emp) => (
            <Option key={emp._id} value={emp._id}>
              {emp.name} ({emp.employeeId})
            </Option>
          ))}
        </Select>
      </Modal>
    </div>
  );
}

export default AssignWork;
