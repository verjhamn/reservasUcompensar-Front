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
import { normalizeRequest } from './utils';

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
        notificar: false
    });
    const [isSaving, setIsSaving] = useState(false);

    const [newComment, setNewComment] = useState('');
    const [isAddingComment, setIsAddingComment] = useState(false);

    const fetchQuotes = useCallback(async () => {
        setIsLoading(true);

        try {
            const response = await getExternalQuotes(filters);
            const payload = response?.data || response;
            let items = [];
            let pagMeta = { current_page: 1, last_page: 1, total: 0 };

            if (Array.isArray(payload?.data)) {
                items = payload.data;
                pagMeta = {
                    current_page: payload.current_page || 1,
                    last_page: payload.last_page || 1,
                    total: payload.total || payload.data.length
                };
            } else if (Array.isArray(payload?.data?.data)) {
                items = payload.data.data;
                pagMeta = {
                    current_page: payload.data.current_page || 1,
                    last_page: payload.data.last_page || 1,
                    total: payload.data.total || payload.data.data.length
                };
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
            notificar: false
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

        setIsSaving(true);

        try {
            await updateExternalQuoteState(selectedQuote.id, {
                estado: actionData.estado,
                observacion: actionData.observacion,
                notificar: actionData.notificar
            }, selectedQuote.origen);
            showSuccessToast('Solicitud actualizada correctamente');
            closeSlideOver();
            fetchQuotes();
        } catch {
            showErrorToast("No se pudo actualizar la solicitud");
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
