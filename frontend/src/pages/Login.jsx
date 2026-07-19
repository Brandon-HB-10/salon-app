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
    <div className="min-h-screen flex items-center justify-center px-6"
      style={{ background: '#0a0a0a' }}>

      <motion.div
        className="w-full max-w-md p-10 border"
        style={{ background: '#0d0d0d', borderColor: 'rgba(201,168,76,0.15)' }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="text-center mb-10">
          <p className="text-xs tracking-[0.5em] uppercase mb-2" style={{ color: '#C9A84C' }}>
            Ilse Alvarado
          </p>
          <h1 className="text-3xl font-light" style={{ color: '#F5F0E8', letterSpacing: '-0.02em' }}>
            Studio
          </h1>
          <div className="h-px mt-6 mx-auto w-16"
            style={{ background: 'linear-gradient(to right, transparent, #C9A84C, transparent)' }} />
        </div>

        {error && (
          <div className="px-4 py-3 text-xs tracking-widest uppercase mb-6 border"
            style={{ borderColor: 'rgba(239,68,68,0.3)', color: '#f87171', background: 'rgba(239,68,68,0.05)' }}>
            {error}
          </div>
        )}

        <div className="space-y-4 mb-8">
          <div>
            <label className="text-xs tracking-widest uppercase block mb-2" style={{ color: '#6B6350' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              placeholder="admin@ilsestudio.com"
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 text-sm outline-none transition-all duration-300"
              style={{ background: '#111', border: '1px solid rgba(201,168,76,0.15)', color: '#F5F0E8' }}
              onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.5)'}
              onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.15)'}
            />
          </div>
          <div>
            <label className="text-xs tracking-widest uppercase block mb-2" style={{ color: '#6B6350' }}>
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              placeholder="••••••••"
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              className="w-full px-4 py-3 text-sm outline-none transition-all duration-300"
              style={{ background: '#111', border: '1px solid rgba(201,168,76,0.15)', color: '#F5F0E8' }}
              onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.5)'}
              onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.15)'}
            />
          </div>
        </div>

        <motion.button
          onClick={handleLogin}
          disabled={cargando}
          className="w-full py-4 text-xs tracking-widest uppercase font-semibold transition-all duration-300 disabled:opacity-40"
          style={{ background: '#C9A84C', color: '#0a0a0a' }}
          whileHover={{ background: '#B8973B' }}
          whileTap={{ scale: 0.99 }}
        >
          {cargando ? 'Entrando...' : '✦ Iniciar sesión'}
        </motion.button>
      </motion.div>
    </div>
  )
}