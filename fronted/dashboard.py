import streamlit as st
import requests
import pandas as pd 


# 1. Configuracion de la pagina
st.set_page_config(page_title="CGD Dashboard", layout="wide")
st.tittle("CD CGD: Colombian Government Data Dashboard")
st.sidebar.header("Filtros del Proyecto")

