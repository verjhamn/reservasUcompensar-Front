import { format } from "date-fns";
import {
  isEventReservation,
  isFutureActiveReservation,
  normalizeSearchText,
  parseReportDate,
  startOfLocalDay,
} from "../reportDateUtils";

const ESTADO_COLORS = {
  creada: { background: "#e6f9fb", border: "#00aab7", text: "#00666e" },
  completada: { background: "#e8f5ed", border: "#00a554", text: "#006332" },
  cancelada: { background: "#fef1f7", border: "#e60064", text: "#a00044" },
};

const DEFAULT_COLORS = { background: "#f3f4f6", border: "#9ca3af", text: "#374151" };

export const getEventColors = (estado) => {
  const key = normalizeSearchText(estado);
  if (key.startsWith("cread")) return ESTADO_COLORS.creada;
  if (key.startsWith("complet")) return ESTADO_COLORS.completada;
  if (key.startsWith("cancel")) return ESTADO_COLORS.cancelada;
  return DEFAULT_COLORS;
};

// Soporta "HH:mm", "HH:mm:ss" y variantes 12h como "2:00pm" o "02:00 p. m."
export const parseTimeParts = (value) => {
  const compact = String(value || "").trim().toLowerCase().replace(/\./g, "").replace(/\s+/g, "");
  if (!compact) return null;

  const meridiemMatch = compact.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?(am|pm)$/);
  if (meridiemMatch) {
    let hours = Number(meridiemMatch[1]) % 12;
    if (meridiemMatch[4] === "pm") hours += 12;
    return { hours, minutes: Number(meridiemMatch[2]), seconds: Number(meridiemMatch[3] || 0) };
  }

  const plainMatch = compact.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if (plainMatch) {
    return {
      hours: Number(plainMatch[1]),
      minutes: Number(plainMatch[2]),
      seconds: Number(plainMatch[3] || 0),
    };
  }

  return null;
};

const combineDateAndTime = (day, timeParts) => new Date(
  day.getFullYear(),
  day.getMonth(),
  day.getDate(),
  timeParts.hours,
  timeParts.minutes,
  timeParts.seconds,
);

export const filterCalendarRows = (rows, filters = {}) => {
  const today = startOfLocalDay();
  const soloProximos = filters.soloProximos !== false;
  const estado = normalizeSearchText(filters.estado);
  const search = normalizeSearchText(filters.search);

  return rows.filter((row) => {
    if (!isEventReservation(row)) return false;
    if (soloProximos && !isFutureActiveReservation(row, today)) return false;
    if (estado && normalizeSearchText(row.estado) !== estado) return false;

    if (search) {
      const haystack = normalizeSearchText(
        [row.titulo_reserva, row.usuario, row.codigo_espacio, row.sede].filter(Boolean).join(" "),
      );
      if (!haystack.includes(search)) return false;
    }

    return true;
  });
};

export const buildCalendarEvents = (rows) => rows.reduce((events, row, index) => {
  const day = parseReportDate(row.fecha_reserva);
  if (!day) return events;

  const startTime = parseTimeParts(row.hora_inicio_reserva);
  const endTime = parseTimeParts(row.hora_fin_reserva);
  const allDay = !startTime;
  const start = startTime ? combineDateAndTime(day, startTime) : day;
  const end = !allDay && endTime ? combineDateAndTime(day, endTime) : null;
  const colors = getEventColors(row.estado);
  const isCancelled = normalizeSearchText(row.estado).startsWith("cancel");

  events.push({
    id: row.numero != null ? String(row.numero) : `evt-${index}`,
    title: row.titulo_reserva || "Evento sin título",
    start,
    end: end && end > start ? end : (allDay ? undefined : new Date(start.getTime() + 60 * 60 * 1000)),
    allDay,
    backgroundColor: colors.background,
    borderColor: colors.border,
    textColor: colors.text,
    classNames: isCancelled ? ["uc-event-cancelled"] : [],
    extendedProps: { row },
  });

  return events;
}, []);

export const buildEventDateKeys = (rows) => rows.reduce((keys, row) => {
  const day = parseReportDate(row.fecha_reserva);
  if (day) keys.add(format(day, "yyyy-MM-dd"));
  return keys;
}, new Set());
