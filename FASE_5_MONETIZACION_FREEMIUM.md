# Fase 5: Sistema de Monetización Híbrido (Premium vs Ads)
## Objetivo
Implementar la lógica de control de acceso para monetizar la extensión combinando un Pase Semestral Premium (por ciclo académico) con un sistema de desbloqueo basado en anuncios de recompensa para usuarios gratuitos.

## Pasos de Ejecución para el Agente

### 1. Estructura de Control de Acceso (`is_premium`)
* En Supabase, añadir o verificar un campo booleano `is_premium` (o `premium_until` con marca de tiempo de 6 meses) asociado al perfil del usuario.
* Al iniciar la aplicación, consultar este estado de forma local.

### 2. Flujo de Funcionalidades Libres (Gratis)
* El usuario gratuito tiene acceso ilimitado a: Parsear el horario del SGU, ver la interfaz interactiva, personalizar los colores de las materias y visualizar los conflictos de horas.

### 3. Compilador de Funciones Avanzadas (Monetización)
Cuando el usuario intente dar clic en **Sincronizar con Google Calendar** o **Exportar archivo .ics**:
* **Caso Premium (`is_premium: true`):** Ejecutar la acción inmediatamente sin interrupciones.
* **Caso Gratis (`is_premium: false`):** Desplegar un modal con dos opciones claras:
  1. *Opción A (Pago):* "Adquirir Pase Semestral ($X.XX)" para desbloquear todas las automatizaciones de fondo durante todo el ciclo de estudios.
  2. *Opción B (Recompensa):* "Ver un anuncio corto para desbloquear ahora". Al completar la reproducción del script de anuncios integrado (vía AdSense o red compatible), disparar un callback que ejecute la sincronización por esa sesión.