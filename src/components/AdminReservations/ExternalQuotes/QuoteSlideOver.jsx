import React from 'react';
import { Clock, Building, Mail, Calendar as CalendarIcon, Briefcase, Phone, X, FileSignature } from 'lucide-react';
import { formatDateObj, formatDateTime, getStatusBadge } from './utils';
import TimelineTracker from './TimelineTracker';

const QuoteSlideOver = ({
    isSlideOverOpen,
    selectedQuote,
    closeSlideOver,
    actionData,
    setActionData,
    handleActionSubmit,
    isSaving,
    newComment,
    setNewComment,
    isAddingComment,
    handleCommentSubmit
}) => {
    return (
        <>
            {/* Backdrop Negro Desenfoque */}
            {isSlideOverOpen && (
                <div
                    className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40 transition-opacity animate-fade-in"
                    onClick={closeSlideOver}
                ></div>
            )}

            {/* El Panel Deslizante */}
            <div
                className={`fixed top-0 right-0 h-full w-full max-w-2xl bg-gray-50 z-50 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isSlideOverOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {selectedQuote && (
                    <>
                        {/* Cabecera del Panel */}
                        <div className="bg-white px-6 py-5 border-b border-gray-200 flex items-center justify-between sticky top-0 z-10">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                                    Solicitud #{selectedQuote.id}
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

                            {/* Bloque 4: Seguimiento y Comentarios (Línea de tiempo) */}
                            <TimelineTracker
                                selectedQuote={selectedQuote}
                                newComment={newComment}
                                setNewComment={setNewComment}
                                isAddingComment={isAddingComment}
                                handleCommentSubmit={handleCommentSubmit}
                            />
                        </div>

                        {/* Zona de Acciones Fixed (Footer del Panel) */}
                        <div className="bg-white border-t border-gray-200 p-6 sticky bottom-0 z-10 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
                            {selectedQuote?.estado?.toLowerCase() === 'aprobada' ? (
                                <div className="bg-green-50 rounded-xl border border-green-200 p-4">
                                    <h4 className="text-sm font-bold text-green-800 flex items-center gap-2 mb-1">
                                        Solicitud Aprobada y Confirmada
                                    </h4>
                                    <p className="text-sm text-green-700 leading-relaxed">
                                        Esta solicitud ya fue aprobada y generó una reserva de forma exitosa. 
                                        Para realizar modificaciones adicionales o cancelarla, debes gestionar la reserva directamente desde el calendario principal de operaciones.
                                    </p>
                                </div>
                            ) : (
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



                                    <div className="flex items-center justify-between pt-2">
                                        <div className="flex items-center gap-3">
                                            <div
                                                onClick={() => setActionData({ ...actionData, notificar: !actionData.notificar })}
                                                className={`relative inline-flex h-6 w-[42px] items-center rounded-full cursor-pointer transition-colors border-2 border-transparent focus:outline-none ${actionData.notificar ? 'bg-purple-600' : 'bg-gray-300'}`}
                                            >
                                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${actionData.notificar ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
                                            </div>
                                            <span className="text-sm font-bold text-gray-700 cursor-pointer select-none" onClick={() => setActionData({ ...actionData, notificar: !actionData.notificar })}>
                                                Notificar por email
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
                            )}
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default QuoteSlideOver;
