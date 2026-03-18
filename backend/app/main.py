from fastapi import FastAPI
import pandas as pd 
from typing import List
from pydantic import BaseModel

# Iniciamos nuestra aplicacion fastAPI
app = FastAPI(
    title="CGD API",
    description="Colombian Government Data API"
)

# ----1. CARGA DE DATOS ---
# Cargamos el CSV al iniciar la aplicacion para que este en memoria
# Nota: La ruta es relativa a la raiz del proyecto
df = pd.read_csv("data/colombia_macro_annual.csv").fillna(0)


# ----2. MODELO DE DATOS (ESQUEMA) ---
# Esto define la estructura de cada fila de nuestro CSV para FastAPI
class MacroData(BaseModel):
    anio: int
    Poblacion: float
    Crecimiento_PIB_pct: float
    Presupuesto_Total_COP: float
    Gasto_Militar_pct_Presupuesto: float
    Gasto_Educacion_pct_Presupuesto: float
    Inflacion_Anual_pct: float
    Desempleo_pct_Total: float
    Inversion_Extranjera_pct_PIB: float
    Presidente: str
    Salario_Minimo_COP: float
    Muertes_Conflicto: float

# ----3. RUTAS (ENDPOINTS) ---

# Creamos nuestro primer endpoint (Ruta principal)
@app.get("/")
def read_root():
    return {
        "mensaje": "Bienvenido a la API de CGD (Colombia Government Data)",
        "estado": "Carga de datos exitosa",
        "columnas_detectadas": list(df.columns)
    }
@app.get("/data", response_model=List[MacroData])
def get_all_data():
    # Convertimos el DataFrame de Pandas a una lista de diccionarios (JSON)
    return df.to_dict(orient="records")





