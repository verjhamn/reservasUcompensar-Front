/* eslint-disable react/prop-types */
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const formatHour12 = (timeStr) => {
    const h = parseInt(timeStr.split(':')[0], 10);
    if (h === 0) return '12:00 a. m.';
    if (h < 12) return `${h}:00 a. m.`;
    if (h === 12) return '12:00 p. m.';
    return `${h - 12}:00 p. m.`;
};

const ConflictWarningPanel = ({ conflicts, isSingleDay }) => {
    return (
        <div className="bg-red-50 border border-red-300 rounded-xl p-4 space-y-3">
            <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-red-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                    <p className="text-sm font-bold text-red-800">
                        El espacio ya se encuentra reservado en el {isSingleDay ? 'día' : 'rango'} y horario seleccionados
                    </p>
                </div>
            </div>

            <div className="space-y-1.5 max-h-36 overflow-y-auto custom-scrollbar">
                {conflicts.map(({ date, hours }) => {
                    const endH = parseInt(hours[hours.length - 1].split(':')[0], 10) + 1;
                    const endHourStr = `${endH.toString().padStart(2, '0')}:00`;
                    return (
                        <div key={format(date, 'yyyy-MM-dd')} className="text-xs bg-white border border-red-200 rounded-lg px-3 py-2 flex items-start gap-1.5">
                            <svg className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <span>
                                <span className="font-semibold text-red-900 capitalize">
                                    {format(date, "EEEE d 'de' MMMM", { locale: es })}:
                                </span>
                                {' '}
                                <span className="text-red-700">
                                    reserva existente entre{' '}
                                    <strong>{formatHour12(hours[0])}</strong> y{' '}
                                    <strong>{formatHour12(endHourStr)}</strong>
                                </span>
                            </span>
                        </div>
                    );
                })}
            </div>

            <p className="text-xs text-red-700 font-medium border-t border-red-200 pt-2">
                No es posible realizar la solicitud en este horario. Por favor selecciona otra fecha u horario disponible.
            </p>
        </div>
    );
};

export default ConflictWarningPanel;
