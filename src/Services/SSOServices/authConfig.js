const clientId_Pruebas = '405a78d3-4e5f-4b1d-87cd-36997d273b08'; // ID de la app en Azure
const clientId_Produccion = '5217c0e0-4244-4b8b-9943-e96a33e70628'; // ID de la app en Azure
const URL_Pruebas = 'https://pruebas.reserva.ucompensar.edu.co/'; // Cambia en producción
const URL_Produccion = 'https://reservas.ucompensar.edu.co/'; // Cambia en producción



export const msalConfig = {
    auth: {
        clientId: clientId_Pruebas, // ID de la app en Azure
        authority: "https://login.microsoftonline.com/4bf38ea2-832d-4552-b508-421570da43ff", // Tenant ID
        redirectUri: URL_Pruebas, // Cambia en producción
    }
};

export const loginRequest = {
    scopes: ["openid", "profile", "email", "User.Read"]
};

export const graphConfig = {
    graphMeEndpoint: "https://graph.microsoft.com/v1.0/me"
};
