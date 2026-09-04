/* eslint-disable react/prop-types */
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import es from "date-fns/locale/es";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const WEEKDAY_LABELS = ["L", "M", "X", "J", "V", "S", "D"];

const MiniMonthNavigator = ({ visibleMonth, onMonthChange, focusedDate, onSelectDate, eventDates }) => {
  const today = new Date();

  const gridStart = startOfWeek(startOfMonth(visibleMonth), { weekStartsOn: 1 });
  const gridEnd = endOfWeek(endOfMonth(visibleMonth), { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => onMonthChange(subMonths(visibleMonth, 1))}
          className="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-blue-dark-500"
          aria-label="Mes anterior"
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </button>
        <p className="text-sm font-bold capitalize text-blue-dark-500">
          {format(visibleMonth, "MMMM yyyy", { locale: es })}
        </p>
        <button
          type="button"
          onClick={() => onMonthChange(addMonths(visibleMonth, 1))}
          className="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-blue-dark-500"
          aria-label="Mes siguiente"
        >
          <ChevronRightIcon className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold uppercase text-gray-400">
        {WEEKDAY_LABELS.map((label, index) => <span key={`${label}-${index}`}>{label}</span>)}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1">
        {days.map((day) => {
          const dayKey = format(day, "yyyy-MM-dd");
          const inMonth = isSameMonth(day, visibleMonth);
          const isFocused = focusedDate && isSameDay(day, focusedDate);
          const isToday = isSameDay(day, today);
          const hasEvents = eventDates.has(dayKey);

          return (
            <button
              key={dayKey}
              type="button"
              onClick={() => onSelectDate(day)}
              className={`relative flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium transition ${
                isFocused
                  ? "bg-blue-dark-500 text-white"
                  : isToday
                    ? "ring-1 ring-inset ring-primary-500 text-primary-600 font-bold"
                    : inMonth
                      ? "text-gray-700 hover:bg-gray-100"
                      : "text-gray-300 hover:bg-gray-50"
              }`}
            >
              {format(day, "d")}
              {hasEvents && (
                <span
                  className={`absolute bottom-1 h-1 w-1 rounded-full ${isFocused ? "bg-white" : "bg-turquoise-500"}`}
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MiniMonthNavigator;
