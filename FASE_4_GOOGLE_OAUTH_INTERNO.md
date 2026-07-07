# Fase 4: Configuración de Google OAuth2 Interno (Método de Dominio)
## Objetivo
Configurar la sincronización con Google Calendar API evitando los costos, auditorías de seguridad y demoras de la verificación formal de Google, limitando el entorno al ecosistema universitario.

## Pasos de Ejecución para el Agente

### 1. Configuración en Google Cloud Console
* **Tipo de Aplicación:** Configurar la pantalla de consentimiento de OAuth como tipo **"Interno" (Internal)**.
* **Asociación de Organización:** Vincular el proyecto al espacio de trabajo (Google Workspace) institucional utilizando un correo con el dominio oficial de la universidad (`@utm.edu.ec`).

### 2. Beneficios Aplicados en Código
* Al marcarse como aplicación Interna, Google omite las restricciones de los 100 usuarios máximos y la pantalla roja de advertencia ("App no verificada") para todos los miembros de la misma organización.
* Cualquier estudiante que inicie sesión con su correo institucional de la UTM podrá otorgar permisos de escritura a su Google Calendar directamente.

### 3. Flujo en la Extensión
* Configurar la autenticación mediante la API `chrome.identity.getAuthToken` para solicitar los *scopes* de calendario de forma nativa y fluida dentro de la extensión de navegador.