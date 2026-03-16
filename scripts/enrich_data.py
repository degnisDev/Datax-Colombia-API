import pandas as pd
import os

# 1. CARGAR DATOS EXISTENTES
df = pd.read_csv('data/colombia_macro_annual.csv')

# 2. DICCIONARIO DE SALARIO MINIMO (Dato historico oficial)
# Formato: {año: valor_pesos}

salarios = {
    1990: 41025, 1991: 51716, 1992: 656190, 1993: 81510, 1994: 98700,
    1995: 118933, 1996: 142125, 1997: 172005, 1998: 203823, 1999: 236460,
    2000: 260100, 2001: 286000, 2002: 309000, 2003: 332000, 2004: 358000,
    2005: 381500, 2006: 408000, 2007: 433700, 2008: 461500, 2009: 496900,
    2010: 515000, 2011: 535600, 2012: 566700, 2013: 589500, 2014: 616000,
    2015: 644350, 2016: 689455, 2017: 737717, 2018: 781242, 2019: 828116,
    2020: 877803, 2021: 908526, 2022: 1000000, 2023: 1160000, 2024: 1300000,
    2025: 1423500
}

# Hay dos formas rapidas de rellenar nuestro df con datos de un diccionario

# Forma 1 con .GET
# -------------------------------------------------


# def obtener_salario(anio):
    # .get(llave_a_buscar, valor_por_defecto_si_no_existe)
    # return salarios.get(anio, "Dato no disponible")

print("Iniciando carga de datos...")

# Creamos la nueva columna en el df e inyectamos los nuevos datos con la fx creada
# df ['Salario_Minimo_COP'] = df ['anio'].apply(obtener_salario)


# Forma 2 con .map()
# -------------------------------------------------

df['Salario_Minimo_COP'] = df ['anio'].map(salarios)

# Guardamos los datos en el mismo archivo para ir completando
df.to_csv('data/colombia_macro_annual.csv', index=False)
 
print(df.tail())
print("DF enriquecido exitosamente")
