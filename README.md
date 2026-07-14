# Objetivo X con clasificación

## Estructura

- `public/index.html`: interfaz del juego.
- `netlify/functions/start-game.js`: inicia la partida y registra la hora en el servidor.
- `netlify/functions/check-answer.js`: valida la operación y guarda el tiempo.
- `netlify/functions/reveal-solution.js`: registra al jugador como rendido.
- `netlify/functions/leaderboard.js`: devuelve la clasificación diaria.
- `netlify/functions/_shared/storage.js`: acceso a Netlify Blobs.
- `netlify/functions/_shared/puzzles.js`: retos diarios.
- `netlify/functions/_shared/parser.js`: evaluador matemático.
- `package.json`: dependencia `@netlify/blobs`.

## Publicar los cambios

Sustituye los archivos de tu repositorio por estos y ejecuta:

```bash
git add .
git commit -m "Añade nombres de usuario y clasificación diaria"
git push
```

Netlify instalará automáticamente las dependencias y desplegará las funciones.

## Prueba local

```bash
npm install
npx netlify dev
```

Netlify Dev utiliza un almacén local separado del de producción.

## Comportamiento

- El usuario elige un nombre de 3 a 20 caracteres.
- La hora de inicio se registra en el servidor.
- Los tiempos correctos se ordenan de menor a mayor.
- Los rendidos aparecen al final.
- Cada partida solo puede registrar un resultado.
- Los resultados se guardan en Netlify Blobs y sobreviven a nuevos despliegues.

## Limitaciones

Es una clasificación casual sin cuentas ni contraseña. Un usuario puede abrir otra partida o usar otro nombre.
Para competiciones con premios conviene añadir autenticación y una base de datos con controles más estrictos.


## Vídeo tras acertar

Cuando el jugador acierta, el servidor devuelve la solución oficial y el enlace
del vídeo:

- Si la expresión escrita coincide con la solución oficial tras normalizar
  espacios, símbolos `×`/`÷` y paréntesis exteriores redundantes, se ofrece la
  explicación de esa misma solución.
- Si la expresión es diferente pero también alcanza el objetivo, se indica que
  el jugador ha encontrado una solución alternativa y se muestra la solución
  oficial explicada en el vídeo.

La comparación es textual normalizada, no una demostración completa de
equivalencia algebraica. Por ejemplo, dos expresiones con sumandos cambiados de
orden pueden considerarse alternativas aunque matemáticamente sean equivalentes.
