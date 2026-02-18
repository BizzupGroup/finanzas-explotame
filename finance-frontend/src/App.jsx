import { useContext, useState } from "react";
import { AuthContext } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/register.jsx";
import Dashboard from "./pages/dashboard.jsx";

function App() {
  const { token } = useContext(AuthContext);
  const [isRegistering, setIsRegistering] = useState(false);

  if (!token) {
    return isRegistering ? (
      <Register switchToLogin={() => setIsRegistering(false)} />
    ) : (
      <Login switchToRegister={() => setIsRegistering(true)} />
    );
  }

  return <Dashboard />;
}

export default App;
