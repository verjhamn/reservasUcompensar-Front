# 📊 Guía del Contador de Estadísticas - Vista de Administrador

## 🎯 Descripción

El sistema de contadores de reservas en la vista de administrador incluye dos componentes principales:

1. **Dashboard de Estadísticas** - Panel interactivo con estadísticas generales
2. **Contador Simple** - Resumen compacto en el listado de reservas

---

## 🚀 Funcionalidades Implementadas

### 1. Dashboard de Estadísticas (Encima del Calendario)

#### Características:
- **4 Tarjetas Interactivas:**
  - 🔵 **Total de Reservas** - Todas las reservas
  - 🟢 **Confirmadas** - Reservas confirmadas
  - 🟡 **Creadas** - Reservas creadas
  - 🔴 **Canceladas** - Reservas canceladas

#### Toggle de Visualización:
- **"Todas"**: Muestra estadísticas de todas las reservas según filtros aplicados
- **"Solo del día"**: Muestra solo las estadísticas del día seleccionado en el calendario

#### Interactividad:
- **Clic en cualquier tarjeta**: Filtra el listado por ese estado
- **Clic en la misma tarjeta**: Quita el filtro (toggle)
- **Clic en "Total"**: Limpia el filtro de estado y muestra todas

#### Indicadores Visuales:
- ✅ **Anillo azul**: Indica la tarjeta seleccionada actualmente
- 🔍 **"Clic para filtrar"**: Aparece cuando la tarjeta no está seleccionada
- ✔️ **"Filtro activo"**: Aparece cuando la tarjeta está seleccionada
- 💡 **Banner informativo**: Aparece cuando hay un filtro de estado activo

---

### 2. Contador Simple (Encima del Listado)

#### Características:
- Se muestra solo cuando hay reservas en el día seleccionado
- Muestra el total de reservas del día
- Desglose visual con puntos de color:
  - 🟢 Confirmadas
  - 🟡 Creadas
  - 🔴 Canceladas

---

## 📝 Flujo de Uso

### Escenario 1: Ver estadísticas generales
1. Por defecto, el dashboard muestra "Todas" las reservas según filtros
2. Aplica filtros desde el panel lateral (tipo, piso, etc.)
3. Las estadísticas se actualizan automáticamente

### Escenario 2: Ver estadísticas de un día específico
1. Selecciona un día en el calendario
2. Haz clic en "Solo del día" en el toggle del dashboard
3. Las estadísticas muestran solo ese día
4. El listado de abajo también muestra ese día

### Escenario 3: Filtrar por estado desde las estadísticas
1. Haz clic en la tarjeta "Creadas" (por ejemplo)
2. El filtro de "Estado" en el panel lateral se actualiza a "Creada"
3. El listado muestra solo las reservas creadas
4. La tarjeta "Creadas" muestra el anillo azul de selección
5. Aparece un banner informativo: "Filtrado por estado: Creada"

### Escenario 4: Quitar el filtro de estado
Hay dos formas:
- **Opción A**: Haz clic nuevamente en la misma tarjeta seleccionada
- **Opción B**: Haz clic en la tarjeta "Total de Reservas"
- **Opción C**: Limpia los filtros desde el panel lateral

---

## 🎨 Diseño y UX

### Colores Semánticos:
- **Azul** (`bg-blue-50`): Total de reservas
- **Verde** (`bg-green-50`): Confirmadas - Estado exitoso
- **Amarillo** (`bg-yellow-50`): Creadas - Pendiente de confirmación
- **Rojo** (`bg-red-50`): Canceladas - Estado negativo

### Animaciones:
- **Hover**: Las tarjetas crecen ligeramente (`scale-105`) y aumenta la sombra
- **Selección**: Animación suave del anillo azul con efecto de escala
- **Transiciones**: Todas las animaciones tienen `duration-200` para fluidez

### Responsividad:
- **Mobile** (< 640px): 1 columna
- **Tablet** (640px - 1024px): 2 columnas
- **Desktop** (> 1024px): 4 columnas

---

## 🔄 Sincronización Automática

Los contadores se actualizan automáticamente cuando:
- ✅ Se aplican o modifican filtros en el panel lateral
- ✅ Se selecciona una fecha diferente en el calendario
- ✅ Se realiza check-in de una reserva
- ✅ Se cancela una reserva
- ✅ Se hace clic en las tarjetas de estadísticas

---

## 📁 Archivos Creados/Modificados

### Nuevos Componentes:
```
src/components/Stats/
├── StatCard.jsx                    # Tarjeta de estadística reutilizable
├── ReservationStats.jsx            # Dashboard completo de estadísticas
└── SimpleReservationCounter.jsx   # Contador simple para el listado
```

### Nuevos Utilities:
```
src/utils/
└── statsHelper.js                  # Funciones helper para calcular estadísticas
```

### Componentes Modificados:
```
src/components/AdminReservations/
└── AdminReservationsView.jsx       # Vista principal del administrador

src/components/Calendar/
└── ReservationList.jsx             # Listado de reservas
```

---

## 🔧 API y Props

### ReservationStats Props:
```javascript
{
  allReservations: Array,      // Todas las reservas según filtros
  dayReservations: Array,       // Reservas del día seleccionado
  selectedDate: Date,           // Fecha seleccionada en calendario
  filters: Object,              // Objeto de filtros actual
  setFilters: Function          // Función para actualizar filtros
}
```

### StatCard Props:
```javascript
{
  title: String,                // Título de la estadística
  value: Number,                // Valor numérico
  bgColor: String,              // Clase Tailwind para fondo
  textColor: String,            // Clase Tailwind para texto
  icon: ReactNode,              // Icono de Heroicons
  isClickable: Boolean,         // Si la tarjeta es clickeable
  isSelected: Boolean,          // Si está seleccionada
  onClick: Function             // Handler del clic
}
```

### SimpleReservationCounter Props:
```javascript
{
  reservations: Array,          // Reservas del día
  selectedDate: Date            // Fecha seleccionada
}
```

---

## 💡 Mejores Prácticas Aplicadas

✅ **Componentes Modulares**: Cada componente tiene una responsabilidad única
✅ **Reutilización**: `StatCard` es completamente reutilizable
✅ **Accesibilidad**: 
  - Roles ARIA (`role="button"`)
  - Navegación por teclado (`tabIndex`, `onKeyDown`)
  - Indicadores visuales claros
✅ **Performance**: Cálculos optimizados con helpers separados
✅ **UX**: Feedback visual inmediato en todas las interacciones
✅ **Documentación**: JSDoc en todos los componentes
✅ **Responsive Design**: Adaptable a todos los dispositivos

---

## 🐛 Solución de Problemas

### Las estadísticas no se actualizan:
- Verifica que los filtros estén correctamente aplicados
- Revisa que `fetchReservations()` se ejecute después de cambios

### El filtro de estado no se aplica:
- Asegúrate de que los valores coincidan exactamente: "Creada", "Confirmada", "Cancelada"
- Verifica que `setFilters` esté correctamente pasado como prop

### Las tarjetas no son clickeables:
- Verifica que `isClickable={true}` esté en las props de `StatCard`
- Revisa que `onClick` esté definido

---

## 🎯 Características Futuras Sugeridas

- [ ] Exportar estadísticas a PDF/Excel
- [ ] Gráficos de tendencias (línea de tiempo)
- [ ] Comparación entre períodos
- [ ] Estadísticas por tipo de espacio
- [ ] Métricas de ocupación por piso
- [ ] Estadísticas de usuarios más activos

---

**Fecha de Creación**: Octubre 2025  
**Última Actualización**: Octubre 2025  
**Versión**: 1.0.0

