/* eslint-disable react/prop-types */
import { Calendar } from 'lucide-react';

import { getRequestDates, safeRender } from './requestFormUtils';

const RequestSummary = ({ spaceData, quoteData }) => {
    const { startDate, endDate } = getRequestDates(quoteData);
    const formattedStartDate = startDate ? new Date(startDate).toLocaleDateString() : '';
    const formattedEndDate = endDate ? new Date(endDate).toLocaleDateString() : formattedStartDate;

    return (
        <div className="w-full lg:w-1/3 shrink-0 flex flex-col">
            <div className="bg-purple-50/50 p-5 rounded-xl border border-purple-100 flex flex-col h-full">
                <div className="flex items-center gap-2 mb-4">
                    <Calendar className="h-5 w-5 text-purple-600" />
                    <h4 className="font-bold text-purple-900 text-lg">Resumen</h4>
                </div>

                <div className="space-y-4">
                    <div>
                        <p className="text-xs font-semibold text-purple-800 tracking-wider mb-1">Espacio seleccionado</p>
                        <p className="text-sm text-gray-800 font-medium">
                            {safeRender(spaceData?.Titulo)} {safeRender(spaceData?.codigo)}
                        </p>
                        <p className="text-xs text-gray-600 mt-0.5">
                            Tipo: {safeRender(spaceData?.tipo)}
                        </p>
                        <p className="text-xs text-gray-600">
                            Sede: {safeRender(spaceData?.sede)}
                        </p>
                    </div>

                    <div className="pt-4 border-t border-purple-200/60">
                        <p className="text-xs font-semibold text-purple-800 tracking-wider mb-1">Rango seleccionado</p>
                        <p className="text-sm text-gray-800 font-medium">
                            {formattedStartDate} - {formattedEndDate}
                        </p>
                    </div>

                    <div className="pt-4 border-t border-purple-200/60">
                        <p className="text-xs font-semibold text-purple-800 tracking-wider mb-1">Horarios</p>
                        <p className="text-xs text-purple-700 mt-3 font-medium bg-purple-100/50 p-2 rounded-lg border border-purple-100 text-center">
                            Rango: {quoteData?.startTime} - {quoteData?.endTime}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RequestSummary;
