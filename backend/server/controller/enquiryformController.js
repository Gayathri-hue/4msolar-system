import enquiryfromModel from "../model/enquiryfromModel.js";
import Employee from "../model/employeeModel.js";
import User from "../model/UserModel.js";
import mongoose from "mongoose";
import PDFDocument from "pdfkit";
import fs from "fs";
import cloudinary from "../utils/cloudinary.js";
import bcrypt from "bcrypt";

import { saveEnquiryToExcel } from "../utils/excel.js";

export async function createEnquiry(req, res) {
  try {
    const data = req.body;

    // Use req.user.id if available, otherwise use data.customer
    const customerId = req.user?.id || data.customer;

    if (!customerId) {
      return res.status(400).json({ msg: "Customer ID is required" });
    }
    const user = await User.findById(customerId);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    let imageUrl = null;

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "enquiries" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );
        stream.end(req.file.buffer); // 🔥 memory buffer
      });

      imageUrl = result.secure_url; // ✅ cloud image URL
    }
    const enquiryDetails = {
      customer: customerId,
      leadId: user.leadId,
      fullName: data.fullName,
      mobile: data.mobile,
      email: data.email,
      // image: data.image,
      image: imageUrl,
      address: data.address,
      enquiryType: data.enquiryType,
      productType: data.productType,

      systemType: data.systemType,
      category: data.category,
      capacity: data.capacity,
      ebServiceNo: data.ebServiceNo,
      roofType: data.roofType,
      roofArea: data.roofArea,
      issueDescription: data.issueDescription,
      preferredTime: data.preferredTime,
      preferredDateTime: data.preferredDateTime,
      message: data.message,
      siteVisit: data.siteVisit,
      siteVisitDateTime: data.siteVisitDateTime,
      googleLocation: data.googleLocation,
      appliedDate: data.appliedDate || Date.now(),

      assignedEmployee: null,

      dueDate: data.dueDate || null,
    };

    const enquiry = await enquiryfromModel.create(enquiryDetails);

    // Excel-la save
    await saveEnquiryToExcel(enquiry);

    res.status(201).json({
      message: "Enquiry submitted successfully",

      data: enquiry,
    });
  } catch (err) {
    console.error("Error creating enquiry:", err);
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
}

export async function getAllEnquiries(req, res) {
  try {
    const enquiries = await enquiryfromModel
      .find()
      .populate("assignedEmployee", "name email phone employeeId"); // populate employee info

    res.json(enquiries);
  } catch (err) {
    console.error("Error fetching enquiries:", err);
    res.status(500).json({ msg: "Server Error" });
  }
}

// GET enquiry by ID
export async function getEnquiryById(req, res) {
  try {
    const { id } = req.params;
    const enquiry = await enquiryfromModel.findById(id);

    if (!enquiry) {
      return res.status(404).json({ msg: "Enquiry not found" });
    }

    res.json(enquiry);
  } catch (err) {
    console.error("Error fetching enquiry:", err);
    res.status(500).json({ msg: "Server Error" });
  }
}

export async function getEnquiriesByCustomerId(req, res) {
  try {
    const { customerId } = req.params;

    const enquiries = await enquiryfromModel.find({ customer: customerId });

    res.json(enquiries); // even if empty
  } catch (err) {
    console.error("Error fetching enquiries by customer:", err);
    res.status(500).json({ msg: "Server Error" });
  }
}

// UPDATE enquiry by ID
export async function updateEnquiry(req, res) {
  try {
    const { id } = req.params;
    const updatedEnquiry = await enquiryfromModel.findByIdAndUpdate(
      id,
      req.body,
      { new: true },
    );

    if (!updatedEnquiry) {
      return res.status(404).json({ msg: "Enquiry not found" });
    }

    res.json(updatedEnquiry);
  } catch (err) {
    console.error("Error updating enquiry:", err);
    res.status(500).json({ msg: "Server Error" });
  }
}

// DELETE enquiry by ID
export async function deleteEnquiry(req, res) {
  try {
    const { id } = req.params;
    const deletedEnquiry = await enquiryfromModel.findByIdAndDelete(id);

    if (!deletedEnquiry) {
      return res.status(404).json({ msg: "Enquiry not found" });
    }

    res.json({ msg: "Enquiry deleted successfully" });
  } catch (err) {
    console.error("Error deleting enquiry:", err);
    res.status(500).json({ msg: "Server Error" });
  }
}

// GET overall user status
export async function getEnquiryStats(req, res) {
  try {
    // Aggregate counts by status
    const stats = await enquiryfromModel.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Format response
    const result = {
      Assigned: 0,
      "In Progress": 0,
      Completed: 0,
    };

    stats.forEach((s) => {
      result[s._id] = s.count;
    });

    res.json(result);
  } catch (err) {
    console.error("Error getting enquiry stats:", err);
    res.status(500).json({ msg: "Server Error" });
  }
}

// GET enquiry stats by customer ID
export async function getEnquiryStatsByCustomer(req, res) {
  try {
    const { customerId } = req.params;

    const stats = await enquiryfromModel.aggregate([
      { $match: { customer: new mongoose.Types.ObjectId(customerId) } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const result = {
      Assigned: 0,
      "In Progress": 0,
      Completed: 0,
    };

    stats.forEach((s) => {
      result[s._id] = s.count;
    });

    res.json(result);
  } catch (err) {
    console.error("Error getting enquiry stats by customer:", err);
    res.status(500).json({ msg: "Server Error" });
  }
}
// GET all enquiries assigned to an employee
// GET all enquiries assigned to an employee
export async function getEnquiriesByEmployee(req, res) {
  try {
    const { employeeId } = req.params;
    const enquiries = await enquiryfromModel.find({
      assignedEmployee: employeeId,
    });

    if (!enquiries || enquiries.length === 0) {
      return res
        .status(404)
        .json({ msg: "No enquiries found for this employee" });
    }

    res.json(enquiries);
  } catch (err) {
    console.error("Error fetching employee enquiries:", err);
    res.status(500).json({ msg: "Server Error" });
  }
}

// export async function downloadEnquiryPDF(req, res) {
//   try {
//     const { id } = req.params;
//     const enquiry = await enquiryfromModel.findById(id);
//     if (!enquiry) return res.status(404).json({ msg: "Enquiry not found" });

//     const doc = new PDFDocument({ margin: 50 });
//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader(
//       "Content-Disposition",
//       "attachment; filename=Solar_Enquiry.pdf",
//     );
//     doc.pipe(res);

//     const pageWidth = doc.page.width - 100; // usable width

//     // ===== Title =====
//     doc.fontSize(18).text("Solar Enquiry Document", 50, 40, {
//       align: "center",
//       width: pageWidth,
//     });

//     doc.moveDown(2);

//     // ===== Top Left & Right =====
//     const y = doc.y;

//     doc.fontSize(11).text(`Order ID : ${enquiry._id}`, 50, y);
//     doc.text(`Customer ID : ${enquiry.customer}`, 50, y + 15);

//     doc.text(`Applied Date : ${enquiry.appliedDate.toDateString()}`, 350, y);
//     doc.text(`Issue Date : ${enquiry.dueDate.toDateString()}`, 350, y + 15);

//     doc.moveDown(3);

//     // ===== Enquiry Details Heading (Center) =====
//     doc.fontSize(13).text("Enquiry Details", 50, doc.y, {
//       align: "center",
//       underline: true,
//       width: pageWidth,
//     });

//     doc.moveDown(1);

//     // ===== Centered 2-Column Table =====
//     const tableWidth = 300;
//     const startX = (doc.page.width - tableWidth) / 2;
//     let rowY = doc.y;

//     const rows = [
//       ["Name", enquiry.fullName],
//       ["Mobile", enquiry.mobile],
//       ["Email", enquiry.email],
//       ["Enquiry Type", enquiry.enquiryType],
//       ["System Type", enquiry.systemType],
//       ["Capacity", enquiry.capacity],

//       ["Roof Type", enquiry.roofType || "-"],
//       ["Status", enquiry.status],
//     ];

//     rows.forEach(([label, value]) => {
//       doc.fontSize(11).text(label, startX, rowY, { width: 180 });
//       doc.text(value, startX + 200, rowY, { width: 200 });
//       rowY += 22;
//     });

//     doc.y = rowY + 20;

//     // ===== Declaration (Perfect Center) =====
//     doc.fontSize(13).text("Declaration", 50, doc.y, {
//       align: "center",
//       underline: true,
//       width: pageWidth,
//     });

//     doc.moveDown(0.8);

//     doc
//       .fontSize(11)
//       .text(
//         "I hereby declare that the above furnished enquiry details are true and correct to the best of my knowledge. I agree to proceed further based on the information provided in this document.",
//         50,
//         doc.y,
//         {
//           align: "center",
//           width: pageWidth,
//         },
//       );

//     doc.moveDown(2);

//     doc.end();
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: "PDF generation failed" });
//   }
// }

export async function downloadEnquiryPDF(req, res) {
  try {
    const { id } = req.params;
    const enquiry = await enquiryfromModel.findById(id);

    if (!enquiry) {
      return res.status(404).json({ msg: "Enquiry not found" });
    }

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=Solar_Enquiry.pdf",
    );

    doc.pipe(res);

    const pageWidth = doc.page.width - 100;

    // ✅ SAFE DATE HANDLING
    const appliedDate = enquiry.appliedDate
      ? new Date(enquiry.appliedDate).toDateString()
      : "N/A";

    const dueDate = enquiry.dueDate
      ? new Date(enquiry.dueDate).toDateString()
      : "N/A";

    // ===== Title =====
    doc.fontSize(18).text("Solar Enquiry Document", 50, 40, {
      align: "center",
      width: pageWidth,
    });

    doc.moveDown(2);

    const y = doc.y;

    doc.fontSize(11).text(`Order ID : ${enquiry._id}`, 50, y);
    doc.text(`Customer ID : ${enquiry.leadId}`, 50, y + 15);

    doc.text(`Applied Date : ${appliedDate}`, 350, y);
    doc.text(`Issue Date : ${dueDate}`, 350, y + 15);

    doc.moveDown(3);

    doc.fontSize(13).text("Enquiry Details", 50, doc.y, {
      align: "center",
      underline: true,
      width: pageWidth,
    });

    doc.moveDown(1);

    const tableWidth = 300;
    const startX = (doc.page.width - tableWidth) / 2;
    let rowY = doc.y;

    const rows = [
      ["Name", enquiry.fullName],
      ["Mobile", enquiry.mobile],
      ["Email", enquiry.email],
      ["Enquiry Type", enquiry.enquiryType],
      ["System Type", enquiry.systemType],
      ["Capacity", enquiry.capacity],
      ["Roof Type", enquiry.roofType || "-"],
      ["Status", enquiry.status || "-"],
    ];

    rows.forEach(([label, value]) => {
      doc.fontSize(11).text(label, startX, rowY, { width: 180 });
      doc.text(String(value), startX + 200, rowY, { width: 200 });
      rowY += 22;
    });

    doc.y = rowY + 20;

    doc.fontSize(13).text("Declaration", 50, doc.y, {
      align: "center",
      underline: true,
      width: pageWidth,
    });

    doc.moveDown(0.8);

    doc
      .fontSize(11)
      .text(
        "I hereby declare that the above furnished enquiry details are true and correct to the best of my knowledge.",
        50,
        doc.y,
        { align: "center", width: pageWidth },
      );

    doc.end(); // ✅ ONLY THIS
  } catch (err) {
    console.error("PDF Error:", err);
    if (!res.headersSent) {
      res.status(500).json({ msg: "PDF generation failed" });
    }
  }
}

export async function downloadInvoicePDF(req, res) {
  try {
    const { id } = req.params;

    const enquiry = await enquiryfromModel.findById(id);
    if (!enquiry) {
      return res.status(404).json({ msg: "Enquiry not found" });
    }

    if (!enquiry.amount) {
      return res.status(400).json({ msg: "Amount not set yet" });
    }

    const doc = new PDFDocument({
      size: "A4",
      margin: 50,
      layout: "portrait",
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Invoice-${enquiry._id.toString().slice(-6)}.pdf`,
    );

    doc.pipe(res);

    const pageWidth = doc.page.width - 100; // usable width
    const grayColor = "#4a4a4a";
    const lightGray = "#e0e0e0";
    const darkColor = "#1a1a1a";

    // ────────────────────────────────────────────────
    // Header + Wave background (simple curve)
    // ────────────────────────────────────────────────
    doc
      .save()
      .fillColor(lightGray)
      .moveTo(0, 0)
      .lineTo(doc.page.width, 0)
      .lineTo(doc.page.width, 120)
      .quadraticCurveTo(doc.page.width / 2, 180, 0, 120)
      .lineTo(0, 0)
      .fill()
      .restore();

    // Company Name & Tagline
    doc
      .fontSize(22)
      .fillColor(darkColor)
      .text("4M SOLAR SYSTEM", 50, 60, { align: "left" });

    doc
      .fontSize(10)
      .fillColor(grayColor)
      .text("Solar Solutions & Services | Chennai, Tamil Nadu", 50, 88);

    // Invoice Title & No + Date (right aligned)
    doc
      .fontSize(28)
      .fillColor(darkColor)
      .text("INVOICE", 400, 60, { align: "right", width: 140 });

    doc
      .fontSize(11)
      .fillColor(grayColor)
      .text(`NO. INV-${enquiry._id.toString().slice(-8)}`, 400, 100, {
        align: "right",
        width: 140,
      });

    doc
      .fontSize(11)
      .fillColor(grayColor)
      .text(`Date: ${new Date().toLocaleDateString("en-IN")}`, 400, 120, {
        align: "right",
        width: 140,
      });

    doc.moveDown(6); // space

    // ────────────────────────────────────────────────
    // Billed To  |  From
    // ────────────────────────────────────────────────
    const billY = doc.y;

    doc.fontSize(12).fillColor(darkColor).text("Billed to:", 50, billY);
    doc
      .fontSize(11)
      .fillColor(grayColor)
      .text(enquiry.fullName || "Customer Name", 50, billY + 20)
      .text(enquiry.address || "Customer Address", 50, billY + 36)
      .text(enquiry.mobile || "", 50, billY + 52)
      .text(enquiry.email || "", 50, billY + 68);

    doc.fontSize(12).fillColor(darkColor).text("From:", 350, billY);
    doc
      .fontSize(11)
      .fillColor(grayColor)
      .text("4M Solar System", 350, billY + 20)
      .text("Chennai, Tamil Nadu, India", 350, billY + 36)
      .text("contact@4msolar.com", 350, billY + 52)
      .text("+91 98765 43210", 350, billY + 68);

    doc.moveDown(5);

    // ────────────────────────────────────────────────
    // Items Table
    // ────────────────────────────────────────────────
    const tableTop = doc.y;
    const rowHeight = 30;

    // Header row
    doc
      .fillColor("#f0f0f0")
      .rect(50, tableTop - 5, pageWidth, rowHeight)
      .fill();

    doc
      .fontSize(11)
      .fillColor(darkColor)
      .text("Item", 60, tableTop + 8)
      .text("Quantity", 280, tableTop + 8)
      .text("Price", 380, tableTop + 8)
      .text("Amount", 480, tableTop + 8, { align: "right", width: 80 });

    doc
      .moveTo(50, tableTop + rowHeight - 5)
      .lineTo(50 + pageWidth, tableTop + rowHeight - 5)
      .lineWidth(1)
      .strokeColor(grayColor)
      .stroke();

    // One row (for now — later multiple items add pannalam)
    let currentY = tableTop + rowHeight + 10;

    const itemName = `Solar ${enquiry.systemType || "System"} - ${enquiry.capacity || "?"} kW`;

    doc
      .fontSize(11)
      .fillColor(darkColor)
      .text(itemName, 60, currentY)
      .text("1", 280, currentY)
      .text(`₹ ${enquiry.amount.toLocaleString("en-IN")}`, 380, currentY)
      .text(`₹ ${enquiry.amount.toLocaleString("en-IN")}`, 480, currentY, {
        align: "right",
        width: 80,
      });

    currentY += rowHeight;

    // Total line
    doc
      .moveTo(50, currentY + 10)
      .lineTo(50 + pageWidth, currentY + 10)
      .stroke();

    doc
      .fontSize(13)
      .fillColor(darkColor)
      .text("Total", 380, currentY + 25)
      .text(`₹ ${enquiry.amount.toLocaleString("en-IN")}`, 480, currentY + 25, {
        align: "right",
        width: 80,
      });

    // ────────────────────────────────────────────────
    // Footer Note + Payment
    // ────────────────────────────────────────────────
    doc.moveDown(8);

    doc
      .fontSize(11)
      .fillColor(grayColor)
      .text("Payment Method: Bank Transfer / UPI / Cash", 50, doc.y);

    doc.moveDown(1);

    doc
      .fontSize(11)
      .fillColor(grayColor)
      .text(
        "Note: Thank you for choosing 4M Solar System! Please make the payment within 7 days.",
        50,
        doc.y,
        {
          width: pageWidth,
          align: "left",
        },
      );

    doc.end();
  } catch (err) {
    console.error("Invoice PDF Error:", err);
    if (!res.headersSent) {
      res.status(500).json({ msg: "Invoice download failed" });
    }
  }
}

export async function downloadAgreementPDF(req, res) {
  try {
    const { id } = req.params;
    const enquiry = await enquiryfromModel.findById(id);

    if (!enquiry) return res.status(404).json({ msg: "Enquiry not found" });
    if (!enquiry.amount)
      return res.status(400).json({ msg: "Agreement not ready yet" });

    const doc = new PDFDocument({ margin: 50, size: "A4" });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Agreement-${enquiry._id.toString().slice(-8)}.pdf`,
    );

    doc.pipe(res);

    const pageWidth = doc.page.width - 100;
    const grayColor = "#4a4a4a";
    const lightGray = "#e0e0e0";
    const darkColor = "#1a1a1a";

    // Exact same wave background as your warranty PDF
    doc
      .save()
      .fillColor(lightGray)
      .moveTo(0, 0)
      .lineTo(doc.page.width, 0)
      .lineTo(doc.page.width, 120)
      .quadraticCurveTo(doc.page.width / 2, 180, 0, 120)
      .lineTo(0, 0)
      .fill()
      .restore();

    // Company name left side (exact match)
    doc.fontSize(22).fillColor(darkColor).text("4M SOLAR SYSTEM", 50, 60);

    doc
      .fontSize(10)
      .fillColor(grayColor)
      .text("Solar Solutions & Services | Chennai, Tamil Nadu", 50, 88);

    // Title right-aligned (same positioning & size as WARRANTY CERTIFICATE)
    doc.fontSize(23).fillColor(darkColor).text("AGREEMENT", 400, 60, {
      align: "right",
      width: 180, // right side gap create pannum
    });
    doc
      .fontSize(11)
      .fillColor(grayColor)
      .text(`AGR. NO. ${enquiry._id.toString().slice(-8)}`, 400, 100, {
        align: "right",
        width: 140,
      });

    doc
      .fontSize(11)
      .fillColor(grayColor)
      .text(
        `Date: ${new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" })}`,
        400,
        120,
        { align: "right", width: 140 },
      );

    doc.moveDown(6);

    // "This is to certify that:" style intro (exact alignment)
    const introY = doc.y;
    doc
      .fontSize(12)
      .fillColor(darkColor)
      .text("This agreement is made between:", 50, introY);

    // Customer details (left side, same spacing as warranty)
    doc
      .fontSize(11)
      .fillColor(grayColor)
      .text(`Customer: ${enquiry.fullName || "—"}`, 50, introY + 40)
      .text(`Address: ${enquiry.address || "—"}`, 50, introY + 60)
      .text(`Mobile: ${enquiry.mobile || "—"}`, 50, introY + 80)
      .text(`Email: ${enquiry.email || "—"}`, 50, introY + 100);

    // Service Provider (right side, to match two-party feel)
    doc
      .fontSize(11)
      .fillColor(grayColor)
      .text("Service Provider:", 300, introY + 40)
      .text("4M Solar System", 300, introY + 60)
      .text("Chennai, Tamil Nadu, India", 300, introY + 80)
      .text("contact@4msolar.com", 300, introY + 100);

    doc.moveDown(5);

    // Agreement Details section (underlined heading like Warranty Terms)
    doc
      .fontSize(12)
      .fillColor(darkColor)
      .text("Agreement Details", 50, doc.y, { underline: true });
    doc.moveDown(1);

    doc
      .fontSize(11)
      .fillColor(darkColor)
      .text(
        `• Project: Installation of ${enquiry.systemType || "Solar System"} - ${enquiry.capacity || "?"} kW`,
        50,
        doc.y,
        { lineGap: 4 },
      )
      .text(
        `• Total Value: ₹ ${enquiry.amount?.toLocaleString("en-IN") || "TBD"}`,
        50,
        doc.y + 25,
        { lineGap: 4 },
      )
      .text(
        "• Scope: Design, supply, installation, testing & commissioning of the solar system",
        50,
        doc.y + 50,
        { width: pageWidth, lineGap: 6 },
      )
      .text(
        "• Payment Terms: 50% advance, 40% on material delivery, 10% after commissioning",
        50,
        doc.y + 80,
        { width: pageWidth, lineGap: 6 },
      )
      .text(
        "• Validity: This agreement is valid upon signing and advance payment",
        50,
        doc.y + 110,
        { width: pageWidth, lineGap: 6 },
      );

    doc.moveDown(5);

    // Closing note (same style as warranty disclaimer)
    doc
      .fontSize(11)
      .fillColor(grayColor)
      .text(
        "This document serves as confirmation of mutual agreement between the parties. " +
          "Full terms and conditions will be provided separately if required. " +
          "Thank you for choosing 4M Solar System!",
        50,
        doc.y,
        { width: pageWidth, lineGap: 6 },
      );

    // Signature lines at bottom (two lines like warranty)
    doc.moveDown(8);
    doc
      .fontSize(11)
      .fillColor(darkColor)
      .text(
        "Customer Signature: ___________________________   Date: _______________",
        50,
        doc.y,
      )
      .text(
        "Authorized Signatory (4M Solar): ___________________________   Date: _______________",
        50,
        doc.y + 40,
      );

    doc.end();
  } catch (err) {
    console.error("Agreement PDF Error:", err);
    if (!res.headersSent)
      res.status(500).json({ msg: "Failed to generate agreement PDF" });
  }
}
export async function downloadWarrantyPDF(req, res) {
  try {
    const { id } = req.params;
    const enquiry = await enquiryfromModel.findById(id);

    if (!enquiry) return res.status(404).json({ msg: "Enquiry not found" });
    if (!enquiry.amount)
      return res.status(400).json({ msg: "Warranty not issued yet" });

    const doc = new PDFDocument({ margin: 50, size: "A4" });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Warranty-${enquiry._id.toString().slice(-8)}.pdf`,
    );

    doc.pipe(res);

    const pageWidth = doc.page.width - 100;
    const grayColor = "#4a4a4a";
    const lightGray = "#e0e0e0";
    const darkColor = "#1a1a1a";

    // Same wave background
    doc
      .save()
      .fillColor(lightGray)
      .moveTo(0, 0)
      .lineTo(doc.page.width, 0)
      .lineTo(doc.page.width, 120)
      .quadraticCurveTo(doc.page.width / 2, 180, 0, 120)
      .lineTo(0, 0)
      .fill()
      .restore();

    // Header - WARRANTY CERTIFICATE (big & right aligned like invoice)

    doc
      .fontSize(13)
      .fillColor(darkColor)
      .text("WARRANTY CERTIFICATE", 400, 60, {
        align: "right",
        width: 180, // right side gap create pannum
      });

    doc
      .fontSize(11)
      .fillColor(grayColor)
      .text(`CERT. NO. WAR-${enquiry._id.toString().slice(-8)}`, 400, 100, {
        align: "right",
        width: 140,
      });

    doc
      .fontSize(11)
      .fillColor(grayColor)
      .text(`Issue Date: ${new Date().toLocaleDateString("en-IN")}`, 400, 120, {
        align: "right",
        width: 140,
      });

    // Company branding left
    doc.fontSize(22).fillColor(darkColor).text("4M SOLAR SYSTEM", 50, 60);

    doc
      .fontSize(10)
      .fillColor(grayColor)
      .text("Solar Solutions & Services | Chennai, Tamil Nadu", 50, 88);

    doc.moveDown(6);

    // Certificate content (clean sections)
    const certY = doc.y;

    doc
      .fontSize(12)
      .fillColor(darkColor)
      .text("This is to certify that:", 50, certY);

    doc
      .fontSize(11)
      .fillColor(grayColor)
      .text(`Customer: ${enquiry.fullName || "—"}`, 50, certY + 30)
      .text(`Address: ${enquiry.address || "—"}`, 50, certY + 50)
      .text(
        `System: ${enquiry.systemType || "Solar Power System"} - ${enquiry.capacity || "?"} kW`,
        50,
        certY + 80,
      );

    doc.moveDown(4);

    doc
      .fontSize(13)
      .fillColor(darkColor)
      .text("Warranty Terms", 50, doc.y, { underline: true });
    doc.moveDown(1);

    doc
      .fontSize(11)
      .fillColor(darkColor)
      .text(
        "• Solar Panels: 25 years performance warranty (as per manufacturer)\n" +
          "• Inverter & Other Components: 5–10 years (make/model specific)\n" +
          "• Workmanship & Installation: 5 years from date of commissioning\n\n" +
          "This certificate is issued subject to proper usage, maintenance, and no unauthorized modifications.",
        50,
        doc.y,
        { width: pageWidth, lineGap: 6 },
      );

    // Authorized signatory
    doc.moveDown(8);
    doc
      .fontSize(11)
      .fillColor(darkColor)
      .text("Authorized Signatory", 350, doc.y)
      .text("___________________________", 350, doc.y + 20)
      .text("4M Solar System", 350, doc.y + 40);

    doc.end();
  } catch (err) {
    console.error("Warranty PDF Error:", err);
    if (!res.headersSent) res.status(500).json({ msg: "Failed" });
  }
}
