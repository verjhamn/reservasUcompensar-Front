# Casos de Uso Detallados - Sistema de Reservas UCompensar

## 1. Diagramas de Flujo del Sistema

### 1.1 Flujo Principal de Autenticación
```
Usuario accede al sistema
         ↓
¿Está autenticado?
         ↓ NO
Mostrar modal informativo
         ↓
Usuario hace clic en "Iniciar Sesión"
         ↓
Redirección a Microsoft SSO
         ↓
Autenticación exitosa
         ↓
Retorno con access token
         ↓
Obtener datos del usuario via Graph API
         ↓
Almacenar en localStorage
         ↓
Verificar permisos y roles
         ↓
Mostrar interfaz según rol
```

### 1.2 Flujo de Creación de Reserva
```
Usuario selecciona espacio
         ↓
Abrir modal de reserva
         ↓
Mostrar pestaña "Info"
         ↓
Usuario navega a "Disponibilidad"
         ↓
Cargar calendario interactivo
         ↓
Usuario selecciona fecha
         ↓
Verificar disponibilidad
         ↓
Usuario selecciona horarios
         ↓
Validar selección
         ↓
Usuario completa información
         ↓
Validar datos
         ↓
Confirmar reserva
         ↓
Crear reserva en backend
         ↓
Mostrar confirmación
         ↓
Redireccionar a "Mis Reservas"
```

### 1.3 Flujo de Check-in Automático
```
Usuario accede via URL /espacio/{codigo}
         ↓
Extraer código del espacio
         ↓
¿Usuario está autenticado?
         ↓ NO
Redireccionar a login
         ↓ SÍ
Obtener fecha actual
         ↓
Verificar disponibilidad del espacio
         ↓
¿Usuario tiene reserva para hoy?
         ↓ NO
Continuar flujo normal
         ↓ SÍ
¿Es momento de check-in? (15 min antes o durante la reserva)
         ↓ NO
Continuar flujo normal
         ↓ SÍ
¿Estado de reserva es "Creada"?
         ↓ NO
Continuar flujo normal
         ↓ SÍ
Mostrar modal de check-in
         ↓
Usuario confirma check-in
         ↓
Actualizar estado a "Confirmada"
         ↓
Mostrar confirmación
```

## 2. Casos de Uso Detallados

### 2.1 UC-001: Reservar Espacio Coworking

**Actor:** Usuario autenticado del sistema
**Objetivo:** Reservar un espacio coworking para uso personal
**Alcance:** Sistema de reservas de la Universidad Compensar

**Precondiciones:**
- Usuario ha iniciado sesión exitosamente
- Usuario tiene permisos para crear reservas
- Existen espacios coworking disponibles

**Flujo Principal:**
1. **Inicio:** Usuario navega a la página principal del sistema
2. **Búsqueda:** Usuario aplica filtros para encontrar espacios coworking:
   - Selecciona "Coworking" en tipo de espacio
   - Especifica fecha deseada
   - Define horario de preferencia
3. **Resultados:** Sistema muestra espacios disponibles que coinciden con los criterios
4. **Selección:** Usuario selecciona un espacio específico
5. **Modal:** Se abre el modal de reserva con información del espacio
6. **Calendario:** Usuario navega a la pestaña "Disponibilidad"
7. **Fecha:** Usuario selecciona la fecha deseada en el calendario
8. **Horarios:** Sistema muestra horarios disponibles para la fecha seleccionada
9. **Selección:** Usuario selecciona los horarios deseados
10. **Información:** Usuario completa:
    - Título de la reserva
    - Descripción (opcional)
11. **Validación:** Sistema valida:
    - Que la fecha no sea anterior al día actual
    - Que los horarios estén disponibles
    - Que no exceda límites de tiempo
12. **Confirmación:** Usuario confirma la reserva
13. **Creación:** Sistema crea la reserva en el backend
14. **Confirmación:** Sistema muestra mensaje de éxito
15. **Redirección:** Usuario es redirigido a "Mis Reservas"

**Flujos Alternativos:**

**A1 - Fecha anterior:**
- En el paso 7, si el usuario selecciona una fecha anterior al día actual
- Sistema muestra error: "No se puede reservar en días anteriores"
- Volver al paso 7

**A2 - Horarios no disponibles:**
- En el paso 8, si no hay horarios disponibles para la fecha
- Sistema muestra mensaje: "Este día no tiene disponibilidad"
- Volver al paso 7

**A3 - Error de validación:**
- En el paso 11, si hay errores de validación
- Sistema muestra errores específicos
- Usuario corrige la información
- Volver al paso 10

**Postcondiciones:**
- Reserva creada en estado "Creada"
- Espacio marcado como ocupado para los horarios seleccionados
- Usuario puede ver la reserva en "Mis Reservas"

**Requisitos Especiales:**
- El sistema debe validar que el usuario no tenga reservas superpuestas
- Los espacios coworking tienen límites de tiempo específicos
- Se debe mostrar confirmación antes de crear la reserva

### 2.2 UC-002: Cancelar Reserva

**Actor:** Usuario autenticado del sistema
**Objetivo:** Cancelar una reserva existente
**Alcance:** Sistema de reservas de la Universidad Compensar

**Precondiciones:**
- Usuario ha iniciado sesión
- Usuario tiene reservas activas
- La reserva no está en estado "Completada"

**Flujo Principal:**
1. **Inicio:** Usuario accede a la sección "Mis Reservas"
2. **Lista:** Sistema muestra todas las reservas del usuario
3. **Selección:** Usuario selecciona la reserva a cancelar
4. **Confirmación:** Sistema muestra modal de confirmación
5. **Confirmar:** Usuario confirma la cancelación
6. **Cancelación:** Sistema cancela la reserva
7. **Confirmación:** Sistema muestra mensaje de éxito
8. **Actualización:** Lista de reservas se actualiza

**Flujos Alternativos:**

**A1 - Usuario cancela:**
- En el paso 4, si el usuario cancela la operación
- Modal se cierra
- No se realiza ninguna acción

**A2 - Error de cancelación:**
- En el paso 6, si hay error al cancelar
- Sistema muestra mensaje de error
- Reserva permanece activa

**Postcondiciones:**
- Reserva en estado "Cancelada"
- Espacio disponible nuevamente para los horarios
- Usuario recibe confirmación de cancelación

### 2.3 UC-003: Check-in de Reserva

**Actor:** Usuario autenticado del sistema
**Objetivo:** Confirmar la llegada al espacio reservado
**Alcance:** Sistema de reservas de la Universidad Compensar

**Precondiciones:**
- Usuario ha iniciado sesión
- Usuario tiene reserva para el día actual
- Reserva está en estado "Creada"

**Flujo Principal:**
1. **Acceso:** Usuario accede via URL específica del espacio (/espacio/{codigo})
2. **Detección:** Sistema detecta automáticamente la reserva del usuario
3. **Modal:** Sistema muestra modal de check-in
4. **Información:** Modal muestra detalles de la reserva
5. **Confirmación:** Usuario confirma el check-in
6. **Actualización:** Sistema actualiza estado a "Confirmada"
7. **Confirmación:** Sistema muestra mensaje de éxito

**Flujos Alternativos:**

**A1 - Sin reserva para hoy:**
- En el paso 2, si el usuario no tiene reserva para hoy
- Sistema continúa con flujo normal de búsqueda

**A2 - Reserva ya confirmada:**
- En el paso 2, si la reserva ya está en estado "Confirmada"
- Sistema muestra mensaje: "Reserva ya confirmada"
- No se muestra modal de check-in

**Postcondiciones:**
- Reserva en estado "Confirmada"
- Sistema registra hora de check-in
- Usuario puede acceder al espacio

### 2.4 UC-004: Gestionar Reservas (Administrador)

**Actor:** Administrador del sistema
**Objetivo:** Gestionar todas las reservas del sistema
**Alcance:** Sistema de reservas de la Universidad Compensar

**Precondiciones:**
- Usuario ha iniciado sesión
- Usuario tiene permisos de administrador
- Existen reservas en el sistema

**Flujo Principal:**
1. **Acceso:** Administrador accede al panel de administración
2. **Carga:** Sistema carga todas las reservas del sistema
3. **Visualización:** Reservas se muestran en calendario y lista
4. **Filtros:** Administrador aplica filtros según necesidades:
   - Por usuario/email
   - Por tipo de espacio
   - Por estado de reserva
   - Por piso/ubicación
   - Por palabra clave
5. **Acciones:** Administrador puede realizar acciones:
   - Ver detalles completos
   - Cancelar reservas
   - Filtrar por fecha específica
6. **Confirmación:** Para acciones críticas, sistema solicita confirmación
7. **Actualización:** Sistema actualiza estados y muestra confirmación

**Flujos Alternativos:**

**A1 - Sin permisos:**
- En el paso 1, si el usuario no tiene permisos de admin
- Sistema redirige a página principal
- Muestra mensaje de acceso denegado

**A2 - Error de carga:**
- En el paso 2, si hay error al cargar reservas
- Sistema muestra mensaje de error
- Permite reintentar la carga

**Postcondiciones:**
- Estados de reservas actualizados según acciones
- Usuarios notificados de cambios en sus reservas
- Sistema registra todas las acciones administrativas

### 2.5 UC-005: Generar Reportes

**Actor:** Usuario con permisos de reportes
**Objetivo:** Generar reportes de uso de espacios
**Alcance:** Sistema de reservas de la Universidad Compensar

**Precondiciones:**
- Usuario ha iniciado sesión
- Usuario tiene permisos de reportes
- Existen datos de reservas en el sistema

**Flujo Principal:**
1. **Acceso:** Usuario accede a la sección de reportes
2. **Carga:** Sistema carga automáticamente todos los datos
3. **Filtros:** Usuario aplica filtros deseados:
   - Por estado (Creada/Cancelada)
   - Por fecha de registro
   - Por fecha de reserva
   - Por usuario
   - Por código de espacio
4. **Visualización:** Datos se muestran en tabla paginada
5. **Ordenamiento:** Usuario puede ordenar por cualquier columna
6. **Exportación:** Usuario puede exportar reporte a Excel
7. **Descarga:** Sistema genera archivo Excel para descarga

**Flujos Alternativos:**

**A1 - Sin datos:**
- En el paso 2, si no hay datos disponibles
- Sistema muestra mensaje: "No hay datos para mostrar"

**A2 - Error de exportación:**
- En el paso 6, si hay error al exportar
- Sistema muestra mensaje de error
- Permite reintentar la exportación

**Postcondiciones:**
- Reporte generado con datos filtrados
- Archivo Excel disponible para descarga
- Datos organizados según criterios del usuario

## 3. Especificaciones Técnicas Detalladas

### 3.1 Estados de Reserva y Transiciones

```
Estado: CREADA
- Descripción: Reserva recién creada, pendiente de confirmación
- Acciones permitidas: Check-in, Cancelar
- Duración: Hasta check-in o cancelación

Estado: CONFIRMADA  
- Descripción: Usuario ha hecho check-in, reserva activa
- Acciones permitidas: Check-out automático
- Duración: Hasta finalizar horario de reserva

Estado: COMPLETADA
- Descripción: Reserva finalizada (check-out automático)
- Acciones permitidas: Ninguna
- Duración: Permanente

Estado: CANCELADA
- Descripción: Reserva cancelada por usuario o admin
- Acciones permitidas: Ninguna
- Duración: Permanente
```

### 3.2 Validaciones del Sistema

#### Validaciones de Reserva
- **Fecha:** No permitir reservas en días anteriores
- **Horarios:** Verificar disponibilidad real en tiempo real
- **Límites:** Respetar límites de tiempo según tipo de espacio
- **Superposición:** No permitir reservas superpuestas del mismo usuario
- **Capacidad:** Verificar que el espacio no esté al límite de capacidad

#### Validaciones de Usuario
- **Autenticación:** Usuario debe estar autenticado
- **Permisos:** Verificar permisos según rol
- **Límites:** Respetar límites de reservas por usuario
- **Estado:** Verificar estado de cuenta del usuario

### 3.3 Configuración de Roles y Permisos

#### Super Admin
- Acceso total al sistema
- Gestión de todos los usuarios
- Configuración del sistema
- Reportes completos

#### Admin
- Gestión de todas las reservas
- Cancelación de reservas de otros usuarios
- Acceso a reportes
- Gestión de espacios

#### Reports Viewer
- Solo acceso a reportes
- Filtros y exportación
- Sin acceso a gestión de reservas

#### Usuario
- Crear reservas propias
- Cancelar reservas propias
- Ver reservas propias
- Check-in/Check-out

### 3.4 Integración con Microsoft Graph API

#### Datos Obtenidos
- Información del perfil del usuario
- Email corporativo
- Nombre completo
- Departamento/Unidad
- Foto de perfil (opcional)

#### Uso de Datos
- Identificación única del usuario
- Asignación de roles y permisos
- Personalización de la interfaz
- Auditoría de acciones

### 3.5 Manejo de Errores

#### Errores de Autenticación
- Token expirado → Renovación automática
- Token inválido → Redirección a login
- Sin permisos → Mensaje de acceso denegado

#### Errores de API
- Timeout → Reintento automático
- Error 500 → Mensaje de error genérico
- Error 404 → Recurso no encontrado
- Error 403 → Sin permisos

#### Errores de Validación
- Campos requeridos → Mensaje específico
- Formato inválido → Ejemplo de formato correcto
- Límites excedidos → Explicación del límite

## 4. Métricas y Monitoreo

### 4.1 Métricas de Usuario
- Número de reservas por usuario
- Tiempo promedio de uso
- Frecuencia de cancelaciones
- Horarios más populares

### 4.2 Métricas de Sistema
- Tiempo de respuesta de API
- Tasa de errores
- Uso de recursos
- Disponibilidad del sistema

### 4.3 Métricas de Negocio
- Ocupación de espacios
- Eficiencia de uso
- Satisfacción del usuario
- ROI del sistema

## 5. Consideraciones de Seguridad

### 5.1 Autenticación
- Tokens JWT con expiración
- Renovación automática de tokens
- Logout seguro con limpieza de datos
- Protección contra CSRF

### 5.2 Autorización
- Verificación de permisos en cada acción
- Roles basados en email corporativo
- Validación en frontend y backend
- Auditoría de acciones administrativas

### 5.3 Protección de Datos
- No almacenamiento de datos sensibles
- Encriptación de datos en tránsito
- Headers de seguridad configurados
- Validación de inputs para prevenir inyección

## 6. Escalabilidad y Rendimiento

### 6.1 Optimizaciones Frontend
- Lazy loading de componentes
- Paginación de resultados
- Caché de datos frecuentes
- Compresión de assets

### 6.2 Optimizaciones Backend
- Caché de consultas frecuentes
- Índices en base de datos
- Compresión de respuestas
- Rate limiting

### 6.3 Monitoreo de Rendimiento
- Métricas de tiempo de carga
- Análisis de bottlenecks
- Optimización continua
- Alertas de rendimiento 