# Arquitectura Técnica - Sistema de Reservas UCompensar

## 1. Arquitectura General

### 1.1 Patrón de Arquitectura
El sistema sigue una arquitectura **Single Page Application (SPA)** con React, implementando el patrón **Component-Based Architecture** y **Service Layer Pattern**.

### 1.2 Stack Tecnológico
```
Frontend:
├── React 18.3.1 (Framework principal)
├── Vite 6.2.3 (Bundler y dev server)
├── TailwindCSS 3.4.15 (Framework CSS)
├── MSAL v4.0.2 (Autenticación Microsoft)
├── react-big-calendar (Componente de calendario)
├── react-hot-toast (Sistema de notificaciones)
├── date-fns (Manejo de fechas)
├── axios (Cliente HTTP)
└── Lucide React + Heroicons (Iconografía)

Herramientas de Desarrollo:
├── ESLint (Linting)
├── PostCSS (Procesamiento CSS)
└── Vite (Build tool)
```

## 2. Estructura de Componentes

### 2.1 Jerarquía de Componentes
```
App.jsx (Componente raíz)
├── Header.jsx (Navegación y autenticación)
├── SearchFilters.jsx (Filtros de búsqueda)
├── ResultsTable.jsx (Tabla de resultados)
├── ReservationModal.jsx (Modal de reservas)
│   ├── ModalHeader.jsx
│   ├── Tabs.jsx
│   ├── InfoTab.jsx
│   ├── AvailabilityTab.jsx
│   ├── TimeSelector.jsx
│   ├── ReservationDetails.jsx
│   └── ConfirmButton.jsx
├── AdminReservationsView.jsx (Panel administrativo)
│   ├── AdminSearchFilters.jsx
│   └── ReservationList.jsx
├── ReportsView.jsx (Vista de reportes)
│   └── BarList.jsx
├── Calendar/ (Componentes de calendario)
│   ├── ReservationCalendar.jsx
│   ├── ReservationList.jsx
│   └── MyReservationList.jsx
├── SSOComponents/ (Componentes de autenticación)
│   ├── SignInButton.jsx
│   └── SignOutButton.jsx
├── UtilComponents/ (Componentes utilitarios)
│   ├── LoadingSpinner.jsx
│   ├── Confirmation.jsx
│   ├── Pagination.jsx
│   ├── Carousel.jsx
│   └── CancelButton.jsx
└── Footer.jsx
```

### 2.2 Patrones de Componentes

#### Container/Presentational Pattern
- **Container Components:** Manejan lógica de negocio y estado
- **Presentational Components:** Se enfocan en la presentación

#### Compound Components
- `ReservationModal` y sus subcomponentes
- `AdminReservationsView` con filtros y lista

#### Higher-Order Components (HOC)
- Componentes que envuelven otros para agregar funcionalidad
- Ejemplo: Componentes con manejo de autenticación

## 3. Gestión de Estado

### 3.1 Estado Local (useState)
```javascript
// Ejemplo de estado en componente
const [filters, setFilters] = useState({
    capacidad: "",
    espacio: "",
    ubicacion: "",
    fecha: "",
    horaInicio: "",
    horaFinal: "",
    palabra: "",
    id: ""
});
```

### 3.2 Estado Global
- **localStorage:** Persistencia de datos de usuario
- **Context API:** Datos compartidos entre componentes
- **URL State:** Parámetros de búsqueda en URL

### 3.3 Patrones de Estado

#### State Lifting
- Estado compartido entre componentes hermanos
- Ejemplo: Filtros compartidos entre búsqueda y resultados

#### Derived State
- Estado calculado a partir de otros estados
- Ejemplo: Horarios disponibles calculados desde disponibilidad

## 4. Servicios y Comunicación con API

### 4.1 Arquitectura de Servicios
```
Services/
├── authService.js (Autenticación y tokens)
├── createReservationService.js (Creación de reservas)
├── getDisponibilidadService.js (Verificación de disponibilidad)
├── getMisReservas.js (Obtener reservas del usuario)
├── adminReservasService.js (Servicios administrativos)
├── reportsService.js (Servicios de reportes)
├── checkInService.js (Servicios de check-in)
├── deleteReservaService.js (Eliminación de reservas)
├── DownloadReport.js (Exportación de reportes)
└── SSOServices/
    ├── authConfig.js (Configuración MSAL)
    └── graphService.js (Microsoft Graph API)
```

### 4.2 Patrón de Servicios
```javascript
// Ejemplo de servicio
export const createReservation = async (reservationData) => {
    try {
        const response = await axiosInstance.post(
            `${API_BASE_URL}/reservas/crear`, 
            reservationData
        );
        
        if (response.data.status === "success") {
            return response.data;
        } else {
            throw new Error(response.data.message);
        }
    } catch (error) {
        throw new Error(error.response?.data?.message || error.message);
    }
};
```

### 4.3 Interceptores Axios
```javascript
// Configuración de interceptores
axiosInstance.interceptors.request.use(
    (config) => {
        // Agregar token de autenticación
        const token = getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Renovar token o redirigir a login
            handleTokenRefresh();
        }
        return Promise.reject(error);
    }
);
```

## 5. Autenticación y Autorización

### 5.1 Microsoft SSO con MSAL
```javascript
// Configuración MSAL
export const msalConfig = {
    auth: {
        clientId: import.meta.env.VITE_MSAL_CLIENT_ID,
        authority: `https://login.microsoftonline.com/${import.meta.env.VITE_MSAL_TENANT_ID}`,
        redirectUri: import.meta.env.VITE_MSAL_REDIRECT_URI,
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false,
    }
};
```

### 5.2 Sistema de Roles
```javascript
// Configuración de roles
export const ADMIN_ROLES = {
    SUPER_ADMIN: 'super_admin',
    ADMIN: 'admin',
    REPORTS_VIEWER: 'reports_viewer',
    USER: 'user'
};

export const AUTHORIZED_EMAILS = {
    super_admin: ['tecnologia@ucompensar.edu.co'],
    admin: [
        'ndmartinezo@ucompensar.edu.co',
        'admon.campus@ucompensar.edu.co',
        // ... más emails
    ],
    reports_viewer: [
        'jcjimeneza@ucompensar.edu.co',
        // ... más emails
    ]
};
```

### 5.3 Verificación de Permisos
```javascript
// Función de verificación de permisos
export const hasAdminAccess = (email) => {
    const role = getUserRole(email);
    return role === ADMIN_ROLES.SUPER_ADMIN || role === ADMIN_ROLES.ADMIN;
};

export const canAccessReports = (email) => {
    const role = getUserRole(email);
    return role === ADMIN_ROLES.SUPER_ADMIN || 
           role === ADMIN_ROLES.ADMIN || 
           role === ADMIN_ROLES.REPORTS_VIEWER;
};
```

## 6. Manejo de Errores

### 6.1 Estrategia de Manejo de Errores
```javascript
// Patrón de manejo de errores
const handleApiCall = async () => {
    try {
        setLoading(true);
        const result = await apiCall();
        setData(result);
    } catch (error) {
        console.error('Error:', error);
        toast.error(error.message || 'Error inesperado');
    } finally {
        setLoading(false);
    }
};
```

### 6.2 Tipos de Errores
- **Errores de Red:** Timeout, conexión perdida
- **Errores de API:** 400, 401, 403, 500
- **Errores de Validación:** Datos inválidos
- **Errores de Autenticación:** Token expirado, sin permisos

### 6.3 Sistema de Notificaciones
```javascript
// Configuración de toast
import { toast } from 'react-hot-toast';

// Éxito
toast.success('Reserva creada exitosamente');

// Error
toast.error('Error al crear la reserva', {
    duration: 4000,
    position: 'top-right',
    style: {
        background: '#fee2e2',
        color: '#dc2626',
    },
});
```

## 7. Optimizaciones de Rendimiento

### 7.1 Lazy Loading
```javascript
// Carga diferida de componentes
const AdminReservationsView = lazy(() => import('./components/AdminReservations/AdminReservationsView'));
const ReportsView = lazy(() => import('./components/Reports/ReportsView'));
```

### 7.2 Memoización
```javascript
// Uso de useMemo para cálculos costosos
const filteredReservations = useMemo(() => {
    return reservations.filter(reservation => 
        reservation.estado === filters.estado
    );
}, [reservations, filters.estado]);

// Uso de useCallback para funciones
const handleFilterChange = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
}, []);
```

### 7.3 Paginación
```javascript
// Implementación de paginación
const [currentPage, setCurrentPage] = useState(1);
const [perPage, setPerPage] = useState(10);

const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * perPage;
    const endIndex = startIndex + perPage;
    return data.slice(startIndex, endIndex);
}, [data, currentPage, perPage]);
```

## 8. Patrones de Diseño

### 8.1 Observer Pattern
- React hooks como useEffect
- Event listeners para cambios de estado
- Suscripciones a cambios de datos

### 8.2 Factory Pattern
- Creación de componentes dinámicos
- Generación de filtros basados en configuración
- Creación de eventos de calendario

### 8.3 Strategy Pattern
- Diferentes estrategias de filtrado
- Múltiples métodos de exportación
- Varios tipos de validación

### 8.4 Template Method Pattern
- Estructura común en modales
- Flujos de reserva estandarizados
- Procesos de autenticación

## 9. Configuración de Build

### 9.1 Vite Configuration
```javascript
// vite.config.js
export default defineConfig({
    plugins: [react()],
    build: {
        outDir: 'dist',
        sourcemap: false,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                    msal: ['@azure/msal-browser', '@azure/msal-react'],
                    calendar: ['react-big-calendar', 'date-fns']
                }
            }
        }
    },
    server: {
        port: 5173,
        proxy: {
            '/api': {
                target: 'https://pruebas.reserva.ucompensar.edu.co',
                changeOrigin: true
            }
        }
    }
});
```

### 9.2 Variables de Entorno
```bash
# .env.development
VITE_API_URL=https://pruebas.reserva.ucompensar.edu.co/api
VITE_MSAL_CLIENT_ID=development_client_id
VITE_MSAL_TENANT_ID=development_tenant_id
VITE_MSAL_REDIRECT_URI=http://localhost:5173

# .env.production
VITE_API_URL=https://reservas.ucompensar.edu.co/api
VITE_MSAL_CLIENT_ID=production_client_id
VITE_MSAL_TENANT_ID=production_tenant_id
VITE_MSAL_REDIRECT_URI=https://reservas.ucompensar.edu.co
```

## 10. Testing Strategy

### 10.1 Tipos de Testing
- **Unit Testing:** Componentes individuales
- **Integration Testing:** Flujos completos
- **E2E Testing:** Casos de uso completos

### 10.2 Herramientas de Testing
- Jest para testing unitario
- React Testing Library para testing de componentes
- Cypress para testing E2E

## 11. Monitoreo y Analytics

### 11.1 Métricas de Rendimiento
- Time to First Byte (TTFB)
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Cumulative Layout Shift (CLS)

### 11.2 Error Tracking
- Console errors
- Network errors
- User interactions
- Performance metrics

## 12. Seguridad

### 12.1 Headers de Seguridad
```javascript
// Configuración de headers
{
    'Content-Security-Policy': "default-src 'self'",
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
}
```

### 12.2 Validación de Inputs
```javascript
// Sanitización de datos
const sanitizeInput = (input) => {
    return input.replace(/[<>]/g, '');
};

// Validación de fechas
const isValidDate = (date) => {
    return date instanceof Date && !isNaN(date);
};
```

## 13. Deployment y CI/CD

### 13.1 Build Process
```bash
# Comandos de build
npm run build          # Build de producción
npm run preview        # Preview del build
npm run dev           # Servidor de desarrollo
```

### 13.2 Configuración de Servidor
- Servidor web configurado para SPA
- Redirección de rutas a index.html
- Compresión gzip/brotli
- Headers de caché optimizados

### 13.3 Variables de Entorno por Entorno
- Desarrollo: Configuración local
- Staging: Configuración de pruebas
- Producción: Configuración de producción

## 14. Mantenimiento y Escalabilidad

### 14.1 Código Limpio
- Nomenclatura consistente
- Funciones pequeñas y enfocadas
- Documentación inline
- Separación de responsabilidades

### 14.2 Refactoring Strategy
- Identificación de código duplicado
- Extracción de componentes reutilizables
- Optimización de re-renders
- Mejora de performance

### 14.3 Versionado
- Semantic Versioning (SemVer)
- Changelog mantenido
- Release notes detalladas
- Rollback procedures 