import enquiryfromModel from "../model/enquiryfromModel.js";

// CREATE new enquiry
export async function createEnquiry(req, res) {
  try {
    const data = req.body;

    // Use req.user.id if available, otherwise use data.customer
    const customerId = req.user?.id || data.customer;

    if (!customerId) {
      return res.status(400).json({ msg: "Customer ID is required" });
    }

    const enquiryDetails = {
      customer: customerId,
      fullName: data.fullName,
      mobile: data.mobile,
      email: data.email,
      address: data.address,
      enquiryType: data.enquiryType,
      systemType: data.systemType,
      capacity: data.capacity,
      monthlyEBBill: data.monthlyEBBill,
      roofType: data.roofType,
      roofArea: data.roofArea,
      issueDescription: data.issueDescription,
      preferredTime: data.preferredTime,
      message: data.message,
      appliedDate: data.appliedDate || Date.now(),

      // Referral info
      referral: data.referral || { type: "Other", name: "" },
    };

    const enquiry = await enquiryfromModel.create(enquiryDetails);

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

// GET customer by ID// GET all enquiries by customer ID

// GET enquiries by customer ID
export async function getEnquiriesByCustomerId(req, res) {
  try {
    const { customerId } = req.params;

    const enquiries = await enquiryfromModel.find({ customer: customerId });

    if (!enquiries || enquiries.length === 0) {
      return res
        .status(404)
        .json({ msg: "No enquiries found for this customer" });
    }

    res.json(enquiries);
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
