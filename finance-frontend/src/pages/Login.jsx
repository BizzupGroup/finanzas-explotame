import { useState, useContext  } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api";
/*import { useNavigate } from "react-router-dom";*/
import toast from "react-hot-toast";

export default function Login({ switchToRegister }) {

  const { setToken } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  /*const navigate = useNavigate();*/

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await api.post("/users/login", {
      email,
      password
    });

    localStorage.setItem("token", res.data.access_token);
    setToken(res.data.access_token); // 👈 CLAVE

    toast.success("Inicio de sesión exitoso 🎉");

    //navigate("/dashboard"); // 👈 REDIRECCIÓN

  //} catch (err) {
  //  toast.error(err?.response?.data?.detail || "Credenciales incorrectas");
  //}

  } catch (err) {
    toast.error(err);
  }

};


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-xl w-96 space-y-4"
      >
        <h2 className="text-white text-2xl font-bold">Login</h2>

        <input
          className="w-full p-2 rounded bg-gray-700 text-white"
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full p-2 rounded bg-gray-700 text-white"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <p
          onClick={switchToRegister}
          className="text-indigo-400 text-sm text-center cursor-pointer"
        >
          ¿No tienes cuenta? Regístrate
        </p>


        <button className="w-full bg-green-500 p-2 rounded font-bold">
          Login
        </button>
      </form>
    </div>
  );
}
