import { useState } from "react";
import api from "../utils/api";

export default function TransactionForm({ token, onSuccess }) {
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "Food",
    date: "",
    notes: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await api.post("/transactions", form, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    setForm({
      title: "",
      amount: "",
      category: "Food",
      date: "",
      notes: ""
    });

    onSuccess(); // refresh dashboard
  };

  return (
  <form className="transaction-form" onSubmit={handleSubmit}>
    <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
    <input name="amount" type="number" placeholder="Amount" value={form.amount} onChange={handleChange} required />
    <input name="date" type="date" value={form.date} onChange={handleChange} required />

    <select name="category" value={form.category} onChange={handleChange}>
      <option>Food</option>
      <option>Rent</option>
      <option>Transport</option>
      <option>Shopping</option>
    </select>

    <input name="notes" placeholder="Notes (optional)" value={form.notes} onChange={handleChange} />
    <button type="submit">Add Transaction</button>
  </form>
);

}
