import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { Search, Filter, CheckCircle, XCircle, Clock, Building, User, Mail, Calendar as CalendarIcon, FileText, Briefcase, AlertCircle, Phone, Info, X, ChevronRight, FileSignature } from 'lucide-react';
import { getExternalQuotes, updateExternalQuoteState } from '../../Services/adminReservasService';
import { format, parseISO } from 'date-fns';
import es from 'date-fns/locale/es';
import { showSuccessToast, showErrorToast } from '../UtilComponents/Confirmation';

const AdminExternalQuotesView = () => {
    // ---- ESTADOS ESTATICOS GLOBALES ----
    const [filters, setFilters] = useState({
        id: "", id_usuario: "", espacio_id: "", palabra: "", email: "", fecha: "", horaInicio: "", horaFin: "", tipo: "", piso: "", estado: "", fecha_creacion: ""
    });

    const [quotes, setQuotes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // ---- ESTADOS DEL PANEL LATERAL (SLIDE-OVER) ----
    const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
    const [selectedQuote, setSelectedQuote] = useState(null);
    const [actionData, setActionData] = useState({
        estado: 'nueva',
        observacion: '',
        notificar: false
    });
    const [isSaving, setIsSaving] = useState(false);

    // ---- CARGA DE DATOS ----
    const fetchQuotes = async () => {
        setIsLoading(true);
        try {
            const data = await getExternalQuotes(filters);
            setQuotes(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error cargando cotizaciones:", error);
            showErrorToast("Ocurrió un error al cargar las cotizaciones");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchQuotes();
        }, 500);
        return () => clearTimeout(timer);
    }, [filters]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    // ---- LÓGICA DEL PANEL LATERAL ----
    const openSlideOver = (quote) => {
        setSelectedQuote(quote);
        setActionData({
            estado: quote.estado?.toLowerCase() || 'nueva',
            observacion: '',
            notificar: false
        });
        setIsSlideOverOpen(true);
        // Deshabilitar scroll del body html
        document.body.style.overflow = 'hidden';
    };

    const closeSlideOver = () => {
        setIsSlideOverOpen(false);
        setTimeout(() => setSelectedQuote(null), 300); // Esperar que acabe la animacion
        document.body.style.overflow = 'unset';
    };

    const handleActionSubmit = async (e) => {
        e.preventDefault();
        if (!selectedQuote) return;

        setIsSaving(true);
        try {
            await updateExternalQuoteState(selectedQuote.id, {
                estado: actionData.estado,
                observacion: actionData.observacion,
                notificar: actionData.notificar
            });
            showSuccessToast(`Solicitud actualizada correctamente`);
            closeSlideOver();
            fetchQuotes();
        } catch (error) {
            showErrorToast("No se pudo actualizar la solicitud");
        } finally {
            setIsSaving(false);
        }
    };

    // ---- HELPERS VISUALES ----
    const getStatusBadge = (estado) => {
        switch (estado?.toLowerCase()) {
            case 'nueva':
                return <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200 uppercase tracking-wide">Nueva</span>;
            case 'en curso':
                return <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200 flex items-center gap-1.5 uppercase tracking-wide"><Clock className="w-3.5 h-3.5" /> En curso</span>;
            case 'en espera':
                return <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800 border border-yellow-300 flex items-center gap-1.5 uppercase tracking-wide"><AlertCircle className="w-3.5 h-3.5" /> En espera</span>;
            case 'aprobada':
                return <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-300 flex items-center gap-1.5 uppercase tracking-wide"><CheckCircle className="w-3.5 h-3.5" /> Aprobada</span>;
            case 'no aprobada':
                return <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-300 flex items-center gap-1.5 uppercase tracking-wide"><XCircle className="w-3.5 h-3.5" /> No Aprobada</span>;
            default:
                return <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-gray-100 text-gray-700 border border-gray-300 uppercase tracking-wide">{estado || 'Desconocido'}</span>;
        }
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return 'No definida';
        try { return format(parseISO(dateString), "dd MMM yyyy, h:mm a", { locale: es }); } catch { return dateString; }
    };

    const formatDateObj = (dateString) => {
        if (!dateString) return 'No definida';
        try { return format(parseISO(dateString), "dd MMM yyyy", { locale: es }); } catch { return dateString; }
    };

    return (
        <div className="flex flex-col gap-6 animate-fade-in relative min-h-[70vh]">
            <Toaster />

            {/* Cabecera y Filtros */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 z-10 relative">
                <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <Briefcase className="w-6 h-6 text-purple-600" />
                            Bandeja de Solicitudes Externas
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">Revisa y pre-aprueba solicitudes para contratos o montajes en los espacios corporativos.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search className="h-4 w-4 text-gray-400" /></div>
                        <input type="text" name="palabra" placeholder="Buscar Solicitante, Empresa..." value={filters.palabra} onChange={handleFilterChange} className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm transition-all bg-gray-50 hover:bg-white" />
                    </div>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Mail className="h-4 w-4 text-gray-400" /></div>
                        <input type="email" name="email" placeholder="Correo solicitante..." value={filters.email} onChange={handleFilterChange} className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm transition-all bg-gray-50 hover:bg-white" />
                    </div>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Filter className="h-4 w-4 text-gray-400" /></div>
                        <select name="estado" value={filters.estado} onChange={handleFilterChange} className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm transition-all bg-gray-50 hover:bg-white appearance-none">
                            <option value="">Todos los Estados</option>
                            <option value="nueva">Nuevas</option>
                            <option value="en curso">En Curso</option>
                            <option value="en espera">En Espera</option>
                            <option value="aprobada">Aprobada</option>
                            <option value="no aprobada">No Aprobada</option>
                        </select>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><CalendarIcon className="h-4 w-4 text-gray-400" /></div>
                        <input type="date" name="fecha" value={filters.fecha} onChange={handleFilterChange} className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm transition-all bg-gray-50 hover:bg-white" />
                    </div>
                </div>
            </div>

            {/* Listado Principal de Tarjetas "Clean" */}
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
                                        Revisar Expediente <ChevronRight className="w-4 h-4" />
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ==== PANEL LATERAL: SLIDE-OVER UX ==== */}
            {/* Backdrop Negro Desenfoque */}
            {isSlideOverOpen && (
                <div
                    className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40 transition-opacity animate-fade-in"
                    onClick={closeSlideOver}
                ></div>
            )}

            {/* El Panel Deslizante */}
            <div
                className={`fixed top-0 right-0 h-full w-full max-w-lg bg-gray-50 z-50 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isSlideOverOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {selectedQuote && (
                    <>
                        {/* Cabecera del Panel */}
                        <div className="bg-white px-6 py-5 border-b border-gray-200 flex items-center justify-between sticky top-0 z-10">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                                    Expediente #{selectedQuote.id}
                                    {getStatusBadge(selectedQuote.estado)}
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">Radicada el {formatDateTime(selectedQuote.created_at)}</p>
                            </div>
                            <button
                                onClick={closeSlideOver}
                                className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Contenido Scrolleable (Lectura Intensiva) */}
                        <div className="flex-grow overflow-y-auto p-6 space-y-6">

                            {/* Bloque 1: El Evento y Tiempos */}
                            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <FileSignature className="w-4 h-4 text-purple-600" /> Concepto del Evento
                                </h3>

                                <p className="text-lg font-bold text-gray-800 mb-4">{selectedQuote.evento_tipo}</p>

                                <div className="grid grid-cols-2 gap-y-4">
                                    <div>
                                        <p className="text-xs text-gray-500">Fecha de uso</p>
                                        <p className="font-semibold text-gray-800 flex items-center gap-1.5"><CalendarIcon className="w-3.5 h-3.5" /> {formatDateObj(selectedQuote.fecha_reserva)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Horario oficial</p>
                                        <p className="font-semibold text-gray-800 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {selectedQuote.hora_inicio} a {selectedQuote.hora_fin}</p>
                                    </div>
                                    {selectedQuote.tiempo_montaje && (
                                        <div>
                                            <p className="text-xs text-gray-500">T. de Montaje Previsto</p>
                                            <p className="font-medium text-gray-800">{selectedQuote.tiempo_montaje} Horas extra</p>
                                        </div>
                                    )}
                                    {selectedQuote.cantidad_personas && (
                                        <div>
                                            <p className="text-xs text-gray-500">Aforo esperado</p>
                                            <p className="font-medium text-gray-800">{selectedQuote.cantidad_personas} Personas</p>
                                        </div>
                                    )}
                                </div>

                                {selectedQuote.evento_detalles && (
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <p className="text-xs text-gray-500 mb-1">Detalles / Logística declarada:</p>
                                        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded italic">{selectedQuote.evento_detalles}</p>
                                    </div>
                                )}
                            </div>

                            {/* Bloque 2: Contratante y Persona a cargo */}
                            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Building className="w-4 h-4 text-purple-600" /> Entidad y Solicitante
                                </h3>

                                <div className="space-y-4">
                                    <div>
                                        <p className="font-bold text-gray-800 text-base">{selectedQuote.empresa_nombre}</p>
                                        <p className="text-sm text-gray-600">{selectedQuote.empresa_tipo_documento || 'ID'}: {selectedQuote.empresa_numero_documento}-{selectedQuote.empresa_digito_verificacion}</p>
                                        <p className="text-sm text-gray-600 flex items-center gap-1.5 mt-1"><Phone className="w-3.5 h-3.5 text-gray-400" /> {selectedQuote.empresa_telefono} - {selectedQuote.empresa_direccion}</p>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                        <span className="text-xs font-bold text-purple-700 uppercase tracking-wide">Responsable del contrato</span>
                                        <div className="mt-2 text-sm text-gray-700 space-y-1.5">
                                            <p><strong>{selectedQuote.solicitante_nombre}</strong> ({selectedQuote.solicitante_tipo_documento}: {selectedQuote.solicitante_numero_documento})</p>
                                            <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-purple-400" /> {selectedQuote.solicitante_telefono}</p>
                                            <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-purple-400" /> {selectedQuote.solicitante_correo}</p>
                                            {selectedQuote.solicitante_correo_alternativo && <p className="text-gray-500 pl-5.5 text-xs">Alt: {selectedQuote.solicitante_correo_alternativo}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Bloque 3: Asset Solicitado (Espacio) */}
                            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Briefcase className="w-4 h-4 text-purple-600" /> Espacio Pre-asignado
                                </h3>

                                <div className="flex items-center gap-3 mb-4">
                                    <div className="bg-purple-100 text-purple-700 p-3 rounded-lg"><Building className="w-6 h-6" /></div>
                                    <div>
                                        <p className="font-bold text-gray-900 text-[15px]">{selectedQuote.espacio?.nombre || 'General'}</p>
                                        <p className="text-xs font-semibold text-gray-500 uppercase">{selectedQuote.espacio?.tipo_espacio} • Piso {selectedQuote.espacio?.piso}</p>
                                    </div>
                                </div>

                                {selectedQuote.espacio?.descripcion && (
                                    <div className="bg-gray-50/50 rounded-lg p-3 border border-gray-200/60">
                                        <div
                                            className="text-[13px] text-gray-700 prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-ul:pl-4 prose-li:list-disc prose-strong:text-purple-900"
                                            dangerouslySetInnerHTML={{ __html: selectedQuote.espacio.descripcion }}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Optional: Tracking History Panel */}
                            {selectedQuote.observacion_estado && (
                                <div className="bg-blue-50/50 rounded-xl p-5 border border-blue-100">
                                    <h3 className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Info className="w-4 h-4" /> Histórico de Staff Backend</h3>
                                    <p className="text-sm italic text-gray-700 border-l-2 border-blue-400 pl-3">"{selectedQuote.observacion_estado}"</p>
                                    <p className="text-[11px] font-medium text-gray-500 mt-2 text-right">Por Gestor. ID: {selectedQuote.estado_changed_by?.substring(0, 8)}...</p>
                                </div>
                            )}

                        </div>

                        {/* Zona de Acciones Fixed (Footer del Panel) */}
                        <div className="bg-white border-t border-gray-200 p-6 sticky bottom-0 z-10 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
                            <form onSubmit={handleActionSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-800 mb-1.5">Determinar Nuevo Estado</label>
                                    <select
                                        required
                                        value={actionData.estado}
                                        onChange={(e) => setActionData({ ...actionData, estado: e.target.value })}
                                        className="w-full border-2 border-purple-100 rounded-xl px-4 py-3 focus:ring-4 focus:ring-purple-50 focus:border-purple-400 outline-none transition-all text-gray-800 font-bold bg-gray-50/50 hover:bg-white"
                                    >
                                        <option value="nueva">Nueva 🟢</option>
                                        <option value="en curso">En Curso 🟡</option>
                                        <option value="en espera">En Espera 🟠</option>
                                        <option value="no aprobada" className="text-red-700">No Aprobada (Rechazar) 🔴</option>
                                        <option value="aprobada" className="text-green-700">Aprobada (Liquidar/Reservar) ✅</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[13px] font-bold text-gray-600 mb-1.5">Anotación Oficial (Interna/Externa)</label>
                                    <textarea
                                        rows="2"
                                        value={actionData.observacion}
                                        onChange={(e) => setActionData({ ...actionData, observacion: e.target.value })}
                                        placeholder="Escriba condiciones, justificaciones de rechazo o estatus del contrato..."
                                        className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:border-purple-500 outline-none text-gray-800 resize-none"
                                    />
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                    <div className="flex items-center gap-3">
                                        <div
                                            onClick={() => setActionData({ ...actionData, notificar: !actionData.notificar })}
                                            className={`relative inline-flex h-6 w-[42px] items-center rounded-full cursor-pointer transition-colors border-2 border-transparent focus:outline-none ${actionData.notificar ? 'bg-purple-600' : 'bg-gray-300'}`}
                                        >
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${actionData.notificar ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
                                        </div>
                                        <span className="text-sm font-bold text-gray-700 cursor-pointer select-none" onClick={() => setActionData({ ...actionData, notificar: !actionData.notificar })}>
                                            Notificar por E-Mail
                                        </span>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-gray-900 hover:bg-purple-700 transition-all flex items-center justify-center min-w-[140px] shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                                    >
                                        {isSaving ? <span className="animate-pulse">Autenticando...</span> : 'Guardar Cierre'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </>
                )}
            </div>

        </div>
    );
};

export default AdminExternalQuotesView;
