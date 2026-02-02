import React, { useEffect, useState } from "react";
import { Table, Button, Tag, Spin, message, Modal, Popconfirm } from "antd";
import Api from "../../Api";
import { useNavigate } from "react-router-dom";

function EmployeeWork() {
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEmployeeWorks, setSelectedEmployeeWorks] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editEmployee, setEditEmployee] = useState(null);
  const [workEditOpen, setWorkEditOpen] = useState(false);
  const [selectedWork, setSelectedWork] = useState(null);

  const navigate = useNavigate();

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const { data } = await Api.get("/admin/employee-work-summary");
      setEmployees(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      // message.error("Failed to fetch employee data");
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDelete = async (id) => {
    try {
      await Api.delete(`/admin/employee/${id}`);
      message.success("Employee deleted successfully");
      fetchEmployees();
    } catch (err) {
      console.error(err);
      message.error("Failed to delete employee");
    }
  };

  const handleEdit = (record) => {
    setEditEmployee(record); // selected employee data
    setEditModalOpen(true); // open modal
  };

  const handleViewWorks = async (employeeId) => {
    setModalVisible(true); // <-- show modal
    setModalLoading(true);
    try {
      const { data } = await Api.get(`/enquiry/getemployeeworks/${employeeId}`);
      setSelectedEmployeeWorks(data);
    } catch (err) {
      console.error(err);
      // message.error("Failed to fetch employee works");
      setSelectedEmployeeWorks([]);
    } finally {
      setModalLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      await Api.put(`/admin/employee/${editEmployee._id}`, editEmployee);
      message.success("Employee updated successfully");
      setEditModalOpen(false);
      fetchEmployees();
    } catch (err) {
      console.error(err);
      message.error("Update failed");
    }
  };

  const columns = [
    { title: "Employee ID", dataIndex: "employeeId" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    { title: "Total Works", dataIndex: "totalWorks", key: "totalWorks" },
    {
      title: "Pending",
      dataIndex: "pending",
      key: "pending",
      render: (text) => <Tag color="orange">{text}</Tag>,
    },
    {
      title: "Completed",
      dataIndex: "completed",
      key: "completed",
      render: (text) => <Tag color="green">{text}</Tag>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button type="primary" onClick={() => handleViewWorks(record._id)}>
            View Works
          </Button>
          <Button type="default" onClick={() => handleEdit(record)}>
            Edit
          </Button>

          <Popconfirm
            title="Are you sure you want to delete this employee?"
            description="This action cannot be undone"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2>Employee Work Summary</h2>
      {loading ? (
        <div style={{ textAlign: "center", padding: 50 }}>
          <Spin size="large" />
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={employees}
          rowKey="_id"
          pagination={{ pageSize: 5 }}
          bordered
          scroll={{ x: "max-content" }}
        />
      )}

      <Modal
        title="Employee Works"
        open={modalVisible} // <-- changed from visible to open
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
        scroll={{ x: "max-content" }}
      >
        {modalLoading ? (
          <div style={{ textAlign: "center", padding: 50 }}>
            <Spin size="large" />
          </div>
        ) : selectedEmployeeWorks.length === 0 ? (
          <p>No works found for this employee.</p>
        ) : (
          <Table
            dataSource={selectedEmployeeWorks}
            rowKey="_id"
            pagination={{ pageSize: 5 }}
            scroll={{ x: "max-content" }}
            columns={[
              { title: "Customer Name", dataIndex: "fullName" },
              { title: "Mobile", dataIndex: "mobile" },
              { title: "Email", dataIndex: "email" },
              { title: "System Type", dataIndex: "systemType" },
              { title: "Enquiry Type", dataIndex: "enquiryType" },
              { title: "Capacity", dataIndex: "capacity" },
              { title: " EB ServiceNo", dataIndex: "ebServiceNo" },
              { title: "Roof Type", dataIndex: "roofType" },
              { title: "Roof Area", dataIndex: "roofArea" },
              { title: "Issue Description", dataIndex: "issueDescription" },
              {
                title: "Image",
                dataIndex: "image",
                render: (url) =>
                  url ? (
                    <a href={url} target="_blank" rel="noopener noreferrer">
                      View
                    </a>
                  ) : (
                    "No Image"
                  ),
              },

              { title: "Preferred Time", dataIndex: "preferredTime" },
              { title: "Message", dataIndex: "message" },
              {
                title: "Status",
                dataIndex: "status",
                key: "status",
                render: (text) =>
                  text === "Completed" ? (
                    <Tag color="green">{text}</Tag>
                  ) : (
                    <Tag color="orange">{text}</Tag>
                  ),
              },
            ]}
          />
        )}
      </Modal>
      <Modal
        title="Edit Employee"
        open={editModalOpen}
        onCancel={() => setEditModalOpen(false)}
        onOk={handleUpdate}
      >
        {editEmployee && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <input
              value={editEmployee.name}
              onChange={(e) =>
                setEditEmployee({ ...editEmployee, name: e.target.value })
              }
              placeholder="Name"
            />
            <input
              value={editEmployee.phone}
              onChange={(e) =>
                setEditEmployee({ ...editEmployee, phone: e.target.value })
              }
              placeholder="Phone"
            />
            <input
              value={editEmployee.email}
              onChange={(e) =>
                setEditEmployee({ ...editEmployee, email: e.target.value })
              }
              placeholder="Email"
            />
          </div>
        )}
      </Modal>
    </div>
  );
}

export default EmployeeWork;
