# Fase 2: Configuración del Entorno de Extensión (Manifest v3)
## Objetivo
Configurar el entorno de construcción (Vite) y el archivo de manifiesto obligatorio para que el proyecto React sea reconocido por navegadores basados en Chromium (Chrome, Edge, Opera) bajo el estándar Manifest v3.

## Pasos de Ejecución para el Agente

### 1. Estructura de Archivos del Proyecto
Asegurar que la estructura final compile los siguientes scripts esenciales:
* `manifest.json`: Configuración principal.
* `background.js` (Service Worker): Lógica en segundo plano para intercepción de red.
* `content.js`: Script inyectado en la página del SGU para interactuar con el DOM si es necesario.
* `/index.html` (Nueva pestaña): La app de React interactiva que se abrirá al procesar el horario.

### 2. Configuración del `manifest.json`
Crear el archivo en la raíz de distribución pública con los siguientes permisos estrictos:

```json
{
  "manifest_version": 3,
  "name": "Inforario UTM",
  "version": "2.0.0",
  "description": "Convierte tu horario del SGU en un cronograma interactivo en un clic.",
  "permissions": [
    "declarativeNetRequest",
    "scripting",
    "activeTab",
    "storage",
    "tabs"
  ],
  "host_permissions": [
    "https://*.utm.edu.ec/*"
  ],
  "background": {
    "service_worker": "background.js"
  },
  "action": {
    "default_title": "Ver mi Horario Interactivo"
  }
}