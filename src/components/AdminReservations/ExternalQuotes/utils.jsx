import { format, parseISO } from 'date-fns';
import es from 'date-fns/locale/es';
import { Clock, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

const pickFirstDefined = (...values) =>
    values.find((value) => {
        if (value === null || value === undefined) return false;
        if (typeof value === 'string') return value.trim() !== '';
        return true;
    });

export const isTruthyFlag = (value) => {
    if (value === true || value === 1) return true;
    if (typeof value === 'number') return value !== 0;
    if (typeof value !== 'string') return false;

    const normalized = value.trim().toLowerCase();
    return ['1', 'true', 'si'].includes(normalized) || normalized.startsWith('s');
};

export const normalizeOrigin = (origin) => {
    const normalized = origin?.toString().trim().toLowerCase();

    if (normalized?.startsWith('int')) return 'interna';
    if (normalized?.startsWith('ext')) return 'externa';

    return normalized || '';
};

export const SEDES = {
    '1': 'Campus Av. 68',
    '2': 'Campus Teusaquillo'
};

export const getSedeLabel = (sede) => {
    if (sede === null || sede === undefined || sede === '') return '';
    return SEDES[sede.toString().trim()] || sede.toString();
};

export const formatSetupTime = (setupTime) => {
    const numericValue = Number(setupTime);

    if (!Number.isFinite(numericValue) || numericValue <= 0) {
        return '';
    }

    if (numericValue >= 60) {
        const hours = numericValue / 60;
        const formattedHours = Number.isInteger(hours) ? hours : hours.toFixed(1);
        return `${formattedHours} hora${formattedHours === 1 ? '' : 's'} extra`;
    }

    return `${numericValue} minuto${numericValue === 1 ? '' : 's'} extra`;
};

export const getOriginBadge = (origin) => {
    switch (normalizeOrigin(origin)) {
        case 'interna':
            return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200 uppercase tracking-wide">Interna</span>;
        case 'externa':
            return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-sky-100 text-sky-700 border border-sky-200 uppercase tracking-wide">Externa</span>;
        default:
            return null;
    }
};

export const normalizeRequest = (request = {}) => {
    const solicitud = request.solicitud || {};
    const reserva = request.reserva || {};
    const empresa = request.empresa || {};
    const solicitante = request.solicitante || request.usuario || {};
    const espacio = request.espacio || reserva.espacio || {};
    const origen = normalizeOrigin(
        pickFirstDefined(request.origen, request.tipo_origen, request.source)
    );

    const empresaCompensarInterno = [
        request.empresa_compensar_interno,
        request.compensar_interno,
        empresa.compensar_interno,
        origen === 'interna'
    ].some(isTruthyFlag);

    const empresaNombre = empresaCompensarInterno
        ? 'Compensar'
        : pickFirstDefined(request.empresa_nombre, empresa.nombre);

    const sede = pickFirstDefined(
        request.sede,
        request.sede_id,
        solicitud.sede,
        solicitud.sede_id,
        reserva.sede,
        reserva.sede_id,
        espacio.sede,
        espacio.sede_id
    );

    return {
        ...request,
        origen,
        sede,
        sede_nombre: getSedeLabel(sede),
        evento_nombre: pickFirstDefined(
            request.evento_nombre,
            request.evento?.nombre,
            solicitud.nombre,
            request.nombre
        ),
        evento_tipo: pickFirstDefined(
            request.evento_tipo,
            request.evento?.tipo,
            solicitud.tipo,
            request.tipo
        ),
        evento_detalles: pickFirstDefined(
            request.evento_detalles,
            solicitud.detalles,
            request.detalles
        ),
        fecha_reserva: pickFirstDefined(
            request.fecha_reserva,
            request.fecha,
            reserva.fecha,
            request.fecha_inicio
        ),
        fecha_fin: pickFirstDefined(
            request.fecha_fin,
            request.fecha_fin_reserva,
            reserva.fecha_fin,
            request.fecha_final
        ),
        hora_inicio: pickFirstDefined(
            request.hora_inicio,
            request.horaInicio,
            reserva.hora_inicio
        ),
        hora_fin: pickFirstDefined(
            request.hora_fin,
            request.horaFin,
            reserva.hora_fin
        ),
        created_at: pickFirstDefined(
            request.created_at,
            request.fecha_creacion,
            solicitud.fecha_solicitud
        ),
        tiempo_montaje: pickFirstDefined(
            request.tiempo_montaje,
            reserva.tiempo_montaje
        ),
        cantidad_personas: pickFirstDefined(
            request.cantidad_personas,
            reserva.cantidad_personas
        ),
        empresa_compensar_interno: empresaCompensarInterno,
        empresa_nombre: empresaNombre,
        empresa_tipo_documento: pickFirstDefined(
            request.empresa_tipo_documento,
            empresa.tipo_documento
        ),
        empresa_numero_documento: pickFirstDefined(
            request.empresa_numero_documento,
            empresa.numero_documento
        ),
        empresa_digito_verificacion: pickFirstDefined(
            request.empresa_digito_verificacion,
            empresa.digito_verificacion
        ),
        empresa_telefono: pickFirstDefined(
            request.empresa_telefono,
            empresa.telefono
        ),
        empresa_direccion: pickFirstDefined(
            request.empresa_direccion,
            empresa.direccion
        ),
        empresa_compensar_id: pickFirstDefined(
            request.empresa_compensar_id,
            empresa.compensar_id,
            request.compensar_id
        ),
        empresa_compensar_id_cc: pickFirstDefined(
            request.empresa_compensar_id_cc,
            empresa.compensar_id_cc,
            request.compensar_id_cc
        ),
        centro_costo: pickFirstDefined(
            request.centro_costo,
            request.compensar_id_cc,
            empresa.compensar_id_cc
        ),
        solicitante_nombre: pickFirstDefined(
            request.solicitante_nombre,
            solicitante.nombre,
            solicitante.displayName,
            solicitante.name
        ),
        solicitante_tipo_documento: pickFirstDefined(
            request.solicitante_tipo_documento,
            solicitante.tipo_documento
        ),
        solicitante_numero_documento: pickFirstDefined(
            request.solicitante_numero_documento,
            solicitante.numero_documento
        ),
        solicitante_telefono: pickFirstDefined(
            request.solicitante_telefono,
            solicitante.telefono,
            solicitante.phone
        ),
        solicitante_correo: pickFirstDefined(
            request.solicitante_correo,
            solicitante.correo,
            solicitante.email,
            request.email
        ),
        solicitante_correo_alternativo: pickFirstDefined(
            request.solicitante_correo_alternativo,
            solicitante.correo_alternativo
        ),
        espacio: {
            ...espacio,
            nombre: pickFirstDefined(espacio.nombre, request.espacio_nombre),
            tipo_espacio: pickFirstDefined(
                espacio.tipo_espacio,
                espacio.tipo,
                request.tipo
            ),
            piso: pickFirstDefined(espacio.piso, request.piso),
            sede,
            sede_nombre: getSedeLabel(sede)
        },
        linea_tiempo: Array.isArray(request.linea_tiempo)
            ? request.linea_tiempo
            : Array.isArray(request.timeline)
                ? request.timeline
                : Array.isArray(request.seguimiento)
                    ? request.seguimiento
                    : []
    };
};

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
