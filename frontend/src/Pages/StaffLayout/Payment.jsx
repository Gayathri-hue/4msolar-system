import React, { useState } from "react";
import { Table, Input, Button, Form, Select, message } from "antd";

const { Option } = Select;

function Payment() {
  const [payments, setPayments] = useState([
    // Example initial data
    {
      key: 1,
      type: "Advance",
      amount: 20000,
      date: "20-01-2026",
      status: "Paid",
    },
  ]);

  const [form] = Form.useForm();

  // Add new payment
  const handleAddPayment = (values) => {
    const newPayment = {
      key: payments.length + 1,
      ...values,
    };
    setPayments([...payments, newPayment]);
    message.success("Payment added successfully!");
    form.resetFields();
  };

  const columns = [
    { title: "Payment Type", dataIndex: "type", key: "type" },
    { title: "Amount", dataIndex: "amount", key: "amount" },
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Status", dataIndex: "status", key: "status" },
  ];

  return (
    <div style={{ padding: 20, maxWidth: 600 }}>
      <h2>Payments</h2>

      {/* Payment Form */}
      <Form
        form={form}
        layout="inline"
        onFinish={handleAddPayment}
        style={{ marginBottom: 20, gap: 10 }}
      >
        <Form.Item
          name="type"
          rules={[{ required: true, message: "Select payment type" }]}
        >
          <Select placeholder="Payment Type" style={{ width: 120 }}>
            <Option value="Advance">Advance</Option>
            <Option value="Installation">Installation</Option>
            <Option value="Final">Final</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="amount"
          rules={[{ required: true, message: "Enter amount" }]}
        >
          <Input placeholder="Amount" type="number" style={{ width: 100 }} />
        </Form.Item>

        <Form.Item
          name="date"
          rules={[{ required: true, message: "Enter date" }]}
        >
          <Input placeholder="Date" type="date" style={{ width: 140 }} />
        </Form.Item>

        <Form.Item
          name="status"
          rules={[{ required: true, message: "Select status" }]}
        >
          <Select placeholder="Status" style={{ width: 120 }}>
            <Option value="Paid">Paid</Option>
            <Option value="Pending">Pending</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Add Payment
          </Button>
        </Form.Item>
      </Form>

      {/* Payment Table */}
      <Table columns={columns} dataSource={payments} pagination={false} />
    </div>
  );
}

export default Payment;
