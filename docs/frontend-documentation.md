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
- **Calendario:** react-big-calendar
- **Notificaciones:** react-hot-toast
- **Iconos:** Lucide React, Heroicons
- **Fechas:** date-fns

### 1.3 Entornos
- **Desarrollo:** https://pruebas.reserva.ucompensar.edu.co/
- **Producción:** https://reservas.ucompensar.edu.co/

## 2. Arquitectura del Sistema

### 2.1 Estructura de Directorios
```
src/
├── components/           # Componentes React
│   ├── AdminFilters/    # Filtros para administradores
│   ├── AdminReservations/ # Vista de administración
│   ├── Calendar/        # Componentes de calendario
│   ├── Reports/         # Componentes de reportes
│   ├── ReservationModal/ # Modal de reservas
│   ├── SSOComponents/   # Componentes de autenticación
│   └── UtilComponents/  # Componentes utilitarios
├── Services/            # Servicios de API
│   └── SSOServices/     # Servicios de autenticación
├── config/              # Configuraciones
├── utils/               # Utilidades
└── assets/              # Recursos estáticos
```

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

### 3.3 Configuración de Roles
```javascript
export const ADMIN_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  REPORTS_VIEWER: 'reports_viewer',
  USER: 'user'
};
```

## 4. Flujos Principales del Sistema

### 4.1 Flujo de Usuario Regular

#### 4.1.1 Autenticación
1. Usuario accede al sistema
2. Se muestra modal informativo (solo primera vez)
3. Usuario hace clic en "Iniciar Sesión"
4. Redirección a Microsoft SSO
5. Autenticación exitosa → retorno con token
6. Obtención de datos del usuario via Graph API
7. Almacenamiento en localStorage
8. Verificación de permisos y roles

#### 4.1.2 Búsqueda de Espacios
1. Usuario aplica filtros (capacidad, tipo, ubicación, fecha, hora)
2. Sistema envía request a `/reservas/filtrar`
3. Respuesta con espacios disponibles
4. Visualización en tabla con paginación
5. Opción de ver detalles del espacio

#### 4.1.3 Creación de Reserva
1. Usuario selecciona espacio
2. Se abre modal de reserva con pestañas:
   - **Info:** Información del espacio
   - **Disponibilidad:** Calendario interactivo
3. Usuario selecciona fecha en calendario
4. Sistema verifica disponibilidad para esa fecha
5. Usuario selecciona horarios disponibles
6. Usuario completa información:
   - Título de la reserva
   - Descripción
   - Horarios seleccionados
7. Validaciones:
   - No reservar en días pasados
   - Verificar disponibilidad real
   - Límites de tiempo según tipo de espacio
8. Confirmación y creación de reserva
9. Redirección a "Mis Reservas"

#### 4.1.4 Gestión de Mis Reservas
1. Vista de calendario con reservas propias
2. Filtros por fecha y estado
3. Opciones de cancelación
4. Visualización de detalles completos

### 4.2 Flujo de Administrador

#### 4.2.1 Panel de Administración
1. Acceso con credenciales de admin
2. Vista de todas las reservas del sistema
3. Filtros avanzados:
   - Por usuario/email
   - Por tipo de espacio
   - Por estado de reserva
   - Por piso/ubicación
   - Por palabra clave

#### 4.2.2 Gestión de Reservas
1. Visualización en calendario y lista
2. Acciones disponibles:
   - Cancelar reservas
   - Ver detalles completos
   - Filtrar por fecha específica
3. Confirmaciones antes de acciones críticas

#### 4.2.3 Sistema de Check-in/Check-out
1. **Check-in automático:**
   - Usuario accede via URL `/espacio/{codigo}`
   - Sistema verifica si tiene reserva para hoy
   - Si tiene reserva → modal de check-in
   - Confirmación → estado "Confirmada"
2. **Check-out automático:**
   - Al finalizar horario de reserva
   - Cambio automático a estado "Completada"

### 4.3 Flujo de Reportes

#### 4.3.1 Generación de Reportes
1. Acceso con permisos de reportes
2. Carga automática de datos del servidor
3. Filtros disponibles:
   - Por estado (Creada/Cancelada)
   - Por fecha de registro
   - Por fecha de reserva
   - Por usuario
   - Por código de espacio
4. Ordenamiento por cualquier columna
5. Paginación de resultados
6. Exportación a Excel

## 5. Casos de Uso Detallados

### 5.1 Casos de Uso de Usuario Regular

#### UC-001: Reservar Espacio Coworking
**Actor:** Usuario autenticado
**Precondiciones:** Usuario ha iniciado sesión
**Flujo Principal:**
1. Usuario navega a la página principal
2. Aplica filtros para encontrar espacios coworking
3. Selecciona un espacio disponible
4. Completa información de reserva
5. Confirma la reserva
6. Sistema crea la reserva
7. Usuario recibe confirmación

**Postcondiciones:** Reserva creada en estado "Creada"

#### UC-002: Cancelar Reserva
**Actor:** Usuario autenticado
**Precondiciones:** Usuario tiene reservas activas
**Flujo Principal:**
1. Usuario accede a "Mis Reservas"
2. Selecciona reserva a cancelar
3. Confirma la cancelación
4. Sistema cancela la reserva
5. Usuario recibe confirmación

**Postcondiciones:** Reserva en estado "Cancelada"

#### UC-003: Check-in de Reserva
**Actor:** Usuario autenticado
**Precondiciones:** Usuario tiene reserva para el día actual
**Flujo Principal:**
1. Usuario accede via URL específica del espacio
2. Sistema detecta reserva del usuario
3. Se muestra modal de check-in
4. Usuario confirma check-in
5. Estado cambia a "Confirmada"

**Postcondiciones:** Reserva en estado "Confirmada"

### 5.2 Casos de Uso de Administrador

#### UC-004: Gestionar Todas las Reservas
**Actor:** Administrador
**Precondiciones:** Usuario tiene permisos de administrador
**Flujo Principal:**
1. Administrador accede al panel de administración
2. Visualiza todas las reservas del sistema
3. Aplica filtros según necesidades
4. Realiza acciones sobre reservas
5. Sistema actualiza estados

**Postcondiciones:** Estados de reservas actualizados

#### UC-005: Cancelar Reserva de Otro Usuario
**Actor:** Administrador
**Precondiciones:** Existe reserva activa de otro usuario
**Flujo Principal:**
1. Administrador selecciona reserva
2. Confirma la cancelación
3. Sistema cancela la reserva
4. Se notifica al usuario propietario

**Postcondiciones:** Reserva cancelada, usuario notificado

### 5.3 Casos de Uso de Reportes

#### UC-006: Generar Reporte General
**Actor:** Usuario con permisos de reportes
**Precondiciones:** Usuario tiene acceso a reportes
**Flujo Principal:**
1. Usuario accede a la sección de reportes
2. Aplica filtros deseados
3. Visualiza datos paginados
4. Exporta reporte si es necesario

**Postcondiciones:** Reporte generado y disponible

## 6. Servicios API

### 6.1 Principales Endpoints
- `/reservas/filtrar`: Búsqueda de espacios
- `/reservas/crear`: Creación de reservas
- `/mis-reservas`: Listar reservas del usuario
- `/reservas/disponibilidad`: Verificar disponibilidad
- `/reservas/admin`: Gestión administrativa
- `/reservas/reportes`: Generación de reportes
- `/reservas/checkin`: Proceso de check-in
- `/reservas/checkout`: Proceso de check-out

### 6.2 Manejo de Errores
- Sistema centralizado de notificaciones con react-hot-toast
- Interceptores axios para manejo de errores de API
- Renovación automática de tokens
- Manejo de errores de autenticación

## 7. Estados de Reserva

### 7.1 Estados Posibles
- **Creada:** Reserva recién creada
- **Confirmada:** Usuario ha hecho check-in
- **Completada:** Reserva finalizada (check-out automático)
- **Cancelada:** Reserva cancelada por usuario o admin

### 7.2 Transiciones de Estado
```
Creada → Confirmada (check-in)
Confirmada → Completada (check-out automático)
Creada/Confirmada → Cancelada (cancelación manual)
```

## 8. Características Técnicas

### 8.1 Gestión de Estado
- Uso de useState para estado de componentes
- useEffect para efectos secundarios
- Contextos para datos globales
- localStorage para persistencia de sesión

### 8.2 Comunicación con Backend
- Axios para requests HTTP
- Interceptores para manejo de tokens
- Transformación de datos en servicios
- Manejo de errores centralizado

### 8.3 Componentes Reutilizables
- Modal system para reservas
- Calendario interactivo
- Tablas de datos paginadas
- Filtros dinámicos
- Componentes de confirmación

## 9. Variables de Entorno

### 9.1 Desarrollo (.env.development)
```
VITE_API_URL=https://pruebas.reserva.ucompensar.edu.co/api
VITE_MSAL_CLIENT_ID=tu_client_id_aqui
VITE_MSAL_TENANT_ID=tu_tenant_id_aqui
VITE_MSAL_REDIRECT_URI=http://localhost:5173
```

### 9.2 Producción (.env.production)
```
VITE_API_URL=https://reservas.ucompensar.edu.co/api
VITE_MSAL_CLIENT_ID=tu_client_id_produccion
VITE_MSAL_TENANT_ID=tu_tenant_id_produccion
VITE_MSAL_REDIRECT_URI=https://reservas.ucompensar.edu.co
```

## 10. Configuración de Despliegue

### 10.1 Build de Producción
```bash
npm run build
```

### 10.2 Configuración de Servidor
- Servidor web configurado para SPA
- Redirección de rutas a index.html
- Headers de seguridad configurados
- CORS configurado para dominios permitidos

## 11. Monitoreo y Logs

### 11.1 Logs del Cliente
- Console.log para debugging
- Errores capturados y reportados
- Métricas de rendimiento

### 11.2 Métricas Importantes
- Tiempo de carga de páginas
- Tiempo de respuesta de API
- Tasa de errores de autenticación
- Uso de funcionalidades por rol

## 12. Seguridad

### 12.1 Autenticación
- Microsoft SSO con MSAL
- Tokens JWT para sesiones
- Renovación automática de tokens
- Logout seguro

### 12.2 Autorización
- Roles basados en email
- Verificación de permisos en frontend
- Validaciones en backend
- Acceso restringido por funcionalidad

### 12.3 Protección de Datos
- No almacenamiento de datos sensibles
- Limpieza de localStorage en logout
- Headers de seguridad configurados
- Validación de inputs

## 13. Mantenimiento y Actualizaciones

### 13.1 Actualización de Dependencias
- Revisión mensual de dependencias
- Actualización de versiones de seguridad
- Testing después de actualizaciones

### 13.2 Backup y Recuperación
- Backup de configuración
- Versionado de código
- Rollback procedures

## 14. Troubleshooting

### 14.1 Problemas Comunes
1. **Error de autenticación:** Verificar configuración MSAL
2. **Error de API:** Verificar conectividad y tokens
3. **Problemas de calendario:** Verificar zona horaria
4. **Errores de filtros:** Verificar formato de fechas

### 14.2 Debugging
- Console logs en desarrollo
- Network tab para requests
- React DevTools para estado
- MSAL logs para autenticación