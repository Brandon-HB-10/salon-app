import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaCheck, FaTimes, FaTrash, FaSignOutAlt, FaCalendar, FaClock, FaUser, FaPhone } from 'react-icons/fa'
import api from '../api/axios'

export default function Admin({ onLogout }) {
  const [citas, setCitas] = useState([])
  const [filtro, setFiltro] = useState('todas')
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    cargarCitas()
  }, [])

  async function cargarCitas() {
    try {
      const res = await api.get('/citas')
      setCitas(res.data)
    } catch {
      onLogout()
    } finally {
      setCargando(false)
    }
  }

  async function actualizarEstado(id, estado) {
    await api.put(`/citas/${id}/estado`, { estado })
    cargarCitas()
  }

  async function eliminarCita(id) {
    if (!confirm('¿Eliminar esta cita?')) return
    await api.delete(`/citas/${id}`)
    cargarCitas()
  }

  function logout() {
    localStorage.removeItem('token')
    onLogout()
  }

  const citasFiltradas = citas.filter(c => filtro === 'todas' ? true : c.estado === filtro)

  const stats = {
    total: citas.length,
    pendientes: citas.filter(c => c.estado === 'pendiente').length,
    confirmadas: citas.filter(c => c.estado === 'confirmada').length,
    canceladas: citas.filter(c => c.estado === 'cancelada').length,
  }

  const colorEstado = {
    pendiente: 'bg-yellow-100 text-yellow-700',
    confirmada: 'bg-green-100 text-green-700',
    cancelada: 'bg-red-100 text-red-700',
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
        <div>
          <p className="font-bold text-rose-400 tracking-widest">ILSE ALVARADO</p>
          <p className="text-xs text-gray-400">Panel de Administración</p>
        </div>
        <button onClick={logout} className="flex items-center gap-2 text-gray-500 hover:text-rose-400 transition-colors text-sm">
          <FaSignOutAlt /> Cerrar sesión
        </button>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total', valor: stats.total, color: 'bg-rose-400' },
            { label: 'Pendientes', valor: stats.pendientes, color: 'bg-yellow-400' },
            { label: 'Confirmadas', valor: stats.confirmadas, color: 'bg-green-400' },
            { label: 'Canceladas', valor: stats.canceladas, color: 'bg-red-400' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              className="bg-white rounded-xl p-5 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <p className="text-gray-500 text-sm mb-1">{stat.label}</p>
              <p className={`text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-400`}>
                {stat.valor}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Filtros */}
        <div className="flex gap-3 mb-6 flex-wrap">
          {['todas', 'pendiente', 'confirmada', 'cancelada'].map((f) => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all capitalize ${
                filtro === f ? 'bg-rose-400 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-rose-300'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Citas */}
        {cargando ? (
          <p className="text-center text-gray-400 py-20">Cargando citas...</p>
        ) : citasFiltradas.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-3">📅</p>
            <p className="text-gray-400">No hay citas {filtro !== 'todas' ? filtro + 's' : ''}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {citasFiltradas.map((cita, i) => (
              <motion.div
                key={cita.id}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-gray-800">{cita.cliente_nombre}</h3>
                    <p className="text-rose-400 font-medium text-sm">{cita.servicio_nombre}</p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${colorEstado[cita.estado]}`}>
                    {cita.estado}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <FaCalendar className="text-rose-300" />
                    <span>{cita.fecha} a las {cita.hora}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <FaPhone className="text-rose-300" />
                    <span>{cita.cliente_telefono}</span>
                  </div>
                  {cita.notas && (
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <span>📝 {cita.notas}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  {cita.estado === 'pendiente' && (
                    <>
                      <button
                        onClick={() => actualizarEstado(cita.id, 'confirmada')}
                        className="flex-1 flex items-center justify-center gap-1 bg-green-500 text-white py-2 rounded-lg text-sm hover:bg-green-600 transition-all"
                      >
                        <FaCheck /> Confirmar
                      </button>
                      <button
                        onClick={() => actualizarEstado(cita.id, 'cancelada')}
                        className="flex-1 flex items-center justify-center gap-1 bg-red-400 text-white py-2 rounded-lg text-sm hover:bg-red-500 transition-all"
                      >
                        <FaTimes /> Cancelar
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => eliminarCita(cita.id)}
                    className="flex items-center justify-center gap-1 border border-gray-200 text-gray-400 py-2 px-3 rounded-lg text-sm hover:border-red-300 hover:text-red-400 transition-all"
                  >
                    <FaTrash />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}