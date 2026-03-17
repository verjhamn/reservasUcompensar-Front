import React from 'react';
import { Info, FileText } from 'lucide-react';
import { formatDateTime } from './utils';

const TimelineTracker = ({
    selectedQuote,
    newComment,
    setNewComment,
    isAddingComment,
    handleCommentSubmit
}) => {
    return (
        <div className="bg-white rounded-xl p-5 border border-purple-100 shadow-sm mt-6">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Info className="w-4 h-4 text-purple-600" /> Seguimiento y Comentarios
            </h3>

            {/* Formulario de Nuevo Comentario */}
            <div className="mb-6 bg-purple-50/50 p-4 rounded-xl border border-purple-100">
                <form onSubmit={handleCommentSubmit} className="flex flex-col gap-3">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Escribe un nuevo comentario o actualización del proceso..."
                        className="w-full border border-purple-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none resize-none bg-white"
                        rows="2"
                    />
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isAddingComment || !newComment.trim()}
                            className="px-4 py-2 bg-purple-600 text-white text-sm font-bold rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isAddingComment ? (
                                <><div className="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full"></div> Guardando...</>
                            ) : (
                                'Agregar Seguimiento'
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Línea de Tiempo */}
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                {selectedQuote.linea_tiempo && selectedQuote.linea_tiempo.length > 0 ? (
                    [...selectedQuote.linea_tiempo]
                        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) // Orden descendente (más recientes primero)
                        .map((item, index) => (
                            <div key={item.id || index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                                {/* Marcador en la línea */}
                                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-purple-100 text-purple-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                                    <FileText className="w-4 h-4" />
                                </div>

                                {/* Tarjeta del comentario */}
                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex flex-col xl:flex-row xl:justify-between xl:items-center gap-1.5 mb-2">
                                        <div className="font-bold text-gray-800 text-sm leading-tight break-words">{item.actor_nombre || item.actor?.displayName || 'Sistema'}</div>
                                        <div className="text-[10px] font-semibold text-gray-400 bg-gray-50 px-2 py-1 rounded-full whitespace-nowrap shrink-0 self-start">
                                            {formatDateTime(item.created_at)}
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 leading-relaxed mt-2 whitespace-pre-wrap">{item.descripcion}</p>
                                </div>
                            </div>
                        ))
                ) : (
                    <div className="text-center py-6 text-sm text-gray-500 relative z-10 bg-white pr-4">
                        No hay comentarios ni historial de seguimiento aún.
                    </div>
                )}
            </div>
        </div>
    );
};

export default TimelineTracker;
