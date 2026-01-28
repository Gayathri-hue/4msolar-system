import React from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";

function BackButton() {
  const navigate = useNavigate();

  return (
    <Button
      type="link"
      icon={<ArrowLeftOutlined />}
      onClick={() => navigate(-1)}
      style={{ padding: 0, fontSize: 16, marginBottom: "15px" }}
    >
      Back
    </Button>
  );
}

export default BackButton;
