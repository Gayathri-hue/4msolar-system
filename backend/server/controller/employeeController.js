import Employee from "../model/employeeModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import enquiryfromModel from "../model/enquiryfromModel.js";

export const employeeLogin = async (req, res) => {
  const { emailOrPhone, password } = req.body;

  try {
    const employee = await Employee.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone.toString() }],
    });

    if (!employee)
      return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, employee.password);

    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: employee._id, role: employee.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.status(200).json({
      message: "Login successful",
      token,
      employee: employee,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET My Leads (Employee)
export const getMyLeads = async (req, res) => {
  try {
    const employeeId = req.user.id;

    const leads = await enquiryfromModel.find({
      assignedEmployee: employeeId,
    });

    res.json(leads);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};
