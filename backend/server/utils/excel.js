import ExcelJS from "exceljs";
import fs from "fs";

export async function saveEnquiryToExcel(enquiry) {
  const filePath = `enquiries_${new Date().toISOString().slice(0, 10)}.xlsx`;

  const workbook = new ExcelJS.Workbook();
  let worksheet;

  const columns = [
    { header: "Customer ID", key: "customer" },
    { header: "Order ID", key: "id" },
    { header: "Full Name", key: "fullName" },
    { header: "Mobile", key: "mobile" },
    { header: "Email", key: "email" },
    { header: "Address", key: "address" },

    { header: "Enquiry Type", key: "enquiryType" },
    { header: "Product Type", key: "productType" },
    { header: "System Type", key: "systemType" },
    { header: "Category", key: "category" },
    { header: "Capacity", key: "capacity" },
    { header: "EB Service No", key: "ebServiceNo" },

    { header: "Roof Type", key: "roofType" },
    { header: "Roof Area", key: "roofArea" },

    { header: "Issue Description", key: "issueDescription" },
    { header: "Image", key: "image" },

    { header: "Preferred Time", key: "preferredTime" },
    { header: "Preferred DateTime", key: "preferredDateTime" },

    { header: "Message", key: "message" },
    { header: "Site Visit", key: "siteVisit" },
    { header: "Site Visit DateTime", key: "siteVisitDateTime" },

    { header: "Google Location", key: "googleLocation" },

    { header: "Status", key: "status" },
    { header: "Assigned Employee", key: "assignedEmployee" },
    { header: "Due Date", key: "dueDate" },

    { header: "Applied Date", key: "appliedDate" },
    { header: "Created At", key: "createdAt" },
    { header: "Updated At", key: "updatedAt" },
  ];

  if (fs.existsSync(filePath)) {
    await workbook.xlsx.readFile(filePath);
    worksheet = workbook.getWorksheet("Enquiries");

    if (!worksheet) {
      worksheet = workbook.addWorksheet("Enquiries");
      worksheet.columns = columns;
    }
  } else {
    worksheet = workbook.addWorksheet("Enquiries");
    worksheet.columns = columns;
  }

  worksheet.addRow({
    customer: enquiry.customer,
    id: enquiry._id,
    fullName: enquiry.fullName,
    mobile: enquiry.mobile,
    email: enquiry.email,
    address: enquiry.address,

    enquiryType: enquiry.enquiryType,
    productType: enquiry.productType,
    systemType: enquiry.systemType,
    category: enquiry.category,
    capacity: enquiry.capacity,
    ebServiceNo: enquiry.ebServiceNo,

    roofType: enquiry.roofType,
    roofArea: enquiry.roofArea,

    issueDescription: enquiry.issueDescription,
    image: enquiry.image,

    preferredTime: enquiry.preferredTime,
    preferredDateTime: enquiry.preferredDateTime,

    message: enquiry.message,
    siteVisit: enquiry.siteVisit ? "Yes" : "No",
    siteVisitDateTime: enquiry.siteVisitDateTime,

    googleLocation: enquiry.googleLocation,

    status: enquiry.status,
    assignedEmployee: enquiry.assignedEmployee,
    dueDate: enquiry.dueDate,

    appliedDate: enquiry.appliedDate,
    createdAt: enquiry.createdAt,
    updatedAt: enquiry.updatedAt,
  });

  await workbook.xlsx.writeFile(filePath);
}
