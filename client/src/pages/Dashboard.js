import { useEffect, useState } from "react";
import api from "../utils/api";
import TransactionModal from "../components/TransactionModal";
import "../assets/dashboard.css";

export default function Dashboard() {
  const token = localStorage.getItem("token");

  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTransaction, setEditTransaction] = useState(null);

  // Fetch transactions
  const fetchTransactions = async () => {
    if (!token) {
      setTransactions([]);
      return;
    }

    const res = await api.get("/transactions", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    setTransactions(res.data);
  };

  useEffect(() => {
    fetchTransactions();
  }, [token]);

  // Delete with confirmation
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this transaction?"
    );
    if (!confirmed) return;

    await api.delete(`/transactions/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    fetchTransactions();
  };

  // Total calculation (safe)
  const total = transactions.reduce(
    (sum, t) => sum + Number(t.amount),
    0
  );

  // Sort: small amount → large amount
  const sortedTransactions = [...transactions].sort(
    (a, b) => Number(a.amount) - Number(b.amount)
  );

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <h3>Total Expenses: ₹{total}</h3>

      {/* ADD TRANSACTION BUTTON */}
      <button
        onClick={() => {
          setEditTransaction(null);
          setIsModalOpen(true);
        }}
      >
        + Add Transaction
      </button>

      {/* TRANSACTION LIST */}
      {sortedTransactions.length === 0 ? (
        <p className="empty-text">No transactions yet</p>
      ) : (
        <ul className="transaction-list">
          {sortedTransactions.map((t) => (
            <li key={t._id} className="transaction-item">
              <span>
                <strong>{t.title}</strong> — ₹{t.amount} ({t.category}) —{" "}
                {new Date(t.date).toLocaleDateString()}
              </span>

              <span>
                <button
                  onClick={() => {
                    setEditTransaction(t); // prefill form
                    setIsModalOpen(true);  // open modal
                  }}
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(t._id)}
                  style={{ marginLeft: "8px" }}
                >
                  Delete
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* ADD / EDIT MODAL */}
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
