import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaCheck, FaTimes, FaTrash, FaSignOutAlt, FaCalendar, FaPhone, FaUser } from 'react-icons/fa'
import api from '../api/axios'

const colorEstado = {
  pendiente:  { bg: 'rgba(201,168,76,0.1)',  text: '#C9A84C',  border: 'rgba(201,168,76,0.3)'  },
  confirmada: { bg: 'rgba(34,197,94,0.08)',  text: '#4ade80',  border: 'rgba(34,197,94,0.25)'  },
  cancelada:  { bg: 'rgba(239,68,68,0.08)',  text: '#f87171',  border: 'rgba(239,68,68,0.25)'  },
}

export default function Admin({ onLogout }) {
  const [citas, setCitas]     = useState([])
  const [filtro, setFiltro]   = useState('todas')
  const [cargando, setCargando] = useState(true)
  const [citaDetalle, setCitaDetalle] = useState(null)

  useEffect(() => { cargarCitas() }, [])

  async function cargarCitas() {
    try {
      const res = await api.get('/citas')
      setCitas(res.data)
    } catch { onLogout() }
    finally { setCargando(false) }
  }

  async function actualizarEstado(id, estado) {
    await api.put(`/citas/${id}/estado`, { estado })
    setCitaDetalle(null)
    cargarCitas()
  }

  async function eliminarCita(id) {
    if (!confirm('¿Eliminar esta cita?')) return
    await api.delete(`/citas/${id}`)
    setCitaDetalle(null)
    cargarCitas()
  }

  function logout() {
    localStorage.removeItem('token')
    onLogout()
  }

  const citasFiltradas = citas.filter(c => filtro === 'todas' ? true : c.estado === filtro)

  const stats = [
    { label: 'Total',       valor: citas.length,                                    color: '#C9A84C' },
    { label: 'Pendientes',  valor: citas.filter(c => c.estado === 'pendiente').length,  color: '#C9A84C' },
    { label: 'Confirmadas', valor: citas.filter(c => c.estado === 'confirmada').length, color: '#4ade80' },
    { label: 'Canceladas',  valor: citas.filter(c => c.estado === 'cancelada').length,  color: '#f87171' },
  ]

  return (
    <div style={{ background: '#0a0a0a', color: '#F5F0E8', minHeight: '100vh' }}>

      {/* ── NAVBAR ── */}
      <nav className="sticky top-0 z-40 px-8 py-5 flex justify-between items-center"
        style={{ background: 'rgba(10,10,10,0.95)', borderBottom: '1px solid rgba(201,168,76,0.1)', backdropFilter: 'blur(12px)' }}>
        <div>
          <p className="text-xs tracking-[0.4em] uppercase" style={{ color: '#C9A84C' }}>Ilse Alvarado</p>
          <p className="text-base font-light tracking-[0.2em] uppercase" style={{ color: '#F5F0E8' }}>Panel de Administración</p>
        </div>
        <button onClick={logout}
          className="flex items-center gap-2 text-xs tracking-widest uppercase transition-colors duration-300"
          style={{ color: '#6B6350' }}
          onMouseEnter={e => e.currentTarget.style.color = '#C9A84C'}
          onMouseLeave={e => e.currentTarget.style.color = '#6B6350'}
        >
          <FaSignOutAlt /> Cerrar sesión
        </button>
      </nav>

      <div className="max-w-7xl mx-auto px-8 py-12">

        {/* ── STATS ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map((s, i) => (
            <motion.div key={i}
              className="p-6 border"
              style={{ background: '#0d0d0d', borderColor: 'rgba(201,168,76,0.1)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <p className="text-xs tracking-widest uppercase mb-3" style={{ color: '#6B6350' }}>{s.label}</p>
              <p className="text-5xl font-light" style={{ color: s.color }}>{s.valor}</p>
            </motion.div>
          ))}
        </div>

        {/* ── FILTROS ── */}
        <div className="flex gap-3 mb-8 flex-wrap">
          {['todas', 'pendiente', 'confirmada', 'cancelada'].map(f => (
            <button key={f} onClick={() => setFiltro(f)}
              className="px-5 py-2 text-xs tracking-widest uppercase transition-all duration-300"
              style={{
                background: filtro === f ? '#C9A84C' : 'transparent',
                color: filtro === f ? '#0a0a0a' : '#6B6350',
                border: `1px solid ${filtro === f ? '#C9A84C' : 'rgba(201,168,76,0.15)'}`,
                fontWeight: filtro === f ? 600 : 400,
              }}
            >
              {f}
            </button>
          ))}
          <p className="ml-auto text-xs self-center" style={{ color: '#6B6350' }}>
            {`${citasFiltradas.length} ${citasFiltradas.length !== 1 ? 'citas' : 'cita'}`}
          </p>
        </div>

        {/* ── CITAS ── */}
        {cargando ? (
          <div className="text-center py-32">
            <p className="text-xs tracking-widest uppercase" style={{ color: '#6B6350' }}>Cargando...</p>
          </div>
        ) : citasFiltradas.length === 0 ? (
          <div className="text-center py-32 border" style={{ borderColor: 'rgba(201,168,76,0.1)' }}>
            <p className="text-3xl mb-4" style={{ color: '#C9A84C' }}>✦</p>
            <p className="text-xs tracking-widest uppercase" style={{ color: '#6B6350' }}>Sin citas {filtro !== 'todas' ? filtro + 's' : ''}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            
              {citasFiltradas.map((cita, i) => {
                const est = colorEstado[cita.estado] || colorEstado.pendiente
                return (
                  <motion.div key={cita.id}
                    className="p-6 border cursor-pointer group transition-all duration-300"
                    style={{ background: '#0d0d0d', borderColor: 'rgba(201,168,76,0.1)' }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => setCitaDetalle(cita)}
                    whileHover={{ borderColor: 'rgba(201,168,76,0.35)' }}
                  >
                    {/* Estado badge */}
                    <div className="flex justify-between items-start mb-5">
                      <span className="text-xs tracking-widest uppercase px-3 py-1"
                        style={{ background: est.bg, color: est.text, border: `1px solid ${est.border}` }}>
                        {cita.estado}
                      </span>
                      <p className="text-xs" style={{ color: '#6B6350' }}>#{cita.id}</p>
                    </div>

                    {/* Info cliente */}
                    <h3 className="text-base font-light mb-1" style={{ color: '#F5F0E8' }}>{cita.cliente_nombre}</h3>
                    <p className="text-sm mb-4" style={{ color: '#C9A84C' }}>{cita.servicio_nombre}</p>

                    <div className="space-y-2 mb-5">
                      <p className="text-xs flex items-center gap-2" style={{ color: '#6B6350' }}>
                        <FaCalendar style={{ color: '#C9A84C' }} />
                        {cita.fecha} · {cita.hora} hrs
                      </p>
                      <p className="text-xs flex items-center gap-2" style={{ color: '#6B6350' }}>
                        <FaPhone style={{ color: '#C9A84C' }} />
                        {cita.cliente_telefono}
                      </p>
                    </div>

                    {/* Acciones rápidas */}
                    {cita.estado === 'pendiente' && (
                      <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                        <button onClick={() => actualizarEstado(cita.id, 'confirmada')}
                          className="flex-1 py-2 text-xs tracking-widest uppercase transition-all duration-300"
                          style={{ background: 'rgba(34,197,94,0.1)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.2)' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(34,197,94,0.2)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'rgba(34,197,94,0.1)'}
                        >
                          <FaCheck className="inline mr-1" /> Confirmar
                        </button>
                        <button onClick={() => actualizarEstado(cita.id, 'cancelada')}
                          className="flex-1 py-2 text-xs tracking-widest uppercase transition-all duration-300"
                          style={{ background: 'rgba(239,68,68,0.08)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.18)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                        >
                          <FaTimes className="inline mr-1" /> Cancelar
                        </button>
                      </div>
                    )}
                  </motion.div>
                )
              })}
            
          </div>
        )}
      </div>

      {/* ── MODAL DETALLE ── */}
      <AnimatePresence>
        {citaDetalle && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.85)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCitaDetalle(null)}
          >
            <motion.div
              className="w-full max-w-lg p-8 border"
              style={{ background: '#0d0d0d', borderColor: 'rgba(201,168,76,0.2)' }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-8">
                <div>
                  <p className="text-xs tracking-widest uppercase mb-1" style={{ color: '#C9A84C' }}>Detalle de cita #{citaDetalle.id}</p>
                  <h3 className="text-2xl font-light" style={{ color: '#F5F0E8' }}>{citaDetalle.cliente_nombre}</h3>
                </div>
                <button onClick={() => setCitaDetalle(null)} style={{ color: '#6B6350', fontSize: 20 }}>✕</button>
              </div>

              <div className="space-y-4 mb-8">
                {[
                  { label: 'Servicio',   valor: citaDetalle.servicio_nombre },
                  { label: 'Fecha',      valor: `${citaDetalle.fecha} a las ${citaDetalle.hora} hrs` },
                  { label: 'Teléfono',   valor: citaDetalle.cliente_telefono },
                  { label: 'Email',      valor: citaDetalle.cliente_email || '—' },
                  { label: 'Estado',     valor: citaDetalle.estado },
                  { label: 'Notas',      valor: citaDetalle.notas || '—' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 pb-4 border-b" style={{ borderColor: 'rgba(201,168,76,0.08)' }}>
                    <p className="text-xs tracking-widest uppercase w-24 flex-shrink-0 mt-0.5" style={{ color: '#6B6350' }}>{item.label}</p>
                    <p className="text-sm" style={{ color: '#F5F0E8' }}>{item.valor}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 flex-wrap">
                {citaDetalle.estado === 'pendiente' && (
                  <>
                    <button onClick={() => actualizarEstado(citaDetalle.id, 'confirmada')}
                      className="flex-1 py-3 text-xs tracking-widest uppercase transition-all duration-300"
                      style={{ background: 'rgba(34,197,94,0.1)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.25)' }}>
                      <FaCheck className="inline mr-2" /> Confirmar
                    </button>
                    <button onClick={() => actualizarEstado(citaDetalle.id, 'cancelada')}
                      className="flex-1 py-3 text-xs tracking-widest uppercase transition-all duration-300"
                      style={{ background: 'rgba(239,68,68,0.08)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}>
                      <FaTimes className="inline mr-2" /> Cancelar
                    </button>
                  </>
                )}
                {citaDetalle.estado === 'cancelada' && (
                  <button onClick={() => actualizarEstado(citaDetalle.id, 'confirmada')}
                    className="flex-1 py-3 text-xs tracking-widest uppercase"
                    style={{ background: 'rgba(34,197,94,0.1)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.25)' }}>
                    <FaCheck className="inline mr-2" /> Reactivar
                  </button>
                )}
                <button onClick={() => eliminarCita(citaDetalle.id)}
                  className="py-3 px-4 text-xs tracking-widest uppercase transition-all duration-300"
                  style={{ color: '#6B6350', border: '1px solid rgba(201,168,76,0.1)' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.2)' }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#6B6350'; e.currentTarget.style.borderColor = 'rgba(201,168,76,0.1)' }}
                >
                  <FaTrash />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}