# Instructivo: Agregar Usuarios, Compilar y Desplegar la Aplicación

**Repositorio:** [https://github.com/verjhamn/reservasUcompensar-Front.git](https://github.com/verjhamn/reservasUcompensar-Front.git)

> **IMPORTANTE:** Todos los cambios relacionados con usuarios y despliegue deben realizarse y subirse usando la rama `updateUsers`. **No uses la rama `main` para estos cambios.**

Este instructivo explica cómo agregar un nuevo usuario a los diferentes roles del sistema, compilar la aplicación y desplegarla en el servidor. Los usuarios y roles están definidos en el archivo `src/utils/adminRoles.js`.

---

## 1. Agregar un nuevo usuario o rol

1. Abre el archivo:
   ```
   src/utils/adminRoles.js
   ```
2. Ubica el objeto donde se definen los roles y los correos de los usuarios. Por ejemplo:
   ```js
   const ADMIN_ROLES = {
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
3. Agrega el correo del nuevo usuario en el arreglo correspondiente al rol deseado.

   **Ejemplo:**
   Para agregar un nuevo administrador:
   ```js
   admin: [
     "admin2@dominio.com",
     "nuevo.admin@dominio.com", // <-- Agrega aquí el nuevo usuario
   ],
   ```

> **Importante:** Guarda los cambios antes de continuar con la compilación.

---

## 2. Clonar el repositorio desde GitHub (si no lo tienes localmente)

```bash
git clone https://github.com/verjhamn/reservasUcompensar-Front.git
```

---

## 3. Abrir el proyecto en tu editor de código

Por ejemplo, usando Visual Studio Code:

```bash
cd <nombre_del_proyecto>
code .
```

---

## 4. Compilar el proyecto

Asegúrate de tener el archivo de variables de entorno adecuado para el entorno (por ejemplo, `.env.production` para producción o `.env.development` para pruebas).

Instala las dependencias:
```bash
npm install
```

### Compilación para pruebas (desarrollo)

```bash
npm run build:dev
```
Esto generará la carpeta `dist` usando las variables de `.env.development`.

### Compilación para producción

```bash
npm run build:prod
```
Esto generará la carpeta `dist` usando las variables de `.env.production`.

---

## 5. Subir la carpeta `dist` al servidor

> **IMPORTANTE:** Usa siempre la rama `updateUsers` para subir y desplegar los cambios en el servidor. No uses la rama `main`.

Conéctate al servidor donde se aloja la aplicación (por ejemplo, por FTP, SFTP o SSH) y reemplaza la carpeta `dist` antigua por la nueva.

### Ejemplo para servidor de **producción**

IP: `172.21.7.121`

```bash
scp -r dist usuario@172.21.7.121:/ruta/del/proyecto/
```

### Ejemplo para servidor de **pruebas**

IP: `172.21.7.113`

```bash
scp -r dist usuario@172.21.7.113:/ruta/del/proyecto/
```

> Cambia `usuario` por tu usuario en el servidor y `/ruta/del/proyecto/` por la ruta real donde debe ir la carpeta `dist`.

O usa la herramienta de despliegue que utilices normalmente.

---

## 6. Verificar el despliegue

Abre la aplicación en el navegador y verifica que todo funcione correctamente.

---

**¡Listo! Así puedes agregar usuarios, compilar y desplegar la aplicación usando la rama correcta.** 