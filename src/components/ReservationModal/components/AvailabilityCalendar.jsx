/* eslint-disable react/prop-types */
import { cloneElement, useRef } from 'react';
import { Calendar } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
    calendarCulture,
    calendarFormats,
    calendarLocalizer,
    calendarMessages
} from "../../../utils/calendarLocale";

const DateCellWrapper = ({ children, value }) => cloneElement(children, {
    'data-availability-date': value.getTime(),
});

const getDayAtPoint = (target, clientX, clientY) => {
    const pointedTarget = target.ownerDocument.elementFromPoint(clientX, clientY);
    if (pointedTarget?.closest('.rbc-event, .rbc-show-more')) return null;

    const calendar = target.closest('.rbc-calendar');
    if (!calendar) return null;

    // Use the touch coordinates because mobile browsers may target a label in another row.
    const cell = Array.from(calendar.querySelectorAll('[data-availability-date]')).find(node => {
        const bounds = node.getBoundingClientRect();
        return clientX >= bounds.left && clientX < bounds.right
            && clientY >= bounds.top && clientY < bounds.bottom;
    });

    return cell ? new Date(Number(cell.dataset.availabilityDate)) : null;
};

const AvailabilityCalendar = ({ events, date, onNavigate, onSelectSlot, dayPropGetter, slotPropGetter }) => {
    const pointerType = useRef(null);
    const touchedDay = useRef(null);
    const touchStartPoint = useRef(null);

    const selectDay = (day) => {
        const end = new Date(day);
        end.setDate(end.getDate() + 1);
        onSelectSlot({ start: day, end, slots: [day], action: 'click' });
    };

    const handleTouchStart = (event) => {
        pointerType.current = 'touch';
        const touch = event.touches[0];
        touchStartPoint.current = touch ? { x: touch.clientX, y: touch.clientY } : null;
        touchedDay.current = event.touches.length === 1
            ? getDayAtPoint(event.target, touch.clientX, touch.clientY)
            : null;
        if (touchedDay.current) {
            // Avoid the calendar's long press so a touch can still scroll the modal.
            event.stopPropagation();
        }
    };

    const handleTouchMove = (event) => {
        const start = touchStartPoint.current;
        const touch = event.touches[0];
        if (!start || event.touches.length !== 1
            || Math.hypot(touch.clientX - start.x, touch.clientY - start.y) > 10) {
            touchedDay.current = null;
        }
    };

    const handleTouchEnd = (event) => {
        if (event.touches.length === 0 && touchedDay.current) {
            selectDay(touchedDay.current);
        } else {
            touchedDay.current = null;
        }
        touchStartPoint.current = null;
    };

    const handleMouseDown = (event) => {
        if (pointerType.current === 'touch' && touchedDay.current) {
            event.stopPropagation();
        }
    };

    const handleClick = (event) => {
        if (pointerType.current !== 'touch' || event.detail === 0) return;

        // Selection already happened on touchend; ignore the browser's synthetic click.
        if (!touchedDay.current) return;

        touchedDay.current = null;
        event.preventDefault();
        event.stopPropagation();
    };

    return (
        <div
            onPointerDownCapture={event => {
                pointerType.current = event.pointerType;
                touchedDay.current = null;
            }}
            onTouchStartCapture={handleTouchStart}
            onTouchMoveCapture={handleTouchMove}
            onTouchEndCapture={handleTouchEnd}
            onTouchCancelCapture={() => {
                touchedDay.current = null;
                touchStartPoint.current = null;
            }}
            onMouseDownCapture={handleMouseDown}
            onClickCapture={handleClick}
        >
            <Calendar
                localizer={calendarLocalizer}
                culture={calendarCulture}
                events={events}
                selectable="ignoreEvents"
                onSelectSlot={onSelectSlot}
                date={date}
                onNavigate={onNavigate}
                onDrillDown={selectDay}
                components={{ dateCellWrapper: DateCellWrapper }}
                views={["month"]}
                style={{ height: 300 }}
                dayPropGetter={dayPropGetter}
                slotPropGetter={slotPropGetter}
                messages={calendarMessages}
                formats={calendarFormats}
            />
        </div>
    );
};

export default AvailabilityCalendar;
