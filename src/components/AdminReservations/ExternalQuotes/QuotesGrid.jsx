import { Calendar as CalendarIcon, Clock, ChevronRight, FileSignature } from 'lucide-react';
import { formatDateObj, getStatusBadge } from './utils';

const QuotesGrid = ({ isLoading, quotes, pagination, filters, setFilters, openSlideOver }) => {
    return (
        <div className="space-y-4 z-0 relative">
            {isLoading ? (
                <div className="flex justify-center items-center py-16">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                    <span className="ml-3 text-purple-600 font-medium">Buscando solicitudes...</span>
                </div>
            ) : quotes.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-16 text-center shadow-sm">
                    <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex justify-center items-center mb-4">
                        <FileSignature className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">Bandeja Vacía</h3>
                    <p className="text-gray-500">No se encontraron solicitudes con los criterios asignados.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
                    {quotes.map(quote => (
                        <div key={quote.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col group cursor-pointer" onClick={() => openSlideOver(quote)}>
                            {/* Info Status Header */}
                            <div className="px-5 pt-5 pb-3">
                                <div className="flex justify-between items-start mb-4">
                                    {getStatusBadge(quote.estado)}
                                    <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-2 py-1 rounded">#{quote.id}</span>
                                </div>
                                <h3 className="text-[17px] font-bold text-gray-900 leading-tight line-clamp-2" title={quote.evento_tipo}>
                                    {quote.evento_tipo || 'Evento Corporativo Externo'}
                                </h3>
                                <p className="text-sm font-medium text-purple-700 mt-1 truncate">
                                    {quote.empresa_nombre || quote.solicitante_nombre}
                                </p>
                            </div>

                            {/* Resumen Fechas */}
                            <div className="px-5 pb-5 mt-auto border-b border-gray-100">
                                <div className="flex items-center gap-2 text-sm text-gray-600 font-medium mb-1">
                                    <CalendarIcon className="w-4 h-4 text-gray-400" /> {formatDateObj(quote.fecha_reserva)}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                                    <Clock className="w-4 h-4 text-gray-400" /> {quote.hora_inicio} - {quote.hora_fin}
                                </div>
                            </div>

                            {/* Area Inferior */}
                            <div className="bg-gray-50/50 p-3 flex justify-between items-center group-hover:bg-purple-50 transition-colors">
                                <span className="text-xs text-gray-500 w-full text-center flex items-center justify-center gap-1 group-hover:text-purple-700 font-semibold transition-colors">
                                    Revisar solicitud <ChevronRight className="w-4 h-4" />
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ===== PAGINACIÓN ===== */}
            {!isLoading && quotes.length > 0 && pagination.total > 0 && (
                <div className="flex flex-col md:flex-row items-center justify-between bg-white px-5 py-3 border border-gray-200 rounded-xl mt-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4 md:mb-0">
                        <span className="text-sm font-medium text-gray-700">Mostrar</span>
                        <select
                            value={filters.per_page}
                            onChange={(e) => setFilters(prev => ({ ...prev, per_page: e.target.value, page: 1 }))}
                            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50 font-medium transition-all"
                        >
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                        </select>
                        <span className="text-sm font-medium text-gray-700">registros de {pagination.total}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            disabled={pagination.current_page <= 1}
                            onClick={() => setFilters(prev => ({ ...prev, page: pagination.current_page - 1 }))}
                            className="px-4 py-1.5 text-sm font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            Anterior
                        </button>
                        <span className="px-4 py-1.5 text-[13px] font-bold text-purple-800 bg-purple-100 rounded-lg">
                            Página {pagination.current_page} de {pagination.last_page || 1}
                        </span>
                        <button
                            disabled={pagination.current_page >= pagination.last_page}
                            onClick={() => setFilters(prev => ({ ...prev, page: pagination.current_page + 1 }))}
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
