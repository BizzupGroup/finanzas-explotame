import { useEffect, useState } from "react";
import api from "../api";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";


export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(null);

 useEffect(() => {
  fetchTransactions();
  fetchBalance();
  fetchCategories();
}, []);

const { logout } = useContext(AuthContext);

const [description, setDescription] = useState("");
const [amount, setAmount] = useState("");
const [type, setType] = useState("expense");
const [categoryId, setCategoryId] = useState("");

const createTransaction = async (e) => {
  e.preventDefault();

  await api.post("/transactions/", {
    description,
    amount: parseFloat(amount),
    type,
    category_id: categoryId,
  });

  setDescription("");
  setAmount("");
  setCategoryId("");

  fetchTransactions();
  fetchBalance();
};


const fetchCategories = async () => {
  const res = await api.get("/categories/");
  setCategories(res.data);
};


  const fetchTransactions = async () => {
    const response = await api.get("/transactions/");
    setTransactions(response.data);
  };

  const fetchBalance = async () => {
    const response = await api.get("/transactions/balance");
    setBalance(response.data);
  };

 const [categories, setCategories] = useState([]);
const [newCategory, setNewCategory] = useState("");

const createCategory = async () => {
  await api.post("/categories/", {
    name: newCategory,
  });

  setNewCategory("");
  fetchCategories();
};

const deleteTransaction = async (id) => {
  await api.delete(`/transactions/${id}`);
  fetchTransactions();
  fetchBalance();
};



  return (
  <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white p-8">
    
    {/* HEADER */}
    <div className="flex justify-between items-center mb-10">
  <h1 className="text-4xl font-bold tracking-tight">
    💸 Finance Dashboard
  </h1>

  <button
    onClick={logout}
    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl transition"
  >
    Cerrar Sesión
  </button>
</div>


    {/* BALANCE CARDS */}
    {balance && (
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="bg-gray-800/60 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-700">
          <p className="text-gray-400 text-sm">Total Income</p>
          <h2 className="text-2xl font-bold text-green-400">
            ${balance.total_income}
          </h2>
        </div>

        <div className="bg-gray-800/60 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-700">
          <p className="text-gray-400 text-sm">Total Expense</p>
          <h2 className="text-2xl font-bold text-red-400">
            ${balance.total_expense}
          </h2>
        </div>

        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-2xl shadow-xl">
          <p className="text-gray-200 text-sm">Current Balance</p>
          <h2 className="text-3xl font-extrabold">
            ${balance.balance}
          </h2>
        </div>
      </div>
    )}

    {/* MAIN GRID */}
    <div className="grid lg:grid-cols-2 gap-8">

      {/* LEFT COLUMN */}
      <div className="space-y-8">

        {/* CREATE CATEGORY */}
        <div className="bg-gray-800/60 backdrop-blur-xl p-6 rounded-2xl border border-gray-700 shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Nueva Categoría</h3>

          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Nombre de categoría"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={createCategory}
              className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl font-medium transition"
            >
              Agregar
            </button>
          </div>
        </div>

        {/* CREATE TRANSACTION */}
        <div className="bg-gray-800/60 backdrop-blur-xl p-6 rounded-2xl border border-gray-700 shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Nueva Transacción</h3>

          <form onSubmit={createTransaction} className="space-y-4">

            <input
              type="text"
              placeholder="Descripción"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <input
              type="number"
              placeholder="Monto"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <div className="grid grid-cols-2 gap-4">
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="expense">Gasto</option>
                <option value="income">Ingreso</option>
              </select>

              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
                className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Categoría</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 py-2 rounded-xl font-semibold transition"
            >
              Guardar Transacción
            </button>
          </form>
        </div>

      </div>

      {/* RIGHT COLUMN — TRANSACTIONS */}
      <div className="bg-gray-800/60 backdrop-blur-xl p-6 rounded-2xl border border-gray-700 shadow-lg">
        <h2 className="text-xl font-semibold mb-6">Transacciones</h2>

        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
          {transactions.map((t) => (
            <div
              key={t.id}
              className="flex justify-between items-center bg-gray-900 p-4 rounded-xl border border-gray-700 hover:border-indigo-500 transition"
            >
              <div>
                <p className="font-medium">{t.description}</p>
                <p className="text-sm text-gray-400">{t.type}</p>
              </div>

              <div className="flex items-center gap-4">
                <span
                  className={`font-semibold ${
                    t.type === "income"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  ${t.amount}
                </span>

                <button
                  onClick={() => deleteTransaction(t.id)}
                  className="text-gray-500 hover:text-red-500 transition"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  </div>
);

}
