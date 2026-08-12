/* eslint-disable react/prop-types */
import {
    Calendar as CalendarIcon,
    Clock,
    ChevronRight,
    FileSignature,
    MapPin,
    Users,
    User,
    RefreshCw,
    MessageSquare
} from 'lucide-react';
import {
    formatDateObj,
    getStatusBadge,
    getOriginBadge,
    isTruthyFlag
} from './utils';

const QuotesGrid = ({
    isLoading,
    quotes,
    pagination,
    filters,
    setFilters,
    openSlideOver
}) => {
    return (
        <div className="space-y-4 z-0 relative">
            {isLoading ? (
                <div className="flex justify-center items-center py-16">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                    <span className="ml-3 text-purple-600 font-medium">
                        Buscando solicitudes...
                    </span>
                </div>
            ) : quotes.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-16 text-center shadow-sm">
                    <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex justify-center items-center mb-4">
                        <FileSignature className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">
                        Bandeja vacia
                    </h3>
                    <p className="text-gray-500">
                        No se encontraron solicitudes con los criterios asignados.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
                    {quotes.map((quote) => {
                        const eventTitle =
                            quote.evento_nombre ||
                            quote.evento_tipo ||
                            'Solicitud sin nombre';
                        const endDate = quote.fecha_fin || quote.fecha_fin_reserva;
                        const companyIsCompensar = [
                            quote.empresa_compensar_interno,
                            quote.compensar_interno,
                            quote.empresa?.compensar_interno
                        ].some(isTruthyFlag);
                        const companyName = companyIsCompensar
                            ? 'Compensar'
                            : (quote.empresa_nombre || quote.solicitante_nombre);
                        const sedeNombre = quote.sede_nombre || quote.espacio?.sede_nombre;
                        const timelineCount = Array.isArray(quote.linea_tiempo) ? quote.linea_tiempo.length : 0;

                        return (
                            <div
                                key={quote.id}
                                className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col group cursor-pointer"
                                onClick={() => openSlideOver(quote)}
                            >
                                <div className="px-5 pt-5 pb-3">
                                    <div className="flex justify-between items-start gap-3 mb-4">
                                        <div className="flex flex-wrap items-center gap-2">
                                            {getStatusBadge(quote.estado)}
                                            {getOriginBadge(quote.origen)}
                                            {quote.tiene_reubicacion && (
                                                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-700 border border-amber-200 uppercase tracking-wide flex items-center gap-1">
                                                    <RefreshCw className="w-3 h-3" /> Reubicada
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex flex-col items-end gap-1 shrink-0">
                                            <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-2 py-1 rounded">
                                                #{quote.id}
                                            </span>
                                            {timelineCount > 0 && (
                                                <span className="text-[10px] font-semibold text-gray-400 flex items-center gap-1">
                                                    <MessageSquare className="w-3 h-3" /> {timelineCount}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <h3
                                        className="text-[17px] font-bold text-gray-900 leading-tight line-clamp-2"
                                        title={eventTitle}
                                    >
                                        {eventTitle}
                                    </h3>

                                    <p className="text-sm font-medium text-purple-700 mt-1 truncate">
                                        {companyName}
                                    </p>

                                    {quote.solicitante_nombre && (
                                        <p className="text-xs font-medium text-gray-500 mt-0.5 truncate flex items-center gap-1">
                                            <User className="w-3 h-3 shrink-0" />
                                            {quote.solicitante_nombre}
                                            {quote.solicitante_cargo ? ` · ${quote.solicitante_cargo}` : ''}
                                        </p>
                                    )}

                                    <p className="text-xs font-semibold text-gray-500 mt-1">
                                        {quote.origen === 'interna'
                                            ? 'Solicitud interna'
                                            : companyIsCompensar
                                                ? 'Empresa Compensar'
                                                : 'Empresa externa'}
                                    </p>
                                </div>

                                <div className="px-5 pb-5 mt-auto border-b border-gray-100">
                                    {sedeNombre && (
                                        <div className="flex items-center gap-2 text-sm text-gray-600 font-medium mb-1">
                                            <MapPin className="w-4 h-4 text-gray-400" />
                                            {sedeNombre}
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 text-sm text-gray-600 font-medium mb-1">
                                        <CalendarIcon className="w-4 h-4 text-gray-400" />
                                        {formatDateObj(quote.fecha_reserva)}
                                        {endDate ? ` - ${formatDateObj(endDate)}` : ''}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600 font-medium mb-1">
                                        <Clock className="w-4 h-4 text-gray-400" />
                                        {quote.hora_inicio || 'Sin hora de inicio'} - {quote.hora_fin || 'Sin hora de fin'}
                                    </div>
                                    {quote.cantidad_personas ? (
                                        <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                                            <Users className="w-4 h-4 text-gray-400" />
                                            {quote.cantidad_personas} personas
                                        </div>
                                    ) : null}
                                </div>

                                <div className="bg-gray-50/50 p-3 flex justify-between items-center group-hover:bg-purple-50 transition-colors">
                                    <span className="text-xs text-gray-500 w-full text-center flex items-center justify-center gap-1 group-hover:text-purple-700 font-semibold transition-colors">
                                        Revisar solicitud <ChevronRight className="w-4 h-4" />
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {!isLoading && quotes.length > 0 && pagination.total > 0 && (
                <div className="flex flex-col md:flex-row items-center justify-between bg-white px-5 py-3 border border-gray-200 rounded-xl mt-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4 md:mb-0">
                        <span className="text-sm font-medium text-gray-700">Mostrar</span>
                        <select
                            value={filters.per_page}
                            onChange={(event) => setFilters((prev) => ({
                                ...prev,
                                per_page: event.target.value,
                                page: 1
                            }))}
                            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50 font-medium transition-all"
                        >
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                        </select>
                        <span className="text-sm font-medium text-gray-700">
                            registros de {pagination.total}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            disabled={pagination.current_page <= 1}
                            onClick={() => setFilters((prev) => ({
                                ...prev,
                                page: pagination.current_page - 1
                            }))}
                            className="px-4 py-1.5 text-sm font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            Anterior
                        </button>
                        <span className="px-4 py-1.5 text-[13px] font-bold text-purple-800 bg-purple-100 rounded-lg">
                            Pagina {pagination.current_page} de {pagination.last_page || 1}
                        </span>
                        <button
                            disabled={pagination.current_page >= pagination.last_page}
                            onClick={() => setFilters((prev) => ({
                                ...prev,
                                page: pagination.current_page + 1
                            }))}
                            className="px-4 py-1.5 text-sm font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuotesGrid;
