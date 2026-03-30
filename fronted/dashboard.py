import streamlit as st
import requests
import pandas as pd 
import plotly.express as px
import plotly.graph_objects as go


# 1. CONFIGURACION DE LA PAGINA
# ====================================

st.set_page_config(
    page_title="CGD | Colombian Government Data",
    page_icon="CO",
    layout="wide",
    initial_sidebar_state="expanded"
)

# 2. CARGA DE DATOS DESDE LA API LOCAL
# =====================================

API_URL = "http://127.0.0.1:8000"

@st.cache_data
def load_data():
    """Carga todos los datos desde nuestra API FastAPI."""
    try:
        response = requests.get(f"{API_URL}/data")
        response.raise_for_status()
        df = pd.DataFrame(response.json())
        return df
    except requests.exceptions.ConnectionError:
        st.error("⚠️ No se puede conectar a la API. Asegúrese de que el servidor FastAPI esté corriendo.")
        return pd.DataFrame()

df = load_data()


# 3. SIDEBAR - FILTROS
# ======================================


st.sidebar.image("https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Flag_of_Colombia.svg/200px-Flag_of_Colombia.svg.png", width=80)
st.sidebar.title("co CGD Dashboard")
st.sidebar.markdown("**Colombia Government Data**")
st.sidebar.divider()

# 4. NAVEGACION (PANELES)
# =====================================

panel = st.sidebar.radio(
    " Selecciona un Panel",
    options=["🌍 Panel General","🧓🏻 Panel Presidente","⚖️ Panel Comparativo"],
    index=0
)

# ===============================================
# MAPA DE COLORES POR PRESIDENTE
# Cada presidente tendra su propio color en todas las graficas

COLOR_MAP = {
    "César Gaviria":        "#3498DB",   # Azul
    "Ernesto Samper":       "#E74C3C",   # Rojo
    "Andrés Pastrana":      "#2ECC71",   # Verde
    "Álvaro Uribe 1":       "#F39C12",   # Naranja
    "Álvaro Uribe 2":       "#E67E22",   # Naranja oscuro (mismo partido)
    "Juan Manuel Santos 1": "#9B59B6",   # Morado
    "Juan Manuel Santos 2": "#7D3C98",   # Morado oscuro (segundo periodo)
    "Iván Duque":           "#1ABC9C",   # Verde agua
    "Gustavo Petro":        "#C0392B",   # Rojo oscuro
}

# 5. RENDERIZADO POR PANEL
# ====================================

# Si la API no devolvio datos, detenemos la app aqui
if df.empty:
    st.stop()

# ================= PANEL GENERAL ====================
if panel == "🌍 Panel General":

    st.title("Panel General - Todos los Presidentes")
    st.markdown("Vision historica completa de colombia desde **1990 hasta 2025**.")
    st.divider()

    # --- FILA DE KPIS (metricas de resumen) ----
    # st.columns() divide la pantalla en columnas iguales
    col1, col2, col3 = st.columns(4)


    # calculamos el promedio de cada indicador clave en todo el periodo
    col1.metric("PIB Promedio", f"{df['Crecimiento_PIB_pct'].mean():.1f}%")
    col2.metric("Inflacion Promedio", f"{df['Inflacion_Anual_pct'].mean():.1f}%")
    col2.metric("Desempleo Promedio", f"{df['Desempleo_pct_Total'].mean():.1f}%")
    col2.metric("Total Muertes Conflicto", f"{df['Muertes_Conflicto'].mean():.1f}%")

    st.divider()

    # --------------- GRAFICA #1 --------------------
 # px.bar crea un gráfico de barras interactivo
    # x = eje horizontal (años), y = eje vertical (valor), color = colorea por presidente
    # color_discrete_map aplica nuestro mapa de colores personalizado
    fig_pib = px.bar(
        df,
        x="anio",
        y="Crecimiento_PIB_pct",
        color="Presidente",
        color_discrete_map=COLOR_MAP,
        title="Crecimiento del PIB (%) por año y presidente",
        labels={"anio": "Año", "Crecimiento_PIB_pct": "Crecimiento PIB (%)"},
        text_auto=".1f"
    )

# Anadimos una linea horizontal en cero para ver facilmente los negativos
fig_pib.add_hline(y=0, line_dash="dash", line_color="white", opacity=0.5)
fig_pib.update_layout(plot_bgcolor="rgba(0,0,0,0)", paper_bgcolor="rgba(0,0,0,0)")
st.plotly_chart(fig_pib, use_container_with=True) #  use_container_with=True = ocupa todo el ancho

# --- FILA CON 2 GRAficas LADO A LADO ---
col_a, col_b = st.columns(2)

with col_a:
    # GRAFICA 2: Inflacion - usamos la linea porque es una serie temporal continua
    fig_inf = px.line(
        df,
        x='anio',
        y="Inflacion_Anual_pct",
        color="Presidente",
        color_discrete_map=COLOR_MAP,
        title="Inflacion Anual (%)",
        markers=True, # Muestra un punto en cada a;o
        labels={"anio": "Año", "Inflacion_Anual_pct": "Inflacion (%)"}
    )
    fig_inf.update_layout(plot_bgcolor="rgba(0,0,0,0)", paper_bgcolor="rgba(0,0,0,0)")
    st.plotly_chart(fig_inf, use_container_with=True)


with col_b:
    # GRAFICA 3: Desempleo - tambien serie temporal, usamos linea con area rellena
    fig_desemp = px.area(
        df,
        x="anio",
        y="Desempleo_pct_Total",
        color="Presidente",
        color_discrete_map=COLOR_MAP,
        title="👷 Tasa de Desempleo (%)",
        labels={"anio": "Año", "Desempleo_pct_Total": "Desempleo (%)"}
    )    

    fig_desemp.update_layout(plot_bgcolor="rgba(0,0,0,0)", paper_bgcolor="rgba(0,0,0,0)")
    st.plotly_chart(fig_desemp, use_container_with=True)

st.divider()

# ---- FILA CON 2 GRAFICAS ---
col_c, col_d = st.columns(2)

with col_c:
    # GRAFICA 4: Gastp en Educacion - barras para comparar magnitudes entre presidentes
    fig_edu = px.bar(
        df,
        x="anio",
        y="Gasto_Educacion_pct_Presupuesto",
        color="Presidente",
        color_discrete_map=COLOR_MAP,
        title="Gasto en Educacion (% del Presupuesto Gral)",
        labels={"anio": "Año", "Gasto_Educacion_pct_Presupuesto": "Educación (%)"}
    ) 

    fig_desemp.update_layout(plot_bgcolor="rgba(0,0,0,0)", paper_bgcolor="rgba(0,0,0,0)")
    st.plotly_chart(fig_desemp, use_container_with=True)

with col_d:
    # GRAFICA 5: Muertes en conflicto - barras, facil de ver los picos historicos
    fig_conf = px.bar (
        df,
        x="anio",
        y="Muertes_Conflicto",
        color="Presidente",
        color_discrete_map=COLOR_MAP,
        title="Muertes en Conflicto Armado",
        labels={"anio": "Año", "Muertes_Conflicto": "Muertes"}
    ) 

    fig.conf.update_layout(plot_bgcolor="rgba(0,0,0,0)", paper_bgcolor="rgba(0,0,0,0)")
    st.plotly_chart(fig_conf, use_container_width=True)




































# if df.empty:
#     st.stop()

# if panel == "🌍 Panel General":
#     st.title("Panel General - Todos los Presidentes")
#     st.markdown("Vision historica completa de colombia desde **1990 hasta 2025**.")

# elif panel == "🧓🏻 Panel Presidente":
#     st.title("🧓🏻 Panel Presidente")
#     st.markdown("Analisis detallado por presidente")

# elif panel == "⚖️ Panel Comparativo":
#     st.title("⚖️ Panel Comparativo")
#     st.markdown("Compara el desempeño entre dos presidentes")
























