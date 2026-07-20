from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import engine, get_db
import models, schemas
from auth import verificar_password, hashear_password, crear_token, get_admin_actual

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Salon App API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── AUTH ──────────────────────────────────────────
@app.post("/auth/login", response_model=schemas.Token)
def login(datos: schemas.UsuarioLogin, db: Session = Depends(get_db)):
    usuario = db.query(models.Usuario).filter(models.Usuario.email == datos.email).first()
    if not usuario or not verificar_password(datos.password, usuario.password):
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")
    token = crear_token({"sub": usuario.email})
    return {"access_token": token, "token_type": "bearer"}

# ── SERVICIOS ─────────────────────────────────────
@app.get("/servicios", response_model=list[schemas.ServicioResponse])
def obtener_servicios(db: Session = Depends(get_db)):
    return db.query(models.Servicio).filter(models.Servicio.activo == True).all()

@app.post("/servicios", response_model=schemas.ServicioResponse)
def crear_servicio(servicio: schemas.ServicioCreate, db: Session = Depends(get_db), admin=Depends(get_admin_actual)):
    nuevo = models.Servicio(**servicio.model_dump())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

@app.delete("/servicios/{id}")
def eliminar_servicio(id: int, db: Session = Depends(get_db), admin=Depends(get_admin_actual)):
    servicio = db.query(models.Servicio).filter(models.Servicio.id == id).first()
    if not servicio:
        raise HTTPException(status_code=404, detail="Servicio no encontrado")
    servicio.activo = False
    db.commit()
    return {"mensaje": "Servicio eliminado"}

# ── CITAS ─────────────────────────────────────────
@app.post("/citas", response_model=schemas.CitaResponse)
def crear_cita(cita: schemas.CitaCreate, db: Session = Depends(get_db)):
    nueva = models.Cita(**cita.model_dump())
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva

@app.get("/citas", response_model=list[schemas.CitaResponse])
def obtener_citas(db: Session = Depends(get_db), admin=Depends(get_admin_actual)):
    return db.query(models.Cita).order_by(models.Cita.creado_en.desc()).all()

@app.put("/citas/{id}/estado")
def actualizar_estado(id: int, datos: schemas.CitaUpdateEstado, db: Session = Depends(get_db), admin=Depends(get_admin_actual)):
    cita = db.query(models.Cita).filter(models.Cita.id == id).first()
    if not cita:
        raise HTTPException(status_code=404, detail="Cita no encontrada")
    cita.estado = datos.estado
    db.commit()
    return {"mensaje": "Estado actualizado"}

@app.delete("/citas/{id}")
def eliminar_cita(id: int, db: Session = Depends(get_db), admin=Depends(get_admin_actual)):
    cita = db.query(models.Cita).filter(models.Cita.id == id).first()
    if not cita:
        raise HTTPException(status_code=404, detail="Cita no encontrada")
    db.delete(cita)
    db.commit()
    return {"mensaje": "Cita eliminada"}