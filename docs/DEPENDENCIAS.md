# Dependencias — Leña y Sabores

Antes de instalar una librería revisar necesidad, mantenimiento, licencia, seguridad, tamaño y compatibilidad.

## Reglas
- Versionar el lockfile.
- No alternar gestores de paquetes sin decisión explícita.
- Actualizar de forma controlada.
- Separar upgrades grandes de funcionalidades cuando sea posible.
- Eliminar dependencias sin uso.
- Prestar especial atención a auth, SDK InsForge, routing, validación y pagos.

## SDK InsForge
Antes de actualizar revisar changelog, breaking changes, pruebas e integración completa.

## Celulares y banderas de registro
- libphonenumber-js 1.13.14: metadatos completos de numeración y validación de tipo móvil por país; licencia MIT y metadatos Apache-2.0.
- country-flag-icons 1.6.20: banderas SVG React de los destinos latinoamericanos, sin solicitudes externas; licencia MIT.
- Lockfile actualizado; instalación auditada sin vulnerabilidades. Importaciones de banderas limitadas a los 21 destinos admitidos. Build total aproximado: 453 kB JavaScript, 132 kB comprimido. Los metadatos deben actualizarse al cambiar los planes nacionales.

## Movimiento en Inicio

Motion 14.0.0 (MIT), importado desde `motion/react`, sin Motion+ ni GSAP. Se usa para el carrusel, menú y estados de interacción, con reducción de movimiento. Instalación auditada sin vulnerabilidades. Registro y Home se cargan por separado para evitar cargar metadatos de celulares en Inicio.

## Mapa de entrega

Leaflet 1.9.4 (BSD-2-Clause), con @types/leaflet 1.9.21 (MIT) en desarrollo. Integración directa con el ciclo de vida de React, sin wrapper adicional. Se carga dentro del checkout diferido; el fragmento de checkout completo pesa aproximadamente 187 kB (54 kB gzip). Lockfile actualizado y auditoría sin vulnerabilidades.
