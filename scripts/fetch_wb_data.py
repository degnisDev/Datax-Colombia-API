import pandas as pd     # Permite manejar tablas de datos (DataFrames) como si fuera Excel en código.
import requests      # Permite viajar a internet y pedir datos a servidores (APIs).
import os            # Permite hablar con tu sistema operativo (crear carpetas, rutas, etc.).

# ETL - Extract Transform Load

# Esto es lo que le vamos a pedir al banco mundial "Lista de compras"
# Cada codigo raro (indicador) representa un dato especifico

indicadores = {
    'SP.POP.TOTL': 'Poblacion',
    'NY.GDP.MKTP.KD.ZG': 'Crecimiento_PIB_pct',
    'GC.XPN.TOTL.CN': 'Presupuesto_Total_COP',
    # 'MS.MIL.XPND.GD.ZS': 'Gasto_Militar_pct_PIB',
    'MS.MIL.XPND.ZS': 'Gasto_Militar_pct_Presupuesto',
    'SE.XPD.TOTL.GB.ZS': 'Gasto_Educacion_pct_Presupuesto',
    'FP.CPI.TOTL.ZG': 'Inflacion_Anual_pct',
    'SL.UEM.TOTL.ZS': 'Desempleo_pct_Total',
    'BX.KLT.DINV.WD.GD.ZS': 'Inversion_Extranjera_pct_PIB'
}

# Configuracion de la peticion
PAIS = 'CO' # Colombia
INICIO = 1990
FIN = 2025

# Hacemos un Merge ("buscarV") para por medio del año traer el presidente respectivamente

def obtener_presidente(anio):
    if 1990 <= anio <= 1994:
        return "César Gaviria"
    elif 1995 <= anio <= 1998:
        return "Ernesto Samper"
    elif 1999 <= anio <= 2002:
        return "Andrés Pastrana"
    elif 2003 <= anio <= 2006:
        return "Álvaro Uribe 1"
    elif 2007 <= anio <= 2010:
        return "Álvaro Uribe 2"
    elif 2011 <= anio <= 2014:
        return "Juan Manuel Santos 1"
    elif 2015 <= anio <= 2018:
        return "Juan Manuel Santos 2"
    elif 2019 <= anio <= 2022:
        return "Iván Duque"
    elif 2023 <= anio <= 2026:
        return "Gustavo Petro"
    else:
        return "Dato no disponible"

def descargar_indicador(codigo, nombre_columna):
    print(f"Descargando {nombre_columna}...")

# Construimos la URL personalizada uniendo las piezas (f-string)
    url = f"https://api.worldbank.org/v2/country/{PAIS}/indicator/{codigo}?date={INICIO}:{FIN}&format=json&per_page=100"


# -------------------------------------------------------
# 1 - CONEXION: Llama a la API del Banco Mundial e inicia la peticion.
# -------------------------------------------------------
# El mensajero (request) va a esa direccion y hace una peticion
    respuesta = requests.get(url)


# -------------------------------------------------------
# 2 - TRANSFORMACION: Convierte los datos crudos (JSON) en una tabla de Pandas.
# -------------------------------------------------------
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
# Creamos una tabla base vacia con los anos que nos interesan
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

# -------------------------------------------------------
# 3 - MAPEO: Asigna el Presidente correspondiente a cada año con .apply()
# -------------------------------------------------------
# Agregamos presidente a nuestro script usando la columna año con la funcion creada


print("Etiquetando presidentes...")
# .apply es como decirle vete fila por fila y haz esto
df_maestro['Presidente'] = df_maestro['anio'].apply(obtener_presidente)


# -------------------------------------------------------
# 4 - EXPORTACION: Guarda la tabla final en un archivo CSV físico.
# -------------------------------------------------------
# Guardar los datos en un archivo Fisico (CSV)



# Primero nos aseguramos de que exite la carpeta data
if not os.path.exists('data'):
    print("Creando carpeta 'data' para guardar los resultados consultados...")
    os.makedirs('data')

# Guardamos el archivo
df_maestro.to_csv('data/colombia_macro_annual.csv', index=False)


# -------------------------------------------------------
# 5 - VISUALIZACION: Muestra un resumen de los datos en la terminal.
# -------------------------------------------------------
print("\n--- !DATOS DESCARGADOS Y GUARDADOS CON EXITO! ---")
print(df_maestro.tail()) # Muestra las últimas 5 filas (Petro/Duque)