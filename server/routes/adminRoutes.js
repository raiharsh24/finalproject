const express = require("express");
const router = express.Router();

const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

/* ================= GET ALL USERS ================= */
router.get(
  "/users",
  authMiddleware,
  roleMiddleware("admin"),
  async (req, res) => {
    try {
      const users = await User.find().select("-password");
      res.json(users);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  }
);

/* ================= CHANGE USER ROLE ================= */
router.post(
  "/change-role",
  authMiddleware,
  roleMiddleware("admin"),
  async (req, res) => {
    try {
      const { email, role } = req.body;

      if (!["student", "teacher", "admin"].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }

      const user = await User.findOneAndUpdate(
        { email },
        { role },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ message: "Role updated", user });

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

/* ================= DELETE USER ================= */
router.delete(
  "/delete-user",
  authMiddleware,
  roleMiddleware("admin"),
  async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Email required" });
      }

      // 🔥 Prevent admin deleting themselves
      if (req.user.email === email) {
        return res.status(400).json({ message: "You cannot delete yourself" });
      }

      const user = await User.findOneAndDelete({ email });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ message: "User deleted" });

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;