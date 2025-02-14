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

    // Construir los parámetros de la query
    const queryParams = {
      pagina: params.page || 1, // Cambiado a 'pagina' si así lo espera el backend
      registros: params.perPage || 10, // Cambiado a 'registros' si así lo espera el backend
      ...cleanFilters
    };

    // Añadir parámetros de ordenamiento si existen
    if (params.sortField) {
      queryParams.ordenar_por = params.sortField;
      queryParams.direccion = params.sortDirection;
    }

    console.log('Parámetros de la petición:', queryParams);

    const response = await axiosInstance.get("/reportes/general", {
      params: queryParams
    });

    console.log('Respuesta del servidor:', response.data);
    return response.data;
  } catch (error) {
    console.error("Error completo:", error);
    throw error;
  }
};