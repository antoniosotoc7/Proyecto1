# Objetivo X protegido

Esta versión guarda los retos futuros y las soluciones dentro de funciones
del servidor. No aparecen en `public/index.html` ni se descargan al abrir la web.

## Estructura

- `public/index.html`: interfaz pública.
- `netlify/functions/daily-puzzle.js`: entrega solo el reto de hoy.
- `netlify/functions/check-answer.js`: comprueba la respuesta en el servidor.
- `netlify/functions/reveal-solution.js`: devuelve únicamente la solución de hoy.
- `netlify/functions/_shared/puzzles.js`: aquí preparas los siete retos.
- `netlify/functions/_shared/parser.js`: evaluador matemático seguro.
- `netlify.toml`: configuración de Netlify.

## Añadir los retos de cada semana

Abre:

`netlify/functions/_shared/puzzles.js`

y cambia la lista `puzzles`.

No pongas los retos dentro de `public/index.html`.

## Publicación recomendada

Esta versión usa Netlify Functions. No basta con abrir `index.html` directamente
ni con publicar solo la carpeta `public`.

### Método sencillo con GitHub

1. Crea un repositorio privado en GitHub.
2. Sube el contenido completo de esta carpeta, manteniendo su estructura.
3. En Netlify, selecciona **Add new project** y conecta el repositorio.
4. Netlify leerá automáticamente `netlify.toml`.
5. Publica el proyecto.
6. Cada semana modifica `puzzles.js` y vuelve a subir los cambios a GitHub.

### Prueba local

Instala Node.js y después ejecuta:

```bash
npm install -g netlify-cli
netlify dev
```

Abre la dirección local que muestre Netlify.

## Qué queda oculto

Al inspeccionar la página, una persona podrá ver:

- el HTML, CSS y JavaScript de la interfaz;
- el reto correspondiente al día actual;
- las peticiones realizadas al servidor.

No podrá obtener desde `index.html`:

- los retos de los próximos días;
- las soluciones futuras;
- el archivo privado `puzzles.js`;
- la lógica interna de comprobación del servidor.

La solución del día sí puede obtenerse llamando al endpoint de revelado, porque
el botón “Me rindo” necesita acceder a ella. Para evitar incluso eso haría falta
añadir cuentas de usuario y guardar el estado de cada partida en una base de datos.


## Temporizador

- Empieza automáticamente al cargar el reto.
- No se reinicia al pulsar “Reiniciar” ni “Borrar todo”.
- Se detiene al acertar.
- Se detiene al pulsar “Me rindo”.
