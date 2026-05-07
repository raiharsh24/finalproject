const User = require("../models/User");

/* ================= GET ALL USERS ================= */

const getAllUsers = async (
  req,
  res
) => {
  try {
    const users =
      await User.find({})
        .select("-password")
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
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
};

/* ================= UPDATE ROLE ================= */

const updateUserRole =
  async (req, res) => {
    try {
      const { id } = req.params;

      const { role } = req.body;

      if (
        ![
          "student",
          "teacher",
          "admin",
        ].includes(role)
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Invalid role",
          });
      }

      const user =
        await User.findById(id);

      if (!user) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "User not found",
          });
      }

      user.role = role;

      await user.save();

      return res.status(200).json({
        success: true,
        message:
          "Role updated successfully",
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
  };

/* ================= BLOCK USER ================= */

const blockUser = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      }
    );

    return res.status(200).json({
      success: true,
      message:
        "User blocked successfully",
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
};

/* ================= UNBLOCK USER ================= */

const unblockUser = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      }
    );

    return res.status(200).json({
      success: true,
      message:
        "User unblocked successfully",
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
};

module.exports = {
  getAllUsers,
  updateUserRole,
  blockUser,
  unblockUser,
};