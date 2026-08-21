const appendMessages = (value, messages) => {
    if (typeof value === 'string' && value.trim()) {
        messages.push(value.trim());
        return;
    }

    if (Array.isArray(value)) {
        value.forEach((item) => appendMessages(item, messages));
        return;
    }

    if (value && typeof value === 'object') {
        Object.values(value).forEach((item) => appendMessages(item, messages));
    }
};

export const getApiErrorMessage = (error, fallbackMessage) => {
    const responseData = error?.response?.data;
    const messages = [];

    if (typeof responseData === 'string') {
        appendMessages(responseData, messages);
    } else {
        appendMessages(responseData?.message, messages);
        appendMessages(responseData?.error, messages);
        appendMessages(responseData?.errors, messages);
        appendMessages(responseData?.detail, messages);
        appendMessages(responseData?.details, messages);
        appendMessages(responseData?.data?.message, messages);
        appendMessages(responseData?.data?.error, messages);
    }

    const uniqueMessages = [...new Set(messages)];
    if (uniqueMessages.length > 0) {
        return uniqueMessages.join('\n');
    }

    return error?.message || fallbackMessage;
};
