# Documentación del Sistema de Reservas UCompensar

## 📋 Índice de Documentación

Esta carpeta contiene la documentación completa del sistema de reservas de espacios de la Universidad Compensar. La documentación está organizada en varios archivos para facilitar la navegación y comprensión del proyecto.

## 📚 Archivos de Documentación

### 1. [Documentación Técnica Principal](./frontend-documentation.md)
**Archivo principal con información técnica completa del proyecto.**

**Contenido:**
- Información general del proyecto
- Arquitectura del sistema
- Autenticación y autorización
- Flujos principales del sistema
- Casos de uso detallados
- Servicios API
- Estados de reserva
- Características técnicas
- Variables de entorno
- Configuración de despliegue
- Monitoreo y logs
- Seguridad
- Mantenimiento y actualizaciones
- Troubleshooting

### 2. [Casos de Uso Detallados](./casos-de-uso-detallados.md)
**Documentación específica de casos de uso con diagramas de flujo.**

**Contenido:**
- Diagramas de flujo del sistema
- Casos de uso detallados (UC-001 a UC-006)
- Especificaciones técnicas detalladas
- Estados de reserva y transiciones
- Validaciones del sistema
- Configuración de roles y permisos
- Integración con Microsoft Graph API
- Manejo de errores
- Métricas y monitoreo
- Consideraciones de seguridad
- Escalabilidad y rendimiento

### 3. [Arquitectura Técnica](./arquitectura-tecnica.md)
**Documentación técnica avanzada sobre arquitectura y patrones de diseño.**

**Contenido:**
- Arquitectura general y stack tecnológico
- Estructura de componentes
- Gestión de estado
- Servicios y comunicación con API
- Autenticación y autorización
- Manejo de errores
- Optimizaciones de rendimiento
- Patrones de diseño
- Configuración de build
- Testing strategy
- Monitoreo y analytics
- Seguridad
- Deployment y CI/CD
- Mantenimiento y escalabilidad

## 🎯 Audiencia Objetivo

Esta documentación está diseñada para:

- **Desarrolladores:** Que necesiten entender la arquitectura y contribuir al proyecto
- **Arquitectos de Software:** Que requieran información técnica detallada
- **Product Managers:** Que necesiten entender los flujos y casos de uso
- **DevOps:** Que requieran información de despliegue y configuración
- **QA/Testing:** Que necesiten entender los flujos para crear casos de prueba
- **Stakeholders:** Que requieran una visión general del sistema

## 🚀 Inicio Rápido

### Para Desarrolladores Nuevos
1. Leer [Documentación Técnica Principal](./frontend-documentation.md) para entender el proyecto
2. Revisar [Arquitectura Técnica](./arquitectura-tecnica.md) para entender la implementación
3. Estudiar [Casos de Uso Detallados](./casos-de-uso-detallados.md) para entender los flujos

### Para Product Managers
1. Revisar [Casos de Uso Detallados](./casos-de-uso-detallados.md) para entender funcionalidades
2. Leer sección de flujos en [Documentación Técnica Principal](./frontend-documentation.md)

### Para DevOps
1. Revisar sección de configuración en [Arquitectura Técnica](./arquitectura-tecnica.md)
2. Leer sección de despliegue en [Documentación Técnica Principal](./frontend-documentation.md)

## 📖 Estructura del Proyecto

```
reservasUcompensar-Front/
├── docs/                          # Documentación
│   ├── README.md                  # Este archivo
│   ├── frontend-documentation.md  # Documentación técnica principal
│   ├── casos-de-uso-detallados.md # Casos de uso y flujos
│   └── arquitectura-tecnica.md    # Arquitectura técnica
├── src/                           # Código fuente
│   ├── components/                # Componentes React
│   ├── Services/                  # Servicios de API
│   ├── config/                    # Configuraciones
│   └── utils/                     # Utilidades
├── public/                        # Archivos públicos
└── package.json                   # Dependencias
```

## 🔧 Tecnologías Principales

- **Frontend:** React 18.3.1, Vite 6.2.3
- **Estilos:** TailwindCSS 3.4.15
- **Autenticación:** Microsoft Authentication Library (MSAL) v4.0.2
- **Calendario:** react-big-calendar
- **Notificaciones:** react-hot-toast
- **HTTP Client:** Axios
- **Fechas:** date-fns

## 🌐 Entornos

- **Desarrollo:** https://pruebas.reserva.ucompensar.edu.co/
- **Producción:** https://reservas.ucompensar.edu.co/

## 👥 Roles del Sistema

- **Super Admin:** Acceso total al sistema
- **Admin:** Gestión de reservas y reportes
- **Reports Viewer:** Solo acceso a reportes
- **Usuario:** Reservas básicas

## 📋 Funcionalidades Principales

### Para Usuarios Regulares
- Búsqueda y filtrado de espacios
- Creación de reservas
- Gestión de reservas propias
- Check-in/Check-out automático
- Visualización de calendario personal

### Para Administradores
- Gestión de todas las reservas
- Cancelación de reservas de otros usuarios
- Filtros avanzados
- Visualización en calendario y lista

### Para Reportes
- Generación de reportes detallados
- Filtros por múltiples criterios
- Exportación a Excel
- Ordenamiento y paginación

## 🔐 Seguridad

- Autenticación via Microsoft SSO
- Autorización basada en roles
- Tokens JWT con renovación automática
- Validación de inputs
- Headers de seguridad configurados

## 📊 Métricas y Monitoreo

- Tiempo de respuesta de API
- Tasa de errores
- Uso de funcionalidades por rol
- Métricas de rendimiento del frontend

## 🛠️ Desarrollo

### Comandos Principales
```bash
npm install          # Instalar dependencias
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run preview      # Preview del build
```

### Variables de Entorno
```bash
VITE_API_URL=https://pruebas.reserva.ucompensar.edu.co/api
VITE_MSAL_CLIENT_ID=tu_client_id_aqui
VITE_MSAL_TENANT_ID=tu_tenant_id_aqui
VITE_MSAL_REDIRECT_URI=http://localhost:5173
```

## 📞 Soporte

Para preguntas o problemas relacionados con la documentación:

1. Revisar la sección de [Troubleshooting](./frontend-documentation.md#14-troubleshooting)
2. Consultar los casos de uso específicos en [Casos de Uso Detallados](./casos-de-uso-detallados.md)
3. Revisar la configuración técnica en [Arquitectura Técnica](./arquitectura-tecnica.md)

## 📝 Contribución a la Documentación

Para mantener esta documentación actualizada:

1. Actualizar casos de uso cuando se agreguen nuevas funcionalidades
2. Documentar cambios en la arquitectura técnica
3. Actualizar diagramas de flujo cuando cambien los procesos
4. Mantener la información de configuración actualizada

## 🔄 Versiones

- **v1.0:** Documentación inicial completa
- **v1.1:** Agregados casos de uso detallados
- **v1.2:** Agregada arquitectura técnica
- **v1.3:** Mejorada estructura y navegación

---

**Última actualización:** Diciembre 2024  
**Mantenido por:** Equipo de Desarrollo UCompensar 