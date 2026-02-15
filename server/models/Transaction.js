const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    // Auto-generated unique ID (_id) === assessment "id"

    // User who owns the transaction
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // Transaction title
    title: {
      type: String,
      required: true,
      trim: true
    },

    // Transaction amount
    amount: {
      type: Number,
      required: true
    },

    // Category of expense
    category: {
      type: String,
      required: true,
      enum: ["Food", "Rent", "Transport", "Shopping"]
    },

    // Date stored as ISO Date
    date: {
      type: Date,
      required: true
    },

    // Optional notes
    notes: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Transaction", transactionSchema);
