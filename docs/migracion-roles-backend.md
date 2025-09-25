# Migración de Roles del Frontend al Backend

## 📋 Resumen de Cambios

Se ha migrado el sistema de roles desde el frontend (emails hardcodeados) hacia un sistema basado en roles que vienen del backend a través del endpoint `/login`.

## 🔄 Cambios Implementados

### 1. **Servicio de Autenticación (`src/Services/authService.js`)**
- ✅ Agregadas funciones `getUserRoles()` y `setUserRoles()`
- ✅ Actualizada función `fetchAuthToken()` para guardar roles del backend
- ✅ Actualizada función de registro para manejar roles
- ✅ Actualizada función `clearAuth()` para limpiar roles

### 2. **Utilidades de Usuario (`src/utils/userHelper.js`)**
- ✅ Creada función `getUserRoleFromBackend()` que lee roles desde localStorage
- ✅ Actualizada función `hasAdminAccess()` para usar roles del backend
- ✅ Actualizadas funciones `canAccessReports()` y `canReserveAnySpace()`
- ✅ Mantenida función `getUserRole()` para compatibilidad

### 3. **Componente Header (`src/components/Header.jsx`)**
- ✅ Actualizadas funciones `getUserRoleLabel()` y `getRoleColor()`
- ✅ Eliminada dependencia del email para determinar roles

### 4. **Componente Principal (`src/App.jsx`)**
- ✅ Actualizada verificación de permisos para usar roles del backend

### 5. **Nuevo Archivo de Configuración (`src/config/backendRoles.js`)**
- ✅ Creadas constantes para mapear IDs de roles del backend
- ✅ Función helper `getRoleNameById()`

## 🎯 Mapeo de Roles

| Role ID | Nombre | Privilegios |
|---------|--------|-------------|
| 1 | Superadministrador | Acceso total al sistema |
| 2 | Administrador | Gestión de reservas y reportes |
| 3 | Reportes | Solo acceso a reportes |
| Sin roles | Usuario Estándar | Reservas básicas |

## 📊 Estructura del JSON del Backend

```json
{
  "status": true,
  "message": "Sesión iniciada correctamente",
  "data": {
    "id": "3bcca725-11b1-47ca-9996-8a7a6d006f04",
    "displayName": "Andres Felipe Verjhamn Urian",
    "givenName": "Andres Felipe",
    "surname": "Verjhamn Urian",
    "email": "afurianv@ucompensar.edu.co",
    "jobTitle": "Desarrollador De Aplicaciones E Integraciones",
    "email_verified_at": null,
    "created_at": "2025-02-04T21:55:49.000000Z",
    "updated_at": "2025-02-04T21:55:49.000000Z",
    "roles": [
      {
        "id": 1,
        "name": "Superadministrador",
        "guard_name": "web",
        "created_at": "2025-09-24T20:56:37.000000Z",
        "updated_at": "2025-09-24T20:56:37.000000Z",
        "pivot": {
          "model_type": "App\\Models\\User",
          "model_id": "3bcca725-11b1-47ca-9996-8a7a6d006f04",
          "role_id": 1
        }
      }
    ]
  },
  "token": "94|ElmbM67khhXp9B6Usm5tZRvAqIlGnS0M1BrG12e0190fd2a5",
  "roles": [
    "Superadministrador"
  ]
}
```

## 🔧 Funciones Principales

### `getUserRoleFromBackend()`
- Lee los roles desde localStorage
- Determina el rol principal basado en el mayor privilegio
- Retorna el rol correspondiente usando las constantes `ADMIN_ROLES`

### `hasAdminAccess()`
- Verifica si el usuario tiene permisos de administrador
- Retorna `true` para Superadministrador y Administrador

### `canAccessReports()`
- Verifica si el usuario puede acceder a reportes
- Retorna `true` para Superadministrador, Administrador y Reportes

## 🚀 Beneficios de la Migración

1. **Seguridad Mejorada**: Los roles ahora se manejan desde el backend
2. **Flexibilidad**: Los roles se pueden modificar sin cambios en el frontend
3. **Escalabilidad**: Fácil agregar nuevos roles desde el backend
4. **Mantenibilidad**: Eliminada la lista hardcodeada de emails

## ⚠️ Consideraciones

- El archivo `src/config/adminRoles.js` mantiene las constantes pero ya no se usan los emails hardcodeados
- Las funciones existentes mantienen compatibilidad hacia atrás
- Los roles se almacenan en localStorage bajo la clave `userRoles`

## 🧪 Testing

Para probar la implementación:

1. **Usuario con rol 1 (Superadministrador)**: Debe ver todos los botones
2. **Usuario con rol 2 (Administrador)**: Debe ver botones de Admin y Reportes
3. **Usuario con rol 3 (Reportes)**: Solo debe ver botón de Reportes
4. **Usuario sin roles**: Solo debe ver botón de Mis Reservas

## 📝 Archivos Modificados

- `src/Services/authService.js`
- `src/utils/userHelper.js`
- `src/components/Header.jsx`
- `src/App.jsx`
- `src/config/backendRoles.js` (nuevo)

## 📝 Archivos Sin Cambios

- `src/config/adminRoles.js` (mantiene constantes para compatibilidad)
