# Locales: propuesta de tres columnas

Se adapta la referencia del usuario: presentación y beneficios a la izquierda, galería al centro y ubicación, horario y bienvenida a la derecha. Se conserva el logo del navbar y se utilizan las tres imágenes entregadas; el contador refleja tres imágenes y las miniaturas permiten seleccionarlas. Las flechas y el teclado mantienen la navegación circular.

El fondo permanece blanco con adornos lineales discretos. El título usa ahora una imagen transparente de caligrafía creada a partir de la referencia. La bienvenida conserva Caveat. Se refinaron los iconos familiares, reloj circular, calendario, mapa, estacionamiento y llama, y se añadieron adornos vectoriales de ruta y reloj.

A partir de 1200 px la composición ocupa la altura disponible bajo el navbar y el footer no se muestra. En ventanas cortas se reducen espacios y tamaños. Tablet muestra la presentación arriba de la galería y la información; celular apila las secciones. Por debajo de 321 px los beneficios también se apilan.

Validación: ausencia de desbordamiento horizontal en 240, 390, 768, 1024, 1280, 1366, 1904 y 2560 px; ausencia de scroll vertical en escritorio desde 1200 px, incluyendo 1280×600. Capturas revisadas en PC, móvil y tablet. Prueba funcional de la galería y enlace a Maps, lint y compilación.

## Recursos generados

Herramienta integrada Imagegen, usando la propuesta como referencia visual:

- `public/images/information/local-title-v2.png`: rótulo con alfa transparente. Prompt: reproducir únicamente “Nuestro” en negro y “local” en rojo en dos líneas, con caligrafía de pincel inclinada, subrayado rojo y acentos laterales; sin logo, fotografía ni fondo.
- `public/images/information/local-background-v2.png`: fondo blanco panorámico. Prompt: ilustraciones periféricas muy suaves en melocotón y taupe, gallina a la izquierda, hojas y cítricos abajo, cebolla arriba y hierbas a la derecha; centro despejado, sin texto, fotos, logos ni interfaz, manteniendo blanco como color dominante.

Los recursos originales generados se conservan en la carpeta de Imagegen y se copian al proyecto. Las tres fotografías previas no se modifican.

### Refinamiento de color y blanco puro

- `local-title-v3.png`, editado con Imagegen: cambiar únicamente las gotas laterales al mismo rojo de “local”, preservando la caligrafía y el alfa transparente.
- `local-ornaments-v3.png`, editado con Imagegen: eliminar fondo y textura de papel, dejando los dibujos periféricos sobre alfa transparente.
- La página y el panel usan blanco `#fff`; los adornos se superponen al 12% de opacidad. Ruta y reloj decorativos también se suavizan.
- Verificación de geometría en 390, 768, 1280, 1904 y 2560 px: miniaturas con anchos iguales (diferencia menor de 0,02 px), galería y panel con bordes superior e inferior alineados en PC/tablet, sin desbordamiento horizontal. PC conserva ausencia de scroll vertical. Capturas revisadas en PC y móvil.

### Nueva referencia con rojo sólido

Las tres fotografías del carrusel se sustituyen por los archivos entregados por el usuario el 9 de octubre, optimizados a WebP sin cambiar su composición. Iconos blancos sobre rojo sólido, botón de Maps blanco, bienvenida gris neutro y adornos en escala de grises al 9% reemplazan los tonos pastel. En PC, descripción, ubicación y horario siguen la alineación de la nueva referencia; móvil centra esos bloques y conserva la bienvenida centrada.

Verificación: capturas en 390×844, 768×1024, 1366×591, 1672×941 y 1920×1080, sin desbordamiento horizontal; las tres resoluciones de PC no tienen scroll vertical. Carrusel circular y enlace de Maps verificados con la prueba existente; compilación y lint correctos.
