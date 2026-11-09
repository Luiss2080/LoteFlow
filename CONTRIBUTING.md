# Guía de contribución

¡Gracias por querer aportar a LoteFlow!

## Cómo proponer cambios

1. Abre un issue describiendo el bug o la idea antes de empezar un cambio grande.
2. Haz un fork y crea una rama con un nombre claro (`fix/vencidos`, `feat/alertas`).
3. Mantén el cambio pequeño y enfocado: una cosa por PR.
4. Agrega o ajusta pruebas en `index.test.js` cuando cambies el comportamiento.
5. Corre `npm test` y confirma que todo pasa antes de abrir el PR.

## Estilo

- Módulos ES, sin dependencias externas.
- Funciones puras: no mutan sus argumentos.
- Mensajes de commit en español, con prefijo (`feat:`, `fix:`, `docs:`, `chore:`).

## Reportar problemas de seguridad

No abras un issue público: sigue la [política de seguridad](SECURITY.md).
