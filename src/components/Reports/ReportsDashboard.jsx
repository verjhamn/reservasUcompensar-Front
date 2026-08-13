/* eslint-disable react/prop-types */
import { useMemo } from "react";
import {
  ArrowTrendingUpIcon,
  BuildingOffice2Icon,
  CalendarDaysIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

const STATUS_COLORS = {
  creada: "#00aab7",
  completada: "#00a554",
  cancelada: "#e60064",
};

const FALLBACK_COLORS = ["#722070", "#ff6600", "#5890c6", "#f7a400", "#95c11f"];

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

const KpiCard = ({ title, value, helper, icon: Icon, accent, loading }) => (
  <article className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        {loading ? (
          <div className="mt-3 h-9 w-28 animate-pulse rounded-lg bg-gray-100" />
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
    return <p className="py-12 text-center text-sm text-gray-500">{emptyMessage}</p>;
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

const ReportsDashboard = ({ data, totalRecords, loading, error, isFiltered }) => {
  const analytics = useMemo(() => {
    const statuses = countBy(data, "estado");
    const spaceTypes = countBy(data, "tipo_espacio").slice(0, 5);
    const campuses = countBy(data, "sede").slice(0, 5);
    const users = countBy(data, "usuario");
    const spaces = countBy(data, "codigo_espacio");
    const hours = sumHours(data);
    const completed = statuses.find((item) => item.name.toLowerCase() === "completada")?.value || 0;
    const cancelled = statuses.find((item) => item.name.toLowerCase() === "cancelada")?.value || 0;
    const resolved = completed + cancelled;

    return {
      statuses,
      spaceTypes,
      campuses,
      users,
      spaces,
      hours,
      completionRate: resolved ? (completed / resolved) * 100 : 0,
      cancellationRate: data.length ? (cancelled / data.length) * 100 : 0,
    };
  }, [data]);

  const donutSegments = useMemo(() => {
    if (!analytics.statuses.length) return "#e5e7eb 0deg 360deg";

    let currentDegree = 0;
    return analytics.statuses.map((status, index) => {
      const start = currentDegree;
      currentDegree += (status.value / data.length) * 360;
      const color = STATUS_COLORS[status.name.toLowerCase()] || FALLBACK_COLORS[index % FALLBACK_COLORS.length];
      return `${color} ${start}deg ${currentDegree}deg`;
    }).join(", ");
  }, [analytics.statuses, data.length]);

  const loadedLabel = isFiltered
    ? `${formatNumber(data.length)} registros coinciden con los filtros del dashboard`
    : `${formatNumber(data.length)} registros del consolidado general`;

  return (
    <div className="space-y-6" aria-busy={loading}>
      <div className="flex flex-col gap-2 rounded-2xl border border-blue-light-100 bg-blue-light-50/70 px-5 py-4 text-sm text-blue-dark-600 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <CalendarDaysIcon className="mt-0.5 h-5 w-5 shrink-0 text-blue-light-600" aria-hidden="true" />
          <p>
            <span className="font-semibold">Alcance de los indicadores:</span> distribuciones, horas y porcentajes usan {loadedLabel}.
          </p>
        </div>
        {error && (
          <span className="inline-flex shrink-0 items-center gap-1.5 font-medium text-error-dark">
            <ExclamationTriangleIcon className="h-4 w-4" /> Datos no actualizados
          </span>
        )}
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Indicadores principales">
        <KpiCard
          title="Reservas encontradas"
          value={formatNumber(totalRecords)}
          helper={isFiltered ? "Total según los filtros del dashboard" : "Total del consolidado general"}
          icon={CalendarDaysIcon}
          accent="bg-primary-50 text-primary-600"
          loading={loading && !data.length}
        />
        <KpiCard
          title="Horas reservadas"
          value={`${formatNumber(analytics.hours, 1)} h`}
          helper="Suma del consolidado analizado"
          icon={ClockIcon}
          accent="bg-turquoise-50 text-turquoise-600"
          loading={loading && !data.length}
        />
        <KpiCard
          title="Tasa de finalización"
          value={`${formatNumber(analytics.completionRate, 1)}%`}
          helper="Completadas sobre reservas resueltas"
          icon={CheckCircleIcon}
          accent="bg-green-50 text-green-600"
          loading={loading && !data.length}
        />
        <KpiCard
          title="Usuarios únicos"
          value={formatNumber(analytics.users.length)}
          helper="Usuarios distintos en el consolidado"
          icon={UserGroupIcon}
          accent="bg-purple-50 text-purple-600"
          loading={loading && !data.length}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-5">
        <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm xl:col-span-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-turquoise-600">Composición</p>
            <h2 className="mt-1 text-lg font-bold text-blue-dark-500">Reservas por estado</h2>
          </div>
          <div className="mt-6 flex flex-col items-center gap-7 sm:flex-row sm:justify-center">
            <div
              className="relative h-40 w-40 shrink-0 rounded-full"
              style={{ background: `conic-gradient(${donutSegments})` }}
              role="img"
              aria-label="Gráfico de distribución de reservas por estado"
            >
              <div className="absolute inset-5 flex flex-col items-center justify-center rounded-full bg-white">
                <span className="text-3xl font-bold text-blue-dark-500">{formatNumber(data.length)}</span>
                <span className="text-xs text-gray-500">analizadas</span>
              </div>
            </div>
            <div className="w-full min-w-0 space-y-3">
              {analytics.statuses.map((status, index) => {
                const color = STATUS_COLORS[status.name.toLowerCase()] || FALLBACK_COLORS[index % FALLBACK_COLORS.length];
                return (
                  <div key={status.name} className="flex items-center justify-between gap-4 text-sm">
                    <span className="flex min-w-0 items-center gap-2 text-gray-600">
                      <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: color }} />
                      <span className="truncate">{status.name}</span>
                    </span>
                    <span className="shrink-0 font-semibold tabular-nums text-gray-800">
                      {status.value} <span className="font-normal text-gray-400">· {formatNumber((status.value / data.length) * 100, 1)}%</span>
                    </span>
                  </div>
                );
              })}
              {!analytics.statuses.length && <p className="text-center text-sm text-gray-500">Sin datos para visualizar</p>}
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm xl:col-span-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-purple-600">Preferencias</p>
          <h2 className="mt-1 text-lg font-bold text-blue-dark-500">Tipos de espacio más reservados</h2>
          <HorizontalBars
            data={analytics.spaceTypes}
            color="bg-purple-500"
            emptyMessage="No hay tipos de espacio para mostrar"
          />
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-600">Ubicación</p>
          <h2 className="mt-1 text-lg font-bold text-blue-dark-500">Distribución por sede</h2>
          <HorizontalBars
            data={analytics.campuses}
            color="bg-primary-500"
            emptyMessage="No hay sedes para mostrar"
          />
        </article>

        <article className="rounded-2xl bg-blue-dark-500 p-6 text-white shadow-sm">
          <div className="flex items-center gap-2 text-blue-light-200">
            <ArrowTrendingUpIcon className="h-5 w-5" aria-hidden="true" />
            <p className="text-xs font-semibold uppercase tracking-wider">Lectura rápida</p>
          </div>
          <h2 className="mt-2 text-xl font-bold">Hallazgos del consolidado</h2>
          <dl className="mt-6 grid gap-5 sm:grid-cols-2">
            <div className="rounded-xl bg-white/10 p-4">
              <dt className="text-xs text-blue-light-100">Tipo más solicitado</dt>
              <dd className="mt-1 truncate font-semibold" title={analytics.spaceTypes[0]?.name}>{analytics.spaceTypes[0]?.name || "Sin datos"}</dd>
              <p className="mt-1 text-xs text-blue-light-200">{formatNumber(analytics.spaceTypes[0]?.value)} reservas</p>
            </div>
            <div className="rounded-xl bg-white/10 p-4">
              <dt className="text-xs text-blue-light-100">Espacio con más reservas</dt>
              <dd className="mt-1 truncate font-semibold" title={analytics.spaces[0]?.name}>{analytics.spaces[0]?.name || "Sin datos"}</dd>
              <p className="mt-1 text-xs text-blue-light-200">{formatNumber(analytics.spaces[0]?.value)} reservas</p>
            </div>
            <div className="rounded-xl bg-white/10 p-4">
              <dt className="text-xs text-blue-light-100">Usuario más activo</dt>
              <dd className="mt-1 truncate font-semibold" title={analytics.users[0]?.name}>{analytics.users[0]?.name || "Sin datos"}</dd>
              <p className="mt-1 text-xs text-blue-light-200">{formatNumber(analytics.users[0]?.value)} reservas</p>
            </div>
            <div className="rounded-xl bg-white/10 p-4">
              <dt className="text-xs text-blue-light-100">Tasa de cancelación</dt>
              <dd className="mt-1 text-2xl font-bold">{formatNumber(analytics.cancellationRate, 1)}%</dd>
              <p className="mt-1 text-xs text-blue-light-200">Sobre registros analizados</p>
            </div>
          </dl>
          <div className="mt-5 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-blue-light-100">
            <BuildingOffice2Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
            Use “Detalle y exportación” para consultar cada reserva y descargar el reporte filtrado.
          </div>
        </article>
      </section>
    </div>
  );
};

export default ReportsDashboard;
