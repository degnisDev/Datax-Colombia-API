import pandas as pd 
import requests

# Esto es lo que le vamos a pedir al banco mundial "Lista de compras"
# Cada codigo raro (indicador) representa un dato especifico

indicadores = {
    'SP.POP.TOTL': 'Poblacion',
    'NY.GDP.MKTP.KD.ZG': 'Crecimiento_PIB_pct',
    'MS.MIL.XPND.GD.ZS': 'Gasto_Militar_pct_PIB',
    'SE.XPD.TOTL.GB.ZS': 'Gasto_Educacion_pct_GastoTotal',
    'FP.CPI.TOTL.ZG': 'Inflacion_Anual_pct'
}

# Configuracion de la peticion
PAIS = 'CO' # Colombia
INICIO = 1990
FIN = 2025

def descargar_indicador(codigo, nombre_columna):
    print(f"Descargando {nombre_columna}...")

# Construimos la URL personalizada uniendo las piezas (f-string)
    url = f"https://api.worldbank.org/v2/country/{PAIS}/indicator/{codigo}?date={INICIO}:{FIN}&format=json&per_page=100"

    # El mensajero (request) va a esa direccion y pide 
    respuesta = requests.get(url)

    # El Banco Mundial devuelve una lista: [Metadatos, Datos Reales]
    # Extraemos la lista de datos (esta en la posicion 1 del JSON)
    datos_crudos = respuesta.json()[1]

    # Pandas convierte esa lista en una tabla (DataFrame)
    df = pd.DataFrame(datos_crudos)

    # Seleccionamos solo las columnas Year (date) y Valor (value)
    df = df[['date','value']]

    # Renombramos la comumna 'value' al nombre que nosotros queramos
    df = df.rename(columns={'value':nombre_columna})

    return df

# BUCLE MAESTRO (UNIMOS Todo)
# 1. Creamos una tabla base vacia con los anos que nos interesan
# range (INICIO, FIN +1) nos da la lista de numeros del 1990 al 2024
df_maestro = pd.DataFrame({'anio': range(INICIO, FIN + 1)})

# 2. Empezamos el bucle (la iteracion)
for cod, nom in indicadores.items():
    # Descargamos el indicador actual
    df_temporal = descargar_indicador(cod, nom)

    # Pasamos el a;o de la API de texto '1990' a numero (1990)
    df_temporal['date'] = df_temporal['date'].astype(int)

    # UNIMOS (Merge) la tabla temporal con nuestra tabla maestra
    # 'how=left' significa: quedate con todos los a;os de la tabla maestra
    df_maestro = pd.merge(df_maestro, df_temporal, left_on='anio', right_on='date',
    how='left')

    # Borramos la columna 'date' (por que ya tenemos anio que es lo mas importante)
    df_maestro = df_maestro.drop(columns=['date'])

#3 Veamos como quedo nuestro trabajo por consola
print("\n--- !DATOS DESCARGADOS CON EXITO! ---")
print(df_maestro.head()) # Muestra las 5 primeras filas