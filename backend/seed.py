from database import SessionLocal
from models import Usuario, Servicio
from auth import hashear_password

db = SessionLocal()

# Crear admin
admin = Usuario(
    nombre="Ilse Alvarado",
    email="admin@ilsestudio.com",
    password=hashear_password("admin123"),
    es_admin=True
)
db.add(admin)

# Crear servicios iniciales
servicios = [
    Servicio(nombre="Microblading", descripcion="Técnica semipermanente para cejas perfectas", precio=800, duracion_min=90),
    Servicio(nombre="Hair Strokes", descripcion="Diseño de cejas pelo a pelo ultra natural", precio=900, duracion_min=90),
    Servicio(nombre="Depilación con Hilo", descripcion="Técnica ancestral para definir cejas", precio=80, duracion_min=30),
    Servicio(nombre="Limpieza Facial", descripcion="Limpieza profunda para piel radiante", precio=350, duracion_min=60),
    Servicio(nombre="Maquillaje Profesional", descripcion="Para eventos y ocasiones especiales", precio=500, duracion_min=60),
    Servicio(nombre="Coloración Capilar", descripcion="Cambio de look con productos premium", precio=400, duracion_min=120),
]

for servicio in servicios:
    db.add(servicio)

db.commit()
db.close()
print("✅ Admin y servicios creados correctamente")