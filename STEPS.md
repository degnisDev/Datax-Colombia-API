# 🚀 DCG: Steps & Guía de Inicio rápido

Este documento resume los pasos esenciales realizados para configurar el entorno de trabajo del proyecto **DCG (Data's Colombia Government)**.

---

## 1. Configuración del Entorno Virtual
Para aislar las librerías del proyecto y evitar conflictos globales.
```powershell
# Crear el entorno
python -m venv venv

# Activar el entorno (Windows)
.\venv\Scripts\activate
```

## 2. Organización de Archivos
Estructuramos el proyecto para separar la lógica de los datos y el código fuente.
```powershell
# Crear carpeta para los scripts de automatización
mkdir scripts

# Crear carpeta para almacenar los CSV generados (opcional, el script la crea solo)
mkdir data
```

## 3. Instalación de Dependencias
Instalamos las herramientas necesarias para la ciencia de datos y peticiones web.
```powershell
# Pandas: Para manipular tablas y limpiar datos
# Requests: Para conectarse a la API del Banco Mundial
pip install pandas requests
```

## 4. Obtención de Datos (Pipeline Inicial)
Hemos creado el script `scripts/fetch_wb_data.py` que realiza las siguientes acciones:
1.  **Conexión**: Llama a la API del Banco Mundial.
2.  **Transformación**: Convierte el JSON en un `DataFrame` de Pandas.
3.  **Mapeo**: Asigna el Presidente correspondiente a cada año de forma automática.
4.  **Exportación**: Genera el archivo `data/colombia_macro_annual.csv`.

```powershell
# Comando para ejecutar el recolector de datos
python scripts/fetch_wb_data.py
```

## 5. Control de Versiones (Git)
Inicializamos el repositorio para rastrear cambios.
```powershell
git init
git add .
git commit -m "Initial commit: Entorno y script de recolección base"
```

---
> [!TIP]
> Mantén siempre activo el entorno virtual (`venv`) antes de correr cualquier script o instalar nuevas librerías.
