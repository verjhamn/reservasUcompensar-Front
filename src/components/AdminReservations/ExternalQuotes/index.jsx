import { useState, useEffect, useCallback } from 'react';
import { Toaster } from 'react-hot-toast';
import {
    getExternalQuotes,
    updateExternalQuoteState,
    addExternalQuoteComment
} from '../../../Services/adminReservasService';
import {
    showConfirmation,
    showSuccessToast,
    showErrorToast
} from '../../UtilComponents/Confirmation';

import QuotesFilterBar from './QuotesFilterBar';
import QuotesGrid from './QuotesGrid';
import QuoteSlideOver from './QuoteSlideOver';
import { normalizeRequest, formatPayloadDate, toDateInputValue } from './utils';
import { getApiErrorMessage } from '../../../utils/apiErrorHelper';

const normalizePagination = (metadata, itemCount) => ({
    current_page: Number(metadata?.current_page) || 1,
    last_page: Number(metadata?.last_page) || 1,
    total: Number(metadata?.total_records ?? metadata?.total) || itemCount
});

const ExternalQuotesIndex = () => {
    const [filters, setFilters] = useState({
        id: "",
        usuario_id: "",
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
        origen: "",
        sede_id: "",
        fecha_creacion: "",
        page: 1,
        per_page: 10
    });

    const [quotes, setQuotes] = useState([]);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        total: 0
    });
    const [isLoading, setIsLoading] = useState(false);

    const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
    const [selectedQuote, setSelectedQuote] = useState(null);
    const [actionData, setActionData] = useState({
        estado: 'nueva',
        observacion: '',
        notificar: false,
        reubicar: false,
        reubicacion: {
            fecha_reserva: '',
            fecha_fin: '',
            hora_inicio: '',
            hora_fin: ''
        }
    });
    const [isSaving, setIsSaving] = useState(false);

    const [newComment, setNewComment] = useState('');
    const [isAddingComment, setIsAddingComment] = useState(false);

    const fetchQuotes = useCallback(async () => {
        setIsLoading(true);

        try {
            const response = await getExternalQuotes(filters);
            // El servicio ya retorna el cuerpo de la respuesta. No se debe tomar
            // response.data porque eso elimina la metadata de `pagination`.
            const payload = response?.success !== undefined
                ? response
                : response?.data || response;
            let items = [];
            let pagMeta = { current_page: 1, last_page: 1, total: 0 };

            if (Array.isArray(payload?.data)) {
                items = payload.data;
                pagMeta = normalizePagination(
                    payload.pagination || payload,
                    items.length
                );
            } else if (Array.isArray(payload?.data?.data)) {
                items = payload.data.data;
                pagMeta = normalizePagination(
                    payload.data.pagination || payload.data,
                    items.length
                );
            } else if (Array.isArray(payload)) {
                items = payload;
                pagMeta.total = items.length;
            }

            setQuotes(items.map(normalizeRequest));
            setPagination(pagMeta);
        } catch (error) {
            console.error("Error cargando solicitudes:", error);
            showErrorToast("Ocurrio un error al cargar las solicitudes");
        } finally {
            setIsLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchQuotes();
        }, 500);

        return () => clearTimeout(timer);
    }, [fetchQuotes]);

    const handleFilterChange = (event) => {
        const { name, value } = event.target;
        setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
    };

    const openSlideOver = (quote) => {
        setSelectedQuote(quote);
        setActionData({
            estado: quote.estado?.toLowerCase() || 'nueva',
            observacion: '',
            notificar: false,
            reubicar: !!quote.tiene_reubicacion,
            reubicacion: {
                fecha_reserva: toDateInputValue(quote.fecha_reserva),
                fecha_fin: toDateInputValue(quote.fecha_fin || quote.fecha_reserva),
                hora_inicio: quote.hora_inicio || '',
                hora_fin: quote.hora_fin || ''
            }
        });
        setIsSlideOverOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeSlideOver = () => {
        setIsSlideOverOpen(false);
        setTimeout(() => setSelectedQuote(null), 300);
        document.body.style.overflow = 'unset';
    };

    const handleActionSubmit = async (event) => {
        event.preventDefault();
        if (!selectedQuote) return;

        if (actionData.estado === 'aprobada') {
            const confirmed = await showConfirmation(
                () => {},
                "Estas seguro de aprobar esta solicitud? Al hacerlo, se generara y confirmara automaticamente una reserva en los horarios solicitados."
            );

            if (!confirmed) return;
        }

        if (actionData.reubicar) {
            const { fecha_reserva, hora_inicio, hora_fin } = actionData.reubicacion;
            if (!fecha_reserva || !hora_inicio || !hora_fin) {
                showErrorToast("Completa fecha y horario de la reubicacion, o desactiva la opcion.");
                return;
            }
        }

        setIsSaving(true);

        try {
            const payload = {
                estado: actionData.estado,
                observacion: actionData.observacion,
                notificar: actionData.notificar
            };

            if (actionData.reubicar) {
                payload.reubicacion = {
                    fecha_reserva: formatPayloadDate(actionData.reubicacion.fecha_reserva),
                    fecha_fin: formatPayloadDate(actionData.reubicacion.fecha_fin || actionData.reubicacion.fecha_reserva),
                    hora_inicio: actionData.reubicacion.hora_inicio,
                    hora_fin: actionData.reubicacion.hora_fin
                };
            }

            await updateExternalQuoteState(selectedQuote.id, payload, selectedQuote.origen);
            showSuccessToast('Solicitud actualizada correctamente');
            closeSlideOver();
            fetchQuotes();
        } catch (error) {
            const errorMessage = getApiErrorMessage(
                error,
                "No se pudo actualizar la solicitud"
            );
            showErrorToast(errorMessage);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCommentSubmit = async (event) => {
        event.preventDefault();
        if (!selectedQuote || !newComment.trim()) return;

        setIsAddingComment(true);

        try {
            await addExternalQuoteComment(selectedQuote.id, {
                comentario: newComment.trim()
            }, selectedQuote.origen);
            showSuccessToast('Comentario agregado correctamente');
            setNewComment('');
            fetchQuotes();
        } catch {
            showErrorToast("No se pudo agregar el comentario");
        } finally {
            setIsAddingComment(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 animate-fade-in relative min-h-[70vh]">
            <Toaster />

            <QuotesFilterBar
                filters={filters}
                handleFilterChange={handleFilterChange}
            />

            <QuotesGrid
                isLoading={isLoading}
                quotes={quotes}
                pagination={pagination}
                filters={filters}
                setFilters={setFilters}
                openSlideOver={openSlideOver}
            />

            <QuoteSlideOver
                isSlideOverOpen={isSlideOverOpen}
                selectedQuote={selectedQuote}
                closeSlideOver={closeSlideOver}
                actionData={actionData}
                setActionData={setActionData}
                handleActionSubmit={handleActionSubmit}
                isSaving={isSaving}
                newComment={newComment}
                setNewComment={setNewComment}
                isAddingComment={isAddingComment}
                handleCommentSubmit={handleCommentSubmit}
            />
        </div>
    );
};

export default ExternalQuotesIndex;
