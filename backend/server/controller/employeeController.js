import Employee from "../model/employeeModel.js";
import jwt from "jsonwebtoken";

export const employeeLogin = async (req, res) => {
  const { emailOrPhone, password } = req.body;

  try {
    const employee = await Employee.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    });

    if (!employee)
      return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await employee.matchPassword(password);

    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: employee._id, role: employee.role },
      process.env.JWT_SECRET,
    );

    res.status(200).json({
      message: "Login successful",
      token,
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
