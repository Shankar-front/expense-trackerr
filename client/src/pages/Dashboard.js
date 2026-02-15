import { useEffect, useState } from "react";
import api from "../utils/api";
import TransactionModal from "../components/TransactionModal";
import "../assets/dashboard.css";

export default function Dashboard() {
  const token = localStorage.getItem("token");
  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTransaction, setEditTransaction] = useState(null);

  const fetchTransactions = async () => {
    const res = await api.get("/transactions", {
      headers: { Authorization: `Bearer ${token}` }
    });
    setTransactions(res.data);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this transaction?");
    if (!confirmed) return;

    await api.delete(`/transactions/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    fetchTransactions();
  };

  const total = transactions.reduce(
    (sum, t) => sum + Number(t.amount),
    0
  );

  const sorted = [...transactions].sort(
    (a, b) => Number(a.amount) - Number(b.amount)
  );

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <h3>Total Expenses: ₹{total}</h3>

      <button onClick={() => {
        setEditTransaction(null);
        setIsModalOpen(true);
      }}>
        + Add Transaction
      </button>

      <ul className="transaction-list">
        {sorted.map((t) => (
          <li key={t._id} className="transaction-item">
            <span>
              <strong>{t.title}</strong> — ₹{t.amount} ({t.category}) —{" "}
              {new Date(t.date).toLocaleDateString()}
            </span>
            <span>
              <button onClick={() => {
                setEditTransaction(t);
                setIsModalOpen(true);
              }}>
                Edit
              </button>
              <button onClick={() => handleDelete(t._id)}>
                Delete
              </button>
            </span>
          </li>
        ))}
      </ul>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        token={token}
        onSuccess={fetchTransactions}
        editTransaction={editTransaction}
      />
    </div>
  );
}
