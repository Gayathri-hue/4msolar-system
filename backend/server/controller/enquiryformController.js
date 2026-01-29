import enquiryfromModel from "../model/enquiryfromModel.js";
import Employee from "../model/employeeModel.js";
import mongoose from "mongoose";
import PDFDocument from "pdfkit";
import fs from "fs";

import { saveEnquiryToExcel } from "../utils/excel.js";

// CREATE new enquiry
export async function createEnquiry(req, res) {
  try {
    const data = req.body;

    // Use req.user.id if available, otherwise use data.customer
    const customerId = req.user?.id || data.customer;

    if (!customerId) {
      return res.status(400).json({ msg: "Customer ID is required" });
    }

    const employees = await Employee.find({ status: "active" }).sort({
      createdAt: 1,
    });

    if (!employees.length) {
      return res.status(400).json({ msg: "No employees available" });
    }

    // Total enquiries count
    const enquiryCount = await enquiryfromModel.countDocuments();

    // Round robin index
    const assignedIndex = enquiryCount % employees.length;
    const assignedEmployee = employees[assignedIndex];

    // 5 days deadline
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 5);
    let imageUrl = null;
    if (req.file) {
      // localhost URL
      imageUrl = `http://localhost:8000/uploads/${req.file.filename}`;
    }

    const enquiryDetails = {
      customer: customerId,
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

      assignedEmployee: assignedEmployee._id,

      dueDate: dueDate,
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

// GET all enquiries
export async function getAllEnquiries(req, res) {
  try {
    const enquiries = await enquiryfromModel.find();
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
export async function downloadEnquiryPDF(req, res) {
  try {
    const { id } = req.params;
    const enquiry = await enquiryfromModel.findById(id);
    if (!enquiry) return res.status(404).json({ msg: "Enquiry not found" });

    const doc = new PDFDocument({ margin: 50 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=Solar_Enquiry.pdf",
    );
    doc.pipe(res);

    const pageWidth = doc.page.width - 100; // usable width

    // ===== Title =====
    doc.fontSize(18).text("Solar Enquiry Document", 50, 40, {
      align: "center",
      width: pageWidth,
    });

    doc.moveDown(2);

    // ===== Top Left & Right =====
    const y = doc.y;

    doc.fontSize(11).text(`Order ID : ${enquiry._id}`, 50, y);
    doc.text(`Customer ID : ${enquiry.customer}`, 50, y + 15);

    doc.text(`Applied Date : ${enquiry.appliedDate.toDateString()}`, 350, y);
    doc.text(`Issue Date : ${enquiry.dueDate.toDateString()}`, 350, y + 15);

    doc.moveDown(3);

    // ===== Enquiry Details Heading (Center) =====
    doc.fontSize(13).text("Enquiry Details", 50, doc.y, {
      align: "center",
      underline: true,
      width: pageWidth,
    });

    doc.moveDown(1);

    // ===== Centered 2-Column Table =====
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
      ["Status", enquiry.status],
    ];

    rows.forEach(([label, value]) => {
      doc.fontSize(11).text(label, startX, rowY, { width: 180 });
      doc.text(value, startX + 200, rowY, { width: 200 });
      rowY += 22;
    });

    doc.y = rowY + 20;

    // ===== Declaration (Perfect Center) =====
    doc.fontSize(13).text("Declaration", 50, doc.y, {
      align: "center",
      underline: true,
      width: pageWidth,
    });

    doc.moveDown(0.8);

    doc
      .fontSize(11)
      .text(
        "I hereby declare that the above furnished enquiry details are true and correct to the best of my knowledge. I agree to proceed further based on the information provided in this document.",
        50,
        doc.y,
        {
          align: "center",
          width: pageWidth,
        },
      );

    doc.moveDown(2);

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "PDF generation failed" });
  }
}
