import React from 'react';
import { Calendar } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
    calendarCulture,
    calendarFormats,
    calendarLocalizer,
    calendarMessages
} from "../../../utils/calendarLocale";

const AvailabilityCalendar = ({ events, date, onNavigate, onSelectSlot, dayPropGetter, slotPropGetter }) => {
    return (
        <Calendar
            localizer={calendarLocalizer}
            culture={calendarCulture}
            events={events}
            selectable="ignoreEvents"
            onSelectSlot={onSelectSlot}
            date={date}
            onNavigate={onNavigate}
            views={["month"]}
            style={{ height: 300 }}
            dayPropGetter={dayPropGetter}
            slotPropGetter={slotPropGetter}
            messages={calendarMessages}
            formats={calendarFormats}
        />
    );
};

export default AvailabilityCalendar;
