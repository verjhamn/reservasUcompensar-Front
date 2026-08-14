const SPANISH_MONTHS = {
  enero: 0,
  febrero: 1,
  marzo: 2,
  abril: 3,
  mayo: 4,
  junio: 5,
  julio: 6,
  agosto: 7,
  septiembre: 8,
  octubre: 9,
  noviembre: 10,
  diciembre: 11,
};

const TERMINAL_STATUSES = new Set([
  "cancelada",
  "cancelado",
  "completada",
  "completado",
  "finalizada",
  "finalizado",
  "rechazada",
  "rechazado",
  "anulada",
  "anulado",
]);

export const normalizeSearchText = (value) => String(value || "")
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .trim()
  .toLowerCase();

export const startOfLocalDay = (date = new Date()) => new Date(
  date.getFullYear(),
  date.getMonth(),
  date.getDate(),
);

export const parseReportDate = (value) => {
  const normalized = normalizeSearchText(value);
  const isoDate = normalized.match(/^(\d{4})-(\d{2})-(\d{2})/);

  if (isoDate) {
    return new Date(Number(isoDate[1]), Number(isoDate[2]) - 1, Number(isoDate[3]));
  }

  const writtenDate = normalized.match(/(\d{1,2})\s+de\s+([a-z]+)\s+de\s+(\d{4})/);
  const month = writtenDate ? SPANISH_MONTHS[writtenDate[2]] : undefined;
  if (!writtenDate || month === undefined) return null;

  return new Date(Number(writtenDate[3]), month, Number(writtenDate[1]));
};

export const isTerminalReservation = (row) => TERMINAL_STATUSES.has(normalizeSearchText(row.estado));

export const isFutureActiveReservation = (row, today = startOfLocalDay()) => {
  const reservationDate = parseReportDate(row.fecha_reserva);
  return Boolean(reservationDate && reservationDate >= today && !isTerminalReservation(row));
};

export const isEventReservation = (row) => normalizeSearchText(row.tipo_espacio).includes("evento");

export const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};
