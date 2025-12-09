# Capítulo X – Implementación del Prototipo
## Notas Técnicas (Primera Iteración)

---

## X.1 Arquitectura general del sistema

### Tecnologías por capa

**Frontend:**
- React 19.0.0
- TypeScript 5.8.2
- Vite 6.2.0 (build tool)
- Material-UI (MUI) 6.4.7
- React Flow 11.11.4 (editor visual de roadmaps)
- Zustand 5.0.3 (gestión de estado)
- React Query (@tanstack/react-query) 5.85.5 (caché y sincronización de servidor)
- React Router DOM 7.3.0
- React Hook Form 7.55.0
- i18next 25.6.1 (internacionalización)

**Backend:**
- FastAPI 0.108.0
- Python 3.11
- Uvicorn 0.25.0 (servidor ASGI)
- SQLModel 0.0.14 (ORM)
- SQLAlchemy 2.0.25
- Alembic 1.14.1 (migraciones)

**Bases de datos:**
- PostgreSQL (base de datos relacional principal)
- MongoDB (almacenamiento de roadmaps)
- SQLite (fallback para desarrollo local)

**Inteligencia Artificial:**
- LangChain 1.0.2
- LangChain OpenAI 1.0.1
- OpenAI API (modelos GPT-4o-mini principalmente)

**Almacenamiento de audio:**
- ElevenLabs 1.59.0 (síntesis de voz TTS)
- Supabase Storage (almacenamiento de archivos de audio)

**Autenticación y seguridad:**
- python-jose[cryptography] 3.4.0 (JWT)
- bcrypt 4.0.1 (hashing de contraseñas)
- passlib 1.7.4

**Despliegue:**
- Vercel (frontend y backend serverless)

### Componentes principales

**Backend (`soft-skills-back/`):**
- `main.py`: Punto de entrada de la aplicación FastAPI
- `router/`: Módulos de endpoints REST (auth, users, modules, learning-goals, objectives, tasks, roadmap, game-sessions, challenges, self-evaluations)
- `service/`: Lógica de negocio (game_session, game_round, challenge, roadmap_conversion, etc.)
- `model/`: Modelos de base de datos SQLModel (PostgreSQL)
- `mongo_service/`: Servicios para MongoDB (roadmaps)
- `llm/`: Integración con modelos de IA (generación y evaluación de desafíos)
- `schema/`: Esquemas Pydantic para validación de requests/responses
- `utils/`: Utilidades (config, db, mongodb, storage, eleven, security, etc.)
- `enums/`: Enumeraciones del dominio

**Frontend (`soft-skills-front/`):**
- `src/features/learn-to-learn/`: Módulo de aprendizaje (roadmaps, objetivos, tareas, kanban, chatbot)
- `src/features/active-listening/`: Módulo de juego de escucha activa
- `src/features/authentication/`: Autenticación (login, registro)
- `src/components/`: Componentes compartidos
- `src/store/`: Stores globales (toast)
- `src/routes/`: Configuración de rutas
- `src/layouts/`: Layouts de la aplicación
- `src/config/`: Configuración (API, constantes, variables de entorno)

### Diagrama lógico en texto

```
Usuario
  ↓
Frontend React (Vite + TypeScript)
  ├─ Material-UI (componentes UI)
  ├─ React Flow (editor visual de roadmaps)
  ├─ Zustand (estado local)
  └─ React Query (sincronización con API)
  ↓
API REST FastAPI (Backend)
  ├─ Autenticación JWT
  ├─ Routers/Endpoints
  └─ Servicios de negocio
  ↓
┌─────────────────────────────────────┐
│ Bases de Datos                      │
├─────────────────────────────────────┤
│ PostgreSQL (SQLModel)                │
│  - Usuarios                          │
│  - Módulos                           │
│  - Metas de aprendizaje             │
│  - Objetivos                         │
│  - Tareas                            │
│  - Sesiones de juego                │
│  - Rondas de juego                   │
│  - Desafíos auditivos               │
│  - Submisiones de respuestas        │
│  - Auto-evaluaciones                 │
│  - Notas y recursos de tareas         │
│                                      │
│ MongoDB                              │
│  - Roadmaps (planes de aprendizaje)  │
│    con estructura jerárquica        │
│    (objetivos → tareas)              │
└─────────────────────────────────────┘
  ↓
┌─────────────────────────────────────┐
│ Servicios Externos                 │
├─────────────────────────────────────┤
│ OpenAI API (LangChain)              │
│  - Generación de roadmaps           │
│  - Generación de desafíos auditivos │
│  - Evaluación de respuestas abiertas │
│                                      │
│ ElevenLabs                          │
│  - Síntesis de voz (TTS)            │
│  - Generación de audio de desafíos  │
│                                      │
│ Supabase Storage                    │
│  - Almacenamiento de archivos audio │
│  - URLs públicas para streaming      │
└─────────────────────────────────────┘
```

### Archivos de arquitectura

- `soft-skills-back/main.py`: Configuración principal de FastAPI, CORS, lifespan
- `soft-skills-back/router/__init__.py`: Agregación de todos los routers
- `soft-skills-back/utils/config.py`: Configuración centralizada (DB, APIs, storage)
- `soft-skills-front/src/routes/routes.tsx`: Configuración de rutas del frontend
- `soft-skills-front/src/config/api.ts`: Endpoints de API centralizados

---

## X.2 Diseño de la base de datos

### X.2.1 Modelo Entidad–Relación (MER)

#### Tablas principales (PostgreSQL)

**1. `users`**
- Propósito: Usuarios del sistema
- Campos clave: `user_id` (PK), `username`, `email`, `password`, `role`, `created_at`, `updated_at`, `last_login`
- Archivo: `soft-skills-back/model/user.py`

**2. `modules`**
- Propósito: Módulos de habilidades blandas disponibles
- Campos clave: `id` (PK), `title`, `category`, `status`, `description`, `route_path`, `tags` (JSON)
- Archivo: `soft-skills-back/model/module.py`

**3. `learning_goals`**
- Propósito: Metas de aprendizaje de los usuarios
- Campos clave: `learning_goal_id` (PK), `user_id` (FK → users), `title`, `description`, `impact`, `objectives_order` (ARRAY), `started_at`, `completed_at`
- Relaciones: 1-N con `objectives`
- Archivo: `soft-skills-back/model/learning_goal.py`

**4. `objectives`**
- Propósito: Objetivos dentro de una meta de aprendizaje
- Campos clave: `objective_id` (PK), `learning_goal_id` (FK → learning_goals), `title`, `description`, `status`, `priority`, `tasks_order_by_status` (JSONB), `due_date`, `started_at`, `completed_at`
- Relaciones: N-1 con `learning_goals`, 1-N con `tasks`
- Archivo: `soft-skills-back/model/objective.py`

**5. `tasks`**
- Propósito: Tareas dentro de un objetivo
- Campos clave: `task_id` (PK), `objective_id` (FK → objectives), `title`, `description`, `task_type`, `status`, `priority`, `estimated_seconds`, `actual_seconds`, `pomodoro_length_seconds_snapshot`, `due_date`, `is_optional`, `started_at`, `completed_at`
- Relaciones: N-1 con `objectives`, 1-N con `self_evaluations`, `task_notes`, `task_resources`
- Archivo: `soft-skills-back/model/task.py`

**6. `self_evaluations`**
- Propósito: Auto-evaluaciones realizadas por usuarios después de completar tareas
- Campos clave: `evaluation_id` (PK), `task_id` (FK → tasks), `user_id` (FK → users), `study_place`, `time_of_day`, `noise_level`, `collaboration_mode`, `learning_intention`, `what_went_well`, `challenges_encountered`, `improvement_plan`, `perceived_difficulty`, `concentration_level`, `mood`, `knowledge_connection`, `learning_methods` (JSON), `created_at`
- Relaciones: N-1 con `tasks`, N-1 con `users`
- Archivo: `soft-skills-back/model/self_evaluation.py`

**7. `task_notes`**
- Propósito: Notas asociadas a tareas
- Campos clave: `note_id` (PK), `task_id` (FK → tasks), `content`, `created_at`, `updated_at`
- Relaciones: N-1 con `tasks`
- Archivo: `soft-skills-back/model/task_note.py`

**8. `task_resources`**
- Propósito: Recursos (enlaces, documentos) asociados a tareas
- Campos clave: `resource_id` (PK), `task_id` (FK → tasks), `type`, `title`, `link`, `created_at`, `updated_at`
- Relaciones: N-1 con `tasks`
- Archivo: `soft-skills-back/model/task_resource.py`

**9. `listening_game_session`**
- Propósito: Sesiones de juego de escucha activa
- Campos clave: `game_session_id` (PK), `user_id` (FK → users), `name`, `status`, `current_round`, `total_score`, `created_at`, `updated_at`, `started_at`, `finished_at`
- Relaciones: 1-1 con `listening_game_session_config`, 1-N con `listening_game_round`, 1-N con `listening_round_submission`
- Índices: `(status, created_at)`
- Archivo: `soft-skills-back/model/listening_core/game_session.py`

**10. `listening_game_session_config`**
- Propósito: Configuración de una sesión de juego
- Campos clave: `game_session_id` (PK, FK → listening_game_session), `total_rounds`, `max_replays_per_round`, `difficulty`, `reuse_existing_challenges`, `response_time_limits` (JSON), `selected_modes` (JSON), `allowed_types` (JSON), `audio_effects` (JSON)
- Relaciones: 1-1 con `listening_game_session`
- Archivo: `soft-skills-back/model/listening_core/game_session_config.py`

**11. `listening_game_round`**
- Propósito: Rondas individuales dentro de una sesión de juego
- Campos clave: `game_round_id` (PK), `game_session_id` (FK → listening_game_session), `challenge_id` (FK → listening_challenge), `round_number`, `status`, `play_mode`, `prompt_type`, `score`, `max_score`, `replays_used`, `prepared_at`, `started_at`, `ended_at`, `created_at`, `updated_at`
- Relaciones: N-1 con `listening_game_session`, N-1 con `listening_challenge`, 1-N con `listening_round_submission`
- Constraints: `UNIQUE(game_session_id, round_number)`
- Índices: `(game_session_id, status)`, `(game_session_id, round_number)`
- Archivo: `soft-skills-back/model/listening_core/game_round.py`

**12. `listening_challenge`**
- Propósito: Desafíos auditivos generados o reutilizados
- Campos clave: `challenge_id` (PK), `play_mode`, `prompt_type`, `difficulty`, `audio_url`, `audio_storage`, `audio_text`, `summary`, `language`, `challenge_metadata` (JSON), `created_at`
- Relaciones: 1-N con `listening_game_round`
- Índices: `(created_at)`
- Archivo: `soft-skills-back/model/listening_core/challenge.py`

**13. `listening_round_submission`**
- Propósito: Submisiones de respuestas de los usuarios para cada ronda
- Campos clave: `round_submission_id` (PK), `game_session_id` (FK → listening_game_session), `game_round_id` (FK → listening_game_round), `user_id` (FK → users), `play_mode`, `prompt_type`, `is_correct`, `feedback_short`, `client_elapsed_ms`, `idempotency_key`, `answer_payload` (JSON), `submitted_at`
- Relaciones: N-1 con `listening_game_session`, N-1 con `listening_game_round`, N-1 con `users`
- Constraints: `UNIQUE(game_round_id)`, `UNIQUE(game_round_id, idempotency_key)`
- Archivo: `soft-skills-back/model/listening_core/round_submission.py`

**14. `pomodoro_preferences`**
- Propósito: Preferencias de Pomodoro del usuario
- Campos clave: `user_id` (PK, FK → users), `pomodoro_length_minutes`, `short_break_minutes`, `long_break_minutes`, `long_break_interval`, `created_at`, `updated_at`
- Relaciones: 1-1 con `users`
- Archivo: `soft-skills-back/model/pomodoro_preferences.py`

#### Relaciones principales

- `users` 1-N `learning_goals`
- `users` 1-N `listening_game_session`
- `users` 1-N `self_evaluations`
- `learning_goals` 1-N `objectives`
- `objectives` 1-N `tasks`
- `tasks` 1-N `self_evaluations`
- `tasks` 1-N `task_notes`
- `tasks` 1-N `task_resources`
- `listening_game_session` 1-1 `listening_game_session_config`
- `listening_game_session` 1-N `listening_game_round`
- `listening_game_session` 1-N `listening_round_submission`
- `listening_challenge` 1-N `listening_game_round`
- `listening_game_round` 1-N `listening_round_submission`

#### Archivos de definición de modelos

- `soft-skills-back/model/__init__.py`: Importaciones centralizadas
- `soft-skills-back/alembic/`: Migraciones de base de datos
- `soft-skills-back/alembic.ini`: Configuración de Alembic

### X.2.2 Modelo UML (clases de dominio)

#### Módulo: Aprendizaje (Learn-to-Learn)

**Clases principales:**
- `User`: Usuario del sistema
- `LearningGoal`: Meta de aprendizaje
- `Objective`: Objetivo dentro de una meta
- `Task`: Tarea dentro de un objetivo
- `TaskNote`: Nota asociada a una tarea
- `TaskResource`: Recurso asociado a una tarea
- `SelfEvaluation`: Auto-evaluación de una tarea completada
- `PomodoroPreferences`: Preferencias de Pomodoro del usuario

**Agrupación:**
- `soft-skills-back/model/user.py`
- `soft-skills-back/model/learning_goal.py`
- `soft-skills-back/model/objective.py`
- `soft-skills-back/model/task.py`
- `soft-skills-back/model/task_note.py`
- `soft-skills-back/model/task_resource.py`
- `soft-skills-back/model/self_evaluation.py`
- `soft-skills-back/model/pomodoro_preferences.py`

#### Módulo: Escucha Activa (Active Listening)

**Clases principales:**
- `GameSession`: Sesión de juego
- `GameSessionConfig`: Configuración de sesión
- `GameRound`: Ronda individual
- `Challenge`: Desafío auditivo
- `RoundSubmission`: Submisión de respuesta

**Agrupación:**
- `soft-skills-back/model/listening_core/game_session.py`
- `soft-skills-back/model/listening_core/game_session_config.py`
- `soft-skills-back/model/listening_core/game_round.py`
- `soft-skills-back/model/listening_core/challenge.py`
- `soft-skills-back/model/listening_core/round_submission.py`

#### Módulo: Sistema

**Clases principales:**
- `Module`: Módulo de habilidad blanda

**Agrupación:**
- `soft-skills-back/model/module.py`

### X.2.3 Base de datos NoSQL / analítica

#### MongoDB

**Motor:** MongoDB (pymongo 4.12.0)

**Base de datos:** `learning_roadmap`

**Colección:** `roadmaps`

**Estructura de documentos:**
- `_id`: ObjectId (MongoDB)
- `roadmap_id`: String (convertido desde _id)
- `title`: String
- `description`: String
- `user_id`: String (UUID del usuario)
- `username`: String
- `visibility`: Enum ("private" | "public")
- `objectives`: Array de objetos Objective
  - `objective_id`: String
  - `title`: String
  - `order_index`: Number
  - `description`: String (opcional)
  - `content_title`: String (opcional)
  - `resources`: Array de Resource
  - `comments`: Array de String
  - `tasks`: Array de Task
    - `task_id`: String
    - `title`: String
    - `order_index`: Number
    - `description`: String (opcional)
    - `type`: Enum (opcional)
    - `content_title`: String (opcional)
    - `resources`: Array de Resource
    - `comments`: Array de String
- `layout`: Objeto Layout (opcional)
  - `nodes`: Array de LayoutNode (posición en canvas)
  - `edges`: Array de LayoutEdge (conexiones)
- `created_at`: String (ISO datetime)
- `updated_at`: String (ISO datetime)

**Propósito:**
- Almacenar roadmaps (planes de aprendizaje) con estructura jerárquica flexible
- Permitir layouts visuales (React Flow) con posiciones de nodos
- Soporte para roadmaps públicos y privados
- Búsqueda y filtrado avanzado (título, descripción, fecha, número de pasos, usuario)

**Archivos relacionados:**
- `soft-skills-back/mongo_service/roadmap.py`: Servicio de acceso a MongoDB
- `soft-skills-back/nosql_models/roadmap.py`: Modelos Pydantic para roadmaps
- `soft-skills-back/nosql_schema/roadmap.py`: Esquemas de serialización
- `soft-skills-back/utils/mongodb.py`: Cliente MongoDB genérico

**Índices (implícitos por MongoDB):**
- Búsqueda por `user_id` (filtrado de roadmaps del usuario)
- Búsqueda por `visibility: "public"` (roadmaps públicos)
- Búsqueda por `title` y `description` (regex case-insensitive)
- Ordenamiento por `created_at` descendente

---

## X.3 Diseño de interfaz y experiencia de usuario (UI/UX)

### Tecnologías de UI

- **React 19.0.0**: Framework principal
- **Material-UI (MUI) 6.4.7**: Biblioteca de componentes
- **React Flow 11.11.4**: Editor visual de grafos para roadmaps
- **Emotion**: Estilos CSS-in-JS (incluido con MUI)
- **Lucide React 0.507.0**: Iconos
- **React Markdown 10.1.0**: Renderizado de markdown

### Pantallas principales implementadas

#### Módulo: Autenticación
- **Login**: `src/features/authentication/pages/Login.tsx`
- **Register**: `src/features/authentication/pages/Register.tsx`

#### Módulo: Aprendizaje (Learn-to-Learn)
- **Dashboard**: `src/features/learn-to-learn/pages/Dashboard.tsx`
- **Planner**: `src/features/learn-to-learn/pages/Planner.tsx`
  - Vista de metas de aprendizaje con navegación jerárquica
- **LearningGoalDetail**: `src/features/learn-to-learn/pages/LearningGoalDetail.tsx`
- **ObjectiveDetail**: `src/features/learn-to-learn/pages/ObjectiveDetail.tsx`
- **TaskDetail**: `src/features/learn-to-learn/pages/TaskDetail.tsx`
- **Roadmaps**: `src/features/learn-to-learn/pages/Roadmaps.tsx`
  - Lista de roadmaps del usuario
- **RoadmapDetail**: `src/features/learn-to-learn/pages/RoadmapDetail.tsx`
  - Visualización de roadmap con React Flow
- **RoadmapEditor**: `src/features/learn-to-learn/pages/RoadmapEditor.tsx`
  - Editor visual de roadmaps (arrastrar y soltar, edición de nodos)
- **CreateRoadmapWithChatbot**: `src/features/learn-to-learn/pages/CreateRoadmapWithChatbot.tsx`
  - Creación de roadmap mediante chatbot con IA
- **Explore**: `src/features/learn-to-learn/pages/Explore.tsx`
  - Exploración de roadmaps públicos
- **LearningReport**: `src/features/learn-to-learn/pages/LearningReport.tsx`
  - Lista de auto-evaluaciones
- **LearningReportDetail**: `src/features/learn-to-learn/pages/LearningReportDetail.tsx`
  - Detalle de auto-evaluación
- **Help**: `src/features/learn-to-learn/pages/Help.tsx`

#### Módulo: Escucha Activa (Active Listening)
- **Home**: `src/features/active-listening/pages/Home.tsx`
  - Página principal del módulo
- **GameSessions**: `src/features/active-listening/pages/GameSessions.tsx`
  - Lista de sesiones de juego
- **GamePlay**: `src/features/active-listening/pages/GamePlay.tsx`
  - Interfaz de juego durante una ronda
- **GameSessionResult**: `src/features/active-listening/pages/GameSessionResult.tsx`
  - Resultados finales de una sesión
- **HowToPlay**: `src/features/active-listening/pages/HowToPlay.tsx`
  - Instrucciones de juego

### Estructura general de navegación

**Rutas públicas:**
- `/login` → Login
- `/register` → Registro

**Rutas protegidas:**
- `/` → Home (selección de módulo)
- `/learn` → Layout del módulo de aprendizaje
  - `/learn/planner` → Planner (metas de aprendizaje)
    - `/learn/planner/goals/:goalId` → Detalle de meta
      - `/learn/planner/goals/:goalId/objectives/:objectiveId` → Detalle de objetivo
        - `/learn/planner/goals/:goalId/objectives/:objectiveId/tasks/:taskId` → Detalle de tarea
  - `/learn/dashboard` → Dashboard
  - `/learn/explore` → Explorar roadmaps públicos
    - `/learn/explore/:roadmapId` → Detalle de roadmap público
  - `/learn/roadmaps` → Mis roadmaps
    - `/learn/roadmaps/create/chat` → Crear roadmap con chatbot
    - `/learn/roadmaps/:roadmapId` → Detalle de roadmap
    - `/learn/roadmaps/:roadmapId/edit` → Editor de roadmap
  - `/learn/reports` → Reportes de aprendizaje
    - `/learn/reports/:evaluationId` → Detalle de auto-evaluación
  - `/learn/help` → Ayuda
- `/active-listening` → Layout del módulo de escucha activa
  - `/active-listening` → Home
  - `/active-listening/game-sessions` → Sesiones de juego
  - `/active-listening/how-to-play` → Cómo jugar
  - `/active-listening/session/:sessionId/play` → Jugar sesión
  - `/active-listening/session/:sessionId/result` → Resultados de sesión

**Archivo de rutas:** `src/routes/routes.tsx`

### Componentes clave

#### Editor de roadmap / flujo de aprendizaje

**Componentes principales:**
- `RoadmapEditor`: `src/features/learn-to-learn/pages/RoadmapEditor.tsx`
- `RoadmapCanvas`: `src/features/learn-to-learn/components/roadmap-editor/RoadmapCanvas.tsx`
- `RoadmapNode`: `src/features/learn-to-learn/components/roadmap-editor/RoadmapNode.tsx`
- `RoadmapControls`: `src/features/learn-to-learn/components/roadmap-editor/RoadmapControls.tsx`
- `ObjectiveNodeEditor`: `src/features/learn-to-learn/components/roadmap-editor/ObjectiveNodeEditor.tsx`
- `TaskNodeEditor`: `src/features/learn-to-learn/components/roadmap-editor/TaskNodeEditor.tsx`

**Tecnología:** React Flow para visualización y edición de grafos

**Archivos relacionados:**
- `src/features/learn-to-learn/components/roadmap/`: Componentes de visualización de roadmap

#### Módulo de escucha activa / juego

**Componentes principales:**
- `GamePlay`: `src/features/active-listening/pages/GamePlay.tsx`
- `AudioPlayer`: `src/features/active-listening/components/game-play/AudioPlayer.tsx`
- `AnswerForm`: `src/features/active-listening/components/game-play/AnswerForm.tsx`
- `RoundProgress`: `src/features/active-listening/components/game-play/RoundProgress.tsx`
- `GameResult`: `src/features/active-listening/components/game-result/GameResult.tsx`
- `RoundResult`: `src/features/active-listening/components/game-result/RoundResult.tsx`

**Archivos relacionados:**
- `src/features/active-listening/components/game-play/`: Componentes de juego
- `src/features/active-listening/components/game-result/`: Componentes de resultados
- `src/features/active-listening/components/sections/`: Secciones de la interfaz

#### Kanban / gestión de tareas

**Componentes principales:**
- `KanbanBoard`: `src/features/learn-to-learn/components/kanban/KanbanBoard.tsx`
- `KanbanColumn`: `src/features/learn-to-learn/components/kanban/KanbanColumn.tsx`
- `KanbanTaskCard`: `src/features/learn-to-learn/components/kanban/KanbanTaskCard.tsx`

**Tecnología:** @atlaskit/pragmatic-drag-and-drop para arrastrar y soltar

**Archivos relacionados:**
- `src/features/learn-to-learn/components/kanban/`: Componentes de Kanban

#### Dashboard o pantallas de resumen

**Componentes principales:**
- `Dashboard`: `src/features/learn-to-learn/pages/Dashboard.tsx`
- `LearningReports`: `src/features/learn-to-learn/components/learning-reports/`: Componentes de reportes

**Archivos relacionados:**
- `src/features/learn-to-learn/components/learning-reports/`: Componentes de reportes

### Archivos de tema y estilos

- `src/theme.ts`: Configuración del tema Material-UI
  - Paleta de colores (primary: #2F3437, secondary: #2383E2)
  - Tipografía (Inter)
  - Componentes personalizados (Button, Paper, Input)
  - Sombras personalizadas
- `src/index.css`: Estilos globales
- `src/App.css`: Estilos de la aplicación principal
- `src/layouts/MainLayout.tsx`: Layout principal con sidebar
- `src/layouts/LearnModuleLayout.tsx`: Layout del módulo de aprendizaje
- `src/layouts/PublicLayout.tsx`: Layout para páginas públicas

### Componentes compartidos

- `Header.tsx`: Encabezado de la aplicación
- `SideBarIcon.tsx`: Iconos del sidebar
- `LearnSidebar.tsx`: Sidebar del módulo de aprendizaje
- `UserMenu.tsx`: Menú de usuario
- `LanguageSelector.tsx`: Selector de idioma
- `GlobalToastManager.tsx`: Gestor global de notificaciones toast
- `ConfirmDeleteModal.tsx`: Modal de confirmación de eliminación
- `ModuleCard.tsx`: Tarjeta de módulo

---

## X.4 Implementación del backend

### Framework y organización

**Framework:** FastAPI 0.108.0

**Organización del proyecto (`soft-skills-back/`):**
```
soft-skills-back/
├── main.py                 # Punto de entrada
├── router/                 # Endpoints REST
├── service/                # Lógica de negocio
├── model/                  # Modelos de base de datos (SQLModel)
├── schema/                 # Esquemas Pydantic (validación)
├── mongo_service/          # Servicios MongoDB
├── nosql_models/           # Modelos Pydantic para MongoDB
├── nosql_schema/           # Esquemas de serialización MongoDB
├── llm/                    # Integración con IA
├── utils/                  # Utilidades
├── enums/                  # Enumeraciones
├── alembic/                # Migraciones de base de datos
└── data/                   # Scripts de seed
```

### Listado de routers/endpoints principales

#### Autenticación (`/api/v1/auth`)
- **POST** `/api/v1/auth/login` → Iniciar sesión
  - Archivo: `router/auth.py`
- **POST** `/api/v1/auth/register` → Registro de usuario
  - Archivo: `router/auth.py`

#### Usuarios (`/api/v1/users`)
- **GET** `/api/v1/users/me` → Obtener usuario actual
  - Archivo: `router/user.py`
- **GET** `/api/v1/users/me/learning-goals` → Metas de aprendizaje del usuario
  - Archivo: `router/user.py`
- **PATCH** `/api/v1/users/me` → Actualizar usuario
  - Archivo: `router/user.py`
- **PUT** `/api/v1/users/me/pomodoro-preferences` → Crear/actualizar preferencias Pomodoro
  - Archivo: `router/user.py`
- **GET** `/api/v1/users/me/pomodoro-preferences` → Obtener preferencias Pomodoro
  - Archivo: `router/user.py`
- **DELETE** `/api/v1/users/me` → Eliminar usuario
  - Archivo: `router/user.py`

#### Módulos (`/api/v1/modules`)
- **GET** `/api/v1/modules` → Listar todos los módulos
  - Archivo: `router/module.py`
- **GET** `/api/v1/modules/{id}` → Obtener módulo por ID
  - Archivo: `router/module.py`
- **POST** `/api/v1/modules` → Crear módulo (admin)
  - Archivo: `router/module.py`
- **PATCH** `/api/v1/modules/{id}` → Actualizar módulo (admin)
  - Archivo: `router/module.py`
- **DELETE** `/api/v1/modules/{id}` → Eliminar módulo (admin)
  - Archivo: `router/module.py`

#### Metas de aprendizaje (`/api/v1/learning-goals`)
- **POST** `/api/v1/learning-goals` → Crear meta de aprendizaje
  - Archivo: `router/learning_goal.py`
- **GET** `/api/v1/learning-goals` → Listar metas del usuario
  - Archivo: `router/learning_goal.py`
- **GET** `/api/v1/learning-goals/{id}` → Obtener meta por ID
  - Archivo: `router/learning_goal.py`
- **PATCH** `/api/v1/learning-goals/{id}` → Actualizar meta
  - Archivo: `router/learning_goal.py`
- **DELETE** `/api/v1/learning-goals/{id}` → Eliminar meta
  - Archivo: `router/learning_goal.py`
- **POST** `/api/v1/learning-goals/{id}/convert-to-roadmap` → Convertir meta a roadmap
  - Archivo: `router/learning_goal.py`

#### Objetivos (`/api/v1/objectives`)
- **POST** `/api/v1/objectives` → Crear objetivo
  - Archivo: `router/objective.py`
- **GET** `/api/v1/objectives/{id}` → Obtener objetivo por ID
  - Archivo: `router/objective.py`
- **PATCH** `/api/v1/objectives/{id}` → Actualizar objetivo
  - Archivo: `router/objective.py`
- **DELETE** `/api/v1/objectives/{id}` → Eliminar objetivo
  - Archivo: `router/objective.py`
- **GET** `/api/v1/objectives/{id}/kanban` → Obtener tareas en formato Kanban
  - Archivo: `router/objective.py`
- **POST** `/api/v1/objectives/{id}/kanban/move` → Mover tarea en Kanban
  - Archivo: `router/objective.py`
- **GET** `/api/v1/objectives/{id}/tasks` → Listar tareas del objetivo
  - Archivo: `router/objective.py`
- **PATCH** `/api/v1/objectives/{id}/tasks/order` → Actualizar orden de tareas
  - Archivo: `router/objective.py`
- **POST** `/api/v1/objectives/{id}/tasks` → Crear tarea en objetivo
  - Archivo: `router/objective.py`

#### Tareas (`/api/v1/tasks`)
- **POST** `/api/v1/tasks` → Crear tarea
  - Archivo: `router/task.py`
- **GET** `/api/v1/tasks/{id}` → Obtener tarea por ID
  - Archivo: `router/task.py`
- **PATCH** `/api/v1/tasks/{id}` → Actualizar tarea
  - Archivo: `router/task.py`
- **PATCH** `/api/v1/tasks/{id}/status` → Actualizar estado de tarea
  - Archivo: `router/task.py`
- **DELETE** `/api/v1/tasks/{id}` → Eliminar tarea
  - Archivo: `router/task.py`

#### Notas de tareas (`/api/v1/tasks/{taskId}/notes`)
- **POST** `/api/v1/tasks/{taskId}/notes` → Crear nota
  - Archivo: `router/task_notes.py`
- **GET** `/api/v1/tasks/{taskId}/notes` → Listar notas
  - Archivo: `router/task_notes.py`
- **GET** `/api/v1/tasks/{taskId}/notes/{noteId}` → Obtener nota por ID
  - Archivo: `router/task_notes.py`
- **PATCH** `/api/v1/tasks/{taskId}/notes/{noteId}` → Actualizar nota
  - Archivo: `router/task_notes.py`
- **DELETE** `/api/v1/tasks/{taskId}/notes/{noteId}` → Eliminar nota
  - Archivo: `router/task_notes.py`

#### Recursos de tareas (`/api/v1/tasks/{taskId}/resources`)
- **POST** `/api/v1/tasks/{taskId}/resources` → Crear recurso
  - Archivo: `router/task_resources.py`
- **GET** `/api/v1/tasks/{taskId}/resources` → Listar recursos
  - Archivo: `router/task_resources.py`
- **GET** `/api/v1/tasks/{taskId}/resources/{resourceId}` → Obtener recurso por ID
  - Archivo: `router/task_resources.py`
- **PATCH** `/api/v1/tasks/{taskId}/resources/{resourceId}` → Actualizar recurso
  - Archivo: `router/task_resources.py`
- **DELETE** `/api/v1/tasks/{taskId}/resources/{resourceId}` → Eliminar recurso
  - Archivo: `router/task_resources.py`

#### Roadmaps (`/api/v1/roadmap`)
- **POST** `/api/v1/roadmap` → Crear roadmap
  - Archivo: `router/roadmap.py`
- **GET** `/api/v1/roadmap/mine` → Obtener roadmaps del usuario
  - Archivo: `router/roadmap.py`
- **GET** `/api/v1/roadmap/public` → Obtener roadmaps públicos (con filtros)
  - Archivo: `router/roadmap.py`
- **GET** `/api/v1/roadmap/{id}` → Obtener roadmap por ID
  - Archivo: `router/roadmap.py`
- **PATCH** `/api/v1/roadmap/{id}` → Actualizar roadmap
  - Archivo: `router/roadmap.py`
- **DELETE** `/api/v1/roadmap/{id}` → Eliminar roadmap
  - Archivo: `router/roadmap.py`
- **POST** `/api/v1/roadmap/{id}/copy` → Copiar roadmap
  - Archivo: `router/roadmap.py`
- **POST** `/api/v1/roadmap/{id}/convert-to-learning-goal` → Convertir roadmap a meta de aprendizaje
  - Archivo: `router/roadmap.py`

#### Sesiones de juego (`/api/v1/game-sessions`)
- **GET** `/api/v1/game-sessions` → Listar sesiones del usuario (paginado)
  - Archivo: `router/game_session.py`
- **POST** `/api/v1/game-sessions` → Crear sesión de juego
  - Archivo: `router/game_session.py`
- **GET** `/api/v1/game-sessions/{id}` → Obtener sesión por ID
  - Archivo: `router/game_session.py`
- **PATCH** `/api/v1/game-sessions/{id}` → Actualizar sesión
  - Archivo: `router/game_session.py`
- **PATCH** `/api/v1/game-sessions/{id}/config` → Actualizar configuración de sesión
  - Archivo: `router/game_session.py`
- **DELETE** `/api/v1/game-sessions/{id}` → Eliminar sesión
  - Archivo: `router/game_session.py`
- **POST** `/api/v1/game-sessions/{id}/start` → Iniciar sesión
  - Archivo: `router/game_session.py`
- **POST** `/api/v1/game-sessions/{id}/finish` → Finalizar sesión
  - Archivo: `router/game_session.py`
- **GET** `/api/v1/game-sessions/{id}/result` → Obtener resultados de sesión
  - Archivo: `router/game_session.py`
- **GET** `/api/v1/game-sessions/{sessionId}/rounds/current` → Obtener ronda actual
  - Archivo: `router/game_session.py`
- **POST** `/api/v1/game-sessions/{sessionId}/rounds/{roundNumber}/attempt` → Enviar respuesta de ronda
  - Archivo: `router/game_session.py`
- **POST** `/api/v1/game-sessions/{sessionId}/rounds/next` → Avanzar a siguiente ronda
  - Archivo: `router/game_session.py`
- **POST** `/api/v1/game-sessions/{sessionId}/rounds/{roundNumber}/audio/replay` → Reproducir audio nuevamente
  - Archivo: `router/game_session.py`

#### Desafíos (`/api/v1/challenges`)
- **POST** `/api/v1/challenges` → Generar desafío auditivo
  - Archivo: `router/challenge.py`
- **GET** `/api/v1/challenges` → Listar desafíos (con filtros)
  - Archivo: `router/challenge.py`

#### Auto-evaluaciones (`/api/v1/self-evaluations`)
- **POST** `/api/v1/self-evaluations` → Crear auto-evaluación
  - Archivo: `router/self_evaluations.py`
- **GET** `/api/v1/self-evaluations` → Listar auto-evaluaciones del usuario
  - Archivo: `router/self_evaluations.py`
- **GET** `/api/v1/self-evaluations/{id}` → Obtener auto-evaluación por ID
  - Archivo: `router/self_evaluations.py`

### Servicios o capas de negocio importantes

#### Gestión de sesiones de juego

**Servicio:** `service/listening_core/game_session.py`

**Clase:** `GameSessionService`

**Funcionalidades principales:**
- Crear sesión con configuración
- Iniciar sesión (preparar primera ronda)
- Avanzar a siguiente ronda
- Finalizar sesión
- Obtener resultados de sesión
- Verificar propiedad de sesión
- Bloqueo de concurrencia (FOR UPDATE)

**Archivos relacionados:**
- `service/listening_core/game_round.py`: Gestión de rondas
- `service/listening_core/game_round_prefetch.py`: Pre-carga de rondas en background

#### Gestión de rondas y retos

**Servicio:** `service/listening_core/game_round.py`

**Clase:** `GameRoundService`

**Funcionalidades principales:**
- Preparar ronda (generar o reutilizar desafío)
- Procesar respuesta de ronda
- Evaluar respuesta según modo de juego
- Obtener evaluación de ronda
- Gestionar repeticiones de audio

**Archivos relacionados:**
- `service/listening_core/scoring.py`: Lógica de puntuación
- `service/challenge.py`: Gestión de desafíos

#### Evaluación de respuestas

**Módulo:** `llm/challenge_evaluation.py`

**Funciones:**
- `evaluate_clarify_questions()`: Evaluar preguntas de clarificación
- `evaluate_summarize_answer()`: Evaluar respuestas de resumen
- `evaluate_paraphrase_answer()`: Evaluar paráfrasis

**Integración:** Usa LLM (OpenAI) con prompts estructurados

**Archivos relacionados:**
- `llm/prompt_loader.py`: Carga de prompts desde archivos
- `llm/prompt_builder.py`: Construcción de prompts
- `llm/models.py`: Cliente LLM (LangChain)

#### Gestión de roadmaps, objetivos y tareas

**Servicios:**
- `mongo_service/roadmap.py`: `RoadmapMongoService` - CRUD de roadmaps en MongoDB
- `service/learning_goal.py`: `LearningGoalService` - CRUD de metas de aprendizaje
- `service/objective.py`: `ObjectiveService` - CRUD de objetivos, gestión de Kanban
- `service/task.py`: `TaskService` - CRUD de tareas
- `service/roadmap_conversion.py`: `RoadmapConversionService` - Conversión entre roadmaps y metas de aprendizaje

**Funcionalidades principales:**
- CRUD completo de roadmaps (MongoDB)
- Búsqueda y filtrado de roadmaps públicos
- Conversión roadmap ↔ meta de aprendizaje
- Gestión de orden de tareas en Kanban (JSONB)
- Gestión de notas y recursos de tareas

**Archivos relacionados:**
- `service/kanban.py`: Lógica de Kanban
- `mongo_service/learning_goal.py`, `objective.py`, `task.py`: Servicios MongoDB para conversión

#### Generación o recuperación de audio

**Módulo:** `utils/eleven.py`

**Clase:** `ElevenLabsClient`

**Funcionalidades:**
- `synthesize_single()`: Síntesis de voz para texto simple
- `synthesize_dialogue()`: Síntesis de diálogo con múltiples voces
- `synthesize_text()`: Detección automática de modo (simple/diálogo)

**Almacenamiento:** `utils/storage.py`

**Clase:** `SupabaseStorage`

**Funcionalidades:**
- `upload()`: Subir archivo de audio a Supabase Storage
- `get_public_url()`: Obtener URL pública del audio
- `get_signed_url()`: Obtener URL firmada temporal
- `exists()`: Verificar existencia de archivo
- `delete()`: Eliminar archivo

**Flujo:**
1. Generar texto de desafío (LLM)
2. Sintetizar audio (ElevenLabs)
3. Subir a Supabase Storage
4. Guardar URL en base de datos

**Archivos relacionados:**
- `service/challenge.py`: Orquestación de generación de desafío completo

#### Tareas en background / jobs

**Pre-carga de rondas:** `service/listening_core/game_round_prefetch.py`

**Función:** `safe_prefetch_rounds()`

**Propósito:** Pre-cargar rondas futuras en background para mejorar rendimiento

**Uso:** Llamado después de iniciar sesión o avanzar ronda

**Archivos relacionados:**
- `router/game_session.py`: Uso de BackgroundTasks de FastAPI

---

## X.5 Implementación del frontend

### Estructura del proyecto

```
soft-skills-front/src/
├── api/                    # Configuración de API
├── app/                    # Configuración de app
├── assets/                 # Recursos estáticos
├── components/             # Componentes compartidos
├── config/                 # Configuración (API, env, constantes)
├── features/               # Módulos de funcionalidad
│   ├── active-listening/  # Módulo de escucha activa
│   ├── authentication/    # Autenticación
│   └── learn-to-learn/    # Módulo de aprendizaje
├── hooks/                  # Hooks personalizados
├── i18n/                   # Internacionalización
├── layouts/                # Layouts de página
├── pages/                  # Páginas genéricas
├── routes/                 # Configuración de rutas
├── store/                  # Stores globales
├── types/                  # Tipos TypeScript
├── utils/                  # Utilidades
├── App.tsx                 # Componente raíz
├── main.tsx                 # Punto de entrada
└── theme.ts                # Tema Material-UI
```

### Uso de Zustand (manejador de estado)

#### Stores globales

**Toast Store:**
- Archivo: `src/store/useToastStore.ts`
- Propósito: Gestión global de notificaciones toast
- Tipo: `src/types/toast.store.ts`

#### Stores del módulo Learn-to-Learn

**Roadmap Store:**
- Archivo: `src/features/learn-to-learn/store/useRoadmapStore.ts`
- Gestiona: Estado de roadmaps (selección, edición)

**Learning Goal Store:**
- Archivo: `src/features/learn-to-learn/store/useLearningGoalStore.ts`
- Gestiona: Estado de metas de aprendizaje

**Objective Store:**
- Archivo: `src/features/learn-to-learn/store/useObjectiveStore.ts`
- Gestiona: Estado de objetivos

**Chatbot Store:**
- Archivo: `src/features/learn-to-learn/store/useChatbotStore.ts`
- Gestiona: Estado del chatbot (conversación, thread ID)

**Explore Store:**
- Archivo: `src/features/learn-to-learn/store/useExploreStore.ts`
- Gestiona: Filtros y estado de exploración de roadmaps públicos

**Self Evaluation Store:**
- Archivo: `src/features/learn-to-learn/store/useSelfEvaluationStore.ts`
- Gestiona: Estado de auto-evaluaciones

**Self Evaluation Draft Store:**
- Archivo: `src/features/learn-to-learn/store/useSelfEvaluationDraftStore.ts`
- Gestiona: Borrador de auto-evaluación en progreso

**Note Store:**
- Archivo: `src/features/learn-to-learn/store/useNoteStore.ts`
- Gestiona: Estado de notas de tareas

**Resource Store:**
- Archivo: `src/features/learn-to-learn/store/useResourceStore.ts`
- Gestiona: Estado de recursos de tareas

**Pomodoro Preferences Store:**
- Archivo: `src/features/learn-to-learn/store/usePomodoroPreferencesStore.ts`
- Gestiona: Preferencias de Pomodoro del usuario

#### Stores del módulo Active Listening

**Game Session Store:**
- Archivo: `src/features/active-listening/store/useGameSessionStore.ts`
- Gestiona: Estado de sesiones de juego

**Game Session Draft Store:**
- Archivo: `src/features/active-listening/store/useGameSessionDraftStore.ts`
- Gestiona: Borrador de configuración de sesión

**Game Play Store:**
- Archivo: `src/features/active-listening/store/useGamePlayStore.ts`
- Gestiona: Estado durante el juego (ronda actual, audio, etc.)

**Game Play Answer Store:**
- Archivo: `src/features/active-listening/store/useGamePlayAnswerStore.ts`
- Gestiona: Estado de la respuesta del usuario en progreso

#### Store de autenticación

**Auth Store:**
- Archivo: `src/features/authentication/store/useAuthStore.ts`
- Gestiona: Estado de autenticación (usuario, token)

### Componentes principales relacionados

#### Roadmaps / editor visual

**Páginas:**
- `Roadmaps.tsx`: Lista de roadmaps
- `RoadmapDetail.tsx`: Visualización de roadmap con React Flow
- `RoadmapEditor.tsx`: Editor visual de roadmaps

**Componentes:**
- `RoadmapCanvas.tsx`: Canvas de React Flow
- `RoadmapNode.tsx`: Nodo personalizado de React Flow
- `RoadmapControls.tsx`: Controles del editor
- `ObjectiveNodeEditor.tsx`: Editor de nodo de objetivo
- `TaskNodeEditor.tsx`: Editor de nodo de tarea
- `RoadmapViewer.tsx`: Visualizador de roadmap (solo lectura)

**Archivos:**
- `src/features/learn-to-learn/components/roadmap-editor/`
- `src/features/learn-to-learn/components/roadmap/`

#### Juego / escucha activa

**Páginas:**
- `GamePlay.tsx`: Interfaz de juego
- `GameSessionResult.tsx`: Resultados finales

**Componentes:**
- `AudioPlayer.tsx`: Reproductor de audio
- `AnswerForm.tsx`: Formulario de respuesta (varía según modo)
- `RoundProgress.tsx`: Indicador de progreso de ronda
- `GameResult.tsx`: Resultado general de sesión
- `RoundResult.tsx`: Resultado de ronda individual
- `FocusAnswerForm.tsx`: Formulario para modo Focus
- `ClozeAnswerForm.tsx`: Formulario para modo Cloze
- `ParaphraseAnswerForm.tsx`: Formulario para modo Paraphrase
- `SummarizeAnswerForm.tsx`: Formulario para modo Summarize
- `ClarifyAnswerForm.tsx`: Formulario para modo Clarify

**Archivos:**
- `src/features/active-listening/components/game-play/`
- `src/features/active-listening/components/game-result/`

#### Gestión de metas, objetivos, tareas

**Páginas:**
- `Planner.tsx`: Vista de metas de aprendizaje
- `LearningGoalDetail.tsx`: Detalle de meta
- `ObjectiveDetail.tsx`: Detalle de objetivo
- `TaskDetail.tsx`: Detalle de tarea

**Componentes:**
- `KanbanBoard.tsx`: Tablero Kanban
- `KanbanColumn.tsx`: Columna de Kanban
- `KanbanTaskCard.tsx`: Tarjeta de tarea
- `ObjectiveCard.tsx`: Tarjeta de objetivo
- `TaskCard.tsx`: Tarjeta de tarea
- `TaskForm.tsx`: Formulario de tarea
- `ObjectiveForm.tsx`: Formulario de objetivo

**Archivos:**
- `src/features/learn-to-learn/components/kanban/`
- `src/features/learn-to-learn/components/objectives/`
- `src/features/learn-to-learn/components/tasks/`

#### Feedback (toasts, diálogos, formularios)

**Componentes:**
- `GlobalToastManager.tsx`: Gestor global de toasts
- `ConfirmDeleteModal.tsx`: Modal de confirmación
- Componentes de formulario usando React Hook Form

**Tecnología:**
- React Hook Form para formularios
- Material-UI para diálogos y toasts
- Zustand para estado de toasts

### Consumo de endpoints del backend

#### Configuración de API

**Archivo:** `src/config/api.ts`

**Estructura:**
- Endpoints centralizados por módulo
- Funciones helper para construir URLs con parámetros
- Constantes de configuración (AUTO_SAVE_DELAY)

#### Hooks personalizados

**Hooks de datos:**
- `useLearningGoals.ts`: Gestión de metas de aprendizaje (React Query)
- `useObjectives.ts`: Gestión de objetivos (React Query)
- `useTasks.ts`: Gestión de tareas (React Query)
- `useSelfEvaluations.ts`: Gestión de auto-evaluaciones (React Query)
- `usePublicRoadmaps.ts`: Gestión de roadmaps públicos (React Query)
- `useKanbanTasks.ts`: Gestión de tareas en Kanban (React Query)
- `useModules.ts`: Gestión de módulos

**Hooks de utilidad:**
- `useDebounce.ts`: Debounce de valores
- `useSSE.ts`: Server-Sent Events (si aplica)

#### Servicios de API

**Módulo Learn-to-Learn:**
- `api/Roadmaps.ts`: Operaciones CRUD de roadmaps
- `api/LearningGoals.ts`: Operaciones CRUD de metas
- `api/Objectives.ts`: Operaciones CRUD de objetivos
- `api/Tasks.ts`: Operaciones CRUD de tareas
- `api/KanbanTasks.ts`: Operaciones de Kanban
- `api/MoveTask.ts`: Mover tareas en Kanban
- `api/Notes.ts`: Operaciones CRUD de notas
- `api/Resources.ts`: Operaciones CRUD de recursos
- `api/SelfEvaluations.ts`: Operaciones CRUD de auto-evaluaciones
- `api/PomodoroPreferences.ts`: Operaciones de preferencias Pomodoro
- `api/Chatbot.ts`: Comunicación con chatbot

**Módulo Active Listening:**
- `api/GameSessions.ts`: Operaciones CRUD de sesiones
- `api/GamePlay.ts`: Operaciones de juego (obtener ronda, enviar respuesta, avanzar)

**Módulo Authentication:**
- `api/login.ts`: Login
- `api/register.ts`: Registro

#### Utilidades de fetch

**Archivo:** `src/utils/fetchWithAuth.ts`

**Propósito:** Wrapper de fetch con autenticación JWT automática

**Uso:** Todas las llamadas a API usan este wrapper para incluir token automáticamente

#### React Query

**Configuración:** Integrado en `App.tsx` o layout principal

**Uso:**
- Caché automática de respuestas
- Sincronización en background
- Invalidación de caché después de mutaciones
- Estados de carga y error automáticos

---

## X.6 Integración con modelos de Inteligencia Artificial

### Ubicación de integración

**Carpeta:** `soft-skills-back/llm/`

**Módulos principales:**
- `models.py`: Cliente LLM (LangChain + OpenAI)
- `challenge_generator.py`: Generación de desafíos auditivos
- `challenge_evaluation.py`: Evaluación de respuestas abiertas
- `prompt_loader.py`: Carga de prompts desde archivos
- `prompt_builder.py`: Construcción de prompts dinámicos
- `schemas.py`: Esquemas Pydantic para respuestas estructuradas

### Flujo de generación

#### Roadmaps / planes de estudio

**Endpoint:** No implementado directamente en backend (se usa chatbot externo o generación manual)

**Nota:** El frontend tiene un componente `CreateRoadmapWithChatbot` que se comunica con un servicio de chatbot externo (`CHATBOT_BASE_URL`)

**Archivo frontend:** `src/features/learn-to-learn/pages/CreateRoadmapWithChatbot.tsx`

#### Desafíos auditivos / prompts

**Función:** `generate_challenge_json()` en `llm/challenge_generator.py`

**Flujo:**
1. Validar combinación de `play_mode` y `prompt_type`
2. Cargar prompt base según modo y dificultad (`PromptLoader`)
3. Construir prompt completo con parámetros (`PromptBuilder`)
4. Ejecutar LLM con esquema estructurado (`LLMClient`)
5. Retornar JSON del desafío generado

**Parámetros:**
- `play_mode`: focus, cloze, paraphrase, summarize, clarify
- `prompt_type`: descriptive, historical_event, narrated_dialogue, dialogue, instructional
- `difficulty`: easy, intermediate, hard
- `audio_length`: short, medium, long
- `locale`: Idioma (español, inglés, etc.)
- `model_name`: Modelo OpenAI (default: gpt-4o-mini)
- `temperature`: Temperatura del modelo (default: 0.7)

**Esquemas de respuesta:**
- `FocusChallenge`: Para modo focus
- `ClozeChallenge`: Para modo cloze
- `ParaphraseChallenge`: Para modo paraphrase
- `SummarizeChallenge`: Para modo summarize
- `ClarifyChallenge`: Para modo clarify

**Archivos de prompts:**
- `llm/prompts/base/`: Prompts base
- `llm/prompts/focus/`: Prompts para modo focus
- `llm/prompts/cloze/`: Prompts para modo cloze
- `llm/prompts/paraphrase/`: Prompts para modo paraphrase
- `llm/prompts/summarize/`: Prompts para modo summarize
- `llm/prompts/clarify/`: Prompts para modo clarify
- `llm/prompts/evaluation/`: Prompts para evaluación
- `llm/prompts/manifest.yml`: Configuración de prompts

**Archivos relacionados:**
- `service/challenge.py`: Orquestación completa (generación + síntesis de audio)

### Evaluación de respuestas abiertas

**Funciones en `llm/challenge_evaluation.py`:**

#### 1. Evaluación de preguntas de clarificación
**Función:** `evaluate_clarify_questions()`

**Parámetros:**
- `reference_questions`: Lista de preguntas de referencia generadas por LLM
- `player_questions`: Lista de preguntas del jugador
- `model_name`: Modelo OpenAI (default: gpt-4o-mini)
- `temperature`: Temperatura (default: 0.1, más determinista)

**Retorna:** `ClarifyEvaluationResponse` con evaluación por pregunta

#### 2. Evaluación de resúmenes
**Función:** `evaluate_summarize_answer()`

**Parámetros:**
- `reference_summary`: Resumen de referencia generado por LLM
- `player_summary`: Resumen del jugador
- `model_name`: Modelo OpenAI (default: gpt-4o-mini)
- `temperature`: Temperatura (default: 0.1)

**Retorna:** `SummarizeEvaluationResponse` con puntuación y feedback

#### 3. Evaluación de paráfrasis
**Función:** `evaluate_paraphrase_answer()`

**Parámetros:**
- `reference_text`: Texto de paráfrasis de referencia generado por LLM
- `player_paraphrase`: Paráfrasis del jugador
- `rubric`: Lista de criterios de evaluación
- `model_name`: Modelo OpenAI (default: gpt-4o-mini)
- `temperature`: Temperatura (default: 0.1)

**Retorna:** `ParaphraseEvaluationResponse` con puntuación y feedback detallado

**Uso:** Llamado desde `GameRoundService` al procesar respuesta de ronda

**Archivos relacionados:**
- `service/listening_core/game_round.py`: Integración con evaluación
- `llm/prompts/evaluation/`: Prompts de evaluación

### Librerías usadas

- **LangChain 1.0.2**: Framework para aplicaciones con LLM
- **LangChain OpenAI 1.0.1**: Integración con OpenAI
- **LangChain Core 1.0.1**: Componentes core de LangChain
- **Pydantic 2.12.3**: Validación y esquemas estructurados

### Estructuras de datos para interacción con IA

#### Cliente LLM

**Clase:** `LLMClient` en `llm/models.py`

**Método principal:** `execute_prompt()`

**Características:**
- Configuración de modelo y temperatura
- Ejecución de prompts con esquemas estructurados (Pydantic)
- Manejo de errores

**Uso:**
```python
llm_client = LLMClient(model_name="gpt-4o-mini", temperature=0.7)
response = llm_client.execute_prompt(chat_template, ResponseSchema, **kwargs)
```

#### Esquemas de respuesta

**Archivo:** `llm/schemas.py`

**Esquemas para generación:**
- `FocusChallenge`
- `ClozeChallenge`
- `ParaphraseChallenge`
- `SummarizeChallenge`
- `ClarifyChallenge`

**Esquemas para evaluación:**
- `ClarifyEvaluationResponse`
- `SummarizeEvaluationResponse`
- `ParaphraseEvaluationResponse`

**Todos usan Pydantic para validación y serialización**

#### Carga y construcción de prompts

**Clase:** `PromptLoader` en `llm/prompt_loader.py`

**Funcionalidad:** Carga prompts desde archivos de texto en `llm/prompts/`

**Clase:** `PromptBuilder` en `llm/prompt_builder.py`

**Funcionalidad:** Construye prompts dinámicos usando templates de LangChain

**Métodos:**
- `build_chat_prompt()`: Construye prompt para generación
- `build_evaluation_prompt()`: Construye prompt para evaluación

---

## X.7 Integración del sistema

### Descripción técnica de integración

#### Backend ↔ Frontend

**Comunicación:** REST API sobre HTTP/HTTPS

**Autenticación:** JWT (JSON Web Tokens)
- Token almacenado en frontend (localStorage o estado)
- Incluido en header `Authorization: Bearer <token>`
- Middleware `decode_jwt_token` en backend valida token

**CORS:** Configurado en `main.py` con `CORSMiddleware`
- Orígenes permitidos desde variables de entorno
- Credenciales habilitadas

**Serialización:**
- Backend: Pydantic schemas → JSON
- Frontend: JSON → TypeScript types
- Conversión snake_case ↔ camelCase (usando `snakecase-keys` y `camelcase-keys`)

**Archivos de integración:**
- `soft-skills-back/main.py`: Configuración CORS
- `soft-skills-front/src/config/api.ts`: Endpoints centralizados
- `soft-skills-front/src/utils/fetchWithAuth.ts`: Wrapper de fetch con auth

#### Backend ↔ Bases de datos

**PostgreSQL:**
- ORM: SQLModel (basado en SQLAlchemy)
- Conexión: URI desde variables de entorno o SQLite fallback
- Migraciones: Alembic
- Pool de conexiones: Gestionado por SQLAlchemy

**MongoDB:**
- Driver: pymongo
- Conexión: URI desde variables de entorno
- Base de datos: `learning_roadmap`
- Serialización: Pydantic models ↔ BSON

**Archivos de integración:**
- `soft-skills-back/utils/db.py`: Configuración PostgreSQL
- `soft-skills-back/utils/mongodb.py`: Cliente MongoDB
- `soft-skills-back/utils/config.py`: Configuración de conexiones

#### Backend ↔ Servicios de IA

**OpenAI (LangChain):**
- API Key desde variables de entorno
- Cliente: `LLMClient` con LangChain
- Respuestas estructuradas con Pydantic

**Archivos de integración:**
- `soft-skills-back/llm/models.py`: Cliente LLM
- `soft-skills-back/utils/config.py`: Configuración de API key

#### Backend ↔ Almacenamiento de audio

**ElevenLabs:**
- API Key desde variables de entorno
- Cliente: `ElevenLabsClient`
- Síntesis de voz (TTS)
- Soporte para texto simple y diálogos

**Supabase Storage:**
- URL y Service Role Key desde variables de entorno
- Cliente: `SupabaseStorage`
- Bucket: `challenges-audio` (configurable)
- URLs públicas para streaming

**Flujo:**
1. Generar texto de desafío (LLM)
2. Sintetizar audio (ElevenLabs) → bytes
3. Subir a Supabase Storage → URL pública
4. Guardar URL en tabla `listening_challenge`

**Archivos de integración:**
- `soft-skills-back/utils/eleven.py`: Cliente ElevenLabs
- `soft-skills-back/utils/storage.py`: Cliente Supabase Storage
- `soft-skills-back/service/challenge.py`: Orquestación completa

### Flujo extremo a extremo

#### Crear una sesión de juego y completar varias rondas

**1. Crear sesión:**
- Frontend: Usuario completa formulario → `POST /api/v1/game-sessions`
- Backend: `GameSessionService.create_game_session_with_config()`
  - Crea `GameSession` y `GameSessionConfig` en PostgreSQL
  - Retorna sesión creada
- Frontend: Almacena ID de sesión, navega a configuración

**2. Configurar sesión:**
- Frontend: Usuario ajusta configuración → `PATCH /api/v1/game-sessions/{id}/config`
- Backend: Actualiza `GameSessionConfig`

**3. Iniciar sesión:**
- Frontend: Usuario hace clic en "Iniciar" → `POST /api/v1/game-sessions/{id}/start`
- Backend: `GameSessionService.start_game_session()`
  - Cambia status a `in_progress`
  - Prepara primera ronda (genera o reutiliza desafío)
  - Pre-carga rondas futuras en background
- Frontend: Navega a `/active-listening/session/{id}/play`

**4. Jugar ronda:**
- Frontend: `GET /api/v1/game-sessions/{sessionId}/rounds/current`
- Backend: Retorna ronda actual con:
  - URL de audio (Supabase)
  - Configuración de ronda
  - Metadata según modo de juego
- Frontend: Reproduce audio, muestra formulario según modo
- Usuario completa respuesta → `POST /api/v1/game-sessions/{sessionId}/rounds/{roundNumber}/attempt`
- Backend: `GameRoundService.process_round_answer()`
  - Valida respuesta
  - Evalúa según modo (LLM para respuestas abiertas)
  - Calcula puntuación
  - Guarda `RoundSubmission`
  - Actualiza `GameRound` (status, score)
  - Actualiza `GameSession` (total_score)
- Frontend: Muestra evaluación y puntuación

**5. Avanzar a siguiente ronda:**
- Frontend: Usuario hace clic en "Siguiente" → `POST /api/v1/game-sessions/{sessionId}/rounds/next`
- Backend: `GameSessionService.advance_to_next_round()`
  - Incrementa `current_round`
  - Prepara siguiente ronda (genera o reutiliza)
  - Pre-carga rondas futuras en background
- Frontend: Actualiza interfaz con nueva ronda

**6. Finalizar sesión:**
- Frontend: Usuario completa todas las rondas → `POST /api/v1/game-sessions/{id}/finish`
- Backend: `GameSessionService.finish_game_session()`
  - Cambia status a `finished`
  - Calcula resultados finales
- Frontend: Navega a `/active-listening/session/{id}/result`

**7. Ver resultados:**
- Frontend: `GET /api/v1/game-sessions/{id}/result`
- Backend: Retorna resumen completo de sesión
- Frontend: Muestra resultados detallados

**Archivos clave:**
- `router/game_session.py`: Endpoints
- `service/listening_core/game_session.py`: Lógica de sesión
- `service/listening_core/game_round.py`: Lógica de rondas
- `service/challenge.py`: Generación de desafíos
- `llm/challenge_generator.py`: Generación con LLM
- `llm/challenge_evaluation.py`: Evaluación con LLM
- `utils/eleven.py`: Síntesis de audio
- `utils/storage.py`: Almacenamiento de audio

#### Generar y editar un roadmap de aprendizaje

**1. Crear roadmap con chatbot:**
- Frontend: Usuario navega a `/learn/roadmaps/create/chat`
- Frontend: `CreateRoadmapWithChatbot` se comunica con servicio de chatbot externo
- Usuario conversa con chatbot para definir roadmap
- Chatbot retorna estructura de roadmap (objetivos, tareas)
- Frontend: Usuario confirma → `POST /api/v1/roadmap`
- Backend: `RoadmapMongoService.add_roadmap()`
  - Valida datos
  - Agrega metadatos (user_id, username, timestamps)
  - Inserta en MongoDB (`learning_roadmap.roadmaps`)
  - Retorna roadmap creado con `_id` convertido a `roadmap_id`
- Frontend: Navega a `/learn/roadmaps/{roadmapId}`

**2. Visualizar roadmap:**
- Frontend: `GET /api/v1/roadmap/{id}`
- Backend: `RoadmapMongoService.get_roadmap_by_id()`
  - Busca en MongoDB por `_id`
  - Convierte a modelo Pydantic
  - Retorna roadmap completo
- Frontend: `RoadmapDetail` renderiza con React Flow
  - Nodos: objetivos y tareas
  - Edges: relaciones jerárquicas
  - Layout: posiciones desde `layout` del roadmap

**3. Editar roadmap:**
- Frontend: Usuario navega a `/learn/roadmaps/{roadmapId}/edit`
- Frontend: `RoadmapEditor` carga roadmap
- Usuario edita en canvas de React Flow:
  - Agrega/elimina nodos (objetivos, tareas)
  - Edita contenido de nodos
  - Mueve nodos (actualiza posiciones)
  - Agrega/elimina edges
- Frontend: Auto-guardado (debounce 750ms) → `PATCH /api/v1/roadmap/{id}`
- Backend: `RoadmapMongoService.update_roadmap()`
  - Actualiza documento en MongoDB
  - Actualiza `updated_at`
- Frontend: Muestra confirmación de guardado

**4. Convertir roadmap a meta de aprendizaje:**
- Frontend: Usuario hace clic en "Convertir a meta" → `POST /api/v1/roadmap/{id}/convert-to-learning-goal`
- Backend: `RoadmapConversionService.convert_roadmap_to_learning_goal()`
  - Obtiene roadmap de MongoDB
  - Crea `LearningGoal` en PostgreSQL
  - Crea `Objective` por cada objetivo del roadmap
  - Crea `Task` por cada tarea del roadmap
  - Crea `TaskResource` por cada recurso
  - Mantiene orden y relaciones
- Frontend: Navega a `/learn/planner/goals/{goalId}`

**5. Explorar roadmaps públicos:**
- Frontend: Usuario navega a `/learn/explore`
- Frontend: `GET /api/v1/roadmap/public` (con filtros opcionales)
- Backend: `RoadmapMongoService.get_public_roadmaps()`
  - Filtra por `visibility: "public"`
  - Aplica filtros (título, descripción, fecha, pasos, usuario)
  - Retorna paginado
- Frontend: Muestra lista de roadmaps públicos
- Usuario puede copiar roadmap → `POST /api/v1/roadmap/{id}/copy`
- Backend: Crea copia con nuevo `user_id`

**Archivos clave:**
- `router/roadmap.py`: Endpoints
- `mongo_service/roadmap.py`: Servicio MongoDB
- `service/roadmap_conversion.py`: Conversión roadmap → learning goal
- `nosql_models/roadmap.py`: Modelos Pydantic
- `src/features/learn-to-learn/pages/RoadmapEditor.tsx`: Editor visual
- `src/features/learn-to-learn/components/roadmap-editor/`: Componentes de editor

### Archivos de configuración de despliegue

#### Backend (Vercel)

**Archivo:** `soft-skills-back/vercel.json`

```json
{
  "version": 2,
  "builds": [{
    "src": "main.py",
    "use": "@vercel/python"
  }],
  "routes": [{
    "src": "/(.*)",
    "dest": "main.py"
  }],
  "env": {
    "APP_MODULE": "main:app"
  }
}
```

**Variables de entorno requeridas:**
- `DB_URI` o componentes de conexión PostgreSQL
- `MONGODB_URI`
- `MONGODB_DB_NAME`
- `SECRET_KEY` (JWT)
- `OPENAI_API_KEY`
- `ELEVENLABS_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `PUBLIC_BASE_URL`
- `CORS_ORIGINS`

#### Frontend (Vercel)

**Archivo:** `soft-skills-front/vercel.json`

```json
{
  "version": 2,
  "builds": [{
    "src": "package.json",
    "use": "@vercel/static-build",
    "config": {
      "distDir": "dist"
    }
  }],
  "rewrites": [{
    "source": "/(.*)",
    "destination": "/index.html"
  }]
}
```

**Variables de entorno requeridas:**
- `VITE_API_BASE_URL`: URL del backend
- `VITE_CHATBOT_BASE_URL`: URL del servicio de chatbot (opcional)

#### Google Cloud (alternativa)

**Archivo:** `soft-skills-back/app.yaml`

**Propósito:** Configuración para Google App Engine (si se usa)

---

## Notas finales

- Todas las rutas de archivos son relativas a la raíz del workspace
- Los modelos de base de datos usan UUID como claves primarias (excepto `modules` que usa int)
- Las migraciones de base de datos están en `soft-skills-back/alembic/versions/`
- El frontend usa TypeScript estricto con validación de tipos
- La internacionalización (i18n) está configurada pero puede no estar completamente implementada
- El sistema de auto-guardado en el editor de roadmaps usa debounce de 750ms
- Los archivos de audio se almacenan en Supabase Storage con URLs públicas
- Las evaluaciones con LLM usan temperatura baja (0.1) para mayor determinismo
- El sistema soporta múltiples modos de juego y tipos de prompts con validación de combinaciones permitidas

