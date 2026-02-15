const express = require("express");
const Transaction = require("../models/Transaction");
const auth = require("../middleware/authMiddleware");

const router = express.Router();
console.log("🔥 transactions.js file LOADED");

// GET transactions
router.get("/", auth, async (req, res) => {
  console.log("📥 GET transactions for user:", req.userId);

  const data = await Transaction.find({ userId: req.userId });
  console.log("📊 Transactions found:", data.length);

  res.json(data);
});

// CREATE transaction
router.post("/", auth, async (req, res) => {
  console.log("📤 POST transaction body:", req.body);
  console.log("👤 User ID from token:", req.userId);

  const transaction = await Transaction.create({
    ...req.body,
    userId: req.userId
  });

  console.log("✅ SAVED TRANSACTION:", transaction);

  res.json(transaction);
});


router.post("/", auth, async (req, res) => {
  console.log("🔥 POST /api/transactions HIT");
  console.log("BODY:", req.body);
  console.log("USER ID:", req.userId);

  const transaction = await Transaction.create({
    ...req.body,
    userId: req.userId
  });

  console.log("🔥 SAVED:", transaction._id);

  res.json(transaction);
});
// DELETE transaction
router.delete("/:id", auth, async (req, res) => {
  try {
    const deleted = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!deleted) {
      return res.status(404).json({ msg: "Transaction not found" });
    }

    res.json({ msg: "Transaction deleted successfully" });
  } catch (err) {
    console.error("DELETE ERROR:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
});
module.exports = router;
router.put("/:id", auth, async (req, res) => {
  const updated = await Transaction.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    req.body,
    { new: true }
  );
  res.json(updated);
});
