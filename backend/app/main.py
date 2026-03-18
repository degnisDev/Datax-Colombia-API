from fastapi import FastAPI 

# Iniciamos nuestra aplicacion fastAPI
app = FastAPI(
    title="CGD API",
    description="API para datos macroeconomicos de Colombia"
)

# Creamos nuestro primer endpoint (Ruta principal)
@app.get("/")
def read_root():
    return {"mensaje": "Bienvenido a la API de CGD (Colombia Goverment Data). Fase 2 en marcha."}
