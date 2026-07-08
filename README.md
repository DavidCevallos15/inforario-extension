<div align="center">
<img width="1200" height="475" alt="GHBanner" src="./inforario_banana_banner.png" />

# 📅 Inforario UTM - Extensión de Navegador (Manifest V3)

[![React](https://img.shields.io/badge/React-19-blue.svg?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-purple.svg?logo=vite)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![Manifest V3](https://img.shields.io/badge/Chrome_Extension-Manifest_V3-green.svg)](https://developer.chrome.com/docs/extensions/mv3/intro/)

**Inforario UTM** es una extensión de navegador moderna y ligera diseñada para los estudiantes de la **Universidad Técnica de Manabí (UTM)**. Transforma los reportes oficiales en formato PDF del nuevo **Sistema de Gestión Universitaria (SGU)** en un calendario semanal interactivo, dinámico y personalizable con un solo clic.

</div>

---

## 🚀 Características Clave

### 1. ⚡ Captura e Intercepción Híbrida (100% de Efectividad)
* **Método A (Intercepción de Red):** La extensión monitorea en segundo plano (`background.ts`) las solicitudes de descarga de PDFs del portal SGU de la UTM. Al presionar "Generar certificado/horario", intercepta el flujo de bytes, procesa la información en memoria y abre automáticamente el visor interactivo.
* **Método B (Inyección DOM & Fallback):** Si la intercepción directa de red es bloqueada por tokens temporales, un script de contenido (`content.ts`) localiza el visor de PDF incrustado en el portal, recupera su URL de origen y descarga de manera segura el archivo mediante cookies activas de sesión.

### 2. 📅 Sincronización Directa con Google Calendar
* Integración fluida mediante la API `chrome.identity.getAuthToken`.
* **Configuración Interna:** El proyecto está vinculado directamente al espacio institucional de Google Workspace bajo el dominio `@utm.edu.ec`. Esto permite a los estudiantes vincular sus cuentas institucionales de forma inmediata, evitando las advertencias rojas de "aplicación no verificada".

### 3. 🎨 Visor Interactivo y "Academic Curator"
* **Vista Adaptable:**
  * **Vista Grid (Escritorio):** Un calendario semanal tradicional para una visión general clara de la distribución de clases.
  * **Vista de Lista (Móvil):** Un diseño vertical fluido, ligero y optimizado para pantallas pequeñas y conexiones de datos móviles.
* **Personalización:** Modifica los colores temáticos de cada materia para identificar tus clases a golpe de vista.
* **Detección de Choques:** Resalta de forma visual e intuitiva cualquier solapamiento u horas conflictivas en tu planificación académica.

### 4. 🔒 Local-First y Privacidad
* Toda la lógica de extracción de texto y conversión de PDF a JSON (`src/utils/sguParser.ts`) se ejecuta de manera local en el hilo de ejecución de tu navegador.
* Funciona completamente offline tras la primera carga y almacena tus horarios localmente en `chrome.storage` o `localStorage`.

### 5. 💎 Modelo de Monetización Híbrido (Premium vs Ads)
* **Funciones Gratuitas:** Carga de horarios, visualización del visor interactivo, personalización de colores y detección de colisiones.
* **Funciones Avanzadas (Sincronización de Calendarios / Exportar ICS):**
  * **Acceso Premium:** Suscripción/pase semestral por ciclo académico para usuarios que desean automatización instantánea y directa.
  * **Acceso por Recompensa (Ad-Supported):** Los usuarios gratuitos pueden desbloquear de forma puntual estas funciones viendo un anuncio corto integrado.

---

## 🛠️ Stack Tecnológico

* **Frontend Framework:** React 19 + TypeScript (Tipado estricto sin tipos `any`).
* **Estilizado & Animaciones:** Tailwind CSS v4 + Framer Motion (para transiciones suaves y micro-interacciones).
* **Compilación & Empaquetado:** Vite 6 + TypeScript Compiler (`tsc`), configurado para generar scripts de extensión estáticos (`background.js`, `content.js`) no hasheados.
* **Procesamiento de PDF:** PDF.js (`pdfjs-dist`) integrado a nivel local.
* **Almacenamiento & Auth:** APIs de extensión de Chrome (`chrome.storage`, `chrome.identity`) y base de datos local con fallback de sesión.

---

## 📂 Estructura del Repositorio

El proyecto está organizado bajo una **Arquitectura Basada en Características (Feature-Driven Architecture)** para mantener el desacoplamiento:

```text
inforario-extension/
├── docs/                        # Guías de arquitectura e ingeniería del proyecto
├── frontend/
│   ├── public/                  # Assets públicos y manifest.json (Manifest V3)
│   ├── src/
│   │   ├── components/          # Componentes visuales globales y diseño del sistema (botones, modales)
│   │   ├── extension/           # Scripts nativos de la extensión (background.ts, content.ts)
│   │   ├── features/            # Módulos core por dominio de negocio
│   │   │   ├── schedule/        # Componentes de Horarios, Grid, Lista y Sincronizadores
│   │   │   └── uploader/        # (Legado/Fallback) Gestores de carga local de archivos
│   │   ├── services/            # Servicios de infraestructura (Supabase, Google OAuth)
│   │   ├── types/               # Definiciones e interfaces de tipado de datos SGU
│   │   ├── utils/               # Lógica aislada del parser del PDF SGU
│   │   ├── App.tsx              # Orquestador y enrutador principal de vistas
│   │   └── main.tsx             # Punto de hidratación de React en el DOM
│   ├── package.json             # Dependencias del frontend y scripts de compilación
│   └── vite.config.ts           # Configuración personalizada de empaquetado para Manifest V3
├── package.json                 # Scripts de orquestación global del monorepo
└── README.md                    # Documentación del proyecto (este archivo)
```

---

## ⚙️ Configuración e Instalación para Desarrollo

### Prerrequisitos
* Node.js (versión 18 o superior recomendada)
* Un navegador basado en Chromium (Google Chrome, Microsoft Edge, Brave, Opera)

### Pasos de Instalación
1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/DavidCevallos15/inforario-extension.git
   cd inforario-extension
   ```

2. **Instalar dependencias globales y de frontend:**
   ```bash
   npm run install:all
   ```

3. **Compilar el proyecto:**
   Para construir la extensión de navegador en modo producción (generando la carpeta `frontend/dist`):
   ```bash
   npm run build --prefix frontend
   ```

4. **Instalar en el Navegador:**
   1. Abre tu navegador y dirígete a la sección de Extensiones (ej. `chrome://extensions/` en Chrome).
   2. Activa el **Modo de desarrollador** (esquina superior derecha).
   3. Haz clic en **Cargar descomprimida** (Load unpacked).
   4. Selecciona la carpeta **`frontend/dist`** resultante de la compilación.
   5. ¡Listo! La extensión estará activa y lista para capturar tus horarios en el portal SGU de la UTM.

---

## 🗺️ Fases del Proyecto e Ingeniería
Puedes explorar en detalle la planificación técnica en los archivos específicos de fases:
* 📄 [Fase 1: Reestructuración Web (Refactor)](file:///c:/Users/David/Documents/Proyectos/inforario-extension/FASE_1_REFRACTOR_WEB.md)
* 📄 [Fase 2: Configuración de la Extensión (Manifest V3)](file:///c:/Users/David/Documents/Proyectos/inforario-extension/FASE_2_MANIFEST_V3.md)
* 📄 [Fase 3: Flujo Técnico de Extracción Híbrida](file:///c:/Users/David/Documents/Proyectos/inforario-extension/FASE_3_EXTRACCION_HIBRIDA.md)
* 📄 [Fase 4: Configuración de Google OAuth2 Interno](file:///c:/Users/David/Documents/Proyectos/inforario-extension/FASE_4_GOOGLE_OAUTH_INTERNO.md)
* 📄 [Fase 5: Sistema de Monetización Híbrido](file:///c:/Users/David/Documents/Proyectos/inforario-extension/FASE_5_MONETIZACION_FREEMIUM.md)

---

## 👥 Contribuciones y Créditos

Este software es desarrollado activamente por:
* **David Cevallos** - [*DavidCevallos15*](https://github.com/DavidCevallos15) (jimdav1506ceva@gmail.com)

*Desarrollado con pasión para mejorar la experiencia académica de la comunidad de la Universidad Técnica de Manabí.*
