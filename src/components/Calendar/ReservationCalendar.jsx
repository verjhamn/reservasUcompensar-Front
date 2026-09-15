import React from 'react';
import { Calendar } from 'react-big-calendar';
import { format } from 'date-fns';
import {
    calendarCulture,
    calendarFormats,
    calendarLocalizer,
    calendarMessages
} from '../../utils/calendarLocale';

const ReservationCalendar = ({
    events,
    selectedDate,
    onSelectDate
}) => {
    const dayPropGetter = (date) => {
        const dateStr = format(date, "yyyy-MM-dd");
        const isSelected = dateStr === format(selectedDate, "yyyy-MM-dd");
        const hasEvents = events.some(event =>
            format(new Date(event.start), "yyyy-MM-dd") === dateStr
        );

        if (isSelected && hasEvents) {
            return {
                style: {
                    backgroundColor: "#9333ea",
                    color: "#fff",
                    position: "relative",
                    border: "2px solid #7e22ce"
                }
            };
        } else if (isSelected) {
            return {
                style: {
                    backgroundColor: "#9333ea",
                    color: "#fff"
                }
            };
        } else if (hasEvents) {
            return {
                style: {
                    backgroundColor: "#f3e8ff",
                    color: "#9333ea",
                    fontWeight: "bold"
                }
            };
        }
        return {};
    };

    return (
        <div className="p-4 bg-white rounded-2xl shadow-xl border border-neutral-100">
            <Calendar
                localizer={calendarLocalizer}
                culture={calendarCulture}
                events={[]}
                selectable
                onSelectSlot={(slotInfo) => onSelectDate(slotInfo.start)}
                date={selectedDate}
                onNavigate={(date) => onSelectDate(date)}
                views={["month"]}
                style={{ height: 300 }}
                dayPropGetter={dayPropGetter}
                messages={calendarMessages}
                formats={calendarFormats}
            />
        </div>
    );
};

export default ReservationCalendar;
