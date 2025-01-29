import React from "react";
import { Calendar } from "react-big-calendar";

const AvailabilityTab = ({
    filteredEvents,
    selectedDate,
    handleSlotSelect,
    handleNavigate,
    dayPropGetter,
    renderTimeSelector,
    localizer,
}) => (
    <div>
        <Calendar
            localizer={localizer}
            events={filteredEvents}
            selectable
            onSelectSlot={handleSlotSelect}
            date={selectedDate}
            onNavigate={(date) => setSelectedDate(date)}
            views={["month"]}
            dayPropGetter={dayPropGetter}
            style={{ height: 300 }}
        />
        {renderTimeSelector && renderTimeSelector()}
    </div>
);

export default AvailabilityTab;