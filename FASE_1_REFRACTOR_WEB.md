\# Fase 1: Reestructuración y Limpieza del Código Web (Refactor)

\## Objetivo

Preparar el repositorio actual de Inforario (`inforario-IA-null`) aislando el núcleo lógico del parser y limpiando componentes pesados de la interfaz web para que sirva como la base ligera de la extensión.



\## Pasos de Ejecución para el Agente



\### 1. Extracción y Aislamiento del Parser

\* \*\*Acción:\*\* Ubicar la lógica encargada de recibir el PDF del SGU, procesar el texto y estructurar el JSON del horario.

\* \*\*Destino:\*\* Mover o centralizar este código en un módulo totalmente independiente en `src/utils/sguParser.js` (o `.ts`).

\* \*\*Regra:\*\* Este archivo debe ser una función pura que reciba un `ArrayBuffer`, `Blob` o `String` crudo del PDF y devuelva el JSON estructurado. No debe depender de ningún estado de React ni llamadas directas a Supabase.



\### 2. Desacoplamiento de Supabase (Modo Local-First)

\* \*\*Acción:\*\* Modificar la vista del calendario principal (`Dashboard` o `Timetable`) para que se renderice leyendo un estado local o `localStorage`.

\* \*\*Lógica:\*\* Al cargar el JSON del parser, guardarlo inmediatamente en el almacenamiento local del navegador para permitir que la aplicación sea completamente funcional de manera offline sin requerir autenticación obligatoria inicial.



\### 3. Depuración de Vistas e Interfaz

\* \*\*Acción:\*\* Eliminar componentes de la interfaz web tradicional que ya no aportan al flujo automatizado de la extensión.

\* \*\*Componentes a remover:\*\*

&#x20; \* Landing page pesada de marketing.

&#x20; \* Zonas de arrastrar y soltar archivos (`Dropzones` o inputs de carga manual de PDF).

&#x20; \* Rutas de navegación web innecesarias.

\* \*\*Resultado esperado:\*\* Dejar únicamente la vista del Horario Interactivo (con sus selectores de colores, detección de colisiones y botones de exportación).

