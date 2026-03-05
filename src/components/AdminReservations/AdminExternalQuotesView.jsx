import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { Search, Filter, CheckCircle, XCircle, Clock, Building, User, Mail, Calendar as CalendarIcon, FileText, Briefcase, ChevronDown, ChevronUp, AlertCircle, Phone, Info } from 'lucide-react';
import { getExternalQuotes, updateExternalQuoteState } from '../../Services/adminReservasService';
import { format, parseISO } from 'date-fns';
import es from 'date-fns/locale/es';
import { showConfirmation, showSuccessToast, showErrorToast } from '../UtilComponents/Confirmation';

const AdminExternalQuotesView = () => {
    // ---- ESTADOS GLOBALES ----
    const [filters, setFilters] = useState({
        id: "",
        id_usuario: "",
        espacio_id: "",
        palabra: "",
        email: "",
        fecha: "",
        horaInicio: "",
        horaFin: "",
        tipo: "",
        piso: "",
        estado: "",
        fecha_creacion: ""
    });

    const [quotes, setQuotes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [expandedQuotes, setExpandedQuotes] = useState({});

    // ---- ESTADOS DEL MODAL ----
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedQuote, setSelectedQuote] = useState(null);
    const [modalData, setModalData] = useState({
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
            // Si el data devuelto es directamente el array o viene wrappeado.
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

    const toggleExpand = (id) => {
        setExpandedQuotes(prev => ({ ...prev, [id]: !prev[id] }));
    };

    // ---- LÓGICA DEL MODAL ----
    const openManageModal = (quote) => {
        setSelectedQuote(quote);
        setModalData({
            estado: quote.estado?.toLowerCase() || 'nueva',
            observacion: '', // Observación limpia por defecto
            notificar: false // No notificar por defecto para evitar spam inyectable accidental
        });
        setIsModalOpen(true);
    };

    const closeManageModal = () => {
        setIsModalOpen(false);
        setSelectedQuote(null);
    };

    const handleModalSubmit = async (e) => {
        e.preventDefault();
        if (!selectedQuote) return;

        setIsSaving(true);
        try {
            await updateExternalQuoteState(selectedQuote.id, {
                estado: modalData.estado,
                observacion: modalData.observacion,
                notificar: modalData.notificar
            });
            showSuccessToast(`Solicitud actualizada a "${modalData.estado}"`);
            closeManageModal();
            fetchQuotes(); // Recargar grilla
        } catch (error) {
            showErrorToast("No se pudo actualizar la solicitud");
        } finally {
            setIsSaving(false);
        }
    };

    // ---- HELPERS DE INTERFAZ ----
    const getStatusBadge = (estado) => {
        switch (estado?.toLowerCase()) {
            case 'nueva':
                return <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">Nueva</span>;
            case 'en curso':
                return <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700 border border-purple-200 flex items-center gap-1"><Clock className="w-3 h-3" /> En curso</span>;
            case 'en espera':
                return <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700 border border-yellow-200 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> En espera</span>;
            case 'aprobada':
                return <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Aprobada</span>;
            case 'no aprobada':
                return <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200 flex items-center gap-1"><XCircle className="w-3 h-3" /> No Aprobada</span>;
            default:
                return <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700 border border-gray-200">{estado || 'Desconocido'}</span>;
        }
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return 'No definida';
        try {
            return format(parseISO(dateString), "dd MMM yyyy, h:mm a", { locale: es });
        } catch {
            return dateString;
        }
    };

    const formatDateObj = (dateString) => {
        if (!dateString) return 'No definida';
        try {
            return format(parseISO(dateString), "dd MMM yyyy", { locale: es });
        } catch {
            return dateString;
        }
    };

    return (
        <div className="flex flex-col gap-6 animate-fade-in relative">
            <Toaster />

            {/* Cabecera y Filtros rápidos */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <Briefcase className="w-6 h-6 text-purple-600" />
                            Bandeja de Solicitudes Externas
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">Gestiona las solicitudes de eventos y cotizaciones de clientes externos y corporativos.</p>
                    </div>
                </div>

                {/* Grid Filtros */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            name="palabra"
                            placeholder="Buscar Solicitante, Empresa o ID..."
                            value={filters.palabra}
                            onChange={handleFilterChange}
                            className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm transition-all bg-gray-50 hover:bg-white"
                        />
                    </div>

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="email"
                            name="email"
                            placeholder="Buscar por correo solicitante..."
                            value={filters.email}
                            onChange={handleFilterChange}
                            className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm transition-all bg-gray-50 hover:bg-white"
                        />
                    </div>

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Filter className="h-4 w-4 text-gray-400" />
                        </div>
                        <select
                            name="estado"
                            value={filters.estado}
                            onChange={handleFilterChange}
                            className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm transition-all bg-gray-50 hover:bg-white appearance-none"
                        >
                            <option value="">Todos los Estados</option>
                            <option value="nueva">Nueva</option>
                            <option value="en curso">En Curso</option>
                            <option value="en espera">En Espera</option>
                            <option value="aprobada">Aprobada</option>
                            <option value="no aprobada">No Aprobada</option>
                        </select>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <CalendarIcon className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="date"
                            name="fecha"
                            value={filters.fecha}
                            onChange={handleFilterChange}
                            className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm transition-all bg-gray-50 hover:bg-white"
                        />
                    </div>
                </div>
            </div>

            {/* Listado de Solicitudes */}
            <div className="space-y-4">
                {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                        <span className="ml-3 text-purple-600 font-medium">Cargando solicitudes V2...</span>
                    </div>
                ) : quotes.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
                        <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex justify-center items-center mb-4">
                            <FileText className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-1">No hay solicitudes</h3>
                        <p className="text-gray-500">No se encontraron solicitudes externas con los criterios asignados.</p>
                        {(filters.palabra || filters.email || filters.estado || filters.fecha) && (
                            <button
                                onClick={() => setFilters({ id: "", id_usuario: "", espacio_id: "", palabra: "", email: "", fecha: "", horaInicio: "", horaFin: "", tipo: "", piso: "", estado: "", fecha_creacion: "" })}
                                className="mt-4 px-4 py-2 text-sm text-purple-600 font-semibold hover:bg-purple-50 rounded-lg transition-colors"
                            >
                                Limpiar Filtros
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {quotes.map(quote => (
                            <div key={quote.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">

                                {/* 1. VISTA PRINCIPAL (Resumen) */}
                                <div className="p-5 border-b border-gray-100 bg-gray-50/50 relative">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-gray-400 bg-white border border-gray-200 px-2 py-1 rounded shadow-sm">#{quote.id}</span>
                                            {getStatusBadge(quote.estado)}
                                        </div>
                                        <div className="text-right">
                                            <span className="block text-[10px] text-gray-500 uppercase tracking-wide">Radicada</span>
                                            <span className="text-xs font-semibold text-gray-700">{formatDateTime(quote.created_at)}</span>
                                        </div>
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-900 leading-tight">{quote.evento_tipo || 'Evento sin clasificar'}</h3>

                                    <div className="flex items-center gap-1.5 mt-2 text-gray-600 text-sm">
                                        <User className="w-4 h-4 text-gray-400" />
                                        <span>Solicita: <strong className="text-gray-800 tracking-tight">{quote.solicitante_nombre}</strong></span>
                                    </div>
                                    <div className="flex items-center gap-1.5 mt-1 text-purple-700 text-sm font-semibold">
                                        <Building className="w-4 h-4" />
                                        <span>{quote.espacio?.nombre || 'Espacio no especificado'} {quote.espacio?.piso ? `(Piso ${quote.espacio.piso})` : ''}</span>
                                    </div>
                                </div>

                                {/* Fechas Resumen */}
                                <div className="px-5 pt-5 pb-3 flex-grow">
                                    <div className="bg-purple-50/60 rounded-xl p-3 border border-purple-100 flex flex-col gap-2">
                                        <div className="flex items-center gap-2 text-sm text-gray-800">
                                            <CalendarIcon className="w-4 h-4 text-purple-600" />
                                            <span><strong>Para el:</strong> {formatDateObj(quote.fecha_reserva)}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-800">
                                            <Clock className="w-4 h-4 text-purple-600" />
                                            <span><strong>Horario:</strong> {quote.hora_inicio} - {quote.hora_fin} / {quote.tiempo_montaje ? `${quote.tiempo_montaje}h montaje` : ''}</span>
                                        </div>
                                    </div>

                                    {/* Botón Ver Más */}
                                    <button
                                        onClick={() => toggleExpand(quote.id)}
                                        className="w-full flex items-center justify-center gap-1.5 py-2 mt-4 text-sm font-semibold text-gray-500 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors border border-dashed border-gray-200"
                                    >
                                        {expandedQuotes[quote.id] ? (
                                            <><ChevronUp className="w-4 h-4" /> Ocultar especificaciones</>
                                        ) : (
                                            <><ChevronDown className="w-4 h-4" /> Ver especificaciones ({quote.empresa_nombre})</>
                                        )}
                                    </button>

                                    {/* 2. VISTA EXPANDIDA (Acordeón Detalles) */}
                                    {expandedQuotes[quote.id] && (
                                        <div className="pt-4 mt-2 border-t border-gray-100 space-y-5 animate-fade-in">

                                            {/* Empresa y Facturación */}
                                            <div>
                                                <h4 className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                                    <Building className="w-3.5 h-3.5" /> Datos de Empresa (Facturación)
                                                </h4>
                                                <div className="text-sm space-y-1.5 bg-gray-50 border border-gray-100 p-3 rounded-lg text-gray-700">
                                                    <p><strong>Razón Social:</strong> {quote.empresa_nombre}</p>
                                                    <p><strong>{quote.empresa_tipo_documento || 'NIT'}:</strong> {quote.empresa_numero_documento}-{quote.empresa_digito_verificacion}</p>
                                                    <p className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> <strong>Tel:</strong> {quote.empresa_telefono}</p>
                                                    <p><strong>Dirección:</strong> {quote.empresa_direccion}</p>
                                                </div>
                                            </div>

                                            {/* Detalles Contacto (Solicitante directo) */}
                                            <div>
                                                <h4 className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                                    <User className="w-3.5 h-3.5" /> Contacto Directo Solicitante
                                                </h4>
                                                <div className="text-sm space-y-1.5 bg-gray-50 border border-gray-100 p-3 rounded-lg text-gray-700">
                                                    <p><strong>{quote.solicitante_tipo_documento}:</strong> {quote.solicitante_numero_documento}</p>
                                                    <p className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> <strong>Tel:</strong> {quote.solicitante_telefono}</p>
                                                    <p className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> <strong>Mail:</strong> {quote.solicitante_correo}</p>
                                                    {quote.solicitante_correo_alternativo && <p className="text-xs text-gray-500 ml-4">({quote.solicitante_correo_alternativo})</p>}
                                                </div>
                                            </div>

                                            {/* Detalles Extra Evento */}
                                            {(quote.evento_detalles || quote.cantidad_personas) && (
                                                <div>
                                                    <h4 className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                                        <Info className="w-3.5 h-3.5" /> Detalles del Evento
                                                    </h4>
                                                    <div className="text-sm bg-gray-50 border border-gray-100 p-3 rounded-lg text-gray-700">
                                                        {quote.cantidad_personas && <p className="mb-1"><strong>Pax Est.:</strong> {quote.cantidad_personas} Asistentes</p>}
                                                        {quote.evento_detalles && <p className="italic text-gray-600">"{quote.evento_detalles}"</p>}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Detalles Espacio HTML */}
                                            {quote.espacio?.descripcion && (
                                                <div>
                                                    <h4 className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                                        Especificaciones de la Sala Pedida
                                                    </h4>
                                                    <div className="bg-purple-50/30 rounded-lg p-3 border border-purple-100">
                                                        <div
                                                            className="text-sm text-gray-600 prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-ul:pl-4 prose-li:list-disc prose-strong:text-purple-900"
                                                            dangerouslySetInnerHTML={{ __html: quote.espacio.descripcion }}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* 3. AUDITORÍA Y ACCIONES */}
                                <div className="border-t border-gray-100 bg-gray-50">
                                    {/* Tracking Layer */}
                                    {quote.observacion_estado && (
                                        <div className="px-5 py-3 border-b border-gray-100 bg-white/50 space-y-1">
                                            <p className="text-xs font-semibold text-gray-500 uppercase">Observación Backend/Admin:</p>
                                            <p className="text-sm italic text-gray-700 bg-gray-100 p-2 rounded">{quote.observacion_estado}</p>
                                            <p className="text-[10px] text-gray-400 text-right mt-1">Act. el {formatDateTime(quote.estado_changed_at)}</p>
                                        </div>
                                    )}

                                    {/* Botón Maestro de Gestión */}
                                    <div className="p-4">
                                        <button
                                            onClick={() => openManageModal(quote)}
                                            className="w-full py-2.5 px-4 rounded-xl text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 transform active:scale-[0.98]"
                                        >
                                            Gestionar Solicitud
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ==== MODAL DE GESTIÓN ==== */}
            {isModalOpen && selectedQuote && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all">
                        {/* Cabecera Modal */}
                        <div className="bg-purple-600 px-6 py-4 flex justify-between items-center">
                            <h3 className="text-white font-bold text-lg">
                                Gestionar Solicitud #{selectedQuote.id}
                            </h3>
                            <button
                                onClick={closeManageModal}
                                className="text-purple-200 hover:text-white transition-colors"
                            >
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleModalSubmit} className="p-6 space-y-5">
                            {/* Resumen Afectado */}
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                <p className="text-sm text-gray-600 font-medium">{selectedQuote.evento_tipo}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{selectedQuote.solicitante_nombre} • {selectedQuote.empresa_nombre}</p>
                            </div>

                            {/* Select del Nuevo Estado */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Nuevo Estado <span className="text-red-500">*</span></label>
                                <select
                                    required
                                    value={modalData.estado}
                                    onChange={(e) => setModalData({ ...modalData, estado: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-purple-500 outline-none transition-shadow text-gray-800 font-medium bg-white"
                                >
                                    <option value="nueva">Nueva</option>
                                    <option value="en curso">En Curso</option>
                                    <option value="en espera">En Espera</option>
                                    <option value="aprobada" className="text-green-600 font-bold">Aprobada</option>
                                    <option value="no aprobada" className="text-red-600 font-bold">No Aprobada</option>
                                </select>
                                {modalData.estado === 'aprobada' && (
                                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                                        <Info className="w-3 h-3" /> Al aprobar, se creará la reserva y ocupará el espacio de inmediato.
                                    </p>
                                )}
                            </div>

                            {/* Textarea Observación */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Observación (Opcional)</label>
                                <textarea
                                    rows="3"
                                    value={modalData.observacion}
                                    onChange={(e) => setModalData({ ...modalData, observacion: e.target.value })}
                                    placeholder="Agrega un motivo para rechazo, espera o un comentario de auditoría interno..."
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none text-sm text-gray-800"
                                />
                            </div>

                            {/* Toggle Notificar */}
                            <div className="flex items-center gap-3 pt-2">
                                <div
                                    onClick={() => setModalData({ ...modalData, notificar: !modalData.notificar })}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer transition-colors ${modalData.notificar ? 'bg-purple-600' : 'bg-gray-300'}`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${modalData.notificar ? 'translate-x-6' : 'translate-x-1'}`}
                                    />
                                </div>
                                <div>
                                    <span className="text-sm font-bold text-gray-800 cursor-pointer select-none" onClick={() => setModalData({ ...modalData, notificar: !modalData.notificar })}>
                                        Notificar al solicitante
                                    </span>
                                    <p className="text-xs text-gray-500">Enviar un correo electrónico a {selectedQuote.solicitante_correo} con la actualización.</p>
                                </div>
                            </div>

                            {/* Acciones */}
                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    disabled={isSaving}
                                    onClick={closeManageModal}
                                    className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="px-5 py-2 rounded-lg text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 transition-all flex items-center gap-2"
                                >
                                    {isSaving ? (
                                        <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> Procesando...</>
                                    ) : (
                                        'Guardar y Aplicar Cambios'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminExternalQuotesView;
