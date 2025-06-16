# Instructivo: Agregar un Nuevo Usuario con Rol

Este instructivo explica cómo agregar un nuevo usuario a los diferentes roles del sistema, considerando que los usuarios están definidos directamente en el código fuente. Es necesario recompilar y desplegar la aplicación después de realizar el cambio.

---

## 1. Clonar el repositorio desde GitHub

Si aún no tienes el repositorio en tu equipo, ejecútalo en la terminal:

```bash
git clone <URL_DEL_REPOSITORIO>
```
Reemplaza `<URL_DEL_REPOSITORIO>` por la URL real del repositorio de GitHub.

---

## 2. Abrir el proyecto en tu editor de código

Por ejemplo, usando Visual Studio Code:

```bash
cd <nombre_del_proyecto>
code .
```

---

## 3. Ubicar el archivo donde están los usuarios y roles

Busca el archivo donde se definen los usuarios y roles, normalmente en:

```
src/utils/userHelper.js
```

Busca un objeto llamado `AUTHORIZED_EMAILS` o similar.

---

## 4. Agregar el nuevo usuario al rol correspondiente

Por ejemplo, si tienes:

```js
const AUTHORIZED_EMAILS = {
  super_admin: [
    "admin1@dominio.com",
    // ...
  ],
  admin: [
    "admin2@dominio.com",
    // ...
  ],
  reports_viewer: [
    "reportes@dominio.com",
    // ...
  ]
};
```

Agrega el correo del nuevo usuario en el arreglo correspondiente al rol deseado.

**Ejemplo:**
Para agregar un nuevo administrador:
```js
admin: [
  "admin2@dominio.com",
  "nuevo.admin@dominio.com", // <-- Agrega aquí el nuevo usuario
],
```

---

## 5. Guardar los cambios y hacer commit

Guarda el archivo y luego realiza un commit de los cambios:

```bash
git add src/utils/userHelper.js
git commit -m "Agregado nuevo usuario admin: nuevo.admin@dominio.com"
```

---

## 6. Compilar el proyecto

Ejecuta el comando de build para generar la carpeta `dist`:

```bash
npm install
npm run build
```

Esto generará la versión optimizada de la aplicación en la carpeta `dist`.

---

## 7. Subir la carpeta `dist` al servidor

Conéctate al servidor donde se aloja la aplicación (por ejemplo, por FTP, SFTP o SSH) y reemplaza la carpeta `dist` antigua por la nueva.

**Ejemplo usando SCP:**
```bash
scp -r dist usuario@servidor:/ruta/del/proyecto/
```
O usa la herramienta de despliegue que utilices normalmente.

---

## 8. Verificar el despliegue

Abre la aplicación en el navegador y verifica que el nuevo usuario tenga el rol y acceso correspondiente.

---

## Resumen rápido

1. Clona el repositorio.
2. Agrega el usuario en el archivo de roles.
3. Guarda, haz commit y build.
4. Sube la carpeta `dist` al servidor.
5. Verifica el acceso.

---

**¡Listo! Ahora puedes agregar nuevos usuarios y roles siguiendo estos pasos.** 