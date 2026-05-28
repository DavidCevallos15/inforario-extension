# ARCHITECTURE.md: Especificación de Estructura de Directorios - Inforario v3.0

Toda generación de código, creación de archivos o refactorización asistida por IA debe regirse estrictamente por la siguiente arquitectura modular basada en dominios de características (**Feature-Driven Architecture**).

## 1. Árbol de Directorios del Frontend

```text
src/
├── components/                 # Componentes de UI globales y agnósticos al dominio
│   ├── ui/                     # Elementos atómicos de diseño (Design System)
│   │   ├── Button.tsx          # Botones interactivos con animaciones integradas
│   │   ├── Card.tsx            # Contenedores con sombras estilo editorial
│   │   ├── Badge.tsx           # Etiquetas de estado para materias o aulas
│   │   └── Modal.tsx           # Diálogos emergentes con AnimatePresence
│   └── layout/                 # Elementos estructurales globales
│       ├── Navbar.tsx          # Barra de navegación superior
│       └── Footer.tsx          # Pie de página institucional y créditos
│
├── features/                   # Módulos core de la aplicación (Lógica de Negocio)
│   ├── landing/                # Vista de bienvenida y presentación del proyecto
│   │   ├── components/         # HeroSection, FeatureCards, CallToAction
│   │   └── LandingPage.tsx     # Punto de entrada de la Landing
│   │
│   ├── uploader/               # Zona de procesamiento y carga de PDFs del SGU
│   │   ├── components/         # DropZone, ProcessingView, FileErrorBanner
│   │   ├── hooks/              # useScheduleUpload.ts (Gestión de estados del archivo)
│   │   └── utils/              # sguRegexParser.ts (Lógica local de extracción de texto)
│   │
│   ├── schedule/               # Núcleo interactivo del Horario Académico
│   │   ├── components/         # ScheduleGrid (Desktop), ScheduleList (Mobile), SubjectCard
│   │   ├── hooks/              # useScheduleCustomizer.ts, useConflictResolver.ts
│   │   └── utils/              # timeSelectors.ts (Cálculo de colisiones horarias)
│   │
│   └── profile/                # Gestión de datos del estudiante y sesiones locales
│       ├── components/         # ProfileForm, PreferencesPanel
│       └── hooks/              # useStudentProfile.ts
│
├── hooks/                      # Hooks globales compartidos y utilitarios
│   ├── useMediaQuery.ts        # Detección en tiempo real de viewports (Mobile vs Desktop)
│   └── useLocalStorage.ts      # Persistencia de estados en el navegador
│
├── services/                   # CAPA DE INFRAESTRUCTURA (Mantener Operacional e Intacta)
│   ├── supabase/               # Configuración y consultas de Supabase
│   │   └── supabaseClient.ts   # Cliente de Base de Datos y funciones Edge de Ollama/Groq
│   ├── google/                 # Integración con Google Calendar API
│   │   └── googleAuth.ts       # Flujo de autenticación OAuth2 y envío de eventos
│   └── ics/                    # Utilidades de conversión de datos nativos
│       └── icsGenerator.ts     # Generador de archivos estandarizados .ics para calendarios
│
├── types/                      # Definiciones estrictas de Tipos e Interfaces de TypeScript
│   ├── index.ts                # Exportación central de tipos comunes
│   ├── sgu.ts                  # Interfaces del formato SGU (ClassSession, Subject, Teacher)
│   └── database.ts             # Tipos mapeados de las tablas de Supabase
│
├── styles/                     # Estilos globales y tokens de diseño
│   └── globals.css             # Tailwind CSS injects y utilidades tipográficas UTM
│
├── App.tsx                     # Orquestador Limpio (Máximo 100 líneas, actúa como View Router)
└── index.tsx                   # Punto de hidratación de React en el DOM
```

## 2. Reglas Estrictas de Programación y Estilo

- **Responsabilidad Única (SRP):** Si un componente visual de una característica (`features/`) supera las 150 líneas de código, la IA debe fragmentarlo obligatoriamente en sub-componentes más pequeños dentro de su respectiva subcarpeta `components/`.
- **Tipado Estricto Sin Excepciones:** Queda rotundamente prohibido el uso de tipos implícitos o explícitos de tipo `any`. Todas las estructuras de datos devueltas por los parsers de texto del SGU o las consultas de Supabase deben implementar interfaces tipadas en `types/sgu.ts`.
- **Encapsulamiento de Estado:** El estado de la aplicación debe vivir lo más cerca posible de donde se consume. El componente principal `App.tsx` solo debe coordinar qué vista principal renderizar (`AppView` enum: `LANDING`, `DASHBOARD`, `ABOUT`) basándose en si existe un horario cargado o no.
- **Respeto a Animaciones e Interactividad:** Cada botón generado debe poseer propiedades reactivas suaves (`whileHover={{ scale: 1.02 }}` y `whileTap={{ scale: 0.98 }}`). Las transiciones entre pantallas deben ser orquestadas usando bloques limpios de `<AnimatePresence>` para evitar saltos visuales bruscos.
