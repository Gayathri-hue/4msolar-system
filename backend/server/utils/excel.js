import ExcelJS from "exceljs";
import fs from "fs";

export async function saveEnquiryToExcel(enquiry) {
  const filePath = `enquiries_${new Date().toISOString().slice(0, 10)}.xlsx`;

  const workbook = new ExcelJS.Workbook();
  let worksheet;

  if (fs.existsSync(filePath)) {
    await workbook.xlsx.readFile(filePath);
    worksheet = workbook.getWorksheet("Enquiries");

    if (!worksheet) {
      worksheet = workbook.addWorksheet("Enquiries");
      worksheet.columns = [
        { header: "Customer ID", key: "customer" },
        { header: "Order ID", key: "id" },
        { header: "Full Name", key: "fullName" },
        { header: "Mobile", key: "mobile" },
        { header: "Email", key: "email" },
        { header: "Enquiry Type", key: "enquiryType" },
        { header: "System Type", key: "systemType" },
        { header: "Capacity", key: "capacity" },
        { header: "Address", key: "address" },
        { header: "Status", key: "status" },
        { header: "Applied Date", key: "appliedDate" },
      ];
    }
  } else {
    worksheet = workbook.addWorksheet("Enquiries");
    worksheet.columns = [
      { header: "Customer ID", key: "customer" },
      { header: "Order ID", key: "id" },

      { header: "Full Name", key: "fullName" },
      { header: "Mobile", key: "mobile" },
      { header: "Email", key: "email" },
      { header: "Enquiry Type", key: "enquiryType" },
      { header: "System Type", key: "systemType" },
      { header: "Capacity", key: "capacity" },
      { header: "Address", key: "address" },
      { header: "Status", key: "status" },
      { header: "Applied Date", key: "appliedDate" },
    ];
  }

  worksheet.addRow({
    customer: enquiry.customer,
    id: enquiry._id,
    fullName: enquiry.fullName,
    mobile: enquiry.mobile,
    email: enquiry.email,
    enquiryType: enquiry.enquiryType,
    systemType: enquiry.systemType,
    capacity: enquiry.capacity,
    address: enquiry.address,
    status: enquiry.status,
    appliedDate: enquiry.appliedDate,
  });

  await workbook.xlsx.writeFile(filePath);
}
