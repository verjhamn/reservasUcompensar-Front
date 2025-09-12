import React, { useState, useRef, useEffect } from 'react';

const Tooltip = ({ 
    children, 
    content, 
    position = 'top',
    disabled = false,
    delay = 500,
    className = ''
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [timeoutId, setTimeoutId] = useState(null);
    const tooltipRef = useRef(null);

    const showTooltip = () => {
        if (disabled || !content) return;
        
        const id = setTimeout(() => {
            setIsVisible(true);
        }, delay);
        setTimeoutId(id);
    };

    const hideTooltip = () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
            setTimeoutId(null);
        }
        setIsVisible(false);
    };

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [timeoutId]);

    const getPositionClasses = () => {
        const baseClasses = 'absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg whitespace-nowrap transition-all duration-200';
        
        switch (position) {
            case 'top':
                return `${baseClasses} bottom-full left-1/2 transform -translate-x-1/2 mb-2`;
            case 'bottom':
                return `${baseClasses} top-full left-1/2 transform -translate-x-1/2 mt-2`;
            case 'left':
                return `${baseClasses} right-full top-1/2 transform -translate-y-1/2 mr-2`;
            case 'right':
                return `${baseClasses} left-full top-1/2 transform -translate-y-1/2 ml-2`;
            default:
                return `${baseClasses} bottom-full left-1/2 transform -translate-x-1/2 mb-2`;
        }
    };

    const getArrowClasses = () => {
        const baseArrow = 'absolute w-2 h-2 bg-gray-900 transform rotate-45';
        
        switch (position) {
            case 'top':
                return `${baseArrow} top-full left-1/2 -translate-x-1/2 -mt-1`;
            case 'bottom':
                return `${baseArrow} bottom-full left-1/2 -translate-x-1/2 -mb-1`;
            case 'left':
                return `${baseArrow} left-full top-1/2 -translate-y-1/2 -ml-1`;
            case 'right':
                return `${baseArrow} right-full top-1/2 -translate-y-1/2 -mr-1`;
            default:
                return `${baseArrow} top-full left-1/2 -translate-x-1/2 -mt-1`;
        }
    };

    return (
        <div 
            className={`relative inline-block ${className}`}
            onMouseEnter={showTooltip}
            onMouseLeave={hideTooltip}
            onFocus={showTooltip}
            onBlur={hideTooltip}
            ref={tooltipRef}
        >
            {children}
            {isVisible && content && (
                <div className={getPositionClasses()}>
                    {content}
                    <div className={getArrowClasses()}></div>
                </div>
            )}
        </div>
    );
};

export default Tooltip;
