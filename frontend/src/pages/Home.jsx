import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaWhatsapp, FaInstagram, FaCalendar, FaClock, FaUser, FaPhone } from 'react-icons/fa'
import api from '../api/axios'

export default function Home() {
  const [servicios, setServicios] = useState([])
  const [form, setForm] = useState({
    cliente_nombre: '',
    cliente_telefono: '',
    cliente_email: '',
    servicio_id: '',
    servicio_nombre: '',
    fecha: '',
    hora: '',
    notas: '',
  })
  const [enviando, setEnviando] = useState(false)
  const [exito, setExito] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/servicios').then(res => setServicios(res.data))
  }, [])

  function handleServicio(e) {
    const id = e.target.value
    const servicio = servicios.find(s => s.id === parseInt(id))
    setForm({ ...form, servicio_id: id, servicio_nombre: servicio?.nombre || '' })
  }

  async function handleSubmit() {
    if (!form.cliente_nombre || !form.cliente_telefono || !form.servicio_id || !form.fecha || !form.hora) {
      setError('Por favor llena todos los campos obligatorios')
      return
    }
    setEnviando(true)
    setError('')
    try {
      await api.post('/citas', { ...form, servicio_id: parseInt(form.servicio_id) })
      setExito(true)
      setForm({
        cliente_nombre: '', cliente_telefono: '', cliente_email: '',
        servicio_id: '', servicio_nombre: '', fecha: '', hora: '', notas: '',
      })
    } catch {
      setError('Error al agendar la cita, intenta de nuevo')
    } finally {
      setEnviando(false)
    }
  }

  const horas = ['9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00']

  return (
    <div className="min-h-screen bg-white">

      {/* Navbar */}
      <nav className="fixed top-0 w-full backdrop-blur-md bg-white/80 border-b border-rose-100 px-6 py-4 flex justify-between items-center z-50">
        <div>
          <p className="text-lg font-bold text-rose-400 tracking-widest">ILSE ALVARADO</p>
          <p className="text-xs text-gray-400 tracking-widest uppercase">Studio</p>
        </div>
        <a href="/admin" className="text-sm text-gray-400 hover:text-rose-400 transition-colors">
          Admin
        </a>
      </nav>

      {/* Hero */}
      <section className="min-h-screen relative flex items-center justify-center pt-16">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1600"
            alt="Salón"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        <motion.div
          className="relative text-center text-white px-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <p className="text-rose-300 tracking-widest uppercase text-sm mb-4">Bienvenida a</p>
          <h1 className="text-6xl font-bold mb-2">Ilse Alvarado</h1>
          <p className="text-3xl font-light tracking-widest mb-6">Studio</p>
          <p className="text-gray-300 mb-10 max-w-lg mx-auto">
            Pioneras en Microblading, Hair strokes y Depilación con hilo en Tlaxcala
          </p>
          <a href="#agendar"
            className="bg-rose-400 text-white px-8 py-3 rounded-full hover:bg-rose-500 transition-all font-medium">
            Agendar Cita
          </a>
        </motion.div>
      </section>

      {/* Servicios */}
      <section className="py-20 px-6 bg-rose-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-rose-400 tracking-widest uppercase text-sm mb-3">Lo que ofrecemos</p>
            <h2 className="text-4xl font-bold text-gray-800">Servicios</h2>
            <div className="w-16 h-1 bg-rose-400 mx-auto mt-4"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {servicios.map((s, i) => (
              <motion.div
                key={s.id}
                className="bg-white rounded-2xl p-6 shadow-sm text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <h3 className="font-bold text-gray-800 text-lg mb-2">{s.nombre}</h3>
                <p className="text-gray-500 text-sm mb-4">{s.descripcion}</p>
                <p className="text-rose-400 font-bold">Desde ${s.precio}</p>
                <p className="text-gray-400 text-xs mt-1">⏱ {s.duracion_min} min</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Formulario de cita */}
      <section id="agendar" className="py-20 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-rose-400 tracking-widest uppercase text-sm mb-3">Reserva tu lugar</p>
            <h2 className="text-4xl font-bold text-gray-800">Agendar Cita</h2>
            <div className="w-16 h-1 bg-rose-400 mx-auto mt-4"></div>
          </div>

          {exito ? (
            <motion.div
              className="text-center py-12 bg-rose-50 rounded-2xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <p className="text-5xl mb-4">🎉</p>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">¡Cita agendada!</h3>
              <p className="text-gray-500 mb-6">Te contactaremos para confirmar tu cita.</p>
              <button
                onClick={() => setExito(false)}
                className="bg-rose-400 text-white px-6 py-3 rounded-full hover:bg-rose-500 transition-all"
              >
                Agendar otra cita
              </button>
            </motion.div>
          ) : (
            <motion.div
              className="bg-white rounded-2xl shadow-sm border border-rose-100 p-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-500 text-sm px-4 py-3 rounded-lg mb-6">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Nombre completo *</label>
                  <input
                    type="text"
                    value={form.cliente_nombre}
                    onChange={e => setForm({ ...form, cliente_nombre: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-rose-400 transition-colors"
                    placeholder="Tu nombre"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Teléfono *</label>
                  <input
                    type="tel"
                    value={form.cliente_telefono}
                    onChange={e => setForm({ ...form, cliente_telefono: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-rose-400 transition-colors"
                    placeholder="246 123 4567"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="text-sm text-gray-600 mb-1 block">Email (opcional)</label>
                <input
                  type="email"
                  value={form.cliente_email}
                  onChange={e => setForm({ ...form, cliente_email: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-rose-400 transition-colors"
                  placeholder="tu@email.com"
                />
              </div>

              <div className="mb-4">
                <label className="text-sm text-gray-600 mb-1 block">Servicio *</label>
                <select
                  value={form.servicio_id}
                  onChange={handleServicio}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-rose-400 transition-colors"
                >
                  <option value="">Selecciona un servicio</option>
                  {servicios.map(s => (
                    <option key={s.id} value={s.id}>{s.nombre} — ${s.precio}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Fecha *</label>
                  <input
                    type="date"
                    value={form.fecha}
                    onChange={e => setForm({ ...form, fecha: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-rose-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Hora *</label>
                  <select
                    value={form.hora}
                    onChange={e => setForm({ ...form, hora: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-rose-400 transition-colors"
                  >
                    <option value="">Selecciona una hora</option>
                    {horas.map(h => (
                      <option key={h} value={h}>{h} hrs</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label className="text-sm text-gray-600 mb-1 block">Notas adicionales</label>
                <textarea
                  value={form.notas}
                  onChange={e => setForm({ ...form, notas: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-rose-400 transition-colors resize-none h-24"
                  placeholder="¿Algo que debamos saber?"
                />
              </div>

              <motion.button
                onClick={handleSubmit}
                disabled={enviando}
                className="w-full bg-rose-400 text-white py-4 rounded-xl font-bold hover:bg-rose-500 transition-all disabled:opacity-50 text-lg"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                {enviando ? 'Agendando...' : '✨ Agendar mi cita'}
              </motion.button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 text-center">
        <p className="text-rose-400 text-xl font-bold mb-1">Ilse Alvarado Studio</p>
        <p className="text-gray-400 text-sm mb-4">Pioneras en Microblading y Hair strokes en Tlaxcala</p>
        <div className="flex justify-center gap-4">
          <a href="https://instagram.com/ilsealvaradostudio" target="_blank" className="text-gray-400 hover:text-rose-400 transition-colors">
            <FaInstagram className="text-xl" />
          </a>
          <a href="https://wa.me/522461595231" target="_blank" className="text-gray-400 hover:text-green-400 transition-colors">
            <FaWhatsapp className="text-xl" />
          </a>
        </div>
      </footer>

      {/* WhatsApp flotante */}
      <motion.a
        href="https://wa.me/522461595231"
        target="_blank"
        className="fixed bottom-6 right-6 bg-green-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg z-40"
        whileHover={{ scale: 1.1 }}
        animate={{ y: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <FaWhatsapp className="text-2xl" />
      </motion.a>

    </div>
  )
}