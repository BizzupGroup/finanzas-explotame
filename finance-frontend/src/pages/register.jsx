import { useState } from "react";
import api from "../api";
import toast from "react-hot-toast";

export default function Register({ switchToLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await api.post("/users", { email, password });

      toast.success("Cuenta creada correctamente 🚀");
      switchToLogin();
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Error al registrar");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
      <form
        onSubmit={handleRegister}
        className="bg-gray-800 p-8 rounded-2xl w-96 space-y-4"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          Crear Cuenta
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2"
        />

        <p
          onClick={switchToLogin}
          className="text-indigo-400 text-sm text-center cursor-pointer hover:underline"
        >
          ¿Ya tienes cuenta? Inicia sesión
        </p>


        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded-xl font-semibold"
        >
          Registrarse
        </button>
      </form>
    </div>
  );
}
