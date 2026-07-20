from database import SessionLocal
from models import Usuario
from auth import hashear_password

db = SessionLocal()

admin = db.query(Usuario).filter(Usuario.email == 'admin@ilsestudio.com').first()
if admin:
    admin.password = hashear_password('admin123')
    db.commit()
    print('✅ Contraseña actualizada')
else:
    print('❌ Admin no encontrado')

db.close()