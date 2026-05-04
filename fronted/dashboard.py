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
# 4.1 SEGMENTACIÓN POR PILARES
# ===============================================
st.sidebar.divider()
pilares = st.sidebar.multiselect(
    "🔍 Filtrar por Ejes:",
    options=["Economía", "Social", "Seguridad", "Inversión Pública"],
    default=["Economía", "Social", "Seguridad", "Inversión Pública"]
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

if df.empty:
    st.stop()

# ================= PANEL GENERAL ====================
if panel == "🌍 Panel General":
    st.title("🌍 Panel General — Visión Histórica")
    st.markdown("Analiza la evolución de Colombia segmentada por tus intereses.")
    st.divider()

    # --- INDICADORES DINÁMICOS (KPIs) ---
    st.subheader("📌 Promedios Históricos")
    kpi1, kpi2, kpi3, kpi4 = st.columns(4)
    kpi1.metric("📈 PIB", f"{df['Crecimiento_PIB_pct'].mean():.1f}%")
    kpi2.metric("💸 Inflación", f"{df['Inflacion_Anual_pct'].mean():.1f}%")
    kpi3.metric("👷 Desempleo", f"{df['Desempleo_pct_Total'].mean():.1f}%")
    kpi4.metric("☮️ Conflicto (Total)", f"{int(df['Muertes_Conflicto'].sum()):,}")
    st.divider()

    # --- SEGMENTACIÓN POR PILARES ---

    # 1. ECONOMÍA (PIB, Inflación, Inversión Extranjera)
    if "Economía" in pilares:
        st.header("📈 Pilar 1: Economía")
        col_e1, col_e2 = st.columns(2)
        with col_e1:
            fig_pib = px.bar(df, x="anio", y="Crecimiento_PIB_pct", color="Presidente", color_discrete_map=COLOR_MAP, title="Variación PIB (%)")
            st.plotly_chart(fig_pib, use_container_width=True)
        with col_e2:
            fig_inv = px.line(df, x="anio", y="Inversion_Extranjera_pct_PIB", color="Presidente", color_discrete_map=COLOR_MAP, title="Inversión Extranjera (% del PIB)")
            st.plotly_chart(fig_inv, use_container_width=True)
        
        fig_inf = px.line(df, x="anio", y="Inflacion_Anual_pct", color="Presidente", color_discrete_map=COLOR_MAP, title="Inflación Anual (%)", markers=True)
        st.plotly_chart(fig_inf, use_container_width=True)

    # 2. SOCIAL (Desempleo, Salario Mínimo, Población)
    if "Social" in pilares:
        st.header("👥 Pilar 2: Social & Empleo")
        col_s1, col_s2 = st.columns(2)
        with col_s1:
            fig_des = px.area(df, x="anio", y="Desempleo_pct_Total", color="Presidente", color_discrete_map=COLOR_MAP, title="Tasa de Desempleo (%)")
            st.plotly_chart(fig_des, use_container_width=True)
        with col_s2:
            fig_sal = px.line(df, x="anio", y="Salario_Minimo_COP", title="Evolución Salario Mínimo (COP)", markers=True)
            st.plotly_chart(fig_sal, use_container_width=True)

    # 3. SEGURIDAD (Muertes Conflicto)
    if "Seguridad" in pilares:
        st.header("🛡️ Pilar 3: Seguridad & Conflicto")
        fig_conf = px.bar(df, x="anio", y="Muertes_Conflicto", color="Presidente", color_discrete_map=COLOR_MAP, title="Víctimas Conflicto Armado")
        st.plotly_chart(fig_conf, use_container_width=True)

    # 4. INVERSIÓN PÚBLICA (Educación, Militar, Presupuesto)
    if "Inversión Pública" in pilares:
        st.header("🏗️ Pilar 4: Inversión Pública")
        col_i1, col_i2 = st.columns(2)
        with col_i1:
            fig_edu = px.bar(df, x="anio", y="Gasto_Educacion_pct_Presupuesto", color="Presidente", color_discrete_map=COLOR_MAP, title="Inversión en Educación (%)")
            st.plotly_chart(fig_edu, use_container_width=True)
        with col_i2:
            fig_mil = px.bar(df, x="anio", y="Gasto_Militar_pct_Presupuesto", color="Presidente", color_discrete_map=COLOR_MAP, title="Gasto Militar (%)")
            st.plotly_chart(fig_mil, use_container_width=True)

# ============== PANEL PRESIDENTE ==============
elif panel == "🧓🏻 Panel Presidente":
    st.title("🧓🏻 Panel Presidente")
    st.info("🚧 Próximo paso: Aquí filtraremos por el presidente seleccionado.")

# ============== PANEL COMPARATIVO ==============
elif panel == "⚖️ Panel Comparativo":
    st.title("⚖️ Panel Comparativo")
    st.info("🚧 Próximo paso: Comparación directa entre dos mandatos.")





# Ok, entiendo, pero estaba revisando el panel genral, y lo encuentro confuso...La grafica de inversion extranjera - inflacion... deberia ser una sola linea y no estar entre cortada... ademas de tener numeros en cada punto a ano, como por ejemplo 7.9   8.5... para que sea mas claro, pienso que la grafica de inversion extranjera deberia ser la misma que la de Inflacion...

# Otra cosa que veo es que no hace mucho sentido mostrar un Pilar con 1 solo item o 2...
# Entonces quiero estructurar mejor mi Dashboard










