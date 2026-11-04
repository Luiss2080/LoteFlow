// FEFO (First Expired, First Out): reparte una cantidad entre lotes priorizando los que vencen antes.
// Funciones puras, sin dependencias y sin mutar la entrada.

const MS_DIA = 86_400_000;

/** Normaliza 'YYYY-MM-DD' | Date | null a días UTC enteros (null = sin vencimiento). */
function aDia(v) {
  if (v == null) return null;
  if (typeof v === 'string') {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
    if (!m) throw new TypeError(`Fecha inválida: ${v} (use YYYY-MM-DD)`);
    return Date.UTC(+m[1], +m[2] - 1, +m[3]) / MS_DIA;
  }
  if (v instanceof Date && !Number.isNaN(v.getTime())) return Date.UTC(v.getFullYear(), v.getMonth(), v.getDate()) / MS_DIA;
  throw new TypeError('Fecha inválida');
}

/**
 * @param {{id:string, cantidad:number, vence?:string|Date|null}[]} lotes
 * @param {number} cantidad  cantidad solicitada (> 0)
 * @param {{hoy?:Date|string, diasMinimos?:number}} [opts]
 *   diasMinimos: vida útil mínima que debe tener un lote para poder venderse (ej. 7 en farmacia).
 * @returns {{asignaciones:{id:string,cantidad:number}[], faltante:number, excluidos:{id:string,motivo:string}[]}}
 */
export function asignarFEFO(lotes, cantidad, { hoy = new Date(), diasMinimos = 0 } = {}) {
  if (!Number.isFinite(cantidad) || cantidad <= 0) throw new TypeError('cantidad debe ser un número > 0');
  const hoyDia = aDia(hoy);
  const excluidos = [];
  const validos = [];

  for (const l of lotes) {
    const dia = aDia(l.vence);
    if (!(l.cantidad > 0)) excluidos.push({ id: l.id, motivo: 'sin-stock' });
    else if (dia !== null && dia < hoyDia + diasMinimos) excluidos.push({ id: l.id, motivo: dia < hoyDia ? 'vencido' : 'vida-util-insuficiente' });
    else validos.push({ ...l, dia });
  }

  // Los lotes sin vencimiento se consumen al final; desempata por id para que sea determinista.
  validos.sort((a, b) => (a.dia ?? Infinity) - (b.dia ?? Infinity) || String(a.id).localeCompare(String(b.id)));

  let pendiente = cantidad;
  const asignaciones = [];
  for (const l of validos) {
    if (pendiente <= 0) break;
    const toma = Math.min(l.cantidad, pendiente);
    asignaciones.push({ id: l.id, cantidad: toma });
    pendiente = Math.round((pendiente - toma) * 1e6) / 1e6; // evita errores de coma flotante con kg/litros
  }
  return { asignaciones, faltante: pendiente, excluidos };
}

/** Lotes con stock que vencen dentro de `dias` días (o ya vencieron), ordenados del más urgente al menos. */
export function porVencer(lotes, dias, { hoy = new Date() } = {}) {
  const hoyDia = aDia(hoy);
  return lotes
    .filter((l) => l.cantidad > 0 && l.vence != null)
    .map((l) => ({ ...l, diasRestantes: aDia(l.vence) - hoyDia }))
    .filter((l) => l.diasRestantes <= dias)
    .sort((a, b) => a.diasRestantes - b.diasRestantes);
}
