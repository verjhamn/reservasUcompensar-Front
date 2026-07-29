// Constantes globales para estados y ventanas de tiempo

export const RESERVATION_STATES = {
    CREADA: "Creada",
    CONFIRMADA: "Confirmada",
    CANCELADA: "Cancelada",
    COMPLETADA: "Completada",
};

// Ventanas de tiempo
export const CHECKIN_EARLY_MS = 15 * 60 * 1000; // 15 minutos antes del inicio

// Sedes (campus)
export const SEDES = {
    '1': 'Campus Av. 68',
    '2': 'Campus Teusaquillo'
};

export const getSedeLabel = (sedeId) => {
    if (sedeId === null || sedeId === undefined || sedeId === '') return '';
    return SEDES[sedeId.toString().trim()] || sedeId.toString();
};


