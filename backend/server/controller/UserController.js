import User from "../model/UserModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

// Auto-generate Employee ID
const generateEmployeeId = async (role) => {
  const lastUser = await User.find({ role }).sort({ createdAt: -1 }).limit(1);
  let nextNumber = 1;

  if (lastUser.length > 0) {
    const lastId = lastUser[0].employeeId; // e.g., SAL007
    const number = parseInt(lastId.slice(3));
    if (!isNaN(number)) nextNumber = number + 1;
  }

  const prefix = role.substring(0, 3).toUpperCase(); // SAL, ENG, ACC, ADM
  return `${prefix}${String(nextNumber).padStart(3, "0")}`; // SAL008
};

// REGISTER
export const register = async (req, res) => {
  try {
    const { name, email, password, dob, phone, role, employeeId, branch } =
      req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ msg: "User email already exists" });

    // Determine final employeeId
    let finalEmpId;
    if (employeeId && employeeId.trim() !== "") {
      // Manual employeeId, check uniqueness
      const existingEmp = await User.findOne({ employeeId });
      if (existingEmp)
        return res.status(400).json({ msg: "Employee ID already exists" });
      finalEmpId = employeeId;
    } else {
      // Auto-generate
      finalEmpId = await generateEmployeeId(role);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      email,
      dob,
      phone,
      password: hashedPassword,
      role,
      employeeId: finalEmpId,

      branch,
    });

    await newUser.save();

    res
      .status(201)
      .json({ msg: "User registered successfully", employeeId: finalEmpId });
  } catch (err) {
    console.error("Register Error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    // Generate JWT with role
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        employeeId: user.employeeId,
        branch: user.branch,
        profileImageUrl: user.profileImageUrl || "",
      },
    });
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// UserController.js - updateProfileImage
export const updateProfileImage = async (req, res) => {
  try {
    const userId = req.params.id;
    const { profileImageUrl } = req.body;

    // Security: only allow the user to update their own profile
    if (req.user.id !== userId) {
      return res
        .status(403)
        .json({ msg: "You can only update your own profile" });
    }

    if (!profileImageUrl?.startsWith("https://res.cloudinary.com")) {
      return res.status(400).json({ msg: "Invalid Cloudinary URL" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { profileImageUrl },
      { new: true, runValidators: true },
    );

    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json({
      message: "Profile image updated successfully",
      profileImageUrl: user.profileImageUrl,
    });
  } catch (error) {
    console.error("Profile image update error:", error);
    res.status(500).json({ msg: "Server error" });
  }
};
