const clientId_Pruebas = 'cb9fcd04-3e61-4cb7-a479-af9d2d75d2b7'; // ID de la app en Azure
const tenantId_Pruebas = '4bf38ea2-832d-4552-b508-421570da43ff'; // Tenant ID

const clientId_Produccion = '5217c0e0-4244-4b8b-9943-e96a33e70628'; // ID de la app en Azure
const tenantId_Produccion = '4bf38ea2-832d-4552-b508-421570da43ff'; // Tenant ID

export const msalConfig = {
    auth: {
        clientId: clientId_Pruebas, // ID de la app en Azure
        authority: "https://login.microsoftonline.com/4bf38ea2-832d-4552-b508-421570da43ff", // Tenant ID
        redirectUri: "http://localhost:3000/", // Cambia en producción
    }
};

export const loginRequest = {
    scopes: ["openid", "profile", "email", "User.Read"]
};

export const graphConfig = {
    graphMeEndpoint: "https://graph.microsoft.com/v1.0/me"
};
