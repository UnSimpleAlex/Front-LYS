# Acceso en pantallas grandes y hover de inicio

El fondo de acceso crecía con toda la ventana mientras el formulario conservaba su tamaño y quedaba arriba. A partir de 1800 px se limita la composición y la fotografía, se centra verticalmente el formulario y se mantiene separación entre el texto y la tarjeta. Se conservan las imágenes existentes y las reglas de móvil y tablet.

Las tarjetas de especialidades y promociones ahora muestran elevación, borde rojo, sombra y un zoom suave de la imagen. La flecha de especialidades también responde al hover. El foco de teclado tiene un contorno visible. Con reducción de movimiento se conservan los cambios de color y sombra, sin desplazamientos ni zoom.

## Validación

- Nuevas comprobaciones de login y registro a 1920×1080, 2560×1440, 3440×1440 y 3840×2160: límites del formulario, separación, fotografía y ausencia de desbordamiento.
- Comprobaciones de hover, foco de teclado y reducción de movimiento.
- Revisión visual de acceso en 2560 y 3840 px, registro móvil de 390 px y hover de inicio.
- 78 pruebas aprobadas en `auth-large-hover`, `auth`, `register`, `responsive` y `home`.
- Lint y compilación aprobados; detector de Impeccable sin hallazgos.

Las comprobaciones de navegadores usan ventanas simuladas; no equivalen a pruebas en cada dispositivo físico.
