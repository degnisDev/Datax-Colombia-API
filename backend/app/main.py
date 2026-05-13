from fastapi import FastAPI
import pandas as pd
from typing import List
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

# ---- App ----
app = FastAPI(
    title="CGD API",
    description="Colombian Government Data API"
)

# ---- CORS (permisos para que el frontend se conecte) ----
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---- 1. CARGA DE DATOS ----
# Ruta relativa a la raíz del proyecto (donde se ejecuta uvicorn)
df = pd.read_csv("data/colombia_macro_annual.csv").fillna(0)


# ---- 2. MODELO DE DATOS (ESQUEMA) ----
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


# ---- 3. CONFIGURACIÓN PRESIDENTES / TRANSICIONES ----
# Mapeo exacto: nombre en CSV → clave interna
PRESIDENT_NAME_MAP = {
    "César Gaviria":          "Gaviria",
    "Ernesto Samper":         "Samper",
    "Andrés Pastrana":        "Pastrana",
    "Álvaro Uribe 1":         "Uribe_1",
    "Álvaro Uribe 2":         "Uribe_2",
    "Juan Manuel Santos 1":   "Santos_1",
    "Juan Manuel Santos 2":   "Santos_2",
    "Iván Duque":             "Duque",
    "Gustavo Petro":          "Petro",
}

PRESIDENT_COLORS = {
    "Gaviria":  "#78909C",   # Gris
    "Samper":   "#7B1FA2",   # Púrpura
    "Pastrana": "#00838F",   # Teal
    "Uribe_1":  "#1565C0",   # Azul oscuro
    "Uribe_2":  "#42A5F5",   # Azul eléctrico
    "Santos_1": "#2E7D32",   # Verde bosque
    "Santos_2": "#9CCC65",   # Verde lima
    "Duque":    "#E65100",   # Naranja
    "Petro":    "#B71C1C",   # Rojo carmín
}

# Años de transición: { año: [(clave_presidente, peso_decimal), ...] }
# Años de transición: año → (presidente_saliente, presidente_entrante)
TRANSITIONS = {
    1994: ("Gaviria",  "Samper"),
    1998: ("Samper",   "Pastrana"),
    2002: ("Pastrana", "Uribe_1"),
    2006: ("Uribe_1",  "Uribe_2"),
    2010: ("Uribe_2",  "Santos_1"),
    2014: ("Santos_1", "Santos_2"),
    2018: ("Santos_2", "Duque"),
    2022: ("Duque",    "Petro"),
}


# ---- 4. ENDPOINTS ----

# Ruta raíz
@app.get("/")
def read_root():
    return {
        "mensaje": "Bienvenido a la API de CGD (Colombia Government Data)",
        "estado": "Carga de datos exitosa",
        "columnas_detectadas": list(df.columns)
    }


# Todos los datos
@app.get("/data", response_model=List[MacroData])
def get_all_data():
    return df.to_dict(orient="records")


# ⚠️ IMPORTANTE: /data/chart debe ir ANTES de /data/{item_anio}
@app.get("/data/chart")
def get_chart_data(indicador: str = "Crecimiento_PIB_pct"):
    """
    Devuelve 1 valor por año con metadatos del presidente.
    Los años de transición incluyen info de ambos mandatarios (sin dividir el valor).
    """
    result = []

    for _, row in df.iterrows():
        year = int(row["anio"])
        raw_value = float(row.get(indicador, 0) or 0)
        csv_name = str(row.get("Presidente", "")).strip()
        pres_key = PRESIDENT_NAME_MAP.get(csv_name, "")

        point = {
            "year": year,
            "value": round(raw_value, 3),
            "president": pres_key,
            "color": PRESIDENT_COLORS.get(pres_key, "#666"),
            "transition": year in TRANSITIONS,
        }

        if year in TRANSITIONS:
            outgoing, incoming = TRANSITIONS[year]
            point["outgoing"] = outgoing
            point["incoming"] = incoming
            point["outgoing_color"] = PRESIDENT_COLORS[outgoing]
            point["incoming_color"] = PRESIDENT_COLORS[incoming]

        result.append(point)

    return {
        "data": result,
        "colors": PRESIDENT_COLORS,
        "presidents": list(PRESIDENT_COLORS.keys()),
        "indicador": indicador,
    }


# Filtro por año específico
@app.get("/data/{item_anio}")
def get_year_data(item_anio: int):
    """Busca los datos de un año específico."""
    resultado = df[df["anio"] == item_anio]
    if resultado.empty:
        return {"error": "Año no encontrado en nuestra Base de datos"}
    return resultado.to_dict(orient="records")[0]


# Filtro por presidente (búsqueda parcial)
@app.get("/data/presidente/{nombre}")
def get_presidente_data(nombre: str):
    """Filtra todos los años gobernados por un presidente específico."""
    resultado = df[df["Presidente"].str.contains(nombre, case=False, na=False)]
    if resultado.empty:
        return {"error": f"No se encontraron registros para el presidente: {nombre}"}
    return resultado.to_dict(orient="records")
