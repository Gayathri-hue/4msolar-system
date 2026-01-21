import React from "react";
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  message as AntMessage,
} from "antd";

const { TextArea } = Input;

function Chat() {
  const handleSubmit = (values) => {
    console.log("Chat form submitted:", values);
    AntMessage.success("Message sent successfully!");
  };

  return (
    <div style={{ padding: "20px" }}>
      <Row gutter={[16, 16]}>
        {/* Enquiry Section */}
        <Col xs={24} md={12}>
          <Card title="Enquiry">
            <p>📞 Office 1: +91 9876543210</p>
            <p>📞 Office 2: +91 8765432109</p>
            <p>📞 Office 3: +91 7654321098</p>
          </Card>
        </Col>

        {/* Chat Section */}
        <Col xs={24} md={12}>
          <Card title="Chat with Us">
            <Form layout="vertical" onFinish={handleSubmit}>
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: "Please enter your name" }]}
              >
                <Input placeholder="Your Name" />
              </Form.Item>

              <Form.Item
                label="Phone Number"
                name="phone"
                rules={[
                  { required: true, message: "Please enter your phone number" },
                  {
                    pattern: /^[0-9]{10}$/,
                    message: "Enter a valid 10-digit phone number",
                  },
                ]}
              >
                <Input placeholder="Your Phone Number" maxLength={10} />
              </Form.Item>

              <Form.Item
                label="Message"
                name="message"
                rules={[
                  { required: true, message: "Please enter your message" },
                ]}
              >
                <TextArea rows={4} placeholder="Your Message" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  Send Message
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Chat;
