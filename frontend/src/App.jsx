import { useState, useEffect } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Admin from "./pages/Admin";

export default function App() {
  const [pagina, setPagina] = useState(window.location.pathname);
  const [logueado, setLogueado] = useState(
    !!localStorage.getItem("token")
  );

  useEffect(() => {
    const handler = () => setPagina(window.location.pathname);
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);

  function handleLogin() {
    setLogueado(true);
    window.history.pushState({}, "", "/admin");
    setPagina("/admin");
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setLogueado(false);
    window.history.pushState({}, "", "/");
    setPagina("/");
  }

  if (pagina === "/admin") {
    return logueado
      ? <Admin onLogout={handleLogout} />
      : <Login onLogin={handleLogin} />;
  }

  return <Home />;
}