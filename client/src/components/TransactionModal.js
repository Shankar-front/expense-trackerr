import { useEffect, useState } from "react";
import api from "../utils/api";
import "../assets/modal.css";

export default function TransactionModal({
  isOpen,
  onClose,
  token,
  onSuccess,
  editTransaction
}) {
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "Food",
    date: "",
    notes: ""
  });

  // Prefill form when editing
  useEffect(() => {
    if (editTransaction) {
      setForm({
        title: editTransaction.title,
        amount: editTransaction.amount,
        category: editTransaction.category,
        date: editTransaction.date.split("T")[0],
        notes: editTransaction.notes || ""
      });
    } else {
      setForm({
        title: "",
        amount: "",
        category: "Food",
        date: "",
        notes: ""
      });
    }
  }, [editTransaction]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      amount: Number(form.amount)
    };

    if (editTransaction) {
      // UPDATE transaction
      await api.put(
        `/transactions/${editTransaction._id}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
    } else {
      // ADD transaction
      await api.post(
        "/transactions",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
    }

    onSuccess();
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>{editTransaction ? "Edit Transaction" : "Add Transaction"}</h3>

        <form onSubmit={handleSubmit}>
          <input
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            required
          />

          <input
            name="amount"
            type="number"
            placeholder="Amount"
            value={form.amount}
            onChange={handleChange}
            required
          />

          <input
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            required
          />

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
          >
            <option>Food</option>
            <option>Rent</option>
            <option>Transport</option>
            <option>Shopping</option>
          </select>

          <input
            name="notes"
            placeholder="Notes (optional)"
            value={form.notes}
            onChange={handleChange}
          />

          <div className="modal-buttons">
            <button type="submit">
              {editTransaction ? "Update" : "Add"}
            </button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
