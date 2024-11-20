import axios from "axios";
import { getAuthToken } from "./authService";

export const fetchSpaces = async (page, filters) => {
  const url =
    "https://api-academusoft-web.ucompensar.edu.co:8093/integrador-rest/servicios/app-integrador/aplicacion/horarioxRecursoFisico";

  try {
    // Obtener el token
    const token = await getAuthToken();

    // Hacer la solicitud a la API
    const response = await axios.post(
      url,
      {
        tipoRetorno: "DataObject",
        parametros: {
          periodoacademico: "20242",
          espaciofisico: filters.espaciofisico || undefined,
          tiporecurso: filters.tiporecurso || undefined,
          clseFechainicio: filters.clseFechainicio || undefined,
          clseFechafinal: filters.clseFechafinal || undefined,
          horainicio: filters.horainicio || undefined,
          horafinal: filters.horafinal || undefined,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Verificar si la respuesta tiene datos válidos
    const spaces = response.data?.data; // Obtener la propiedad `data`

    if (!Array.isArray(spaces)) {
      console.warn("La API no devolvió un array válido en `data`:", response.data);
      return []; // Devuelve un array vacío si no es válido
    }

    // Paginación manual
    const itemsPerPage = 10;
    return spaces.slice(page * itemsPerPage, (page + 1) * itemsPerPage);
  } catch (error) {
    console.error("Error al obtener los espacios:", error);
    throw error; // Maneja el error según sea necesario
  }
};

