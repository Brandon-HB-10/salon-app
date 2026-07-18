import { useState } from 'react'
import Home from './pages/Home'
import Login from './pages/Login'
import Admin from './pages/Admin'

export default function App() {
  const [pagina, setPagina] = useState(window.location.pathname)
  const [logueado, setLogueado] = useState(!!localStorage.getItem('token'))

  function handleLogin() {
    setLogueado(true)
    setPagina('/admin')
    window.history.pushState({}, '', '/admin')
  }

  function handleLogout() {
    setLogueado(false)
    setPagina('/')
    window.history.pushState({}, '', '/')
  }

  if (pagina === '/admin') {
    if (!logueado) return <Login onLogin={handleLogin} />
    return <Admin onLogout={handleLogout} />
  }

  return <Home />
}