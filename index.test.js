import test from 'node:test';
import assert from 'node:assert/strict';
import { asignarFEFO, porVencer } from './index.js';

const hoy = '2026-11-04';
const lotes = [
  { id: 'L3', cantidad: 10, vence: '2026-12-30' },
  { id: 'L1', cantidad: 5, vence: '2026-11-10' },
  { id: 'L2', cantidad: 8, vence: '2026-11-20' },
  { id: 'LX', cantidad: 4, vence: '2026-11-01' },
  { id: 'L0', cantidad: 0, vence: '2026-11-15' },
  { id: 'LN', cantidad: 50, vence: null },
];

test('consume primero el lote que vence antes y omite vencidos y vacíos', () => {
  const r = asignarFEFO(lotes, 12, { hoy });
  assert.deepEqual(r.asignaciones, [{ id: 'L1', cantidad: 5 }, { id: 'L2', cantidad: 7 }]);
  assert.equal(r.faltante, 0);
  assert.deepEqual(r.excluidos.sort((a, b) => a.id.localeCompare(b.id)), [
    { id: 'L0', motivo: 'sin-stock' },
    { id: 'LX', motivo: 'vencido' },
  ]);
});

test('los lotes sin vencimiento van al final', () => {
  const r = asignarFEFO(lotes, 30, { hoy });
  assert.deepEqual(r.asignaciones.map((a) => a.id), ['L1', 'L2', 'L3', 'LN']);
  assert.equal(r.asignaciones.at(-1).cantidad, 7);
});

test('informa faltante cuando no alcanza el stock', () => {
  const r = asignarFEFO([{ id: 'A', cantidad: 3, vence: '2027-01-01' }], 5, { hoy });
  assert.equal(r.faltante, 2);
});

test('diasMinimos excluye lotes con poca vida útil', () => {
  const r = asignarFEFO(lotes, 5, { hoy, diasMinimos: 10 });
  assert.equal(r.asignaciones[0].id, 'L2');
  assert.ok(r.excluidos.some((e) => e.id === 'L1' && e.motivo === 'vida-util-insuficiente'));
});

test('soporta cantidades decimales (kg) sin errores de coma flotante', () => {
  const r = asignarFEFO([{ id: 'A', cantidad: 0.3, vence: '2027-01-01' }, { id: 'B', cantidad: 1, vence: '2027-02-01' }], 0.6, { hoy });
  assert.deepEqual(r.asignaciones, [{ id: 'A', cantidad: 0.3 }, { id: 'B', cantidad: 0.3 }]);
  assert.equal(r.faltante, 0);
});

test('no muta la entrada y valida argumentos', () => {
  const copia = JSON.stringify(lotes);
  asignarFEFO(lotes, 5, { hoy });
  assert.equal(JSON.stringify(lotes), copia);
  assert.throws(() => asignarFEFO(lotes, 0), TypeError);
  assert.throws(() => asignarFEFO([{ id: 'x', cantidad: 1, vence: '04/11/2026' }], 1, { hoy }), TypeError);
});

test('porVencer ordena por urgencia e incluye vencidos con stock', () => {
  const r = porVencer(lotes, 20, { hoy });
  assert.deepEqual(r.map((l) => [l.id, l.diasRestantes]), [['LX', -3], ['L1', 6], ['L2', 16]]);
});
