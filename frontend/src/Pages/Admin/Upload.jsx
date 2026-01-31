import React, { useState } from "react";
import axios from "axios";

function Upload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  // File தேர்ந்தெடுக்கும்போது
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setMessage(null);
    setError(null);
    setResult(null);
  };

  // Upload button click பண்ணும்போது
  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select an Excel file first (.xlsx or .xls)");
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    const formData = new FormData();
    formData.append("users", selectedFile); // backend route-ல upload.single("users") use பண்ணிருக்க

    try {
      const response = await axios.post(
        "http://localhost:8000/api/admin/upload-users", // உன் backend URL
        formData,
      );

      setResult(response.data);
      setMessage(
        `Success! ${response.data.successCount} users processed. Failed: ${response.data.failedCount}`,
      );

      // Optional: file input-ஐ clear பண்ணலாம்
      document.getElementById("file-input").value = "";
      setSelectedFile(null);
    } catch (err) {
      console.error("Upload error:", err);
      setError(
        err.response?.data?.msg ||
          "Upload failed. Please check your connection or file format.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "30px", maxWidth: "700px", margin: "0 auto" }}>
      <h2>Bulk Upload Users (Excel)</h2>
      <p style={{ color: "#555", marginBottom: "20px" }}>
        Select an Excel file (.xlsx) with columns: name, email, phone, dob,
        password (optional), referrer, referrerDetails
      </p>

      <div style={{ marginBottom: "25px" }}>
        <input
          id="file-input"
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileChange}
          style={{ display: "block", marginBottom: "15px" }}
        />

        <button
          onClick={handleUpload}
          disabled={loading || !selectedFile}
          style={{
            padding: "12px 30px",
            backgroundColor: loading || !selectedFile ? "#ccc" : "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "16px",
            cursor: loading || !selectedFile ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Uploading..." : "Upload Excel File"}
        </button>
      </div>

      {error && (
        <div
          style={{
            color: "red",
            margin: "15px 0",
            padding: "10px",
            background: "#ffebee",
            borderRadius: "5px",
          }}
        >
          {error}
        </div>
      )}

      {message && (
        <div
          style={{
            color: "green",
            margin: "15px 0",
            padding: "10px",
            background: "#e8f5e9",
            borderRadius: "5px",
          }}
        >
          {message}
        </div>
      )}

      {result && result.failedCount > 0 && (
        <div style={{ marginTop: "25px" }}>
          <h4>Failed Rows:</h4>
          <pre
            style={{
              background: "#f5f5f5",
              padding: "15px",
              borderRadius: "6px",
              overflowX: "auto",
              maxHeight: "300px",
            }}
          >
            {JSON.stringify(result.failedRows || result.failed, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default Upload;
