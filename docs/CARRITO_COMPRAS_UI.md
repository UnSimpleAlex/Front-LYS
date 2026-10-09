# Carrito y compra — interfaz de demostración

La cabecera compartida abre `/carrito` desde Carta, Promociones, Inicio y autenticación. Los productos y promociones existentes conservan sus imágenes, descripciones y precios; el estado compartido utiliza `useSyncExternalStore` y se persiste en `lys-carta-cart`.

## Recorrido
- `/carrito`: cantidades de 1 a 99, eliminar, favoritos, vaciar, recomendaciones y cupón de prueba BRASA10 (10% del subtotal).
- `/checkout/entrega`: delivery o recojo, direcciones editables con diálogo, referencia, instrucciones y contacto. Delivery de prueba S/7; recojo S/0. Mapa real OpenStreetMap con Leaflet: selección manual, marcador arrastrable y ubicación actual opcional al pulsar el botón. Coordenadas conservadas en la revisión y el comprobante. Ver `MAPA_ENTREGA_UI.md`.
- `/checkout/pago`: tarjeta con datos de prueba, Yape, Plin o efectivo con vuelto calculado. Facturación opcional. Las validaciones del formulario bloquean el avance si faltan datos.
- `/checkout/confirmacion`: revisar productos, cantidades, entrega, contacto, pago y volver para editar.
- `/pedido-confirmado`: comprobante con código LYS-DEMO, fecha actual y total. Vacía el carrito. `/mi-pedido` muestra ese comprobante.

No se llama a una pasarela, se envían correos ni se registra un pedido en backend. Los QR codifican una identificación de demostración sin destinatario de pago. Los números de tarjeta, CVV y códigos de aprobación permanecen únicamente en el formulario y no se persisten. El comprobante, incluyendo los datos de contacto ingresados, se conserva en `sessionStorage` durante la sesión de la pestaña. No usar datos personales reales para las pruebas.

Los pasos requieren carrito y datos anteriores válidos; abrir un paso avanzado sin completar los previos redirige al paso correspondiente. Refrescar el checkout conserva el carrito, pero vuelve a solicitar entrega y pago. El comprobante sí se recupera al refrescar la página final.

## Visuales y responsive
Fondos del banner de PC/móvil e iconos de Yape/Plin generados con imagegen; prompts en `CARRITO_ASSETS.json`. QR SVG determinista generado con qrcode. Tipografía, colores y cabecera existentes. Dos columnas en PC, una en tablet/celular, controles y formularios apilados según espacio.

## Verificación
Pruebas E2E cubren los cuatro métodos, cantidades, cupón, dirección, edición, validaciones, persistencia del comprobante, eliminación de datos de pago, carrito vacío y ausencia de desbordes a 240, 390, 768, 1024 y 1920 px. Las capturas de cada paso se guardan en los resultados de Playwright para revisión visual.
