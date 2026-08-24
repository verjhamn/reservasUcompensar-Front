const formatApiDate = (value = "") => {
    if (!value) return "";

    const [year, month, day] = value.split("-");
    if (year?.length === 4 && month && day) {
        return `${day}/${month}/${year}`;
    }

    return value;
};

const normalizeSede = (value) => {
    if (value === null || value === undefined || value === "") return "";

    const numericValue = Number(value);
    return Number.isNaN(numericValue) ? value : numericValue;
};

export const buildSpaceFilterPayload = (filters = {}) => {
    const sede = normalizeSede(filters.sede ?? filters.sede_id);

    return ({
    id: filters.id || "",
    palabra: filters.palabra || "",
    sede,
    bloque: sede?.toString() === "2" && filters.bloque ? filters.bloque.toString().toUpperCase() : "",
    tipo: filters.tipo || "",
    piso: filters.piso || "",
    agrupable: filters.agrupable || "",
    tiporecurso: filters.tiporecurso || "",
    fecha: formatApiDate(filters.fecha),
    horaInicio: filters.horaInicio || "",
    horaFin: filters.horaFin || "",
});
};
