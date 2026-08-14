/* eslint-disable react/prop-types */
import { useMemo } from "react";
import {
  BoltIcon,
  BuildingOffice2Icon,
  CalendarDaysIcon,
  ExclamationTriangleIcon,
  MapPinIcon,
  PresentationChartBarIcon,
  SparklesIcon,
  TicketIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import {
  addDays,
  isEventReservation,
  isTerminalReservation,
  normalizeSearchText,
  parseReportDate,
  startOfLocalDay,
} from "./reportDateUtils";

const DAY_IN_MS = 24 * 60 * 60 * 1000;

const normalizeText = (value) => String(value || "Sin información").trim();

const countBy = (data, key) => {
  const counts = data.reduce((accumulator, item) => {
    const label = normalizeText(item[key]);
    accumulator[label] = (accumulator[label] || 0) + 1;
    return accumulator;
  }, {});

  return Object.entries(counts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
};

const sumHours = (data) => data.reduce((total, item) => {
  const value = Number.parseFloat(item.tiempo_reserva);
  return total + (Number.isFinite(value) ? value : 0);
}, 0);

const formatNumber = (value, maximumFractionDigits = 0) => new Intl.NumberFormat("es-CO", {
  maximumFractionDigits,
}).format(value || 0);

const formatMonth = (date) => new Intl.DateTimeFormat("es-CO", {
  month: "short",
  year: "numeric",
}).format(date).replace(" de ", " ");

const formatAgendaMonth = (date) => new Intl.DateTimeFormat("es-CO", { month: "short" })
  .format(date)
  .replace(".", "")
  .toUpperCase();

const getDaysUntil = (date, today) => Math.round((date - today) / DAY_IN_MS);

const getProximityLabel = (date, today) => {
  const days = getDaysUntil(date, today);
  if (days === 0) return "Hoy";
  if (days === 1) return "Mañana";
  return `En ${formatNumber(days)} días`;
};

const KpiCard = ({ title, value, helper, icon: Icon, accent, loading }) => (
  <article className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        {loading ? (
          <div className="mt-3 h-9 w-24 animate-pulse rounded-lg bg-gray-100" />
        ) : (
          <p className="mt-2 truncate text-3xl font-bold tracking-tight text-blue-dark-500">{value}</p>
        )}
        <p className="mt-2 text-xs leading-5 text-gray-500">{helper}</p>
      </div>
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${accent}`}>
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
    </div>
  </article>
);

const HorizontalBars = ({ data, color = "bg-turquoise-500", emptyMessage }) => {
  const maxValue = Math.max(...data.map((item) => item.value), 1);

  if (!data.length) {
    return <p className="py-10 text-center text-sm text-gray-500">{emptyMessage}</p>;
  }

  return (
    <div className="mt-5 space-y-4">
      {data.map((item) => (
        <div key={item.name}>
          <div className="mb-1.5 flex items-center justify-between gap-4 text-sm">
            <span className="truncate font-medium text-gray-700" title={item.name}>{item.name}</span>
            <span className="shrink-0 tabular-nums text-gray-500">{formatNumber(item.value)}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-100">
            <div
              className={`h-full rounded-full ${color} transition-all duration-500`}
              style={{ width: `${Math.max((item.value / maxValue) * 100, 4)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

const MonthlyForecast = ({ months }) => {
  const maxValue = Math.max(...months.map((month) => month.total), 1);

  return (
    <div className="mt-6 space-y-5">
      {months.map((month) => (
        <div key={month.key} className="grid grid-cols-[5.5rem_1fr_auto] items-center gap-3">
          <span className="text-xs font-semibold capitalize text-gray-600">{month.label}</span>
          <div className="h-3 overflow-hidden rounded-full bg-gray-100" title={`${month.events} eventos de ${month.total} reservas`}>
            <div
              className="h-full overflow-hidden rounded-full bg-turquoise-500 transition-all duration-500"
              style={{ width: `${month.total ? Math.max((month.total / maxValue) * 100, 4) : 0}%` }}
            >
              <div
                className="h-full bg-magenta-500"
                style={{ width: `${month.total ? (month.events / month.total) * 100 : 0}%` }}
              />
            </div>
          </div>
          <span className="min-w-10 text-right text-sm font-semibold tabular-nums text-blue-dark-500">{formatNumber(month.total)}</span>
        </div>
      ))}
      <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-gray-100 pt-4 text-xs text-gray-500">
        <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-turquoise-500" /> Reservas activas</span>
        <span className="inline-flex items-center gap-1.5 font-medium text-magenta-600"><span className="h-2 w-2 rounded-full bg-magenta-500" /> {formatNumber(months.reduce((total, month) => total + month.events, 0))} corresponden a eventos</span>
      </div>
    </div>
  );
};

const EventAgenda = ({ events, today }) => {
  if (!events.length) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center rounded-xl bg-gray-50 px-6 text-center">
        <TicketIcon className="h-10 w-10 text-gray-300" aria-hidden="true" />
        <p className="mt-3 text-sm font-semibold text-gray-600">No hay eventos próximos en este alcance</p>
        <p className="mt-1 text-xs text-gray-500">Amplía las fechas o limpia los filtros para consultar la agenda.</p>
      </div>
    );
  }

  return (
    <ol className="mt-5 divide-y divide-gray-100">
      {events.map(({ row, date }, index) => (
        <li key={row.numero ?? `${row.codigo_espacio}-${date.getTime()}-${index}`} className="flex gap-4 py-4 first:pt-0 last:pb-0">
          <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-magenta-50 text-magenta-700">
            <span className="text-lg font-bold leading-none">{date.getDate()}</span>
            <span className="mt-1 text-[10px] font-bold tracking-wider">{formatAgendaMonth(date)}</span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <p className="truncate text-sm font-semibold text-blue-dark-500" title={row.titulo_reserva}>{row.titulo_reserva || "Evento sin título"}</p>
              <span className="shrink-0 rounded-full bg-turquoise-50 px-2 py-0.5 text-[11px] font-semibold text-turquoise-700">{getProximityLabel(date, today)}</span>
            </div>
            <p className="mt-1 truncate text-xs text-gray-500" title={`${row.sede || ""} · ${row.codigo_espacio || ""}`}>
              {row.sede || "Sede sin información"} · Espacio {row.codigo_espacio || "sin código"}
            </p>
            <p className="mt-1 text-xs font-medium text-gray-600">{row.hora_inicio_reserva || "Hora pendiente"} – {row.hora_fin_reserva || "Hora pendiente"}</p>
          </div>
        </li>
      ))}
    </ol>
  );
};

const ReportsDashboard = ({
  data,
  allData,
  consolidatedTotalRecords,
  loading,
  error,
  scope,
  isFiltered,
}) => {
  const historicalAnalytics = useMemo(() => {
    const cancelled = allData.filter((row) => normalizeSearchText(row.estado).startsWith("cancelad")).length;
    const completed = allData.filter((row) => normalizeSearchText(row.estado).startsWith("completad")).length;
    const uniqueUsers = new Set(allData.map((row) => normalizeText(row.correo || row.usuario))).size;

    return {
      cancelled,
      completed,
      uniqueUsers,
      cancellationRate: allData.length ? (cancelled / allData.length) * 100 : 0,
    };
  }, [allData]);

  const analytics = useMemo(() => {
    const today = startOfLocalDay();
    const next7Limit = addDays(today, 7);
    const next30Limit = addDays(today, 30);
    const futureItems = data.reduce((items, row) => {
      const date = parseReportDate(row.fecha_reserva);
      if (date && date >= today && !isTerminalReservation(row)) items.push({ row, date });
      return items;
    }, []);
    const futureRecords = futureItems.map((item) => item.row);
    const futureEventItems = futureItems.filter((item) => isEventReservation(item.row));
    const futureEvents = futureEventItems.map((item) => item.row);
    const next7 = futureItems.filter((item) => item.date < next7Limit);
    const next30 = futureItems.filter((item) => item.date < next30Limit);
    const eventAgenda = futureEventItems
      .sort((a, b) => a.date - b.date)
      .slice(0, 6);

    const months = Array.from({ length: 6 }, (_, index) => {
      const start = new Date(today.getFullYear(), today.getMonth() + index, 1);
      const end = new Date(today.getFullYear(), today.getMonth() + index + 1, 1);
      const records = futureItems.filter((item) => item.date >= start && item.date < end);

      return {
        key: `${start.getFullYear()}-${start.getMonth()}`,
        label: formatMonth(start),
        total: records.length,
        events: records.filter((item) => isEventReservation(item.row)).length,
      };
    });

    const campuses = countBy(futureRecords, "sede").slice(0, 5);
    const spaceTypes = countBy(futureRecords, "tipo_espacio").slice(0, 5);
    const eventSpaces = countBy(futureEvents, "codigo_espacio").slice(0, 5);
    const uniqueSpaces = new Set(futureRecords.map((row) => normalizeText(row.codigo_espacio))).size;
    const uniqueEventSpaces = new Set(futureEvents.map((row) => normalizeText(row.codigo_espacio))).size;
    const peakMonth = [...months].sort((a, b) => b.total - a.total)[0];

    return {
      today,
      futureRecords,
      futureEvents,
      next7,
      next30,
      eventAgenda,
      months,
      campuses,
      spaceTypes,
      eventSpaces,
      uniqueSpaces,
      uniqueEventSpaces,
      plannedHours: sumHours(futureRecords),
      peakMonth,
    };
  }, [data]);

  const scopeLabels = {
    upcoming: "reservas próximas activas",
    events: "próximos eventos",
    all: "todo el histórico",
  };
  const scopeLabel = scopeLabels[scope] || scopeLabels.upcoming;
  const loadingCards = loading && !allData.length;
  const eventShare = analytics.futureRecords.length
    ? (analytics.futureEvents.length / analytics.futureRecords.length) * 100
    : 0;

  return (
    <div className="space-y-6" aria-busy={loading}>
      <div className="flex flex-col gap-2 rounded-2xl border border-blue-light-100 bg-blue-light-50/70 px-5 py-4 text-sm text-blue-dark-600 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <CalendarDaysIcon className="mt-0.5 h-5 w-5 shrink-0 text-blue-light-600" aria-hidden="true" />
          <p>
            <span className="font-semibold">Enfoque actual:</span> {scopeLabel}. Los indicadores se calculan sobre {formatNumber(data.length)} registros{isFiltered ? " después de aplicar filtros adicionales" : ""}.
          </p>
        </div>
        {error && (
          <span className="inline-flex shrink-0 items-center gap-1.5 font-medium text-error-dark">
            <ExclamationTriangleIcon className="h-4 w-4" /> Datos no actualizados
          </span>
        )}
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Indicadores de reservas futuras">
        <KpiCard
          title="Reservas en el alcance"
          value={formatNumber(data.length)}
          helper={`Vista: ${scopeLabel}`}
          icon={CalendarDaysIcon}
          accent="bg-primary-50 text-primary-600"
          loading={loadingCards}
        />
        <KpiCard
          title="Próximos 7 días"
          value={formatNumber(analytics.next7.length)}
          helper="Reservas activas que requieren atención inmediata"
          icon={BoltIcon}
          accent="bg-orange-50 text-orange-600"
          loading={loadingCards}
        />
        <KpiCard
          title="Próximos 30 días"
          value={formatNumber(analytics.next30.length)}
          helper="Carga operativa prevista para el siguiente mes"
          icon={PresentationChartBarIcon}
          accent="bg-turquoise-50 text-turquoise-600"
          loading={loadingCards}
        />
        <KpiCard
          title={scope === "events" ? "Espacios para eventos" : "Eventos próximos"}
          value={formatNumber(scope === "events" ? analytics.uniqueEventSpaces : analytics.futureEvents.length)}
          helper={scope === "events"
            ? "Espacios distintos comprometidos por eventos próximos"
            : `${formatNumber(eventShare, 1)}% de las reservas futuras del alcance`}
          icon={TicketIcon}
          accent="bg-magenta-50 text-magenta-600"
          loading={loadingCards}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-5">
        <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm xl:col-span-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-turquoise-600">Planeación semestral</p>
          <h2 className="mt-1 text-lg font-bold text-blue-dark-500">Carga futura por mes</h2>
          <p className="mt-1 text-sm text-gray-500">Reservas activas programadas durante los próximos seis meses.</p>
          <MonthlyForecast months={analytics.months} />
        </article>

        <article className="rounded-2xl bg-blue-dark-500 p-6 text-white shadow-sm xl:col-span-2">
          <div className="flex items-center gap-2 text-blue-light-200">
            <SparklesIcon className="h-5 w-5" aria-hidden="true" />
            <p className="text-xs font-semibold uppercase tracking-wider">Señales para planeación</p>
          </div>
          <dl className="mt-6 space-y-5">
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
              <dt className="text-sm text-blue-light-100">Horas aún por ejecutar</dt>
              <dd className="text-lg font-bold tabular-nums">{formatNumber(analytics.plannedHours, 1)} h</dd>
            </div>
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
              <dt className="text-sm text-blue-light-100">Espacios comprometidos</dt>
              <dd className="text-lg font-bold tabular-nums">{formatNumber(analytics.uniqueSpaces)}</dd>
            </div>
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
              <dt className="text-sm text-blue-light-100">Mes con mayor carga</dt>
              <dd className="text-right font-semibold capitalize">{analytics.peakMonth?.total ? `${analytics.peakMonth.label} · ${formatNumber(analytics.peakMonth.total)}` : "Sin datos"}</dd>
            </div>
            <div className="flex items-start justify-between gap-4">
              <dt className="text-sm text-blue-light-100">Sede con mayor demanda</dt>
              <dd className="max-w-44 text-right font-semibold">{analytics.campuses[0]?.name || "Sin datos"}</dd>
            </div>
          </dl>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-5">
        <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm xl:col-span-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-magenta-600">Agenda prioritaria</p>
              <h2 className="mt-1 text-lg font-bold text-blue-dark-500">Próximos eventos</h2>
              <p className="mt-1 text-sm text-gray-500">Los seis eventos más cercanos que aún no se han realizado.</p>
            </div>
            <TicketIcon className="h-7 w-7 shrink-0 text-magenta-500" aria-hidden="true" />
          </div>
          <EventAgenda events={analytics.eventAgenda} today={analytics.today} />
        </article>

        <div className="grid gap-6 xl:col-span-2">
          <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <MapPinIcon className="h-5 w-5 text-primary-600" aria-hidden="true" />
              <h2 className="text-base font-bold text-blue-dark-500">Sedes con mayor carga futura</h2>
            </div>
            <HorizontalBars data={analytics.campuses} color="bg-primary-500" emptyMessage="No hay carga futura por sede" />
          </article>
          <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <PresentationChartBarIcon className="h-5 w-5 text-purple-600" aria-hidden="true" />
              <h2 className="text-base font-bold text-blue-dark-500">Tipos de espacio con demanda futura</h2>
            </div>
            <HorizontalBars data={analytics.spaceTypes} color="bg-purple-500" emptyMessage="No hay demanda futura por tipo de espacio" />
          </article>
          <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <BuildingOffice2Icon className="h-5 w-5 text-magenta-600" aria-hidden="true" />
              <h2 className="text-base font-bold text-blue-dark-500">Espacios para eventos más solicitados</h2>
            </div>
            <HorizontalBars data={analytics.eventSpaces} color="bg-magenta-500" emptyMessage="No hay espacios de eventos en este alcance" />
          </article>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm" aria-label="Contexto del consolidado general">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Contexto general</p>
            <h2 className="mt-1 text-lg font-bold text-blue-dark-500">Salud del consolidado histórico</h2>
          </div>
          <p className="text-xs text-gray-500">Referencia global; no cambia con los filtros del dashboard.</p>
        </div>
        <dl className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl bg-gray-50 p-4">
            <dt className="flex items-center gap-2 text-xs font-medium text-gray-500"><CalendarDaysIcon className="h-4 w-4" /> Total consolidado</dt>
            <dd className="mt-2 text-2xl font-bold text-blue-dark-500">{formatNumber(consolidatedTotalRecords || allData.length)}</dd>
          </div>
          <div className="rounded-xl bg-green-50 p-4">
            <dt className="flex items-center gap-2 text-xs font-medium text-green-700"><PresentationChartBarIcon className="h-4 w-4" /> Completadas</dt>
            <dd className="mt-2 text-2xl font-bold text-green-700">{formatNumber(historicalAnalytics.completed)}</dd>
          </div>
          <div className="rounded-xl bg-magenta-50 p-4">
            <dt className="flex items-center gap-2 text-xs font-medium text-magenta-700"><ExclamationTriangleIcon className="h-4 w-4" /> Cancelación histórica</dt>
            <dd className="mt-2 text-2xl font-bold text-magenta-700">{formatNumber(historicalAnalytics.cancellationRate, 1)}%</dd>
          </div>
          <div className="rounded-xl bg-purple-50 p-4">
            <dt className="flex items-center gap-2 text-xs font-medium text-purple-700"><UserGroupIcon className="h-4 w-4" /> Usuarios históricos</dt>
            <dd className="mt-2 text-2xl font-bold text-purple-700">{formatNumber(historicalAnalytics.uniqueUsers)}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
};

export default ReportsDashboard;
