import jwt from "jsonwebtoken";
import Employee from "../model/employeeModel.js";

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
