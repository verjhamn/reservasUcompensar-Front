# Sesion local de pruebas

Activar en `.env.development.local` (ignorado por Git):

```env
VITE_LOCAL_AUTH_BYPASS=true
VITE_LOCAL_AUTH_EMAIL=pruebas.local@example.com
```

Ejecutar `npm run dev` y abrir la URL en `localhost` o `127.0.0.1`.
La ventana inicial permite elegir cualquiera de los cuatro roles y cualquier
correo valido, incluidos dominios externos, sin Microsoft SSO ni registro real.
El boton del matraz reabre el selector. Cerrar sesion vuelve a la ventana inicial.
Al recargar, se vuelve a pedir la seleccion y se conservan los valores de la pestana.

Vite excluye la ventana y la implementacion del bypass de todos los builds,
incluido `build:dev`. El bypass usa un token ficticio: las operaciones del backend
que requieren autenticacion real siguen sujetas a su validacion habitual.
