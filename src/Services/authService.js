import axios from "axios";

export const getAuthToken = async () => {
  const url =
    "https://api-academusoft-web.ucompensar.edu.co:8093/integrador-rest/servicios/app-acceso/acceso?=";

  try {
    const response = await axios.post(
      url,
      { codigoAplicacion: "ReservaEspacios" },
      {
        headers: {
          "Content-Type": "application/json",
          "WWW-Authenticate":
            "Basic UmVzZXJ2YUVzcGFjaW9zOjQ1OThlNzE0MWMyYTk5ODYyM2IzMzYxYmZmODMxYmQ0",
        },
      }
    );

    return response.data.token; // Devuelve el token
  } catch (error) {
    console.error("Error al obtener el token:", error);
    throw error; // Maneja el error según sea necesario
  }
};
