import complaintmodel from "../model/complaintModel.js";

export const createServiceRequest = async (req, res) => {
  try {
    const { customerId, complaintType, priority, description, images } =
      req.body;

    if (!customerId || !complaintType || !description) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    const newRequest = new complaintmodel({
      customerId,
      complaintType,
      priority,
      description,
    });

    await newRequest.save();

    res.status(201).json({
      success: true,
      message: "Complaint raised successfully",
      data: newRequest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// export const getAllServiceRequests = async (req, res) => {
//   try {
//     const requests = await complaintmodel.find().sort({ createdAt: -1 }); // latest first (optional)

//     res.status(200).json({
//       success: true,
//       count: requests.length,
//       data: requests,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

export const getAllServiceRequests = async (req, res) => {
  try {
    const requests = await complaintmodel
      .find()
      .populate("customerId", "name phone email leadId");

    res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (err) {
    console.error("Get Service Requests Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
