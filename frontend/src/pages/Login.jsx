import { useState } from 'react'
import { motion } from 'framer-motion'
import api from '../api/axios'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  async function handleLogin() {
    setCargando(true)
    setError('')
    try {
      const res = await api.post('/auth/login', { email, password })
      localStorage.setItem('token', res.data.access_token)
      onLogin()
    } catch {
      setError('Credenciales incorrectas')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="min-h-screen bg-rose-50 flex items-center justify-center px-6">
      <motion.div
        className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-8">
          <p className="text-rose-400 tracking-widest uppercase text-sm mb-1">Panel de</p>
          <h1 className="text-3xl font-bold text-gray-800">Administración</h1>
          <p className="text-gray-400 text-sm mt-2">Ilse Alvarado Studio</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-500 text-sm px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-rose-400 transition-colors"
              placeholder="admin@ilsestudio.com"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-rose-400 transition-colors"
              placeholder="••••••••"
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>
          <motion.button
            onClick={handleLogin}
            disabled={cargando}
            className="w-full bg-rose-400 text-white py-3 rounded-lg font-medium hover:bg-rose-500 transition-all disabled:opacity-50"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            {cargando ? 'Entrando...' : 'Iniciar Sesión'}
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}