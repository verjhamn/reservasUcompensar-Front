# Services Documentation

## API Endpoints

### Autenticación
- **POST** `/auth/login` - Iniciar sesión
- **POST** `/auth/register` - Registro de usuario

### Reservas

#### Check-in/Check-out
- **POST** `/reservas/check-in` - Check-in de usuario regular
- **POST** `/reservas/check-in-admin` - Check-in de administrador
- **POST** `/reservas/checkout` - Check-out (tanto usuario como admin)

#### Gestión de Reservas
- **POST** `/reservas/crear` - Crear nueva reserva
- **DELETE** `/reservas/{id}` - Eliminar/cancelar reserva
- **GET** `/mis-reservas` - Obtener reservas del usuario actual
- **POST** `/reservas/filtrar` - Filtrar reservas (admin)

#### Disponibilidad
- **POST** `/reservas/disponibilidad` - Consultar disponibilidad de espacios

### Espacios
- **POST** `/espacios/filtrar` - Filtrar espacios disponibles

### Reportes
- **GET** `/reportes/general` - Obtener reportes generales
- **GET** `/reportes/general-excel` - Descargar reportes en Excel

## Estado de Consistencia

### ✅ Inconsistencias Corregidas

#### 1. Uso de API_URL
- ✅ **Corregido**: Todos los servicios ahora usan `${API_URL}/endpoint`
- ✅ **Unificado**: `getDisponibilidadService.js` y `adminReservasService.js` actualizados

#### 2. Endpoints Centralizados
- ✅ **Implementado**: `apiEndpoints.js` contiene todos los endpoints
- ✅ **Documentado**: README actualizado con todos los endpoints

### 📝 Notas de Implementación

#### Naming de Endpoints
- **Backend usa**: `/reservas/checkout` (no `/reservas/check-out`)
- **Frontend respeta**: La convención del backend para mantener compatibilidad

#### Configuración Centralizada
```javascript
// Todos los servicios ahora usan:
const API_URL = import.meta.env.VITE_API_URL;
const response = await axiosInstance.post(`${API_URL}/endpoint`, data);
```

## Uso de Endpoints Centralizados

### Importar desde apiEndpoints.js
```javascript
import { API_ENDPOINTS, getDeleteReservationEndpoint } from './apiEndpoints';

// Usar endpoints predefinidos
const response = await axiosInstance.post(API_ENDPOINTS.CHECK_IN, data);

// Usar helpers para endpoints dinámicos
const deleteUrl = getDeleteReservationEndpoint(reservationId);
```

## Servicios por Funcionalidad

### Check-in/Check-out
- `checkInService.js` - Servicios de check-in y check-out

### Gestión de Reservas
- `createReservationService.js` - Crear reservas
- `deleteReservaService.js` - Eliminar reservas
- `getMisReservas.js` - Obtener reservas del usuario
- `adminReservasService.js` - Gestión administrativa

### Disponibilidad
- `getDisponibilidadService.js` - Consultar disponibilidad y validaciones

### Autenticación
- `authService.js` - Configuración de axios y autenticación
- `SSOServices/` - Servicios de Single Sign-On

### Reportes
- `reportsService.js` - Generación de reportes
- `DownloadReport.js` - Descarga de archivos

## Notas de Implementación

- Todos los servicios usan `axiosInstance` de `authService.js`
- Los endpoints de check-in tienen validaciones específicas por rol
- La disponibilidad se consulta con diferentes parámetros según el caso de uso
- Los reportes incluyen funcionalidad de descarga de archivos Excel
