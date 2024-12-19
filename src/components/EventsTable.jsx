import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const EventsTable = ({ 
  events, 
  searchTerm, 
  setSearchTerm, 
  currentPage, 
  setCurrentPage, 
  totalPages,
  indexOfFirstEvent,
  indexOfLastEvent,
  totalEvents,
  handlePageChange 
}) => {
  return (
    <div className="bg-white w-96 flex flex-col h-full">
      <div className="p-2 border-b border-gris-sutil">
        <input
          type="text"
          placeholder="Buscar reservas..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full p-1.5 text-sm border border-gris-sutil rounded focus:outline-none focus:ring-1 focus:ring-turquesa text-gris-medio"
        />
      </div>

      <div className="flex-1 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gris-sutil/50 sticky top-0 z-10">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gris-medio uppercase tracking-wider">
                Fecha
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gris-medio uppercase tracking-wider">
                Sala
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gris-medio uppercase tracking-wider">
                Detalles
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gris-sutil/50">
            {events.map((event, idx) => (
              <tr 
                key={idx}
                className="hover:bg-gris-sutil/10 transition-colors h-12"
              >
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gris-medio">
                  <div className="font-medium">
                    {format(new Date(event.start), 'dd MMM yyyy', { locale: es })}
                  </div>
                  <div className="text-xs">
                    {format(new Date(event.start), 'HH:mm')} - {format(new Date(event.end), 'HH:mm')}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm font-medium text-turquesa">
                    {event.title}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gris-medio">
                  <div>Capacidad: {event.capacity} personas</div>
                  <div>Ubicación: {event.location}</div>
                </td>
              </tr>
            ))}
            {events.length < 7 && [...Array(7 - events.length)].map((_, idx) => (
              <tr key={`empty-${idx}`} className="h-12">
                <td colSpan={3}>&nbsp;</td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-4 text-center text-sm text-gris-medio">
                  No se encontraron reservas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="px-4 py-2 border-t border-gris-sutil flex items-center justify-between text-xs bg-gris-sutil/20">
          <span className="text-gris-medio">
            {indexOfFirstEvent + 1}-{Math.min(indexOfLastEvent, totalEvents)} de {totalEvents}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`min-w-[24px] h-6 flex items-center justify-center rounded ${
                currentPage === 1
                  ? 'bg-gris-sutil text-gris-medio cursor-not-allowed'
                  : 'bg-turquesa text-white hover:bg-turquesa/90'
              }`}
            >
              ←
            </button>
            {totalPages <= 5 ? (
              [...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx + 1}
                  onClick={() => handlePageChange(idx + 1)}
                  className={`min-w-[24px] h-6 flex items-center justify-center rounded ${
                    currentPage === idx + 1
                      ? 'bg-turquesa text-white'
                      : 'bg-gris-sutil text-gris-medio hover:bg-gris-sutil/70'
                  }`}
                >
                  {idx + 1}
                </button>
              ))
            ) : (
              <>
                <button
                  onClick={() => handlePageChange(1)}
                  className={`min-w-[24px] h-6 flex items-center justify-center rounded ${
                    currentPage === 1 ? 'bg-turquesa text-white' : 'bg-gris-sutil text-gris-medio'
                  }`}
                >
                  1
                </button>
                {currentPage > 3 && <span className="px-1">...</span>}
                {currentPage !== 1 && currentPage !== totalPages && (
                  <button
                    onClick={() => handlePageChange(currentPage)}
                    className="min-w-[24px] h-6 flex items-center justify-center rounded bg-turquesa text-white"
                  >
                    {currentPage}
                  </button>
                )}
                {currentPage < totalPages - 2 && <span className="px-1">...</span>}
                <button
                  onClick={() => handlePageChange(totalPages)}
                  className={`min-w-[24px] h-6 flex items-center justify-center rounded ${
                    currentPage === totalPages ? 'bg-turquesa text-white' : 'bg-gris-sutil text-gris-medio'
                  }`}
                >
                  {totalPages}
                </button>
              </>
            )}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`min-w-[24px] h-6 flex items-center justify-center rounded ${
                currentPage === totalPages
                  ? 'bg-gris-sutil text-gris-medio cursor-not-allowed'
                  : 'bg-turquesa text-white hover:bg-turquesa/90'
              }`}
            >
              →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsTable; 