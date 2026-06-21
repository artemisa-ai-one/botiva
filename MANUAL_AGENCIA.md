# 🚀 Manual de Operaciones - Agencia AIAA (NexIA)

Este documento es tu "Acordeón" o "Cheat Sheet". Si se te olvida cómo funciona tu propia agencia de Inteligencia Artificial, lee esto.

## 1. Tu Página de Ventas (Landing Page)
Tu sitio web para conseguir clientes ya está público y alojado gratis en internet.
👉 **Enlace en vivo:** [https://artemisa-ai-one.github.io/botiva/](https://artemisa-ai-one.github.io/botiva/)

El bot de chat que está en esa página se llama **"NexIA Demo"**. 
* **Regla de seguridad:** Está configurado para responder un máximo de **3 preguntas**. A la cuarta pregunta, cortará la charla e invitará al cliente a llenar el formulario. Esto evita que te gasten el saldo de tu API en pruebas o que intenten hackearlo.

---

## 2. Cómo Crear un Bot para un Cliente Nuevo
Cuando cierres una venta, no tienes que entrar a Botiva a hacer clics. Solo tienes que abrir tu terminal, ir a la carpeta de este repositorio y usar "La Fábrica".

**Comando:**
```bash
node scripts/fabrica_agentes.js "Nombre del Cliente" <perfil>
```
*Los perfiles disponibles son: `ventas`, `recepcion`, `soporte`.*

**Ejemplo:** Si le vendiste a "Ferretería El Tornillo" un bot para ventas:
```bash
node scripts/fabrica_agentes.js "Ferretería El Tornillo" ventas
```
El script te devolverá un código HTML. Ese código es el que le mandas al programador de la ferretería para que lo pegue en su página web. **Y listo, a cobrar.**

---

## 3. Estructura de Scripts (¿Qué hace cada cosa?)
* `scripts/fabrica_agentes.js`: Tu herramienta de producción. Crea los bots en Botiva y te da el código final.
* `scripts/chat_harvar_scout.js`: Un script de prueba por consola para hablar con mi esclavo técnico "Harvar-Scout".
* `landing/index.html`: El código fuente visual de tu página web de ventas.
* `setup_gh_pages.sh`: El script que usamos para crear al bot limitador (NexIA Demo) y subir la página a internet de un solo golpe.

## 4. Notas Técnicas y Credenciales
* **API de Botiva:** `https://api-rest-agent-flow-528082765109.europe-west1.run.app/api/v1`
* **Modelo por defecto:** Estamos usando `vx/gemini-3.5-flash` (más estable y no da errores internos 500 en esta plataforma).
