# Documentación Técnica - Frontend Reservas UCompensar

## 1. Información General

### 1.1 Descripción del Proyecto
Sistema de reservas para espacios académicos de la Universidad Compensar, que permite la gestión de reservas de espacios coworking y otros tipos de espacios institucionales.

### 1.2 Tecnologías Principales
- **Framework Principal:** React 18.3.1
- **Bundler:** Vite 6.2.3
- **Lenguaje:** JavaScript (ES6+)
- **Estilos:** TailwindCSS 3.4.15
- **Autenticación:** Microsoft Authentication Library (MSAL) v4.0.2

### 1.3 Entornos
- **Desarrollo:** https://pruebas.reserva.ucompensar.edu.co/
- **Producción:** https://reservas.ucompensar.edu.co/

## 2. Estructura del Proyecto

### 2.1 Directorios Principales


### 2.2 Componentes Principales
- **App.jsx:** Componente raíz y manejo de rutas
- **Header.jsx:** Barra de navegación y manejo de autenticación
- **SearchFilters.jsx:** Filtros de búsqueda
- **ResultsTable.jsx:** Visualización de espacios disponibles
- **ReservationModal.jsx:** Modal para realizar reservas
- **AdminReservationsView.jsx:** Vista de administración de reservas
- **ReportsView.jsx:** Vista de reportes

## 3. Autenticación y Autorización

### 3.1 Microsoft SSO
- Implementado usando @azure/msal-react y @azure/msal-browser
- Configuración en `/src/Services/SSOServices/authConfig.js`
- Roles de usuario definidos en `/src/config/adminRoles.js`

### 3.2 Niveles de Acceso
- **Super Admin:** Acceso total al sistema
- **Admin:** Gestión de reservas y reportes
- **Reports Viewer:** Solo acceso a reportes
- **Usuario:** Reservas básicas

## 4. Características Principales

### 4.1 Gestión de Reservas
- Búsqueda y filtrado de espacios
- Reserva de espacios coworking y multipropósito
- Calendario de disponibilidad
- Gestión de horarios y franjas

### 4.2 Sistema de Filtros
- Filtros por tipo de espacio
- Filtros por fecha y hora
- Filtros por ubicación (piso)
- Búsqueda por código

### 4.3 Calendario
- Implementado con react-big-calendar
- Vista mensual con indicadores de disponibilidad
- Selección de fechas y horarios
- Visualización de reservas existentes

## 5. Servicios API

### 5.1 Principales Endpoints
- `/reservas/filtrar`: Búsqueda de espacios
- `/reservas/crear`: Creación de reservas
- `/mis-reservas`: Listar reservas del usuario
- `/reservas/disponibilidad`: Verificar disponibilidad

### 5.2 Manejo de Errores
- Sistema centralizado de notificaciones con react-hot-toast
- Interceptores axios para manejo de errores de API
- Renovación automática de tokens

## 6. Estado y Gestión de Datos

### 6.1 Estado Local
- Uso de useState para estado de componentes
- useEffect para efectos secundarios
- Contextos para datos globales

### 6.2 Comunicación con Backend
- Axios para requests HTTP
- Interceptores para manejo de tokens
- Transformación de datos en servicios

## 7. Diseño y UI

### 7.1 Framework CSS
- TailwindCSS para estilos
- Sistema de colores personalizado
- Componentes responsive

### 7.2 Componentes UI
- Modal system para reservas
- Calendario interactivo
- Tablas de datos paginadas
- Filtros dinámicos

## 8. Variables de Entorno

### 8.1 Desarrollo (.env.development)