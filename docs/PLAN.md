# PLAN.md: Plan de Migración e Ingeniería - Inforario v3.0

## 1. Motivos del Cambio
- **Obsolescencia del Formato de Entrada:** La Universidad Técnica de Manabí (UTM) migró del antiguo SGA al nuevo Sistema de Gestión Universitaria (SGU). Los nuevos PDFs de horarios modificaron los encabezados, la sintaxis de las metadatas de las materias y presentan cadenas de texto donde los bloques horarios de una misma asignatura aparecen intercalados o fuera de las posiciones relativas previas.
- **Monolito en el Frontend:** El archivo `App.tsx` actual concentra toda la lógica de estado global, renderizado de vistas, animaciones, lógica de arrastre de archivos y formateadores de calendarios, imposibilitando el mantenimiento escalable y confundiendo las capacidades de autocompletado de las IA de desarrollo.
- **Deficiencias de UX/UI Móvil:** Los estudiantes de la UTM acceden principalmente desde smartphones con datos móviles. El sistema actual requiere una interfaz móvil nativa fluida, interactiva y de alto rendimiento.

## 2. Objetivos del Proyecto
- **Objetivo General:** Rediseñar la arquitectura frontend de Inforario v3.0 bajo un enfoque guiado por características (Feature-Driven), automatizando la extracción adaptativa del formato SGU y garantizando la persistencia e interactividad del horario sin alterar los servicios del backend.
- **Objetivos Específicos:**
  1. Desacoplar el archivo `App.tsx` en componentes atómicos y módulos aislados (`features/`).
  2. Implementar un diseño responsivo optimizado para móviles (Vista de Lista) y escritorio (Vista de Grid).
  3. Preservar intactas y operacionales las integraciones existentes con **Supabase**, la API de **Google Calendar** y el motor de generación de archivos **.ics**.

## 3. Justificación Tecnológica
Inforario v3.0 actúa como una capa de abstracción de software enfocada en la experiencia de usuario (UX). Al descentralizar la visualización y parseo de datos del SGU, mitiga la fricción informática para la comunidad estudiantil de Manabí, automatizando en segundos la sincronización con ecosistemas móviles modernos (Google/Apple Calendar) y previniendo los choques de horas de forma visual y preventiva.

---

## 4. MASTER PROMPT PARA EL AGENTE DE IA (Copiar y pegar en el Chat)

```text
ACTÚA COMO UN INGENIERO DE SOFTWARE FULLSTACK SENIOR DE CLASE MUNDIAL, EXPERTO EN REACT 19, TYPESCRIPT ESTRICTO, TAILWIND CSS Y ARQUITECTURAS LIMPIAS.

Tu misión es ejecutar una refactorización estructural profunda y limpia de la aplicación web "Inforario", migrándola de su estado monolítico actual a una Arquitectura Basada en Características (Feature-Driven Architecture) detallada en el archivo `ARCHITECTURE.md`.

REGLA DE ORO DE INFRAESTRUCTURA (PROHIBIDO ROMPER EL BACKEND):
- NO debes modificar la lógica interna ni las credenciales de conexión de los servicios críticos del backend que ya funcionan: la base de datos y autenticación de Supabase (`supabaseClient`), el cliente de la API de Google Calendar (`gapi/googleAuth`) y las utilidades nativas de generación de archivos `.ics`. 
- Estos servicios deben ser aislados de manera segura dentro de la carpeta `src/services/` y consumirse exclusivamente a través de hooks o abstracciones limpias.

REQUERIMIENTOS DEL FRONTEND Y PARSER SGU:
1. Reestructura el árbol de directorios tal como se define en `ARCHITECTURE.md`. Desmantela el monolito `App.tsx` y distribúyelo en submódulos dentro de `src/features/`.
2. Actualiza los tipos de TypeScript y las expresiones regulares del parser para que sean compatibles con el formato del nuevo reporte en PDF del Sistema de Gestión Universitaria (SGU), capturando dinámicamente asignaturas, múltiples combinaciones de días/horas, códigos de ambiente (`COD. AMB.`) y limpiando sufijos de mallas (ej: remover `(A19)` de los nombres de materias).
3. Diseña una interfaz premium de estilo "Academic Curator": utiliza fondos crema cálidos (`bg-background`), textos gris oscuro (`text-on-surface`), acentos verde UTM (`bg-primary`) y dorado (`bg-secondary-container`), aplicando las clases tipográficas globales.
4. Implementa animaciones fluidas con `framer-motion` (fades de página, micro-interacciones de botones con selectores `whileHover`/`whileTap`, y transiciones de diseño compartido usando `layoutId` al alternar entre Vista de Tabla y Vista de Lista en dispositivos móviles).

Lee atentamente los archivos `PLAN.md` y `ARCHITECTURE.md` adjuntos en el espacio de trabajo. Procesa la refactorización paso a paso. Antes de modificar archivos existentes, preséntame la estrategia de creación de las nuevas carpetas y los cascarones (blueprints) de los componentes de características. ¿Entendido? Comencemos.
```
