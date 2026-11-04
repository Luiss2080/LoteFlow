# @luiss2080/fefo-lotes

Asignación **FEFO** (*First Expired, First Out*) de stock por lotes. Pensado para farmacias, panaderías, verdulerías y tiendas de barrio donde importa vender primero lo que vence antes.

```js
import { asignarFEFO, porVencer } from '@luiss2080/fefo-lotes';

const lotes = [
  { id: 'L1', cantidad: 5,  vence: '2026-11-10' },
  { id: 'L2', cantidad: 8,  vence: '2026-11-20' },
  { id: 'LX', cantidad: 4,  vence: '2026-11-01' }, // ya vencido
];

asignarFEFO(lotes, 12, { hoy: '2026-11-04' });
// { asignaciones: [{id:'L1',cantidad:5},{id:'L2',cantidad:7}], faltante: 0,
//   excluidos: [{id:'LX',motivo:'vencido'}] }

asignarFEFO(lotes, 5, { hoy: '2026-11-04', diasMinimos: 10 }); // exige 10 días de vida útil
porVencer(lotes, 20, { hoy: '2026-11-04' });                    // alertas de vencimiento
```

- Excluye lotes vencidos, sin stock o con vida útil menor a `diasMinimos` (con el motivo).
- Los lotes sin vencimiento (`vence: null`) se consumen al final.
- Soporta cantidades decimales (kg, litros) y no muta la entrada.
- Fechas `YYYY-MM-DD` o `Date`, comparadas por día calendario.

## Instalación

Se publica en GitHub Packages. Agrega a tu `.npmrc`:

```
@luiss2080:registry=https://npm.pkg.github.com
```

```bash
npm install @luiss2080/fefo-lotes
```

> GitHub Packages pide autenticarse (token con `read:packages`) incluso para paquetes públicos.

## Desarrollo

```bash
npm test   # usa node:test, sin dependencias
```

Licencia MIT.
