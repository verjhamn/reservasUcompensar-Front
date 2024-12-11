import axios from "axios";
import { getAuthToken } from "./authService";

export const fetchSpaces = async (filters = {}) => {
  const url =
    "https://api-academusoft-web.ucompensar.edu.co:8093/integrador-rest/servicios/app-integrador/aplicacion/horarioxRecursoFisico";

  try {
    // Obtener el token
    const token = await getAuthToken();

    // Solicitar todos los datos al servidor
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
    const spaces = response.data?.data;

    if (!Array.isArray(spaces)) {
      console.warn("La API no devolvió un array válido en `data`:", response.data);
      return [];
    }

    // Devuelve todos los datos sin aplicar paginación
    return spaces;
  } catch (error) {
    console.error("Error al obtener los espacios:", error);
    throw error;
  }
};
