# 🤖 RoboKids — Plataforma de Robótica para Niños

Todo el proyecto vive en **un solo archivo: `index.html`** (HTML + CSS + JS
juntos). Adentro hay 5 "pantallas" que se muestran/ocultan con JavaScript,
sin recargar la página:

1. **Splash** — crear usuario o iniciar sesión
2. **Dashboard** — ruta con los 7 temas (estilo Duolingo)
3. **Lección** — Clase / Laboratorio / Quiz de cada tema
4. **Login de profesor** — acceso protegido con contraseña
5. **Panel de profesor** — tabla con todos los estudiantes, sus puntos,
   racha y progreso por tema

Los datos (usuarios, puntos, progreso) se guardan en **Firebase Firestore**,
así que se ven igual sin importar el dispositivo que use cada estudiante.

## Paso 1: crear tu proyecto de Firebase (una sola vez, ~10 min)

1. Ve a **https://console.firebase.google.com** y crea un proyecto nuevo
   (gratis, solo pide una cuenta de Google).
2. Menú izquierdo → **Firestore Database** → "Crear base de datos" → modo
   de producción → elige la región más cercana.
3. Pestaña **"Reglas"** de Firestore → borra lo que haya y pega esto →
   **Publicar**:

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /usuarios/{usuarioId} {
         allow read, write: if true;
       }
     }
   }
   ```

   > Esto deja la colección abierta para que la app funcione sin backend
   > propio. No es seguridad de nivel bancario — es apropiada para nombres,
   > avatares, un PIN de 4 dígitos y puntajes de un salón de robótica. No
   > pidas datos sensibles reales (direcciones, teléfonos, etc.). Si más
   > adelante quieres reforzarlo, se puede migrar a Firebase Authentication.

4. **⚙️ Configuración del proyecto** (arriba a la izquierda) → pestaña
   **"Tus apps"** → ícono `</>` (Web) → regístrala con cualquier nombre
   (no marques Hosting). Firebase te mostrará un bloque `firebaseConfig`.

5. Abre `index.html` en VS Code, busca (Ctrl/Cmd + F) el texto
   `PEGA_AQUI_TU_apiKey` y reemplaza todo el objeto `firebaseConfig` por
   el que te dio Firebase.

6. Justo debajo, busca `CODIGO_INVITACION_PROFESOR` y cámbialo por una
   palabra o frase que solo tú (y otros profesores de confianza) conozcan:

   ```js
   const CODIGO_INVITACION_PROFESOR = "robotica-inem-2026";
   ```

   Este código es lo único que evita que un estudiante curioso cree una
   cuenta de profesor por accidente y vea el progreso de todos — solo se
   pide al **crear** una cuenta nueva, no al iniciar sesión con una que
   ya existe.

6. Justo debajo, cambia esta línea por la contraseña que quieras usar para
   entrar al panel de profesor:

   ```js
   const CLAVE_PROFESOR = "robotica2026";
   ```

## Paso 2: abrirlo en VS Code

- Abre la carpeta en VS Code.
- Instala la extensión **"Live Server"** si no la tienes.
- Clic derecho sobre `index.html` → **"Open with Live Server"**.

> ⚠️ Al ser un solo archivo ya no depende de carpetas `css/` o `js/`, pero
> sigue siendo mejor abrirlo con Live Server (no con doble clic) para que
> Firebase funcione sin restricciones del navegador.

## Cómo funciona

- **Estudiantes**: crean su usuario (nombre + avatar + PIN de 4 números) y
  avanzan por los 7 temas en el orden que definiste. Cada tema se desbloquea
  al aprobar el quiz del anterior (60% o más). Todo queda guardado en la
  nube con su nombre.
- **Tú (profesor/a)**: en el splash, toca "👩‍🏫 Soy profesor/a", escribe la
  contraseña que configuraste, y verás una tabla con todos los estudiantes:
  puntos, racha, y un ícono por cada tema (✓ completado, ~ en progreso,
  – sin empezar). Botón "🔄 Actualizar" para refrescar en vivo.

## Cómo agregar un nuevo tema más adelante

Dentro de `index.html`, busca el bloque `const MODULOS = [ ... ]`. Copia uno
de los módulos existentes y cambia:

- `id`: identificador único, sin espacios ni tildes (ej. `"sensores"`)
- `orden`: el número siguiente (8, 9...)
- `nombre`, `icono` (un emoji)
- `tagline`: frase corta que se ve en la portada del tema
- `objetivos`: 3 frases con lo que el estudiante va a aprender
- `lecciones`: 6 lecciones, cada una con:
  - `eyebrow` (etiqueta corta), `titulo`, `subtitulo`
  - `coach`: frase estilo mentor, en primera persona
  - `clave`: la idea más importante para recordar
  - `tipo`: `"tarjetas"` (3 mini tarjetas `{titulo,texto}`) o `"flujo"`
    (3 pasos `{etiqueta,texto}` conectados con flechas)
- `lab`: laboratorio, con `titulo`, `subtitulo` y `tipo`:
  - `"secuencia"`: `pasos` (arreglo en el orden correcto) + `mensajes`
    (`vacio`, `parcial`, `incorrecto`, `correcto`) que se muestran en vivo
    mientras el estudiante ordena.
  - `"escenario"`: `opciones` (3 `{icono,titulo,texto,correcta}`), el
    estudiante elige la mejor solución a un caso planteado.
- `quiz`: 6 preguntas `{ pregunta, pista, explicacion, opciones: [3 de
  {texto, correcta}] }`. La pista es opcional de ver, la explicación
  aparece después de responder.

Aparece automáticamente en la ruta y en el panel de profesor. No hace falta
tocar nada más.

## Ideas para más adelante

- **Firebase Authentication**: para una capa real de seguridad en vez de
  las reglas abiertas de Firestore.
- **Exportar el panel de profesor a Excel/CSV** para llevar registro fuera
  de la app.
- **Ilustraciones o animaciones propias** en vez de emojis.