import React, { useState } from "react";
import { Upload, Button, List, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

function Document() {
  const [documents, setDocuments] = useState([]);

  // Handle file upload
  const handleUpload = (file) => {
    setDocuments((prev) => [...prev, file]);
    message.success(`${file.name} uploaded successfully`);
    return false; // prevent default upload behavior (no server)
  };

  return (
    <div style={{ padding: 20, maxWidth: 600 }}>
      <h2>Documents</h2>

      {/* Upload button */}
      <Upload beforeUpload={handleUpload} multiple>
        <Button icon={<UploadOutlined />}>Upload Document</Button>
      </Upload>

      {/* List of uploaded documents */}
      <List
        style={{ marginTop: 20 }}
        bordered
        dataSource={documents}
        renderItem={(item) => <List.Item>{item.name}</List.Item>}
        locale={{ emptyText: "No documents uploaded yet" }}
      />
    </div>
  );
}

export default Document;
