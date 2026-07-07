---

### `FASE_3_EXTRACCION_HIBRIDA.md`
```markdown
# Fase 3: Flujo Técnico de Extracción Híbrida (Opción A + Fallback B)
## Objetivo
Implementar el algoritmo de captura robusta del PDF del SGU de la UTM mediante intercepción de red y extracción del DOM, garantizando un 100% de efectividad.

## Pasos de Ejecución para el Agente

### 1. Implementación de Opción A (Intercepción de Red en `background.js`)
* **Lógica:** Escuchar activamente las peticiones HTTP del SGU cuando el usuario presiona "Generar certificado".
* **Código:** Utilizar la API `chrome.declarativeNetRequest` o `chrome.webRequest` (si se procesa asíncronamente) para detectar la URL que responde con un tipo de contenido `application/pdf`.
* **Acción:** Capturar los bytes del archivo en tránsito, enviarlos en memoria al parser y disparar la apertura de la pestaña de la app: `chrome.tabs.create({ url: 'index.html' })`.

### 2. Implementación de Opción B (Fallback mediante Inyección DOM)
* **Condición:** Si la opción A no logra interceptar el archivo debido a tokens dinámicos o cambios de red, se activa el fallback.
* **Acción en `content.js`:** 
  1. Identificar el contenedor o `<iframe>` que aloja el visor de PDF con scroll en la página del SGU.
  2. Extraer el atributo `src` o la URL del blob incrustado.
  3. Realizar un `fetch()` de fondo utilizando las cookies de la sesión activa del usuario para descargar el archivo binario directamente.
  4. Pasar el archivo resultante al core del parser.

### 3. Manejo de Errores
* Si ambas opciones fallan de forma crítica, la extensión debe mostrar un modal amigable guiando al usuario con un paso alternativo (ej. "Descarga el PDF y arrástralo aquí").