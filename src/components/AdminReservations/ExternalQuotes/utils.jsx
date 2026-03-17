import { format, parseISO } from 'date-fns';
import es from 'date-fns/locale/es';
import React from 'react';
import { Clock, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

export const formatDateTime = (dateString) => {
    if (!dateString) return 'No definida';
    try { return format(parseISO(dateString), "dd MMM yyyy, h:mm a", { locale: es }); } catch { return dateString; }
};

export const formatDateObj = (dateString) => {
    if (!dateString) return 'No definida';
    try { return format(parseISO(dateString), "dd MMM yyyy", { locale: es }); } catch { return dateString; }
};

export const getStatusBadge = (estado) => {
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
