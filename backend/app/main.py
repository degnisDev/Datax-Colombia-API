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

# 1ER endpoint (Ruta principal)
@app.get("/")
def read_root():
    return {
        "mensaje": "Bienvenido a la API de CGD (Colombia Government Data)",
        "estado": "Carga de datos exitosa",
        "columnas_detectadas": list(df.columns)
    }


# 2DO endpoint (Toda la data)
@app.get("/data", response_model=List[MacroData])
def get_all_data():
    # Convertimos el DataFrame de Pandas a una lista de diccionarios (JSON)
    return df.to_dict(orient="records")

# 3ER endpoint (Filtro por años)
@app.get("/data/{item_anio}")
def get_year_data(item_anio: int):
    """busca los datos de un año especifico"""
    # Filtramos el DataFrame usando año
    resultado = df[df['anio']== item_anio]

    # Si no encuentra nada, devolvemos un mensaje de error
    if resultado.empty:
        return {"error": "Año no encontrado en nuestra Bade de datos"}
    
    # Si lo encuentra, lo convertimos en un diccionario para que sea un JSON
    return resultado.to_dict(orient="records")[0]


# 4TO endpoint (Filtro por Presidente)
@app.get("/data/presidente/{nombre}")
def get_presidente_data(nombre: str):
    """Filtra todos los años gobernados por un presidente en especifico"""
    # Usamos .str.contrains para que busque si el nombre coincide parcialmente
    # case=False, na=False el primero desactiva el case sentive y el segundo omite los N/A
    resultado = df[df['Presidente'].str.contains(nombre, case=False, na=False)]

    if resultado.empty:
        return {"error": f"No se encontraron registros para el presidente: {nombre}"}

    # Aqui no ponemos el [0] por que un presidente goberno varios años y los queremos todos
    return resultado.to_dict(orient="records")


