import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    birthDate: {
      type: Date,
    },
    avatar: {
      type: String, // ⭐ Cloudinary URL will be stored here
      default: "",  // keep empty if user didn’t upload
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
