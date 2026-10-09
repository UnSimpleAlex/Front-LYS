# Mapa real de entrega

En `/checkout/entrega` el cliente puede tocar el mapa, arrastrar el marcador o desplazarlo con las flechas del teclado y pulsar «Marcar el centro del mapa». «Usar mi ubicación» solicita geolocalización únicamente al pulsarlo, sujeto al permiso del navegador. En producción requiere HTTPS (localhost permite pruebas). Una selección manual cancela el resultado de una solicitud de ubicación pendiente.

El mapa inicial de Lima es solo contexto: no se asigna una dirección ni un punto automáticamente. La calle, número, distrito y referencia se completan en el formulario; no se realiza búsqueda ni geocodificación inversa. Cambiar calle o distrito descarta el punto anterior. El punto es opcional, de modo que un error de conexión o permiso denegado no bloquea el formulario.

Las coordenadas seleccionadas se incluyen en el borrador y el comprobante de demostración en sessionStorage, junto con los datos de entrega ya existentes. La revisión y el comprobante ofrecen un enlace para abrir el punto en OpenStreetMap. No se envían datos a un backend de pedidos.

## Proveedor y configuración

Por defecto se utilizan los mosaicos HTTPS `https://tile.openstreetmap.org/{z}/{x}/{y}.png`, con atribución visible. Las solicitudes revelan al proveedor la conexión del navegador y el área visualizada, incluida el área del punto seleccionado. No se envían nombres, teléfonos, correos ni direcciones escritas al proveedor del mapa.

Variables opcionales de Vite:
- `VITE_MAP_TILE_URL`: plantilla HTTPS del proveedor de mosaicos autorizado.
- `VITE_MAP_ATTRIBUTION`: atribución correspondiente, configurada únicamente por el desarrollador (HTML de confianza).

No se necesitan claves para el proveedor predeterminado. Se mantienen la caché y el referer normales del navegador, sin descargas masivas, precarga offline ni elusión de límites. El servicio público de OSM no tiene SLA: evaluar un proveedor contratado o infraestructura propia antes de una carga importante de producción, conservando la atribución y sus condiciones.

Política: https://operations.osmfoundation.org/policies/tiles/
Documentación: https://leafletjs.com/reference.html

## Verificación

Pruebas de selección manual, arrastre, teclado, ubicación simulada, permiso denegado, error del proveedor y reintento; revisión y comprobante conservan coordenadas. Responsive entre 240 y 1920 px. Los E2E sustituyen los mosaicos por imágenes locales de prueba para evitar solicitudes repetidas al servicio público.
