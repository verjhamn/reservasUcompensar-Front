export const safeRender = (value) => {
    if (typeof value === 'object' && value !== null) {
        return value.nombre || value.name || value.label || '';
    }

    return value || '';
};

export const formatPayloadDate = (dateValue) => {
    const date = dateValue ? new Date(dateValue) : new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
};

export const getRequestDates = (quoteData) => {
    const startDate = quoteData?.startDate || quoteData?.date;
    const endDate = quoteData?.endDate || quoteData?.date || quoteData?.startDate;

    return { startDate, endDate };
};

export const getBackendErrorMessage = (error, fallbackMessage) => {
    if (error?.errors && Object.keys(error.errors).length > 0) {
        const firstError = Object.values(error.errors)[0];
        return Array.isArray(firstError) ? firstError[0] : firstError;
    }

    return error?.message || fallbackMessage;
};

export const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export const isValidPhone = (value) => /^\d{10}$/.test(value);
