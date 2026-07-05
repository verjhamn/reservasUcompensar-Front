import { axiosInstance } from "./authService";

export const getGeneralReport = async (params = {}) => {
  try {
    // Crear un objeto de filtros limpio (solo con valores no vacíos)
    const cleanFilters = {};

    // Iterar sobre los filtros y solo incluir los que tienen valor
    Object.entries(params.columnFilters || {}).forEach(([key, value]) => {
      if (value && value.toString().trim() !== '') {
        // Usar el nombre del campo directamente sin 'filter[]'
        cleanFilters[key] = value.trim();
      }
    });

    // Construir los parámetros del body
    const bodyParams = {
      page: params.page || 1,
      per_page: params.perPage || 10,
      ...cleanFilters
    };

    // Añadir parámetros de ordenamiento si existen
    if (params.sortField) {
      bodyParams.ordenar_por = params.sortField;
      bodyParams.direccion = params.sortDirection;
    }

    const response = await axiosInstance.post("/reportes/general", bodyParams);

    return response.data;
  } catch (error) {
    console.error("Error completo:", error);
    throw error;
  }
};