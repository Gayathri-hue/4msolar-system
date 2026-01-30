import ExcelJS from "exceljs";
import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "enquiries.xlsx"); // change back when testing done

export async function saveEnquiryToExcel(enquiry) {
  const workbook = new ExcelJS.Workbook();
  const SHEET_NAME = "Enquiries";

  let worksheet;

  try {
    // 1. Check if file exists
    const fileExists = await fs
      .access(filePath)
      .then(() => true)
      .catch(() => false);

    if (fileExists) {
      // Read existing file
      await workbook.xlsx.readFile(filePath);
      worksheet = workbook.getWorksheet(SHEET_NAME);

      if (!worksheet) {
        worksheet = workbook.addWorksheet(SHEET_NAME);
        addHeaders(worksheet);
      }
    } else {
      // Brand new file
      worksheet = workbook.addWorksheet(SHEET_NAME);
      addHeaders(worksheet);
    }

    // 2. Prepare clean row data
    const rowData = [
      enquiry.customer?.toString() || "",
      enquiry._id?.toString() || "",
      enquiry.fullName || "",
      enquiry.mobile || "",
      enquiry.email || "",
      enquiry.address || "",
      enquiry.enquiryType || "",
      enquiry.productType || "",
      enquiry.systemType || "",
      enquiry.category || "",
      enquiry.capacity || "",
      enquiry.ebServiceNo || "",
      enquiry.roofType || "",
      enquiry.roofArea || "",
      enquiry.issueDescription || "",
      enquiry.image || "",
      enquiry.preferredTime || "",
      enquiry.preferredDateTime
        ? new Date(enquiry.preferredDateTime).toISOString()
        : "",
      enquiry.message || "",
      enquiry.siteVisit ? "Yes" : "No",
      enquiry.siteVisitDateTime
        ? new Date(enquiry.siteVisitDateTime).toISOString()
        : "",
      enquiry.googleLocation || "",
      enquiry.status || "Assigned",
      enquiry.assignedEmployee?.toString() || "",
      enquiry.dueDate ? new Date(enquiry.dueDate).toISOString() : "",
      enquiry.appliedDate ? new Date(enquiry.appliedDate).toISOString() : "",
      enquiry.createdAt ? new Date(enquiry.createdAt).toISOString() : "",
      enquiry.updatedAt ? new Date(enquiry.updatedAt).toISOString() : "",
    ];

    // 3. Add the row (using array → more reliable)
    const newRow = worksheet.addRow(rowData);

    // 4. Optional: make new row visible / style if needed
    // newRow.commit();   // usually not needed anymore in recent ExcelJS

    // 5. Auto-fit AFTER adding the row
    worksheet.columns.forEach((col, idx) => {
      let maxLength = 0;
      // Check header + data
      const headerLength = col.header ? col.header.toString().length : 0;
      maxLength = Math.max(maxLength, headerLength);

      worksheet.eachRow({ includeEmpty: false }, (row) => {
        const val = row.getCell(idx + 1).value;
        const len = val ? val.toString().length : 0;
        if (len > maxLength) maxLength = len;
      });

      col.width = Math.min(Math.max(maxLength + 3, 12), 70);
    });

    // 6. Save
    await workbook.xlsx.writeFile(filePath);

    console.log(
      `Enquiry ${enquiry._id} saved → total rows: ${worksheet.rowCount}`,
    );
  } catch (err) {
    console.error("Excel write failed:", err.message);
    throw err;
  }
}

function addHeaders(worksheet) {
  const headers = [
    "Customer ID",
    "Order ID",
    "Full Name",
    "Mobile",
    "Email",
    "Address",
    "Enquiry Type",
    "Product Type",
    "System Type",
    "Category",
    "Capacity",
    "EB Service No",
    "Roof Type",
    "Roof Area",
    "Issue Description",
    "Image",
    "Preferred Time",
    "Preferred DateTime",
    "Message",
    "Site Visit",
    "Site Visit DateTime",
    "Google Location",
    "Status",
    "Assigned Employee",
    "Due Date",
    "Applied Date",
    "Created At",
    "Updated At",
  ];

  const headerRow = worksheet.addRow(headers);
  headerRow.font = { bold: true };
  headerRow.commit();

  // Set column keys & initial widths
  worksheet.columns = headers.map((h, i) => ({
    header: h,
    key: h.toLowerCase().replace(/\s+/g, ""),
    width: 15,
  }));

  worksheet.views = [{ state: "frozen", ySplit: 1 }];
}
