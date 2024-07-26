const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    order_id: String,
    status: String,
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema, "transactions");

module.exports = Transaction;
