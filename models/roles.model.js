const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    permissions: {
      type: Array,
      default: [],
    },
    updatedBy: [
      {
        account_id: String,
        updatedAt: Date,
      },
    ],
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);

const Roles = mongoose.model("Role", roleSchema, "roles");

module.exports = Roles;
