// import React, { useEffect, useState } from "react";
// import { Table, Button, Modal, Select, Tag, message } from "antd";
// import Api from "../../Api";

// const { Option } = Select;

// function AssignWork() {
//   const [enquiries, setEnquiries] = useState([]);
//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState(null);
//   const [selectedEnquiry, setSelectedEnquiry] = useState(null);
//   const [open, setOpen] = useState(false);
//   const [loading, setLoading] = useState(false);

//   // 🔹 fetch enquiries
//   const fetchEnquiries = async () => {
//     const res = await Api.get("/enquiry/getallenquiry");
//     setEnquiries(res.data);
//   };

//   // 🔹 fetch employees
//   const fetchEmployees = async () => {
//     const res = await Api.get("/admin/getemployee");
//     setEmployees(res.data);
//   };

//   useEffect(() => {
//     fetchEnquiries();
//     fetchEmployees();
//   }, []);

//   // 🔹 open modal
//   const openAssignModal = (record) => {
//     setSelectedEnquiry(record);
//     setSelectedEmployee(null);
//     setOpen(true);
//   };

//   // 🔹 assign action
//   const handleAssign = async () => {
//     if (!selectedEmployee) {
//       message.warning("Please select employee");
//       return;
//     }

//     try {
//       setLoading(true);

//       await Api.post("/admin/assign-enquiry", {
//         enquiryId: selectedEnquiry._id,
//         employeeId: selectedEmployee,
//       });

//       message.success("Employee assigned successfully");
//       setOpen(false);
//       fetchEnquiries();
//     } catch (err) {
//       message.error("Assign failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const columns = [
//     {
//       title: "Customer",
//       dataIndex: "fullName",
//     },
//     {
//       title: "CustomerID",
//       dataIndex: "customer",
//     },
//     {
//       title: "Enquiry Type",
//       dataIndex: "enquiryType",
//     },
//     {
//       title: "Mobile",
//       dataIndex: "mobile",
//     },
//     {
//       title: "Status",
//       dataIndex: "status",
//       render: (status) => (
//         <Tag color={status === "Assigned" ? "blue" : "green"}>{status}</Tag>
//       ),
//     },
//     {
//       title: "Action",
//       render: (_, record) =>
//         record.assignedEmployee ? (
//           <Tag color="green">Assigned</Tag>
//         ) : (
//           <Button type="primary" onClick={() => openAssignModal(record)}>
//             Assign
//           </Button>
//         ),
//     },
//   ];

//   return (
//     <div style={{ padding: 16 }}>
//       <h2 className="front-title ">Assign Work</h2>

//       <Table
//         columns={columns}
//         dataSource={enquiries}
//         rowKey="_id"
//         pagination={{ pageSize: 5 }}
//         scroll={{ x: 600 }}
//       />

//       <Modal
//         title="Assign Enquiry"
//         open={open}
//         onOk={handleAssign}
//         onCancel={() => setOpen(false)}
//         confirmLoading={loading}
//         okText="Assign"
//       >
//         <p>
//           <strong>Customer:</strong> {selectedEnquiry?.fullName}
//         </p>

//         <Select
//           style={{ width: "100%" }}
//           placeholder="Select Employee"
//           onChange={(value) => setSelectedEmployee(value)}
//         >
//           {employees.map((emp) => (
//             <Option key={emp._id} value={emp._id}>
//               {emp.name} ({emp.employeeId})
//             </Option>
//           ))}
//         </Select>
//       </Modal>
//     </div>
//   );
// }

// export default AssignWork;
import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Select, Tag, message, Input } from "antd";
import Api from "../../Api";

const { Option } = Select;

function AssignWork() {
  const [enquiries, setEnquiries] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [amount, setAmount] = useState("");

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch all enquiries
  const fetchEnquiries = async () => {
    try {
      const res = await Api.get("/enquiry/getallenquiry");
      setEnquiries(res.data);
    } catch (err) {
      message.error("Failed to load enquiries");
    }
  };

  // 🔹 Fetch employees
  const fetchEmployees = async () => {
    try {
      const res = await Api.get("/admin/getemployee");
      setEmployees(res.data);
    } catch (err) {
      message.error("Failed to load employees");
    }
  };

  useEffect(() => {
    fetchEnquiries();
    fetchEmployees();
  }, []);

  // 🔹 Open modal
  const openAssignModal = (record) => {
    setSelectedEnquiry(record);
    setSelectedEmployee(record.assignedEmployee?._id || null);
    setAmount(record.amount || "");
    setOpen(true);
  };

  // 🔹 Assign / Reassign + Set Amount
  const handleAssign = async () => {
    if (!selectedEmployee) {
      message.warning("Please select employee");
      return;
    }
    if (!amount || amount <= 0) {
      message.warning("Please enter valid amount");
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ Set Amount
      await Api.post("/admin/set-enquiry-amount", {
        enquiryId: selectedEnquiry._id,
        amount,
      });

      // 2️⃣ Assign or Reassign Employee
      const res = await Api.post("/admin/assign-or-reassign-enquiry", {
        enquiryId: selectedEnquiry._id,
        employeeId: selectedEmployee,
      });

      message.success(res.data.msg);
      setOpen(false);
      fetchEnquiries();
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.msg || "Operation failed, try again later";
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Customer Name",
      dataIndex: "fullName",
    },
    { title: "Lead ID", dataIndex: "leadId" },

    {
      title: "Customer ID",
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
      title: "Amount",
      dataIndex: "amount",
      render: (amt) => (amt ? `₹${amt}` : "-"),
    },
    {
      title: "Assigned Employee",
      dataIndex: "assignedEmployee",
      render: (emp) => (emp ? `${emp.name} (${emp.employeeId})` : "-"),
    },
    {
      title: "Quotation",
      dataIndex: "quotationStatus",
      render: (status) => (
        <Tag color={status === "AMOUNT_SET" ? "green" : "orange"}>
          {status || "PENDING"}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => (
        <Tag color={status === "Assigned" ? "blue" : "default"}>
          {status || "New"}
        </Tag>
      ),
    },
    {
      title: "Action",
      render: (_, record) => (
        <Button type="primary" onClick={() => openAssignModal(record)}>
          {record.assignedEmployee
            ? "Reassign / Set Amount"
            : "Assign / Set Amount"}
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 16 }}>
      <h2 className="front-title">Assign Work & Set Amount</h2>

      <Table
        columns={columns}
        dataSource={enquiries}
        rowKey="_id"
        pagination={{ pageSize: 5 }}
        scroll={{ x: 1000 }}
      />

      <Modal
        title="Assign / Reassign Enquiry & Set Amount"
        open={open}
        onOk={handleAssign}
        onCancel={() => setOpen(false)}
        confirmLoading={loading}
        okText="Submit"
      >
        <p>
          <strong>Customer:</strong> {selectedEnquiry?.fullName}
        </p>
        <p>
          <strong>Enquiry Type:</strong> {selectedEnquiry?.enquiryType}
        </p>

        {selectedEnquiry?.assignedEmployee && (
          <p>
            <strong>Currently Assigned To:</strong>{" "}
            {selectedEnquiry.assignedEmployee.name} (
            {selectedEnquiry.assignedEmployee.employeeId})
          </p>
        )}

        <Select
          style={{ width: "100%", marginBottom: 12 }}
          placeholder="Select Employee"
          value={selectedEmployee}
          onChange={(value) => setSelectedEmployee(value)}
        >
          {employees.map((emp) => (
            <Option key={emp._id} value={emp._id}>
              {emp.name} ({emp.employeeId})
            </Option>
          ))}
        </Select>

        <Input
          type="number"
          placeholder="Enter Quotation Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </Modal>
    </div>
  );
}

export default AssignWork;
