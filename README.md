# 📚 Plataforma Soft Skills

Plataforma web para el desarrollo de habilidades blandas (soft skills) que incluye módulos de aprender a aprender y escucha activa.

## 📋 Tabla de Contenidos

- [Estructura del Proyecto](#estructura-del-proyecto)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración de Variables de Entorno](#configuración-de-variables-de-entorno)
- [Configuración de Base de Datos](#configuración-de-base-de-datos)
- [Migraciones con Alembic](#migraciones-con-alembic)
- [Ejecución del Proyecto](#ejecución-del-proyecto)

---

## 📁 Estructura del Proyecto

El proyecto está organizado en una arquitectura de **frontend** y **backend** separados:

```
soft-skills-plataform/
├── soft-skills-back/          # Backend FastAPI
├── soft-skills-front/         # Frontend React + TypeScript
├── databases/                 # Scripts SQL para inicializar la base de datos
├── documents/                 # Documentación del proyecto
├── latex-project/            # Documentos LaTeX del proyecto
├── godot-project/            # Proyecto de juego en Godot
└── tests/                    # Tests y pruebas de usabilidad
```

### 📂 Descripción de Carpetas

#### **Backend (`soft-skills-back/`)**

Backend desarrollado con **FastAPI** que proporciona la API REST para la plataforma.

```
soft-skills-back/
├── main.py                   # Punto de entrada de la aplicación
├── alembic/                  # Migraciones de base de datos
│   ├── env.py               # Configuración de Alembic
│   └── versions/            # Archivos de migración
├── alembic.ini              # Configuración de Alembic
├── router/                   # Endpoints REST de la API
│   ├── auth.py              # Autenticación (login, registro)
│   ├── learning_goal.py     # Metas de aprendizaje
│   ├── objective.py         # Objetivos
│   ├── task.py              # Tareas
│   ├── roadmap.py           # Roadmaps
│   └── ...
├── service/                  # Lógica de negocio
├── model/                    # Modelos de base de datos (SQLModel)
│   ├── user.py
│   ├── learning_goal.py
│   ├── objective.py
│   ├── task.py
│   └── ...
├── schema/                   # Esquemas Pydantic (validación de requests/responses)
├── mongo_service/            # Servicios para MongoDB
├── nosql_models/             # Modelos Pydantic para MongoDB
├── nosql_schema/             # Esquemas de serialización MongoDB
├── llm/                      # Integración con IA (generación de desafíos, evaluación)
│   └── prompts/             # Prompts para el LLM
├── utils/                    # Utilidades
│   ├── config.py            # Configuración y variables de entorno
│   ├── db.py                # Conexión a base de datos
│   ├── mongodb.py           # Conexión a MongoDB
│   ├── security.py          # Seguridad (JWT, encriptación)
│   └── ...
├── enums/                    # Enumeraciones del dominio
├── data/                     # Scripts de seed (datos iniciales)
│   └── seed.py
├── requirements.txt          # Dependencias de Python
└── pyproject.toml           # Configuración de Poetry (opcional)
```

#### **Frontend (`soft-skills-front/`)**

Frontend desarrollado con **React**, **TypeScript**, **Vite** y **Material-UI**.

```
soft-skills-front/
├── src/
│   ├── main.tsx             # Punto de entrada
│   ├── App.tsx              # Componente raíz
│   ├── api/                 # Configuración de API
│   ├── config/              # Configuración (API, env, constantes)
│   │   ├── api.ts           # Endpoints de la API
│   │   └── env.ts           # Variables de entorno
│   ├── features/            # Módulos de funcionalidad
│   │   ├── authentication/  # Autenticación (login, registro)
│   │   ├── learn-to-learn/  # Módulo de aprendizaje
│   │   │   ├── api/        # Llamadas a la API
│   │   │   ├── components/ # Componentes del módulo
│   │   │   ├── pages/      # Páginas del módulo
│   │   │   ├── store/      # Stores de Zustand
│   │   │   └── types/      # Tipos TypeScript
│   │   └── active-listening/ # Módulo de juego de escucha activa
│   ├── components/          # Componentes compartidos
│   ├── layouts/             # Layouts de la aplicación
│   ├── routes/              # Configuración de rutas
│   ├── store/               # Stores globales (toast)
│   ├── hooks/               # Hooks personalizados
│   ├── i18n/                # Internacionalización (español/inglés)
│   ├── utils/               # Utilidades
│   └── theme.ts             # Tema Material-UI
├── package.json             # Dependencias de Node.js
└── vite.config.js           # Configuración de Vite
```

#### **Base de Datos (`databases/`)**

Scripts SQL para inicializar la base de datos:

```
databases/
├── content/
│   ├── Tablas.sql           # Definición de tablas
│   ├── Carga.sql            # Datos iniciales
│   ├── Finanzas_Personales.sql
│   ├── Fitness.sql
│   └── Productividad.sql
└── exportdb_definitions/    # Exportaciones de base de datos
```

---

## 🔧 Requisitos Previos

### Backend
- **Python 3.x** (recomendado 3.9+)
- **pip** (gestor de paquetes de Python)
- **PostgreSQL** (para producción) o **SQLite** (para desarrollo)
- **MongoDB** (para almacenar roadmaps)

### Frontend
- **Node.js** 18+ y **npm** (o **yarn**)

### Opcional
- **Poetry** (para gestión de dependencias de Python)

---

## 🚀 Instalación

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/soft-skills-plataform.git
cd soft-skills-plataform
```

### 2. Configurar el Backend

```bash
# Navegar a la carpeta del backend
cd soft-skills-back

# Crear un entorno virtual (recomendado)
python -m venv venv

# Activar el entorno virtual
# En Windows:
venv\Scripts\activate
# En Linux/Mac:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt
```

### 3. Configurar el Frontend

```bash
# Navegar a la carpeta del frontend
cd soft-skills-front

# Instalar dependencias
npm install
```

---

## ⚙️ Configuración de Variables de Entorno

### Backend (`soft-skills-back/.env`)

Crea un archivo `.env` en la carpeta `soft-skills-back/` con las siguientes variables:

```env
# Base de Datos PostgreSQL (opción 1: URI completa)
DB_URI=postgresql://usuario:contraseña@localhost:5432/nombre_base_datos

# Base de Datos PostgreSQL (opción 2: componentes individuales)
# Si no se proporciona DB_URI, se usan estas variables
DB_HOST=localhost
DB_NAME=soft_skills_db
DB_PORT=5432
DB_USER=usuario
DB_PASSWORD=contraseña

# Si no se configuran las variables anteriores, se usará SQLite por defecto

# Autenticación JWT
SECRET_KEY=tu-clave-secreta-super-segura-aqui
ACCESS_TOKEN_EXPIRE_MINUTES=30

# ElevenLabs (para generación de audio)
ELEVENLABS_API_KEY=tu-api-key-de-elevenlabs
VOICE_SPK1_FEMALE=id-de-voz-femenina
VOICE_SPK2_MALE=id-de-voz-masculina
VOICE_DEFAULT_SINGLE=id-de-voz-por-defecto
ELEVENLABS_DEFAULT_MODEL=eleven_multilingual_v2

# Supabase (para almacenamiento de archivos de audio)
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
SUPABASE_BUCKET=challenges-audio

# URL pública de la aplicación (para enlaces en correos, etc.)
PUBLIC_BASE_URL=http://localhost:8000

# CORS (orígenes permitidos, separados por comas)
CORS_ORIGINS=http://localhost:3000,http://localhost:5173

# Puerto del backend
BACK_PORT=8000

# Configuración de audio (opcional)
AUDIO_DEFAULT_FORMAT=mp3
AUDIO_STORAGE_TYPE=supabase
```

**Nota:** Si no configuras las variables de base de datos, el sistema usará SQLite por defecto (útil para desarrollo local).

### Frontend (`soft-skills-front/.env`)

Crea un archivo `.env` en la carpeta `soft-skills-front/` con las siguientes variables:

```env
# URL base de la API del backend
VITE_API_BASE_URL=http://localhost:8000/api/v1

# URL del servicio de chatbot (si está separado)
VITE_CHATBOT_BASE_URL=http://localhost:8001

# Modo debug (opcional)
VITE_DEBUG_MODE=false
```

**Nota:** Las variables en Vite deben comenzar con `VITE_` para ser accesibles en el código del frontend.

---

## 🗄️ Configuración de Base de Datos

### Opción 1: PostgreSQL (Recomendado para Producción)

1. **Instalar PostgreSQL** en tu sistema
2. **Crear una base de datos:**
   ```sql
   CREATE DATABASE soft_skills_db;
   ```
3. **Configurar las variables de entorno** en `soft-skills-back/.env` (ver sección anterior)
4. **Cargar las tablas iniciales** (opcional):
   ```bash
   # Ejecutar los scripts SQL desde la carpeta databases/content/
   psql -U usuario -d soft_skills_db -f databases/content/Tablas.sql
   psql -U usuario -d soft_skills_db -f databases/content/Carga.sql
   ```

### Opción 2: SQLite (Para Desarrollo)

Si no configuras las variables de base de datos, el sistema usará SQLite automáticamente. La base de datos se creará en `soft-skills-back/db/tesis.db`.

### MongoDB

Para el almacenamiento de roadmaps, necesitas tener **MongoDB** ejecutándose. Puedes usar MongoDB local o MongoDB Atlas (cloud).

**Configuración de MongoDB:**
- Por defecto, el sistema intentará conectarse a `mongodb://localhost:27017`
- Para cambiar la conexión, modifica `soft-skills-back/utils/mongodb.py`

---

## 🔄 Migraciones con Alembic

El proyecto utiliza **Alembic** para gestionar las migraciones de la base de datos PostgreSQL.

### Comandos Básicos

```bash
# Navegar a la carpeta del backend
cd soft-skills-back

# Activar el entorno virtual (si no está activo)
# Windows: venv\Scripts\activate
# Linux/Mac: source venv/bin/activate

# Ver el estado actual de las migraciones
alembic current

# Ver el historial de migraciones
alembic history

# Crear una nueva migración (después de modificar modelos)
alembic revision --autogenerate -m "descripción del cambio"

# Aplicar todas las migraciones pendientes
alembic upgrade head

# Aplicar la siguiente migración
alembic upgrade +1

# Revertir la última migración
alembic downgrade -1

# Revertir todas las migraciones
alembic downgrade base

# Ver las migraciones pendientes
alembic heads
```

### Flujo de Trabajo Típico

1. **Modificar los modelos** en `soft-skills-back/model/`
2. **Generar la migración:**
   ```bash
   alembic revision --autogenerate -m "agregar campo nuevo a tabla usuario"
   ```
3. **Revisar el archivo de migración** generado en `soft-skills-back/alembic/versions/`
4. **Aplicar la migración:**
   ```bash
   alembic upgrade head
   ```

### Notas Importantes

- **Siempre revisa** los archivos de migración generados antes de aplicarlos
- **Haz backup** de tu base de datos antes de aplicar migraciones en producción
- Las migraciones se aplican automáticamente según la configuración en `alembic/env.py`
- La URL de la base de datos se toma de las variables de entorno configuradas

---

## ▶️ Ejecución del Proyecto

### Backend

```bash
# Navegar a la carpeta del backend
cd soft-skills-back

# Activar el entorno virtual (si no está activo)
# Windows: venv\Scripts\activate
# Linux/Mac: source venv/bin/activate

# Aplicar migraciones (primera vez o después de cambios)
alembic upgrade head

# Ejecutar el servidor
python main.py
```

El backend estará disponible en `http://localhost:8000`

**Documentación de la API:**
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### Frontend

```bash
# Navegar a la carpeta del frontend
cd soft-skills-front

# Ejecutar en modo desarrollo
npm run dev
```

El frontend estará disponible en `http://localhost:5173` (o el puerto que Vite asigne)

### Ejecutar Ambos Simultáneamente

Puedes abrir dos terminales:
- **Terminal 1:** Backend (`cd soft-skills-back && python main.py`)
- **Terminal 2:** Frontend (`cd soft-skills-front && npm run dev`)

---

## 📝 Notas Adicionales

- **Base de datos:** La carpeta `databases/` contiene los scripts SQL necesarios para cargar una nueva base de datos en un servidor SQL de tu elección.
- **Variables de entorno:** Asegúrate de configurar correctamente todas las variables de entorno antes de ejecutar el proyecto.
- **MongoDB:** Asegúrate de tener MongoDB ejecutándose si vas a usar la funcionalidad de roadmaps.
- **Desarrollo:** Para desarrollo local, puedes usar SQLite para PostgreSQL y omitir la configuración de MongoDB si no necesitas esa funcionalidad.

---

## 🛠️ Tecnologías Utilizadas

### Backend
- FastAPI
- SQLModel (ORM)
- Alembic (migraciones)
- PostgreSQL / SQLite
- MongoDB
- Python-JOSE (JWT)
- ElevenLabs (generación de audio)
- Supabase (almacenamiento)

### Frontend
- React 19
- TypeScript
- Vite
- Material-UI
- React Query
- Zustand (gestión de estado)
- React Router
- React Flow (editor de roadmaps)

---
