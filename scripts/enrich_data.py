import pandas as pd
import os

# 1. CARGAR DATOS EXISTENTES
df = pd.read_csv('data/colombia_macro_annual.csv')

# 2. DICCIONARIO DE SALARIO MINIMO (Dato historico oficial)
# Formato: {año: valor_pesos}

salarios = {
    1990: 41025, 1991: 51716, 1992: 65190, 1993: 81510, 1994: 98700,
    1995: 118933, 1996: 142125, 1997: 172005, 1998: 203823, 1999: 236460,
    2000: 260100, 2001: 286000, 2002: 309000, 2003: 332000, 2004: 358000,
    2005: 381500, 2006: 408000, 2007: 433700, 2008: 461500, 2009: 496900,
    2010: 515000, 2011: 535600, 2012: 566700, 2013: 589500, 2014: 616000,
    2015: 644350, 2016: 689455, 2017: 737717, 2018: 781242, 2019: 828116,
    2020: 877803, 2021: 908526, 2022: 1000000, 2023: 1160000, 2024: 1300000,
    2025: 1423500
}

# 3. DICCIONARIO DE CONFLICTO (Muertes por combate - Fuente: UCDP)
conflicto = {
    1990: 501, 1991: 725, 1992: 1479, 1993: 182, 1994: 1123,
    1995: 823, 1996: 1192, 1997: 560, 1998: 939, 1999: 1374,
    2000: 1078, 2001: 1864, 2002: 2263, 2003: 730, 2004: 1234,
    2005: 1389, 2006: 502, 2007: 314, 2008: 219, 2009: 377,
    2010: 419, 2011: 202, 2012: 211, 2013: 140, 2014: 119,
    2015: 134, 2016: 30, 2017: 50, 2018: 147, 2019: 132,
    2020: 28, 2021: 150, 2022: 120, 2023: 110, 2024: 90
}

# 4. DICCIONARIO DE PRESUPUESTO TOTAL 

presupuesto_total = {
    1990: 4.88,   1991: 5.43,   1992: 7.32,   1993: 12.85,  1994: 15.40,
    1995: 18.15,  1996: 23.58,  1997: 30.31,  1998: 38.74,  1999: 45.32,
    2000: 46.61,  2001: 56.98,  2002: 62.91,  2003: 67.17,  2004: 76.65,
    2005: 93.11,  2006: 105.40, 2007: 116.43, 2008: 124.20, 2009: 140.50,
    2010: 148.3,  2011: 147.2,  2012: 165.3,  2013: 185.5,  2014: 199.0,
    2015: 216.2,  2016: 215.9,  2017: 224.4,  2018: 235.6,  2019: 258.9,
    2020: 271.7,  2021: 313.9,  2022: 350.4,  2023: 422.8,  2024: 502.6
}

# DICCIONARIO INVERSION EN EDUCACION

educacion_oficial = {
        1990: 10.1, 1991: 10.4, 1992: 10.8, 1993: 11.2, 1994: 11.5,
        1995: 11.9, 1996: 12.1, 1997: 12.3, 1998: 12.5, 1999: 12.4,
        2000: 12.6, 2001: 12.9, 2002: 12.8, 2003: 12.5, 2004: 12.2,
        2005: 12.7, 2006: 13.0, 2007: 13.1, 2008: 13.2, 2009: 13.4,
        2010: 13.8, 2011: 13.9, 2012: 13.7, 2013: 14.1, 2014: 14.2,
        2015: 14.8, 2016: 15.1, 2017: 15.4, 2018: 15.6, 2019: 16.5,
        2020: 15.8, 2021: 15.1, 2022: 14.5, 2023: 13.5, 2024: 15.4,
        2025: 15.2
    }


# Hay dos formas rapidas de rellenar nuestro df con datos de un diccionario (SALARIO MINIMO)

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

print(df.tail())
print("DF enriquecido exitosamente")


# Inyectamos dados de CONFLICTO en nuestro df

print("Cargando datos de conflicto armado")
df['Muertes_Conflicto'] = df ['anio'].map(conflicto) # creamos columna y con .map() inyectamos datos del diccionario conflicto

# Inyectamos datos de inflacion y PIB para 2024

df.loc[df['anio'] == 2024, 'Crecimiento_PIB_pct'] = 1.6
df.loc[df['anio'] == 2024, 'Inflacion_Anual_pct'] = 6.77
# Guardamos los datos en el mismo archivo para ir completando


# Inyectamos dados de PRESUPUESTO en nuestro df
print("Cargando datos del PRESUPUESTO GENERAL")
df['Presupuesto_Total_COP']= df ['anio'].map(presupuesto_total)

# Inyectamos dados de EDUCACION en nuestro df
df['Gasto_Educacion_pct_Presupuesto']= df ['anio'].map(educacion_oficial)


# Vamos a inyectar datos unicos para años determinados, con .loc

df.loc[df['anio'] == 2024, 'Gasto_Educacion_pct_Presupuesto'] = 14.0
df.loc[df['anio'] == 2025, 'Inflacion_Anual_pct'] = 2.6
df.loc[df['anio'] == 2025, 'Poblacion'] = 53200000.0
df.loc[df['anio'] == 2025, 'Crecimiento_PIB_pct'] = 2.6
df.loc[df['anio'] == 2025, 'Presupuesto_Total_COP'] = 511.2
df.loc[df['anio'] == 2025, 'Muertes_Conflicto'] = 278


df.to_csv('data/colombia_macro_annual.csv', index=False) # guardamos el df con info de conflicto actualizada


print("DF enriquecido exitosamente")



