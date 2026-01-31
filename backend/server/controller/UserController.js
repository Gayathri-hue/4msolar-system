import User from "../model/UserModel.js";
import bcrypt from "bcryptjs";
import Counter from "../model/CounterModel.js";
import xlsx from "xlsx";
// import Employee from "../model/employeeModel.js";
import nodemailer from "nodemailer";
import { promises as fs } from "fs";

import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      dob,
      phone,
      role,
      referrer,
      referrerDetails,
    } = req.body; // include dob and phone

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }
    // Check if phone already exists
    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({ msg: "Phone number already exists" });
    }

    // 🔥 AUTO INCREMENT
    const counter = await Counter.findOneAndUpdate(
      { name: "leadId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true },
    );

    const leadId = `4MSolarLead${String(counter.seq).padStart(2, "0")}`;

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // const employees = await Employee.find();
    // const assignedEmployee =
    //   employees[Math.floor(Math.random() * employees.length)];
    // Create new user
    const newUser = new User({
      leadId,
      name,
      email,
      dob, // <<< add this
      phone,
      referrer,
      referrerDetails,
      password: hashedPassword,
      role: "user",
      // assignedTo: assignedEmployee._id,
    });

    await newUser.save();

    res.status(201).json({
      msg: "User registered successfully",
      leadId,
      user: newUser, // <--- this contains name, email, dob, phone, referrer, referrerDetails, _id, etc.
    });
  } catch (err) {
    console.error("Register Error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    res.json({
      token,
      user: {
        id: user._id,
        leadId: user.leadId,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// Get users registered per month or per day
export const getUserStats = async (req, res) => {
  try {
    // Aggregation: Group by month for this year
    const stats = await User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().getFullYear(), 0, 1), // From Jan 1 this year
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" }, // Group by month
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Total customers
export const getCustomerCount = async (req, res) => {
  try {
    const totalCustomers = await User.countDocuments(); // no filter
    res.status(200).json({ totalCustomers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // password hide panna
    res.status(200).json(users);
  } catch (err) {
    console.error("Get All Users Error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Save OTP and expiry
    user.resetOTP = otp;
    user.resetOTPExpire = Date.now() + 5 * 60 * 1000; // 5 minutes
    await user.save();

    // Log OTP in backend terminal
    console.log(`Resent OTP for ${email}: ${otp}`);

    // Configure nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "pgayathri488@gmail.com",
        pass: "cxlv njul ayqt ytwv", // Use app password
      },
    });

    // Send OTP via email
    await transporter.sendMail({
      from: "pgayathri488@gmail.com",
      to: email,
      subject: "Resent OTP for Password Reset",
      text: `Your new OTP is ${otp}. Valid for 5 minutes.`,
    });

    res.json({ msg: "OTP resent successfully" });
  } catch (error) {
    console.error("Error in resendOtp:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

export const resetPasswordWithOtp = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (user.resetOTP != otp || user.resetOTPExpire < Date.now()) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    user.resetOTP = null;
    user.resetOTPExpire = null;
    await user.save();

    res.json({ msg: "Password reset successful" });
  } catch (err) {
    console.error("Error in resetPasswordWithOtp:", err);
    res.status(500).json({ msg: "Server error" });
  }
};
// UserController.js
export const uploadUsersFromExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "No Excel file uploaded" });
    }

    // Multer-ஆ upload ஆன file-ஐ படி
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json(sheet);

    let success = 0;
    let failed = [];

    for (let row of rows) {
      // column names case-sensitive ஆக இருக்கலாம் → lowercase ஆக்கி எடு (safe)
      const data = {
        name: row.name || row.Name || "",
        email: row.email || row.Email || "",
        phone: String(row.phone || row.Phone || ""),
        dob: row.dob || row.DOB || row.dateOfBirth || "",
        password: row.password || row.Password || "",
        referrer: row.referrer || row.Referrer || "Other",
        referrerDetails: row.referrerDetails || row.ReferrerDetails || "",
      };

      if (!data.name || !data.email || !data.phone) {
        failed.push({ row, reason: "Missing name, email or phone" });
        continue;
      }

      // phone-ஐ string ஆகவே வை (leading zero issue வராம)
      data.phone = data.phone.trim();

      let user = await User.findOne({
        $or: [{ email: data.email }, { phone: data.phone }],
      });

      const hashedPassword = data.password
        ? await bcrypt.hash(data.password.toString(), 10)
        : await bcrypt.hash("welcome123", 10);

      let dobParsed = null;
      if (data.dob) {
        dobParsed = new Date(data.dob);
        if (isNaN(dobParsed)) dobParsed = null;
      }

      if (user) {
        // update
        user.name = data.name || user.name;
        user.phone = data.phone || user.phone;
        user.dob = dobParsed || user.dob;
        user.referrer = data.referrer || user.referrer;
        user.referrerDetails = data.referrerDetails || user.referrerDetails;
        user.password = hashedPassword; // ← optional – புது password இருந்தா மட்டும் மாத்து
        await user.save();
      } else {
        // create new
        const counter = await Counter.findOneAndUpdate(
          { name: "leadId" },
          { $inc: { seq: 1 } },
          { new: true, upsert: true },
        );

        const leadId = `4MSolarLead${String(counter.seq).padStart(4, "0")}`; // 0001, 0002 style

        await User.create({
          leadId,
          name: data.name,
          email: data.email,
          phone: data.phone,
          dob: dobParsed,
          referrer: data.referrer,
          referrerDetails: data.referrerDetails,
          password: hashedPassword,
          role: "user",
        });
      }

      success++;
    }
    await fs.unlink(req.file.path).catch(() => {});

    res.status(200).json({
      message: "Excel processing completed",
      successCount: success,
      failedCount: failed.length,
      failedRows: failed,
    });
  } catch (err) {
    console.error("Excel upload error:", err);
    res.status(500).json({ msg: "Server error while processing excel" });
  }
};
