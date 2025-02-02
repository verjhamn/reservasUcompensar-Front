import { graphConfig } from "./authConfig";

/**
 * Obtiene los datos del usuario autenticado desde Microsoft Graph
 * @param {string} accessToken - Token de Microsoft Entra
 */
export async function getUserData(accessToken) {
    const headers = new Headers();
    headers.append("Authorization", `Bearer ${accessToken}`);

    const options = {
        method: "GET",
        headers: headers,
    };

    try {
        const response = await fetch(graphConfig.graphMeEndpoint, options);
        return await response.json();
    } catch (error) {
        console.error("Error al obtener datos desde Microsoft Graph:", error);
        throw error;
    }
}
