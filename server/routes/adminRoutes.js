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
      const users = await User.find()
        .select("-password")
        .sort({
          createdAt: -1,
        });

      return res.json({
        success: true,
        data: users,
      });
    } catch (err) {
      console.error(
        "GET USERS ERROR:",
        err
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch users",
      });
    }
  }
);

/* ================= UPDATE ROLE ================= */

router.put(
  "/users/:id/role",
  authMiddleware,
  roleMiddleware("admin"),
  async (req, res) => {
    try {
      const { role } = req.body;

      const allowedRoles = [
        "student",
        "teacher",
        "admin",
      ];

      if (
        !allowedRoles.includes(
          role
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid role",
        });
      }

      const user =
        await User.findByIdAndUpdate(
          req.params.id,
          { role },
          { new: true }
        ).select("-password");

      if (!user) {
        return res.status(404).json({
          success: false,
          message:
            "User not found",
        });
      }

      return res.json({
        success: true,
        message:
          "Role updated successfully",
        data: user,
      });
    } catch (err) {
      console.error(
        "UPDATE ROLE ERROR:",
        err
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to update role",
      });
    }
  }
);

/* ================= BLOCK USER ================= */

router.put(
  "/users/:id/block",
  authMiddleware,
  roleMiddleware("admin"),
  async (req, res) => {
    try {
      const user =
        await User.findByIdAndUpdate(
          req.params.id,
          {
            isBlocked: true,
          },
          { new: true }
        ).select("-password");

      if (!user) {
        return res.status(404).json({
          success: false,
          message:
            "User not found",
        });
      }

      return res.json({
        success: true,
        message:
          "User blocked successfully",
        data: user,
      });
    } catch (err) {
      console.error(
        "BLOCK USER ERROR:",
        err
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to block user",
      });
    }
  }
);

/* ================= UNBLOCK USER ================= */

router.put(
  "/users/:id/unblock",
  authMiddleware,
  roleMiddleware("admin"),
  async (req, res) => {
    try {
      const user =
        await User.findByIdAndUpdate(
          req.params.id,
          {
            isBlocked: false,
          },
          { new: true }
        ).select("-password");

      if (!user) {
        return res.status(404).json({
          success: false,
          message:
            "User not found",
        });
      }

      return res.json({
        success: true,
        message:
          "User unblocked successfully",
        data: user,
      });
    } catch (err) {
      console.error(
        "UNBLOCK USER ERROR:",
        err
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to unblock user",
      });
    }
  }
);

module.exports = router;