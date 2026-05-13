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

# Pandas y Requests (si no los tienes aún)
pip install pandas requests
```

### 7.2. Estructura del Servidor
Creamos una carpeta dedicada para el backend para mantener el orden.
```powershell
mkdir backend
mkdir backend/app
```
Dentro de `backend/app/` creamos el archivo `main.py`, que contiene:
- Importación de librerías (FastAPI, Pandas)
- Carga del CSV en memoria
- Configuración de CORS (permisos para que el Frontend se conecte)
- Definición de los Endpoints

### 7.3. Levantar el Backend
```powershell
# 1. Asegúrate de estar en la RAÍZ del proyecto
cd d:\devSpace\PROYECTOS\CGD

# 2. Activa el entorno virtual
.\venv\Scripts\activate

# 3. Ejecuta el servidor (--reload reinicia al detectar cambios)
uvicorn backend.app.main:app --reload
```
> [!IMPORTANT]
> Si todo salió bien, verás: `INFO: Uvicorn running on http://127.0.0.1:8000`
> Puedes verificar abriendo `http://127.0.0.1:8000` en tu navegador.

### 7.4. Endpoints Disponibles
Son las rutas por donde pedimos información a nuestra API:

| Ruta | Descripción | Ejemplo |
|------|-------------|---------|
| `GET /` | Mensaje de bienvenida y columnas detectadas | `http://127.0.0.1:8000/` |
| `GET /data` | Todos los datos del CSV (todos los años) | `http://127.0.0.1:8000/data` |
| `GET /data/{año}` | Datos de un año específico | `http://127.0.0.1:8000/data/2020` |
| `GET /data/presidente/{nombre}` | Datos filtrados por presidente | `http://127.0.0.1:8000/data/presidente/Petro` |

---

<!-- -------------------------------------- -->
# FRONTEND
<!-- -------------------------------------- -->

---

## 8. Fase 3: Frontend (React + Vite)
Interfaz web profesional que consume los datos del Backend.

### 8.1. Instalación del Frontend
```powershell
# Desde la raíz del proyecto, crear la app React con Vite
npx -y create-vite@latest frontend -- --template react

# Entrar a la carpeta e instalar dependencias
cd frontend
npm install

# Instalar dependencias adicionales del proyecto
npm install react-router-dom recharts lucide-react
```

### 8.2. Levantar el Frontend
```powershell
# 1. Entra a la carpeta del frontend
cd d:\devSpace\PROYECTOS\CGD\frontend

# 2. Ejecuta el servidor de desarrollo
npm run dev
```
> [!IMPORTANT]
> Si todo salió bien, verás: `Local: http://localhost:5173/`
> Abre esa URL en tu navegador para ver el Dashboard.

### 8.3. Estructura de Archivos del Frontend
```
frontend/
├── public/
│   ├── presidents/          # Fotos reales de los presidentes
│   └── hero_presidents.png  # Imagen épica de portada (generada por IA)
├── src/
│   ├── pages/
│   │   ├── Inicio.jsx       # Sección 1: Portada con hero image
│   │   ├── Inicio.css
│   │   ├── General.jsx      # Sección 2: Dashboard de KPIs
│   │   └── General.css
│   ├── App.jsx              # Router principal + Navbar
│   ├── App.css
│   ├── index.css            # Estilos globales (paleta Colombia, glassmorphism)
│   └── main.jsx             # Punto de entrada de React
└── package.json
```

---

## 🚀 INICIO RÁPIDO (Levantar Todo el Proyecto)

> [!TIP]
> Necesitas **2 terminales** abiertas simultáneamente.

**Terminal 1 — Backend (API de datos):**
```powershell
cd d:\devSpace\PROYECTOS\CGD
.\venv\Scripts\activate
uvicorn backend.app.main:app --reload
```

**Terminal 2 — Frontend (Interfaz web):**
```powershell
cd d:\devSpace\PROYECTOS\CGD\frontend
npm run dev
```

Luego abre `http://localhost:5173` en tu navegador. ¡Listo!


**Terminal 3 — Commits (Git):**
```git add .
    git commit -m
```

