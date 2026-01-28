import Employee from "../model/employeeModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import enquiryfromModel from "../model/enquiryfromModel.js";
import nodemailer from "nodemailer";

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

export const resendOtpEmployee = async (req, res) => {
  try {
    const email = req.body.email.trim().toLowerCase();

    const user = await Employee.findOne({ email });
    if (!user) return res.status(404).json({ msg: "Employee not found" });

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.resetOTP = otp;
    user.resetOTPExpire = Date.now() + 5 * 60 * 1000;
    await user.save();

    console.log("OTP saved for:", user.email);
    console.log("OTP:", otp);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "pgayathri488@gmail.com",
        pass: "cxlv njul ayqt ytwv",
      },
    });

    await transporter.sendMail({
      from: "pgayathri488@gmail.com",
      to: email,
      subject: "OTP for Password Reset",
      text: `Your OTP is ${otp}. Valid for 5 minutes.`,
    });

    res.status(200).json({
      msg: "OTP sent successfully",
      otp: otp, // frontend la view panna
    });
  } catch (error) {
    console.error("OTP Error:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

export const resetPasswordWithOtpEmployee = async (req, res) => {
  try {
    const email = req.body.email.trim().toLowerCase();
    const { otp, newPassword } = req.body;

    const user = await Employee.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    console.log("Entered OTP:", otp);
    console.log("Stored OTP:", user.resetOTP);

    if (!user.resetOTP || !user.resetOTPExpire) {
      return res.status(400).json({ msg: "No OTP generated. Resend OTP." });
    }

    if (String(user.resetOTP).trim() !== String(otp).trim()) {
      return res.status(400).json({ msg: "Invalid OTP" });
    }

    if (user.resetOTPExpire < Date.now()) {
      return res.status(400).json({ msg: "OTP expired" });
    }

    // ────────────────────────────────────────────────
    // மிக முக்கிய fix இங்க தான்
    // pre-save hook-ஐ trigger பண்ணாம direct update பண்ணுறோம்
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword.trim(), salt);

    await Employee.updateOne(
      { email: email },
      {
        $set: {
          password: hashedPassword,
          resetOTP: null,
          resetOTPExpire: null,
        },
      },
    );

    console.log(`Password reset success for ${email}`);

    return res.status(200).json({ msg: "Password reset successful" });
  } catch (err) {
    console.error("Reset error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
};
