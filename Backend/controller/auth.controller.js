import User from "../model/user.model.js";
import bcrypt from "bcryptjs";

// Register user
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, birthDate, avatar } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      birthDate,
      avatar: avatar || "", // ✅ set empty string if not provided
    });

    if (user) {
      // Return user data without password
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        birthDate: user.birthDate,
        avatar: user.avatar, // ✅ include avatar
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error registering user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar, // ✅ include avatar
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.log("Error logging in:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get user profile (with avatar and birthdate)
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.log("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
};
