import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { getExternalQuotes, updateExternalQuoteState, addExternalQuoteComment } from '../../../Services/adminReservasService';
import { showConfirmation, showSuccessToast, showErrorToast } from '../../UtilComponents/Confirmation';

import QuotesFilterBar from './QuotesFilterBar';
import QuotesGrid from './QuotesGrid';
import QuoteSlideOver from './QuoteSlideOver';

const ExternalQuotesIndex = () => {
    // ---- ESTADOS ESTATICOS GLOBALES ----
    const [filters, setFilters] = useState({
        id: "", id_usuario: "", espacio_id: "", palabra: "", email: "", fecha: "", horaInicio: "", horaFin: "", tipo: "", piso: "", estado: "", fecha_creacion: "",
        page: 1,
        per_page: 10
    });

    const [quotes, setQuotes] = useState([]);
    const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
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

    // ---- ESTADOS DE COMENTARIOS (LÍNEA DE TIEMPO) ----
    const [newComment, setNewComment] = useState('');
    const [isAddingComment, setIsAddingComment] = useState(false);

    // ---- CARGA DE DATOS ----
    const fetchQuotes = async () => {
        setIsLoading(true);
        try {
            const response = await getExternalQuotes(filters);
            let items = [];
            let pagMeta = { current_page: 1, last_page: 1, total: 0 };

            // Evaluación agnóstica de Payload Paginado (Soportar varios estilos de Laravel)
            if (response.data && Array.isArray(response.data.data)) {
                // Native LengthAwarePaginator (data.data.data)
                items = response.data.data;
                pagMeta = { current_page: response.data.current_page, last_page: response.data.last_page, total: response.data.total };
            } else if (Array.isArray(response.data)) {
                // Formato plano híbrido (data.data es el array, .total afuera)
                items = response.data;
                pagMeta = { current_page: response.current_page || 1, last_page: response.last_page || 1, total: response.total || items.length };
            } else if (Array.isArray(response)) {
                items = response;
                pagMeta.total = items.length;
            }

            setQuotes(items);
            setPagination(pagMeta);
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
        setFilters(prev => ({ ...prev, [name]: value, page: 1 }));
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

        if (actionData.estado === 'aprobada') {
            const confirmed = await showConfirmation(
                () => { },
                "¿Estás seguro de aprobar esta solicitud? Al hacerlo, se generará y confirmará automáticamente una reserva en los horarios solicitados."
            );
            if (!confirmed) return;
        }

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

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!selectedQuote || !newComment.trim()) return;

        setIsAddingComment(true);
        try {
            const response = await addExternalQuoteComment(selectedQuote.id, {
                comentario: newComment.trim()
            });
            showSuccessToast(`Comentario agregado correctamente`);
            setNewComment('');

            // Actualizar la línea de tiempo localmente para feedback inmediato
            if (response && response.data) {
                fetchQuotes();
            } else {
                fetchQuotes();
            }
        } catch (error) {
            showErrorToast("No se pudo agregar el comentario");
        } finally {
            setIsAddingComment(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 animate-fade-in relative min-h-[70vh]">
            <Toaster />

            {/* Cabecera y Filtros */}
            <QuotesFilterBar
                filters={filters}
                handleFilterChange={handleFilterChange}
            />

            {/* Listado Principal de Tarjetas y Paginación */}
            <QuotesGrid
                isLoading={isLoading}
                quotes={quotes}
                pagination={pagination}
                filters={filters}
                setFilters={setFilters}
                openSlideOver={openSlideOver}
            />

            {/* Panel Lateral: Slide-Over UX */}
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
