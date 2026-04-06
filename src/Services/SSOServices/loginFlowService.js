import { loginRequest } from "./authConfig";

const AUTH_FLOW_STORAGE_KEY = "msalAuthFlowState";

export const AUTH_FLOW_SOURCES = {
    GENERAL: "general",
    QR: "qr",
};

const safeParse = (value) => {
    try {
        return JSON.parse(value);
    } catch {
        return null;
    }
};

export const setAuthFlowState = (state) => {
    sessionStorage.setItem(AUTH_FLOW_STORAGE_KEY, JSON.stringify(state));
};

export const getAuthFlowState = () => {
    const raw = sessionStorage.getItem(AUTH_FLOW_STORAGE_KEY);
    if (!raw) return null;
    return safeParse(raw);
};

export const clearAuthFlowState = () => {
    sessionStorage.removeItem(AUTH_FLOW_STORAGE_KEY);
};

export const isQrAuthPending = (codigo) => {
    const state = getAuthFlowState();
    if (!state || state.source !== AUTH_FLOW_SOURCES.QR) return false;
    if (!codigo) return true;
    return state.codigo === codigo;
};

export const startMicrosoftLogin = async (instance, options = {}) => {
    const { source = AUTH_FLOW_SOURCES.GENERAL, redirectStartPage, metadata = {} } = options;

    setAuthFlowState({
        source,
        codigo: metadata.codigo || null,
        createdAt: Date.now(),
    });

    const request = {
        ...loginRequest,
        ...(redirectStartPage ? { redirectStartPage } : {}),
    };

    try {
        await instance.loginRedirect(request);
    } catch (error) {
        clearAuthFlowState();
        throw error;
    }
};

