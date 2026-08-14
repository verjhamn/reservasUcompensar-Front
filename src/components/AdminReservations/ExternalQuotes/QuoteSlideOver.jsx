/* eslint-disable react/prop-types */
import {
    Clock,
    Building,
    Mail,
    Calendar as CalendarIcon,
    Briefcase,
    Phone,
    X,
    FileSignature,
    AlertCircle,
    AlertTriangle,
    RefreshCw
} from 'lucide-react';
import {
    formatDateObj,
    formatDateTime,
    getStatusBadge,
    getOriginBadge,
    formatSetupTime,
    isTruthyFlag
} from './utils';
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
    const eventName =
        selectedQuote?.evento_nombre ||
        selectedQuote?.evento?.nombre ||
        selectedQuote?.evento_tipo ||
        'Solicitud sin nombre';
    const endDate = selectedQuote?.fecha_fin || selectedQuote?.fecha_fin_reserva;
    const companyIsCompensar = [
        selectedQuote?.empresa_compensar_interno,
        selectedQuote?.compensar_interno,
        selectedQuote?.empresa?.compensar_interno
    ].some(isTruthyFlag);
    const companyName = companyIsCompensar
        ? 'Compensar'
        : (selectedQuote?.empresa_nombre || selectedQuote?.solicitante_nombre);
    const compensarId = selectedQuote?.empresa_compensar_id || selectedQuote?.compensar_id;
    const compensarCostCenter =
        selectedQuote?.empresa_compensar_id_cc ||
        selectedQuote?.compensar_id_cc ||
        selectedQuote?.centro_costo;
    const setupTime = formatSetupTime(selectedQuote?.tiempo_montaje);
    const requesterDocument = [
        selectedQuote?.solicitante_tipo_documento,
        selectedQuote?.solicitante_numero_documento
    ].filter(Boolean).join(': ');
    const companyDocument = [
        selectedQuote?.empresa_tipo_documento || 'ID',
        [
            selectedQuote?.empresa_numero_documento,
            selectedQuote?.empresa_digito_verificacion
        ].filter(Boolean).join('-')
    ].filter(Boolean).join(': ');

    return (
        <>
            {isSlideOverOpen && (
                <div
                    className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40 transition-opacity animate-fade-in"
                    onClick={closeSlideOver}
                ></div>
            )}

            <div
                className={`fixed top-0 right-0 h-full w-full max-w-2xl bg-gray-50 z-50 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isSlideOverOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {selectedQuote && (
                    <>
                        <div className="bg-white px-6 py-5 border-b border-gray-200 flex items-center justify-between sticky top-0 z-10">
                            <div>
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                    <h2 className="text-xl font-bold text-gray-900">
                                        Solicitud #{selectedQuote.id}
                                    </h2>
                                    {getStatusBadge(selectedQuote.estado)}
                                    {getOriginBadge(selectedQuote.origen)}
                                </div>
                                <p className="text-sm text-gray-500">
                                    Radicada el {formatDateTime(selectedQuote.created_at)}
                                </p>
                                {selectedQuote.updated_at && selectedQuote.updated_at !== selectedQuote.created_at && (
                                    <p className="text-xs text-gray-400">
                                        Última actualización: {formatDateTime(selectedQuote.updated_at)}
                                    </p>
                                )}
                                {selectedQuote.reserva_id && (
                                    <p className="text-xs font-semibold text-emerald-700 mt-1">
                                        Reserva generada #{selectedQuote.reserva_id}
                                        {selectedQuote.reserva_estado ? ` · ${selectedQuote.reserva_estado}` : ''}
                                    </p>
                                )}
                            </div>
                            <button
                                onClick={closeSlideOver}
                                className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-grow overflow-y-auto p-6 space-y-6">
                            {selectedQuote.observacion_estado && (
                                <div className={`rounded-xl p-4 border text-sm font-medium flex items-start gap-2 ${
                                    selectedQuote.estado?.toLowerCase() === 'no aprobada'
                                        ? 'bg-red-50 border-red-200 text-red-800'
                                        : selectedQuote.estado?.toLowerCase() === 'en espera'
                                            ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
                                            : 'bg-gray-50 border-gray-200 text-gray-700'
                                }`}>
                                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                                    <span><strong>Observación del estado actual:</strong> {selectedQuote.observacion_estado}</span>
                                </div>
                            )}

                            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <FileSignature className="w-4 h-4 text-purple-600" />
                                    Concepto de la Solicitud
                                </h3>

                                <p className="text-lg font-bold text-gray-800 mb-1">
                                    {eventName}
                                </p>
                                {selectedQuote.evento_tipo && (
                                    <p className="text-sm font-semibold text-purple-700 mb-1">
                                        {selectedQuote.evento_tipo}
                                    </p>
                                )}
                                {selectedQuote.contexto_categoria && (
                                    <p className="text-xs text-gray-400 mb-4">
                                        Categoría: {selectedQuote.contexto_categoria}
                                    </p>
                                )}

                                <div className="grid grid-cols-2 gap-y-4">
                                    <div>
                                        <p className="text-xs text-gray-500">Fecha de inicio</p>
                                        <p className="font-semibold text-gray-800 flex items-center gap-1.5">
                                            <CalendarIcon className="w-3.5 h-3.5" />
                                            {formatDateObj(selectedQuote.fecha_reserva)}
                                        </p>
                                    </div>
                                    {endDate && (
                                        <div>
                                            <p className="text-xs text-gray-500">Fecha de fin</p>
                                            <p className="font-semibold text-gray-800 flex items-center gap-1.5">
                                                <CalendarIcon className="w-3.5 h-3.5" />
                                                {formatDateObj(endDate)}
                                            </p>
                                        </div>
                                    )}
                                    {(selectedQuote.hora_inicio || selectedQuote.hora_fin) && (
                                        <div>
                                            <p className="text-xs text-gray-500">Horario oficial</p>
                                            <p className="font-semibold text-gray-800 flex items-center gap-1.5">
                                                <Clock className="w-3.5 h-3.5" />
                                                {selectedQuote.hora_inicio || 'Sin hora de inicio'} a {selectedQuote.hora_fin || 'Sin hora de fin'}
                                            </p>
                                        </div>
                                    )}

                                    {selectedQuote.cantidad_personas && (
                                        <div>
                                            <p className="text-xs text-gray-500">Aforo esperado</p>
                                            <p className="font-medium text-gray-800">
                                                {selectedQuote.cantidad_personas} personas
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {selectedQuote.evento_detalles && (
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <p className="text-xs text-gray-500 mb-1">Detalles declarados:</p>
                                        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded italic">
                                            {selectedQuote.evento_detalles}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {selectedQuote.tiene_reubicacion && (
                                <div className="bg-amber-50 rounded-xl p-5 border border-amber-200 shadow-sm">
                                    <h3 className="text-sm font-bold text-amber-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                                        <RefreshCw className="w-4 h-4" />
                                        Solicitud Reubicada
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-xs text-amber-700 font-semibold mb-1">Solicitado originalmente</p>
                                            <p className="text-gray-800 font-medium flex items-center gap-1.5">
                                                <CalendarIcon className="w-3.5 h-3.5" />
                                                {formatDateObj(selectedQuote.fecha_reserva_original)}
                                                {selectedQuote.fecha_fin_original && selectedQuote.fecha_fin_original !== selectedQuote.fecha_reserva_original
                                                    ? ` - ${formatDateObj(selectedQuote.fecha_fin_original)}`
                                                    : ''}
                                            </p>
                                            <p className="text-gray-600 flex items-center gap-1.5 mt-1">
                                                <Clock className="w-3.5 h-3.5" />
                                                {selectedQuote.hora_inicio_original || '—'} a {selectedQuote.hora_fin_original || '—'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-amber-700 font-semibold mb-1">Agenda definitiva</p>
                                            <p className="text-gray-900 font-bold flex items-center gap-1.5">
                                                <CalendarIcon className="w-3.5 h-3.5" />
                                                {formatDateObj(selectedQuote.fecha_reserva)}
                                                {endDate ? ` - ${formatDateObj(endDate)}` : ''}
                                            </p>
                                            <p className="text-gray-800 font-semibold flex items-center gap-1.5 mt-1">
                                                <Clock className="w-3.5 h-3.5" />
                                                {selectedQuote.hora_inicio || '—'} a {selectedQuote.hora_fin || '—'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Building className="w-4 h-4 text-purple-600" />
                                    Entidad y Solicitante
                                </h3>

                                <div className="space-y-4">
                                    <div>
                                        <p className="font-bold text-gray-800 text-base">
                                            {companyName || 'Sin entidad registrada'}
                                        </p>
                                        <p className="text-xs font-bold text-purple-700 uppercase tracking-wide mt-1">
                                            {selectedQuote.origen === 'interna'
                                                ? 'Solicitud interna'
                                                : companyIsCompensar
                                                    ? 'Empresa asistente Compensar'
                                                    : 'Empresa externa'}
                                        </p>

                                        {!companyIsCompensar && companyDocument !== 'ID' && (
                                            <p className="text-sm text-gray-600 mt-1">
                                                {companyDocument}
                                            </p>
                                        )}

                                        {!companyIsCompensar && (selectedQuote.empresa_telefono || selectedQuote.empresa_direccion) && (
                                            <p className="text-sm text-gray-600 flex items-center gap-1.5 mt-1">
                                                <Phone className="w-3.5 h-3.5 text-gray-400" />
                                                {[selectedQuote.empresa_telefono, selectedQuote.empresa_direccion]
                                                    .filter(Boolean)
                                                    .join(' - ')}
                                            </p>
                                        )}

                                        {(compensarId || compensarCostCenter) && (
                                            <p className="text-sm text-gray-600 mt-1">
                                                ID Compensar: {compensarId || 'No definido'}
                                                {compensarCostCenter ? ` - CC: ${compensarCostCenter}` : ''}
                                            </p>
                                        )}
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                        <span className="text-xs font-bold text-purple-700 uppercase tracking-wide">
                                            Responsable de la solicitud
                                        </span>
                                        <div className="mt-2 text-sm text-gray-700 space-y-1.5">
                                            <p>
                                                <strong>{selectedQuote.solicitante_nombre || 'Sin nombre registrado'}</strong>
                                                {selectedQuote.solicitante_cargo ? ` — ${selectedQuote.solicitante_cargo}` : ''}
                                                {requesterDocument ? ` (${requesterDocument})` : ''}
                                            </p>
                                            {selectedQuote.solicitante_telefono && (
                                                <p className="flex items-center gap-2">
                                                    <Phone className="w-3.5 h-3.5 text-purple-400" />
                                                    {selectedQuote.solicitante_telefono}
                                                </p>
                                            )}
                                            {selectedQuote.solicitante_correo && (
                                                <p className="flex items-center gap-2">
                                                    <Mail className="w-3.5 h-3.5 text-purple-400" />
                                                    {selectedQuote.solicitante_correo}
                                                </p>
                                            )}
                                            {selectedQuote.solicitante_correo_alternativo && (
                                                <p className="text-gray-500 pl-5 text-xs">
                                                    Alt: {selectedQuote.solicitante_correo_alternativo}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Briefcase className="w-4 h-4 text-purple-600" />
                                    Espacio Relacionado
                                </h3>

                                <div className="flex items-center gap-3 mb-4">
                                    <div className="bg-purple-100 text-purple-700 p-3 rounded-lg">
                                        <Building className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 text-[15px]">
                                            {selectedQuote.espacio?.nombre || 'General'}
                                            {selectedQuote.espacio?.codigo && selectedQuote.espacio.codigo !== selectedQuote.espacio?.nombre
                                                ? ` (${selectedQuote.espacio.codigo})`
                                                : ''}
                                        </p>
                                        <p className="text-xs font-semibold text-gray-500 uppercase">
                                            {selectedQuote.espacio?.tipo_espacio || 'Tipo no definido'}
                                            {selectedQuote.espacio?.piso ? ` - Piso ${selectedQuote.espacio.piso}` : ''}
                                        </p>
                                        {(selectedQuote.sede_nombre || selectedQuote.espacio?.sede_nombre) && (
                                            <p className="text-xs font-semibold text-purple-600 uppercase mt-0.5">
                                                {selectedQuote.sede_nombre || selectedQuote.espacio?.sede_nombre}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {selectedQuote.espacio?.reservable && !isTruthyFlag(selectedQuote.espacio.reservable) && (
                                    <div className="mb-3 flex items-center gap-2 text-xs font-bold text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                                        Este espacio está marcado como no reservable actualmente.
                                    </div>
                                )}

                                {Number(selectedQuote.espacio?.cantidad_equipos) > 0 && (
                                    <p className="text-xs text-gray-600 mb-3">
                                        <strong>{selectedQuote.espacio.cantidad_equipos}</strong> equipo(s)
                                        {selectedQuote.espacio.tipo_equipos ? `: ${selectedQuote.espacio.tipo_equipos}` : ''}
                                    </p>
                                )}

                                {selectedQuote.espacio?.descripcion && (
                                    <div className="bg-gray-50/50 rounded-lg p-3 border border-gray-200/60">
                                        <div
                                            className="text-[13px] text-gray-700 prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-ul:pl-4 prose-li:list-disc prose-strong:text-purple-900"
                                            dangerouslySetInnerHTML={{ __html: selectedQuote.espacio.descripcion }}
                                        />
                                    </div>
                                )}

                                {selectedQuote.espacio?.observaciones && (
                                    <div className="mt-3 bg-purple-50/50 rounded-lg p-3 border border-purple-100 text-[13px] text-purple-800">
                                        <strong>Nota del espacio:</strong> {selectedQuote.espacio.observaciones}
                                    </div>
                                )}
                            </div>

                            <TimelineTracker
                                selectedQuote={selectedQuote}
                                newComment={newComment}
                                setNewComment={setNewComment}
                                isAddingComment={isAddingComment}
                                handleCommentSubmit={handleCommentSubmit}
                            />
                        </div>

                        <div className="bg-white border-t border-gray-200 p-6 sticky bottom-0 z-10 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
                            {selectedQuote?.estado?.toLowerCase() === 'aprobada' ? (
                                <div className="bg-green-50 rounded-xl border border-green-200 p-4">
                                    <h4 className="text-sm font-bold text-green-800 flex items-center gap-2 mb-1">
                                        Solicitud aprobada y confirmada
                                    </h4>
                                    <p className="text-sm text-green-700 leading-relaxed">
                                        Esta solicitud ya fue aprobada y genero una reserva de forma exitosa.
                                        Para realizar modificaciones adicionales o cancelarla, debes gestionar la
                                        reserva directamente desde el calendario principal de operaciones.
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handleActionSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-800 mb-1.5">
                                            Determinar nuevo estado
                                        </label>
                                        <select
                                            required
                                            value={actionData.estado}
                                            onChange={(event) => setActionData({
                                                ...actionData,
                                                estado: event.target.value
                                            })}
                                            className="w-full border-2 border-purple-100 rounded-xl px-4 py-3 focus:ring-4 focus:ring-purple-50 focus:border-purple-400 outline-none transition-all text-gray-800 font-bold bg-gray-50/50 hover:bg-white"
                                        >
                                            <option value="nueva">Nueva</option>
                                            <option value="en curso">En curso</option>
                                            <option value="en espera">En espera</option>
                                            <option value="no aprobada" className="text-red-700">
                                                No aprobada
                                            </option>
                                            <option value="aprobada" className="text-green-700">
                                                Aprobada
                                            </option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-800 mb-1.5">
                                            Observación {actionData.estado === 'no aprobada' ? '(motivo del rechazo)' : '(opcional)'}
                                        </label>
                                        <textarea
                                            value={actionData.observacion}
                                            onChange={(event) => setActionData({
                                                ...actionData,
                                                observacion: event.target.value
                                            })}
                                            placeholder="Ej. Se ajusta la agenda por disponibilidad del espacio."
                                            rows="2"
                                            className="w-full border-2 border-purple-100 rounded-xl px-4 py-2.5 focus:ring-4 focus:ring-purple-50 focus:border-purple-400 outline-none transition-all text-gray-800 text-sm bg-gray-50/50 hover:bg-white resize-none"
                                        />
                                    </div>

                                    <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-4">
                                        <div className="flex items-center justify-between gap-3">
                                            <div>
                                                <p className="text-sm font-bold text-amber-900">Reubicar fecha / hora</p>
                                                <p className="text-xs text-amber-700 mt-0.5">
                                                    Actívalo si no es posible atender la solicitud en la fecha u hora pedida.
                                                </p>
                                            </div>
                                            <div
                                                onClick={() => setActionData({
                                                    ...actionData,
                                                    reubicar: !actionData.reubicar
                                                })}
                                                className={`relative inline-flex h-6 w-[42px] items-center rounded-full cursor-pointer transition-colors border-2 border-transparent focus:outline-none shrink-0 ${actionData.reubicar ? 'bg-amber-500' : 'bg-gray-300'}`}
                                            >
                                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${actionData.reubicar ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
                                            </div>
                                        </div>

                                        {actionData.reubicar && (
                                            <div className="grid grid-cols-2 gap-3 mt-4 animate-fade-in">
                                                <div>
                                                    <label className="block text-xs font-semibold text-amber-800 mb-1">Fecha inicio</label>
                                                    <input
                                                        type="date"
                                                        value={actionData.reubicacion.fecha_reserva}
                                                        onChange={(event) => setActionData({
                                                            ...actionData,
                                                            reubicacion: { ...actionData.reubicacion, fecha_reserva: event.target.value }
                                                        })}
                                                        className="w-full border border-amber-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-400 bg-white"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-semibold text-amber-800 mb-1">Fecha fin</label>
                                                    <input
                                                        type="date"
                                                        value={actionData.reubicacion.fecha_fin}
                                                        onChange={(event) => setActionData({
                                                            ...actionData,
                                                            reubicacion: { ...actionData.reubicacion, fecha_fin: event.target.value }
                                                        })}
                                                        className="w-full border border-amber-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-400 bg-white"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-semibold text-amber-800 mb-1">Hora inicio</label>
                                                    <input
                                                        type="time"
                                                        value={actionData.reubicacion.hora_inicio}
                                                        onChange={(event) => setActionData({
                                                            ...actionData,
                                                            reubicacion: { ...actionData.reubicacion, hora_inicio: event.target.value }
                                                        })}
                                                        className="w-full border border-amber-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-400 bg-white"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-semibold text-amber-800 mb-1">Hora fin</label>
                                                    <input
                                                        type="time"
                                                        value={actionData.reubicacion.hora_fin}
                                                        onChange={(event) => setActionData({
                                                            ...actionData,
                                                            reubicacion: { ...actionData.reubicacion, hora_fin: event.target.value }
                                                        })}
                                                        className="w-full border border-amber-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-400 bg-white"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between pt-2">
                                        <div className="flex items-center gap-3">
                                            <div
                                                onClick={() => setActionData({
                                                    ...actionData,
                                                    notificar: !actionData.notificar
                                                })}
                                                className={`relative inline-flex h-6 w-[42px] items-center rounded-full cursor-pointer transition-colors border-2 border-transparent focus:outline-none ${actionData.notificar ? 'bg-purple-600' : 'bg-gray-300'}`}
                                            >
                                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${actionData.notificar ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
                                            </div>
                                            <span
                                                className="text-sm font-bold text-gray-700 cursor-pointer select-none"
                                                onClick={() => setActionData({
                                                    ...actionData,
                                                    notificar: !actionData.notificar
                                                })}
                                            >
                                                Notificar por email
                                            </span>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSaving}
                                            className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-gray-900 hover:bg-purple-700 transition-all flex items-center justify-center min-w-[140px] shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                                        >
                                            {isSaving ? (
                                                <span className="animate-pulse">Guardando...</span>
                                            ) : (
                                                'Guardar cierre'
                                            )}
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
