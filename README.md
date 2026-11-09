<div align="center">
  <img src="docs/assets/logo.svg" width="96" alt="Logo de LoteFlow" />
  <h1>📦 LoteFlow</h1>
  <p><b>Asignación FEFO (primero en vencer, primero en salir) de stock por lotes: vida útil mínima, decimales y lotes sin vencimiento.</b></p>
  <img src="https://img.shields.io/badge/versi%C3%B3n-1.0.0-blue?style=for-the-badge" alt="Versión 1.0.0" />
  <img src="https://img.shields.io/badge/node-18%2B-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js 18+" />
  <img src="https://img.shields.io/badge/dependencias-cero-brightgreen?style=for-the-badge" alt="Cero dependencias" />
  <img src="https://img.shields.io/badge/tests-node%3Atest-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Tests con node:test" />
  <img src="https://img.shields.io/badge/paquete-GitHub%20Packages-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Packages" />
  <img src="https://img.shields.io/badge/licencia-MIT-yellow?style=for-the-badge" alt="Licencia MIT" />
  <img src="https://img.shields.io/github/last-commit/Luiss2080/LoteFlow" alt="Último commit" />
  <img src="https://img.shields.io/badge/PRs-bienvenidos-brightgreen.svg" alt="PRs bienvenidos" />
  <p>
    <a href="#-inicio-rápido">Inicio rápido</a> ·
    <a href="#-características">Características</a> ·
    <a href="#-arquitectura">Arquitectura</a> ·
    <a href="#-pruebas">Pruebas</a> ·
    <a href="#-contribuir">Contribuir</a>
  </p>
</div>

Asignación **FEFO** (*First Expired, First Out*) de stock por lotes. Pensado para farmacias, panaderías, verdulerías y tiendas de barrio donde importa vender primero lo que vence antes. Es una librería sin dependencias, de funciones puras, para Node.js 18 o superior.

## 🎬 Vista rápida

```js
import { asignarFEFO, porVencer } from '@luiss2080/loteflow';

const lotes = [
  { id: 'L1', cantidad: 5, vence: '2026-11-10' },
  { id: 'L2', cantidad: 8, vence: '2026-11-20' },
  { id: 'LX', cantidad: 4, vence: '2026-11-01' }, // ya vencido
];

asignarFEFO(lotes, 12, { hoy: '2026-11-04' });
// { asignaciones: [{id:'L1',cantidad:5},{id:'L2',cantidad:7}], faltante: 0,
//   excluidos: [{id:'LX',motivo:'vencido'}] }

asignarFEFO(lotes, 5, { hoy: '2026-11-04', diasMinimos: 10 }); // exige 10 días de vida útil
porVencer(lotes, 20, { hoy: '2026-11-04' }); // alertas de vencimiento
```

## ✨ Características

| Característica | Detalle |
|---|---|
| Asignación FEFO | `asignarFEFO(lotes, cantidad, opciones)` reparte la cantidad pedida entre los lotes que vencen primero. |
| Exclusiones con motivo | Descarta lotes vencidos, sin stock o con vida útil menor a `diasMinimos`, e informa el motivo de cada uno. |
| Lotes sin vencimiento | Los lotes con `vence: null` se consumen al final. |
| Cantidades decimales | Soporta kg y litros, no solo unidades enteras. |
| Alertas de vencimiento | `porVencer(lotes, dias, opciones)` lista los lotes próximos a vencer. |
| Sin efectos secundarios | No muta la entrada. |
| Fechas flexibles | `YYYY-MM-DD` o `Date`, comparadas por día calendario. |

## 🏗️ Arquitectura

| Archivo | Propósito |
|---|---|
| `index.js` | Módulo ES con la lógica y las funciones exportadas. |
| `index.test.js` | Pruebas con `node:test`. |
| `package.json` | Metadatos del paquete y configuración de publicación en GitHub Packages. |
| `.github/workflows/` | Flujo de GitHub Actions para probar y publicar. |

## 🚀 Inicio rápido

| Requisito | Versión |
|---|---|
| Node.js | 18+ |

Se publica en GitHub Packages. Agrega a tu `.npmrc`:

```
@luiss2080:registry=https://npm.pkg.github.com
```

Luego instala el paquete:

```bash
npm install @luiss2080/loteflow
```

> GitHub Packages pide autenticarse (token con `read:packages`) incluso para paquetes públicos.

## 🧪 Pruebas

```bash
npm test # usa node:test, sin dependencias
```

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Lee la [guía de contribución](CONTRIBUTING.md) y el [código de conducta](CODE_OF_CONDUCT.md) antes de abrir un PR. Para bugs o ideas abre un issue; los problemas de seguridad se reportan según la [política de seguridad](SECURITY.md). ¿Dudas? Mira [SUPPORT.md](SUPPORT.md). Los cambios por versión están en el [CHANGELOG](CHANGELOG.md).

## 📄 Licencia

Distribuido bajo la licencia MIT. Ver [LICENSE](LICENSE).

---

<div align="center">
  <sub>Hecho por <a href="https://github.com/Luiss2080">Luiss2080</a> · asignación FEFO para inventarios con vencimiento</sub>
</div>
