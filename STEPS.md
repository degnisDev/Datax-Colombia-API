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


## 6. Enriquecimiento de Datos (Manual/Local)
Para cubrir vacíos de la API e incluir datos locales (Salario Mínimo, Conflicto Armado, Presupuesto General de la Nación e hitos en Educación).

```powershell
# Comando para inyectar datos manuales y parches
python scripts/enrich_data.py
```


<!-- -------------------------------------- -->
# BACKEND
<!-- -------------------------------------- -->

---

## 7. Fase 2: Backend (FastAPI)
Configuración del servidor para exponer los datos a través de una API.

### 7.1. Instalación de Dependencias del Backend
Instalamos FastAPI y el servidor ASGI (Uvicorn).
```powershell
# FastAPI: El framework web
# Uvicorn: El servidor encargado de ejecutar la app
pip install fastapi uvicorn
# y tambien pandas y request
pip install pandas requests

### 7.2. Estructura del Servidor
Creamos una carpeta dedicada para el backend para mantener el orden.
mkdir backend
mkdir backend/app

"""dentro de app creamos un archivo llamado main.py
En el cual vamos a descargar librerias, formatear la data y crear los Endpoints"""

# 7.3. Primer Servidor (Hola Mundo)
# --reload permite que el servidor se reinicie al detectar cambios en el código

"""Al ejecutar este comando en consola, veremos nuestra API en vivo mostrando la informacion en elformato que solicitamos """

uvicorn backend.app.main:app --reload


# 7.4 ENDPOINTS

Son los puertos por donde vamos a pedir informacion general o especifica de nuestra DB alojada en nuestra API.




