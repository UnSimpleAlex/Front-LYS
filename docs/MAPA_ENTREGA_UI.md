# Mapa real de entrega

En `/checkout/entrega` el cliente puede tocar el mapa, arrastrar el marcador o desplazarlo con las flechas del teclado y pulsar «Marcar el centro del mapa». «Usar mi ubicación» solicita geolocalización únicamente al pulsarlo, sujeto al permiso del navegador. En producción requiere HTTPS (localhost permite pruebas). Una selección manual cancela el resultado de una solicitud de ubicación pendiente. Se solicita una posición nueva (maximumAge: 0), alta precisión y hasta 20 segundos de espera; el mapa centra esa posición a zoom 18. Un círculo representa el margen de precisión recibido, sin prometer precisión GPS cuando el dispositivo solo ofrece una ubicación aproximada.

El mapa inicial de Lima Norte es solo contexto: no se asigna una dirección ni un punto automáticamente. La calle, número, distrito y referencia se completan en el formulario. Las sugerencias de calles se consultan en Photon/Komoot, con autorización del propietario, priorizando Lima Norte y el distrito elegido. No se realiza geocodificación inversa. Cambiar calle o distrito descarta el punto anterior. El punto es opcional, de modo que un error de conexión o permiso denegado no bloquea el formulario.

Las coordenadas seleccionadas se incluyen en el borrador y el comprobante de demostración en sessionStorage, junto con los datos de entrega ya existentes. La revisión y el comprobante ofrecen un enlace para abrir el punto en OpenStreetMap. No se envían datos a un backend de pedidos.

## Proveedor y configuración

Por defecto se utilizan los mosaicos HTTPS `https://tile.openstreetmap.org/{z}/{x}/{y}.png`, con atribución visible. Las solicitudes revelan al proveedor la conexión del navegador y el área visualizada, incluida el área del punto seleccionado. No se envían nombres, teléfonos ni correos al proveedor del mapa. La búsqueda sí envía a Photon/Komoot el texto de la calle y el distrito, con contexto Lima, sin datos de contacto ni coordenadas GPS del cliente.

Variables opcionales de Vite:
- `VITE_MAP_TILE_URL`: plantilla HTTPS del proveedor de mosaicos autorizado.
- `VITE_MAP_ATTRIBUTION`: atribución correspondiente, configurada únicamente por el desarrollador (HTML de confianza).

No se necesitan claves para el proveedor predeterminado. Se mantienen la caché y el referer normales del navegador, sin descargas masivas, precarga offline ni elusión de límites. El servicio público de OSM no tiene SLA: evaluar un proveedor contratado o infraestructura propia antes de una carga importante de producción, conservando la atribución y sus condiciones.

Política: https://operations.osmfoundation.org/policies/tiles/
Documentación: https://leafletjs.com/reference.html

## Verificación

Pruebas de selección manual, arrastre, teclado, ubicación simulada, permiso denegado, error del proveedor y reintento; revisión y comprobante conservan coordenadas. Responsive entre 240 y 1920 px. Los E2E sustituyen los mosaicos por imágenes locales de prueba para evitar solicitudes repetidas al servicio público.

## Sugerencias y distritos de Lima Norte

Selector local con Ancón, Carabayllo, Comas, Independencia, Los Olivos, Puente Piedra, San Martín de Porres y Santa Rosa, más «Otro distrito» para escritura manual. Fuente de la agrupación: https://portal.imp.gob.pe/pdulimanorte/

Photon se consulta a partir de 3 caracteres, con 700 ms de espera, cancelación de consultas anteriores, timeout de 8 segundos y caché de hasta 40 búsquedas en memoria. Se limitan resultados a Perú y una caja alrededor de Lima, con preferencia espacial por Lima Norte. Los resultados duplicados se agrupan; seleccionar uno coloca su punto en el mapa a nivel de calle. La ubicación devuelta puede representar la calle, no el número exacto: el cliente debe ajustar el marcador y completar el número. Las sugerencias no garantizan cobertura de delivery.

`VITE_ADDRESS_SEARCH_URL` permite sustituir la URL del API Photon. Por defecto: `https://photon.komoot.io/api/`. Servidor público sin garantía de disponibilidad, adecuado para uso moderado; antes de tráfico significativo usar instancia propia o proveedor contratado. No se utiliza Nominatim público para autocompletar. Documentación y condiciones: https://github.com/komoot/photon

Las pruebas adicionales cubren consultas por distrito, selección con teclado, eliminación de duplicados, respuestas antiguas, fallo de conexión y adaptación a 390, 768 y 1440 px. Una consulta real desde el navegador a Avenida Universitaria / Los Olivos respondió HTTP 200 con resultados de calles. Los E2E usan respuestas simuladas.
