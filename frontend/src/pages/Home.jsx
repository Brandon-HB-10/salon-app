// Home.jsx — Ilse Alvarado Studio
// Dark premium design — negro + dorado + crema
// Estructura: Hero full-bleed → Ticker → Servicios → Nosotros → Galería → Citas → Footer

import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { FaWhatsapp, FaInstagram, FaFacebook, FaMapMarkerAlt, FaClock, FaPhone } from 'react-icons/fa'
import api from '../api/axios'

// ── Fade-in al hacer scroll ──────────────────────────────
function Reveal({ children, delay = 0, direction = 'up' }) {
  const variants = {
    up:    { hidden: { opacity: 0, y: 40 },  visible: { opacity: 1, y: 0 } },
    left:  { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0 } },
    right: { hidden: { opacity: 0, x: 40 },  visible: { opacity: 1, x: 0 } },
  }
  return (
    <motion.div
      variants={variants[direction]}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

// ── Línea decorativa dorada ──────────────────────────────
function GoldLine() {
  return (
    <motion.div
      className="h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent my-6"
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: 'easeOut' }}
    />
  )
}

// ── Ticker de servicios ──────────────────────────────────
function Ticker() {
  const items = [
    '✦ Microblading', '✦ Hair Strokes', '✦ Depilación con Hilo',
    '✦ Maquillaje Profesional', '✦ Limpieza Facial', '✦ Coloración Capilar',
    '✦ Microblading', '✦ Hair Strokes', '✦ Depilación con Hilo',
    '✦ Maquillaje Profesional', '✦ Limpieza Facial', '✦ Coloración Capilar',
  ]
  return (
    <div className="overflow-hidden border-y border-amber-400/20 py-3 bg-black">
      <motion.div
        className="flex gap-16 whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      >
        {items.map((item, i) => (
          <span key={i} className="text-amber-400/70 text-sm tracking-widest font-light uppercase">
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

// ── Componente principal ─────────────────────────────────
export default function Home() {
  const [servicios, setServicios] = useState([])
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [form, setForm] = useState({
    cliente_nombre: '', cliente_telefono: '', cliente_email: '',
    servicio_id: '', servicio_nombre: '', fecha: '', hora: '', notas: '',
  })
  const [enviando, setEnviando] = useState(false)
  const [exito, setExito] = useState(false)
  const [error, setError] = useState('')
  const [imgActiva, setImgActiva] = useState(null)

  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  useEffect(() => {
    api.get('/servicios').then(r => setServicios(r.data)).catch(() => {})
  }, [])

  function handleServicio(e) {
    const id = e.target.value
    const s = servicios.find(s => s.id === parseInt(id))
    setForm({ ...form, servicio_id: id, servicio_nombre: s?.nombre || '' })
  }

  async function handleSubmit() {
    if (!form.cliente_nombre || !form.cliente_telefono || !form.servicio_id || !form.fecha || !form.hora) {
      setError('Por favor completa todos los campos obligatorios')
      return
    }
    setEnviando(true); setError('')
    try {
      await api.post('/citas', { ...form, servicio_id: parseInt(form.servicio_id) })
      setExito(true)
      setForm({ cliente_nombre: '', cliente_telefono: '', cliente_email: '', servicio_id: '', servicio_nombre: '', fecha: '', hora: '', notas: '' })
    } catch { setError('Error al agendar. Intenta de nuevo.') }
    finally { setEnviando(false) }
  }

  const horas = ['9:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00']

  const galeria = [
    'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=600',
    'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600',
    'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600',
    'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600',
    'https://images.unsplash.com/photo-1559599101-f09722fb4948?w=600',
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600',
  ]

  return (
    <div style={{ background: '#0a0a0a', color: '#f5f0e8' }} className="font-sans">


        {/* NAVBAR */}
        <nav className="fixed top-0 w-full z-50 px-6 py-4 flex justify-between items-center"
          style={{ background: 'rgba(10,10,10,0.95)', borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
          
          <div>
            <p className="text-xs tracking-[0.4em] uppercase" style={{ color: '#C9A84C' }}>Ilse Alvarado</p>
            <p className="text-sm font-light tracking-[0.2em] uppercase" style={{ color: '#F5F0E8' }}>Studio</p>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex gap-8 text-xs tracking-widest uppercase" style={{ color: '#6B6350' }}>
            {['Servicios','Nosotros','Galería','Agendar'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`}
                className="hover:text-amber-400 transition-colors duration-300">
                {item}
              </a>
            ))}
            <button onClick={() => { window.history.pushState({}, '', '/admin'); window.dispatchEvent(new PopStateEvent('popstate')) }}
              className="hover:text-amber-400 transition-colors duration-300"
              style={{ color: '#6B6350' }}>
              Admin
            </button>
          </div>

          {/* Hamburger mobile */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuAbierto(!menuAbierto)}
          >
            <span className="block w-6 h-px transition-all duration-300"
              style={{ background: menuAbierto ? '#C9A84C' : '#F5F0E8', transform: menuAbierto ? 'rotate(45deg) translate(4px, 4px)' : 'none' }} />
            <span className="block w-6 h-px transition-all duration-300"
              style={{ background: '#C9A84C', opacity: menuAbierto ? 0 : 1 }} />
            <span className="block w-6 h-px transition-all duration-300"
              style={{ background: menuAbierto ? '#C9A84C' : '#F5F0E8', transform: menuAbierto ? 'rotate(-45deg) translate(4px, -4px)' : 'none' }} />
          </button>

          {/* Mobile menu desplegable */}
          {menuAbierto && (
            <motion.div
              className="absolute top-full left-0 w-full py-6 px-6 flex flex-col gap-5 md:hidden"
              style={{ background: 'rgba(10,10,10,0.98)', borderBottom: '1px solid rgba(201,168,76,0.15)' }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {['Servicios','Nosotros','Galería','Agendar'].map(item => (
                <a key={item} href={`#${item.toLowerCase()}`}
                  onClick={() => setMenuAbierto(false)}
                  className="text-sm tracking-widest uppercase transition-colors duration-300"
                  style={{ color: '#6B6350' }}
                  onMouseEnter={e => e.target.style.color = '#C9A84C'}
                  onMouseLeave={e => e.target.style.color = '#6B6350'}
                >
                  {item}
                </a>
              ))}
              <button
  onClick={() => {
    setMenuAbierto(false)
    window.history.pushState({}, '', '/admin')
    window.dispatchEvent(new PopStateEvent('popstate'))
  }}
  className="text-sm tracking-widest uppercase text-left"
  style={{ color: '#6B6350' }}
>
  Admin
</button>
            </motion.div>
          )}
        </nav>

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative h-screen overflow-hidden flex items-end pb-20 px-8">
        <motion.div className="absolute inset-0" style={{ y: heroY }}>
          <img
            src="https://i.pinimg.com/736x/49/e3/8e/49e38eb4d00b31fac1cc6ee4b2663f6f.jpg"
            alt="Ilse Alvarado Studio"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #0a0a0a 20%, rgba(10,10,10,0.5) 60%, rgba(10,10,10,0.2) 100%)' }} />
        </motion.div>

        <motion.div className="relative z-10 max-w-5xl" style={{ opacity: heroOpacity }}>
          <motion.p
            className="text-xs tracking-[0.5em] uppercase mb-6"
            style={{ color: '#C9A84C' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            [ Estudio de belleza · Apizaco & Tlaxcala ]
          </motion.p>

          <motion.h1
            className="font-light leading-none mb-2"
            style={{ fontSize: 'clamp(3.5rem, 9vw, 8rem)', color: '#F5F0E8', letterSpacing: '-0.02em' }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Tu belleza,
          </motion.h1>
          <motion.h1
            className="font-light leading-none mb-10"
            style={{ fontSize: 'clamp(3.5rem, 9vw, 8rem)', color: '#C9A84C', fontStyle: 'italic', letterSpacing: '-0.02em' }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
          >
            redefinida.
          </motion.h1>

          <motion.div
            className="flex gap-4 items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <a href="#agendar"
              className="px-8 py-3 text-sm tracking-widest uppercase transition-all duration-300"
              style={{ background: '#C9A84C', color: '#0a0a0a', fontWeight: 600 }}
              onMouseEnter={e => e.target.style.background = '#B8973B'}
              onMouseLeave={e => e.target.style.background = '#C9A84C'}
            >
              Reservar sesión
            </a>
            <a href="#servicios"
              className="px-8 py-3 text-sm tracking-widest uppercase transition-all duration-300"
              style={{ border: '1px solid rgba(201,168,76,0.4)', color: '#C9A84C' }}
              onMouseEnter={e => { e.target.style.borderColor = '#C9A84C'; e.target.style.background = 'rgba(201,168,76,0.05)' }}
              onMouseLeave={e => { e.target.style.borderColor = 'rgba(201,168,76,0.4)'; e.target.style.background = 'transparent' }}
            >
              Ver servicios
            </a>
          </motion.div>
        </motion.div>

        {/* Info flotante derecha */}
        <motion.div
          className="hidden md:block absolute right-8 bottom-20 text-right text-xs space-y-2"
          style={{ color: '#6B6350' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <p className="flex items-center gap-2 justify-end"><FaClock /> Lun–Sáb 9:00–19:00</p>
          <p className="flex items-center gap-2 justify-end"><FaPhone /> 246 159 5231</p>
          <p className="flex items-center gap-2 justify-end"><FaMapMarkerAlt /> Apizaco · Tlaxcala</p>
        </motion.div>
      </section>

      {/* ── TICKER ── */}
      <Ticker />

      {/* ── SERVICIOS ── */}
      <section id="servicios" className="py-32 px-8" style={{ background: '#0a0a0a' }}>
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <p className="text-xs tracking-[0.5em] uppercase mb-3" style={{ color: '#C9A84C' }}>Especialidades</p>
            <h2 className="font-light text-5xl" style={{ color: '#F5F0E8', letterSpacing: '-0.02em' }}>
              Nuestros servicios
            </h2>
          </Reveal>
          <GoldLine />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: 'rgba(201,168,76,0.1)' }}>
            {servicios.map((s, i) => (
              <Reveal key={s.id} delay={i * 0.08}>
                <motion.div
                  className="p-8 h-full flex flex-col justify-between transition-colors duration-300 cursor-default"
                  style={{ background: '#0a0a0a' }}
                  whileHover={{ background: '#111111' }}
                >
                  <div>
                    <p className="text-xs tracking-widest uppercase mb-4" style={{ color: '#C9A84C' }}>
                      0{i + 1}
                    </p>
                    <h3 className="text-xl font-light mb-3" style={{ color: '#F5F0E8' }}>{s.nombre}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: '#6B6350' }}>{s.descripcion}</p>
                  </div>
                  <div className="flex justify-between items-end mt-8">
                    <p className="text-2xl font-light" style={{ color: '#C9A84C' }}>${s.precio}</p>
                    <p className="text-xs" style={{ color: '#6B6350' }}>⏱ {s.duracion_min} min</p>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── NOSOTROS ── */}
      <section id="nosotros" className="py-32 px-8" style={{ background: '#0d0d0d' }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <Reveal direction="left">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800"
                alt="Studio"
                className="w-full object-cover"
                style={{ height: 560, filter: 'brightness(0.85)' }}
              />
              <div className="absolute -bottom-6 -right-6 px-8 py-6" style={{ background: '#C9A84C' }}>
                <p className="text-3xl font-bold" style={{ color: '#0a0a0a' }}>+10</p>
                <p className="text-xs uppercase tracking-widest" style={{ color: '#0a0a0a' }}>Años de experiencia</p>
              </div>
            </div>
          </Reveal>

          <Reveal direction="right">
            <p className="text-xs tracking-[0.5em] uppercase mb-4" style={{ color: '#C9A84C' }}>Quiénes somos</p>
            <h2 className="font-light text-5xl mb-8" style={{ color: '#F5F0E8', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              Pioneras en belleza semipermanente
            </h2>
            <p className="text-sm leading-loose mb-6" style={{ color: '#6B6350' }}>
              En Ilse Alvarado Studio somos pioneras en Microblading, Hair Strokes y Depilación con
              hilo en Tlaxcala. Nos especializamos en resaltar tu belleza natural con técnicas
              modernas y los mejores productos del mercado.
            </p>
            <p className="text-sm leading-loose mb-10" style={{ color: '#6B6350' }}>
              Contamos con dos sucursales — Apizaco y Tlaxcala — para estar cerca de ti y brindarte
              la mejor experiencia posible.
            </p>
            <a href="#agendar"
              className="inline-block px-8 py-3 text-sm tracking-widest uppercase transition-all duration-300"
              style={{ border: '1px solid #C9A84C', color: '#C9A84C' }}
              onMouseEnter={e => { e.target.style.background = '#C9A84C'; e.target.style.color = '#0a0a0a' }}
              onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = '#C9A84C' }}
            >
              Agendar cita
            </a>
          </Reveal>
        </div>
      </section>

      {/* ── GALERÍA ── */}
      <section id="galería" className="py-32 px-8" style={{ background: '#0a0a0a' }}>
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <p className="text-xs tracking-[0.5em] uppercase mb-3" style={{ color: '#C9A84C' }}>Nuestro trabajo</p>
            <h2 className="font-light text-5xl mb-12" style={{ color: '#F5F0E8', letterSpacing: '-0.02em' }}>Galería</h2>
          </Reveal>

          {/* Carrusel automático */}
          <div className="overflow-hidden">
            <motion.div
              className="flex gap-4"
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            >
              {[...galeria, ...galeria].map((img, i) => (
                <motion.div
                  key={i}
                  className="flex-shrink-0 relative overflow-hidden cursor-pointer group"
                  style={{ width: 320, height: 420 }}
                  onClick={() => setImgActiva(img)}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.4 }}
                >
                  <img src={img} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: 'rgba(201,168,76,0.25)' }}>
                    <span className="text-2xl text-white">✦</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIOS ── */}
      <section className="py-32 px-8" style={{ background: '#0d0d0d' }}>
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <p className="text-xs tracking-[0.5em] uppercase mb-3" style={{ color: '#C9A84C' }}>Clientas</p>
            <h2 className="font-light text-5xl mb-16" style={{ color: '#F5F0E8', letterSpacing: '-0.02em' }}>Lo que dicen</h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { nombre: 'María González', texto: 'El mejor microblading que me han hecho. El resultado es completamente natural e increíble.' },
              { nombre: 'Sofía Ramírez', texto: 'Excelente servicio y atención. Mis cejas quedaron perfectas con la técnica de hair strokes.' },
              { nombre: 'Valeria López', texto: 'Siempre salgo encantada. El ambiente es muy relajante y el equipo es súper profesional.' },
            ].map((t, i) => (
              <Reveal key={i} delay={i * 0.15}>
                <div className="p-8 border-t" style={{ borderColor: 'rgba(201,168,76,0.2)' }}>
                  <p className="text-amber-400 mb-6 text-xl">✦✦✦✦✦</p>
                  <p className="text-sm leading-loose mb-8 italic" style={{ color: '#9A8F7E' }}>"{t.texto}"</p>
                  <p className="text-xs tracking-widest uppercase" style={{ color: '#C9A84C' }}>— {t.nombre}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── AGENDAR CITA ── */}
      <section id="agendar" className="py-32 px-8" style={{ background: '#0a0a0a' }}>
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <p className="text-xs tracking-[0.5em] uppercase mb-3" style={{ color: '#C9A84C' }}>Reserva tu lugar</p>
            <h2 className="font-light text-5xl mb-4" style={{ color: '#F5F0E8', letterSpacing: '-0.02em' }}>Agendar cita</h2>
            <p className="text-sm mb-12" style={{ color: '#6B6350' }}>
              Te contactaremos para confirmar tu horario en menos de 24 horas.
            </p>
          </Reveal>

          {exito ? (
            <motion.div
              className="text-center py-20 border"
              style={{ borderColor: 'rgba(201,168,76,0.2)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-5xl mb-4" style={{ color: '#C9A84C' }}>✦</p>
              <h3 className="text-2xl font-light mb-3" style={{ color: '#F5F0E8' }}>Cita agendada</h3>
              <p className="text-sm mb-8" style={{ color: '#6B6350' }}>Te contactaremos pronto para confirmar.</p>
              <button onClick={() => setExito(false)}
                className="px-8 py-3 text-sm tracking-widest uppercase"
                style={{ border: '1px solid #C9A84C', color: '#C9A84C' }}>
                Agendar otra
              </button>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {error && (
                <div className="px-4 py-3 text-sm border" style={{ borderColor: 'rgba(239,68,68,0.3)', color: '#f87171', background: 'rgba(239,68,68,0.05)' }}>
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'Nombre completo *', key: 'cliente_nombre', type: 'text', ph: 'Tu nombre' },
                  { label: 'Teléfono *', key: 'cliente_telefono', type: 'tel', ph: '246 123 4567' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="text-xs tracking-widest uppercase block mb-2" style={{ color: '#6B6350' }}>{f.label}</label>
                    <input type={f.type} placeholder={f.ph} value={form[f.key]}
                      onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                      className="w-full px-4 py-3 text-sm outline-none transition-all duration-300"
                      style={{ background: '#111', border: '1px solid rgba(201,168,76,0.15)', color: '#F5F0E8' }}
                      onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.5)'}
                      onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.15)'}
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="text-xs tracking-widest uppercase block mb-2" style={{ color: '#6B6350' }}>Email (opcional)</label>
                <input type="email" placeholder="tu@email.com" value={form.cliente_email}
                  onChange={e => setForm({ ...form, cliente_email: e.target.value })}
                  className="w-full px-4 py-3 text-sm outline-none"
                  style={{ background: '#111', border: '1px solid rgba(201,168,76,0.15)', color: '#F5F0E8' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.15)'}
                />
              </div>

              <div>
                <label className="text-xs tracking-widest uppercase block mb-2" style={{ color: '#6B6350' }}>Servicio *</label>
                <select value={form.servicio_id} onChange={handleServicio}
                  className="w-full px-4 py-3 text-sm outline-none"
                  style={{ background: '#111', border: '1px solid rgba(201,168,76,0.15)', color: form.servicio_id ? '#F5F0E8' : '#6B6350' }}>
                  <option value="">Selecciona un servicio</option>
                  {servicios.map(s => (
                    <option key={s.id} value={s.id}>{s.nombre} — ${s.precio}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs tracking-widest uppercase block mb-2" style={{ color: '#6B6350' }}>Fecha *</label>
                  <input type="date" value={form.fecha}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={e => setForm({ ...form, fecha: e.target.value })}
                    className="w-full px-4 py-3 text-sm outline-none"
                    style={{ background: '#111', border: '1px solid rgba(201,168,76,0.15)', color: '#F5F0E8' }}
                    onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.5)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.15)'}
                  />
                </div>
                <div>
                  <label className="text-xs tracking-widest uppercase block mb-2" style={{ color: '#6B6350' }}>Hora *</label>
                  <select value={form.hora} onChange={e => setForm({ ...form, hora: e.target.value })}
                    className="w-full px-4 py-3 text-sm outline-none"
                    style={{ background: '#111', border: '1px solid rgba(201,168,76,0.15)', color: form.hora ? '#F5F0E8' : '#6B6350' }}>
                    <option value="">Selecciona una hora</option>
                    {horas.map(h => <option key={h} value={h}>{h} hrs</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs tracking-widest uppercase block mb-2" style={{ color: '#6B6350' }}>Notas adicionales</label>
                <textarea value={form.notas} onChange={e => setForm({ ...form, notas: e.target.value })}
                  placeholder="¿Algo que debamos saber?" rows={3}
                  className="w-full px-4 py-3 text-sm outline-none resize-none"
                  style={{ background: '#111', border: '1px solid rgba(201,168,76,0.15)', color: '#F5F0E8' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.15)'}
                />
              </div>

              <motion.button
                onClick={handleSubmit} disabled={enviando}
                className="w-full py-4 text-sm tracking-widest uppercase font-semibold transition-all duration-300 disabled:opacity-40"
                style={{ background: '#C9A84C', color: '#0a0a0a' }}
                whileHover={{ background: '#B8973B' }}
                whileTap={{ scale: 0.99 }}
              >
                {enviando ? 'Agendando...' : '✦ Reservar mi cita'}
              </motion.button>
            </div>
          )}
        </div>
      </section>

      {/* ── CONTACTO ── */}
      <section className="py-24 px-8 border-t" style={{ background: '#0d0d0d', borderColor: 'rgba(201,168,76,0.1)' }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { 
              icon: <FaMapMarkerAlt />, 
              titulo: 'Apizaco', 
              texto: 'Av. Ignacio Zaragoza y Xicoténcatl 333, Fátima', 
              sub: 'Lunes a Sábado',
              maps: 'https://maps.app.goo.gl/HwQttNPtCby9QKik8'
            },
            { 
              icon: <FaMapMarkerAlt />, 
              titulo: 'Tlaxcala', 
              texto: 'Av. Independencia 7-A, Centro', 
              sub: 'Lunes, Miércoles, Viernes',
              maps: 'https://maps.app.goo.gl/6a4rDFDXnBkoj4ij6'
            },
            { 
              icon: <FaClock />, 
              titulo: 'Horarios', 
              texto: '9:00 AM – 7:00 PM', 
              sub: 'Citas previas · 246 159 5231',
              maps: null
            },
          ].map((item, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div>
                <p className="text-amber-400 mb-3 text-sm">{item.icon}</p>
                <p className="text-xs tracking-widest uppercase mb-2" style={{ color: '#C9A84C' }}>{item.titulo}</p>
                <p className="text-sm mb-1" style={{ color: '#F5F0E8' }}>{item.texto}</p>
                <p className="text-xs mb-3" style={{ color: '#6B6350' }}>{item.sub}</p>
                {item.maps && (
                  <a href={item.maps} target="_blank" rel="noopener noreferrer"
                    className="text-xs tracking-widest uppercase transition-colors duration-300"
                    style={{ color: '#C9A84C', borderBottom: '1px solid rgba(201,168,76,0.3)' }}
                    onMouseEnter={e => e.target.style.borderBottomColor = '#C9A84C'}
                    onMouseLeave={e => e.target.style.borderBottomColor = 'rgba(201,168,76,0.3)'}
                  >
                    Ver en Google Maps →
                  </a>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-10 px-8 border-t flex flex-col md:flex-row justify-between items-center gap-4"
        style={{ background: '#0a0a0a', borderColor: 'rgba(201,168,76,0.1)' }}>
        <p className="text-xs tracking-widest uppercase" style={{ color: '#6B6350' }}>
          © 2026 Ilse Alvarado Studio · Todos los derechos reservados
        </p>
        <div className="flex gap-6">
          {[
            { icon: <FaInstagram />, href: 'https://instagram.com/ilsealvaradostudio' },
            { icon: <FaFacebook />,  href: 'https://facebook.com/IlseAlvaradoStudio' },
            { icon: <FaWhatsapp />,  href: 'https://wa.me/522461595231' },
          ].map((s, i) => (
            <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
              className="text-sm transition-colors duration-300"
              style={{ color: '#6B6350' }}
              onMouseEnter={e => e.target.style.color = '#C9A84C'}
              onMouseLeave={e => e.target.style.color = '#6B6350'}
            >
              {s.icon}
            </a>
          ))}
        </div>
      </footer>

      {/* ── WHATSAPP FLOTANTE ── */}
      <motion.a
        href="https://wa.me/522461595231" target="_blank"
        className="fixed bottom-6 right-6 w-13 h-13 flex items-center justify-center z-50 text-white"
        style={{ background: '#25D366', width: 52, height: 52, borderRadius: '50%', boxShadow: '0 4px 20px rgba(37,211,102,0.3)' }}
        whileHover={{ scale: 1.1 }}
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
      >
        <FaWhatsapp size={22} />
      </motion.a>

      {/* ── LIGHTBOX ── */}
      {imgActiva && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.92)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setImgActiva(null)}
        >
          <motion.img
            src={imgActiva}
            className="max-w-4xl max-h-screen object-contain"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
          <button onClick={() => setImgActiva(null)}
            className="absolute top-6 right-6 text-2xl"
            style={{ color: '#C9A84C' }}>✕</button>
        </motion.div>
      )}

    </div>
  )
}