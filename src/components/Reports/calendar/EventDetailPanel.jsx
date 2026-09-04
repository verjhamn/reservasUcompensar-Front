/* eslint-disable react/prop-types */
import { format } from "date-fns";
import es from "date-fns/locale/es";
import {
  BuildingOffice2Icon,
  CalendarDaysIcon,
  ClockIcon,
  EnvelopeIcon,
  IdentificationIcon,
  MapPinIcon,
  TicketIcon,
  UserIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { getEventColors } from "./reportsCalendarUtils";
import { parseReportDate } from "../reportDateUtils";

const DetailRow = ({ icon: Icon, label, value }) => {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="truncate text-sm font-semibold text-gray-800" title={value}>{value}</p>
      </div>
    </div>
  );
};

const EventDetailPanel = ({ isOpen, row, onClose }) => {
  const colors = row ? getEventColors(row.estado) : null;
  const reservationDate = row ? parseReportDate(row.fecha_reserva) : null;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900/40 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md transform flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {row && (
          <>
            <div className="flex items-start justify-between gap-3 border-b border-gray-200 px-6 py-5">
              <div className="min-w-0">
                <span
                  className="inline-flex rounded-full px-2.5 py-1 text-xs font-bold"
                  style={{ backgroundColor: colors.background, color: colors.text }}
                >
                  {row.estado || "Sin estado"}
                </span>
                <h2 className="mt-2 truncate text-lg font-bold text-blue-dark-500" title={row.titulo_reserva}>
                  {row.titulo_reserva || "Evento sin título"}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full bg-gray-100 p-2 text-gray-500 transition hover:bg-gray-200 hover:text-gray-900"
                aria-label="Cerrar detalle"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto p-6">
              <DetailRow
                icon={CalendarDaysIcon}
                label="Fecha de la reserva"
                value={reservationDate ? format(reservationDate, "EEEE d 'de' MMMM 'de' yyyy", { locale: es }) : row.fecha_reserva}
              />
              <DetailRow
                icon={ClockIcon}
                label="Horario"
                value={[row.hora_inicio_reserva, row.hora_fin_reserva].filter(Boolean).join(" – ") || null}
              />
              <DetailRow icon={TicketIcon} label="Tipo de espacio" value={row.tipo_espacio} />
              <DetailRow icon={MapPinIcon} label="Sede" value={row.sede} />
              <DetailRow icon={BuildingOffice2Icon} label="Código de espacio" value={row.codigo_espacio} />
              <DetailRow icon={UserIcon} label="Usuario" value={row.usuario} />
              <DetailRow icon={IdentificationIcon} label="Cargo / rol" value={row.cargo_rol} />
              <DetailRow icon={EnvelopeIcon} label="Correo" value={row.correo} />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default EventDetailPanel;
