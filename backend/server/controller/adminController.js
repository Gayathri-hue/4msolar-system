import jwt from "jsonwebtoken";
import Employee from "../model/employeeModel.js";
import enquiryfromModel from "../model/enquiryfromModel.js";

export const adminLogin = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and Password required" });
  }

  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    // Generate JWT Token (optional but recommended)
    const token = jwt.sign({ role: "admin", email }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.status(200).json({
      message: "Admin login successful",
      token,
      role: "admin",
      email,
    });
  }

  return res.status(401).json({ message: "Invalid credentials" });
};

export const createEmployee = async (req, res) => {
  try {
    const { name, employeeId, dob, branch, location, email, phone, password } =
      req.body;

    // Check if email or phone already exist
    const exist = await Employee.findOne({
      $or: [{ email }, { phone }, { employeeId }],
    });
    if (exist)
      return res
        .status(400)
        .json({ message: "Employee email/phone/ID already exists" });

    const employee = new Employee({
      name,
      employeeId,
      dob,
      branch,
      location,
      email,
      phone,
      password,
    });

    await employee.save();

    res.status(201).json({
      message: "Employee created successfully",
      employee: {
        _id: employee._id,
        name: employee.name,
        email: employee.email,
        phone: employee.phone,
        employeeId: employee.employeeId,
        branch: employee.branch,
        location: employee.location,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllEmployees = async (req, res) => {
  const employees = await Employee.find().select("-password");
  res.json(employees);
};

export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, employeeId, dob, branch, location, email, phone, status } =
      req.body;

    const employee = await Employee.findByIdAndUpdate(
      id,
      {
        name,
        employeeId,
        dob,
        branch,
        location,
        email,
        phone,
      },
      { new: true },
    ).select("-password");

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json({
      message: "Employee updated successfully",
      employee,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findByIdAndDelete(id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

//employee count
export const getEmployeeCount = async (req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments();
    res.status(200).json({ totalEmployees });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getEmployeeWorkSummary = async (req, res) => {
  try {
    const data = await Employee.aggregate([
      {
        $lookup: {
          from: "enquiryforms",
          localField: "_id",
          foreignField: "assignedEmployee",
          as: "works",
        },
      },
      {
        $project: {
          name: 1,
          employeeId: 1,
          phone: 1,
          email: 1,
          totalWorks: { $size: "$works" },
          completed: {
            $size: {
              $filter: {
                input: "$works",
                as: "w",
                cond: { $eq: ["$$w.status", "Completed"] },
              },
            },
          },
          pending: {
            $size: {
              $filter: {
                input: "$works",
                as: "w",
                cond: { $ne: ["$$w.status", "Completed"] },
              },
            },
          },
        },
      },
    ]);

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
};

// // export const assignEmployeeByAdmin = async (req, res) => {
// //   try {
// //     const { enquiryId, employeeId, dueDate } = req.body;

// //     const enquiry = await enquiryfromModel.findById(enquiryId);
// //     if (!enquiry) return res.status(404).json({ msg: "Enquiry not found" });

// //     enquiry.assignedEmployee = employeeId;
// //     enquiry.dueDate = dueDate;
// //     enquiry.status = "Assigned";

// //     await enquiry.save();

// //     res.json({ msg: "Employee assigned successfully" });
// //   } catch (err) {
// //     res.status(500).json({ msg: "Server Error" });
// //   }
// // };

// export const assignEmployeeByAdmin = async (req, res) => {
//   try {
//     const { enquiryId, employeeId, dueDate } = req.body;

//     const enquiry = await enquiryfromModel.findById(enquiryId);
//     if (!enquiry) return res.status(404).json({ msg: "Enquiry not found" });

//     // ✅ Already assigned check
//     if (enquiry.assignedEmployee) {
//       return res
//         .status(400)
//         .json({ msg: "This enquiry is already assigned to an employee" });
//     }

//     enquiry.assignedEmployee = employeeId;
//     enquiry.dueDate = dueDate;
//     enquiry.status = "Assigned";

//     await enquiry.save();

//     res.json({ msg: "Employee assigned successfully" });
//   } catch (err) {
//     res.status(500).json({ msg: "Server Error" });
//   }
// };

export const setEnquiryAmount = async (req, res) => {
  try {
    const { enquiryId, amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ msg: "Valid amount required" });
    }

    const enquiry = await enquiryfromModel.findById(enquiryId);
    if (!enquiry) {
      return res.status(404).json({ msg: "Enquiry not found" });
    }

    enquiry.amount = amount;
    enquiry.quotationStatus = "AMOUNT_SET";

    await enquiry.save();

    res.json({
      msg: "Amount set successfully",
      enquiry,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
};

export const assignOrReassignEmployeeByAdmin = async (req, res) => {
  try {
    const { enquiryId, employeeId, dueDate } = req.body;

    const enquiry = await enquiryfromModel.findById(enquiryId);
    if (!enquiry) return res.status(404).json({ msg: "Enquiry not found" });

    const oldEmployeeId = enquiry.assignedEmployee;

    enquiry.assignedEmployee = employeeId;
    enquiry.dueDate = dueDate || enquiry.dueDate;
    enquiry.status = "Assigned";

    await enquiry.save();

    const msg = oldEmployeeId
      ? `Enquiry reassigned from employee ${oldEmployeeId} to ${employeeId}`
      : "Employee assigned successfully";

    res.json({ msg, enquiry });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};
