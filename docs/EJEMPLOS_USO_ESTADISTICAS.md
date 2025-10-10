# 🎬 Ejemplos de Uso - Contador de Estadísticas

## 📖 Casos de Uso Prácticos

### Ejemplo 1: Consultar todas las reservas confirmadas

**Objetivo**: Ver solo las reservas que ya están confirmadas.

**Pasos**:
1. En el Dashboard de Estadísticas, observa que están en modo "Todas"
2. Haz clic en la tarjeta verde "Confirmadas" (mostrará, por ejemplo, 15)
3. **Resultado**:
   - La tarjeta "Confirmadas" muestra un anillo azul brillante
   - El panel de filtros actualiza "Estado: Confirmada"
   - El listado muestra solo las 15 reservas confirmadas
   - Aparece un banner: "💡 Filtrado por estado: Confirmada"
   - El contador del listado muestra: "15 reservas en este día"

**Para quitar el filtro**:
- Haz clic nuevamente en "Confirmadas", O
- Haz clic en "Total de Reservas"

---

### Ejemplo 2: Ver estadísticas de un día específico

**Objetivo**: Ver cuántas reservas hay el próximo lunes.

**Pasos**:
1. Haz clic en el día lunes en el calendario
2. En el Dashboard, haz clic en el toggle "Solo del día"
3. **Resultado**:
   - El dashboard muestra: "Mostrando reservas del 14 de octubre de 2025"
   - Las 4 tarjetas actualizan sus números solo para ese día
   - Si hay 8 reservas: Total=8, Confirmadas=5, Creadas=2, Canceladas=1
   - El listado abajo muestra las mismas 8 reservas del lunes

**Volver a ver todas**:
- Haz clic en el toggle "Todas"

---

### Ejemplo 3: Buscar reservas creadas pero no confirmadas de Coworking

**Objetivo**: Identificar reservas de Coworking que están pendientes de confirmación.

**Pasos**:
1. En el panel de filtros lateral, selecciona "Tipo de espacio: Coworking"
2. El dashboard actualiza (por ejemplo: Total=25)
3. Haz clic en la tarjeta amarilla "Creadas"
4. **Resultado**:
   - Se aplican ambos filtros: Tipo=Coworking Y Estado=Creada
   - El dashboard muestra solo las estadísticas de estas reservas
   - Supongamos que quedan 8 reservas creadas de Coworking
   - El listado muestra esas 8 reservas pendientes
   - Puedes procesarlas (hacer check-in o cancelar)

---

### Ejemplo 4: Analizar cancelaciones de un piso específico

**Objetivo**: Ver cuántas reservas del piso 5 fueron canceladas.

**Pasos**:
1. En filtros, selecciona "Piso: 5"
2. El dashboard actualiza con todas las reservas del piso 5
3. Haz clic en la tarjeta roja "Canceladas"
4. **Resultado**:
   - Dashboard y listado filtran por: Piso=5 Y Estado=Cancelada
   - Puedes analizar patrones: ¿Qué espacios se cancelan más?
   - ¿Quiénes cancelan más frecuentemente?

---

### Ejemplo 5: Comparar reservas del día vs. todas

**Objetivo**: Ver si un día específico tiene más o menos reservas que el promedio.

**Pasos**:
1. **Ver todas las reservas**:
   - Dashboard en modo "Todas"
   - Observa: Total = 120 reservas (en toda la semana con filtros activos)

2. **Ver solo hoy**:
   - Haz clic en "Solo del día"
   - Observa: Total = 25 reservas (solo hoy)

3. **Análisis**:
   - Si hay 120 reservas en 5 días hábiles = ~24 por día en promedio
   - Hoy hay 25, está dentro del promedio ✅

---

### Ejemplo 6: Workflow completo de administración

**Contexto**: Es lunes por la mañana, inicio de la semana.

**Pasos**:

1. **Revisar panorama general**:
   - Dashboard en "Todas"
   - Observa: Total=85, Confirmadas=60, Creadas=20, Canceladas=5
   - Identificas: Hay 20 reservas pendientes de confirmar

2. **Enfocarse en hoy**:
   - Selecciona hoy en el calendario
   - Cambia a "Solo del día"
   - Ves: Total=18, Confirmadas=12, Creadas=5, Canceladas=1

3. **Procesar reservas creadas de hoy**:
   - Haz clic en "Creadas" (5 reservas)
   - El listado muestra las 5 reservas pendientes
   - Revisas cada una y haces check-in según corresponda

4. **Revisar confirmadas**:
   - Haz clic en "Confirmadas" (12 reservas)
   - Verificas que todo esté en orden

5. **Analizar cancelación**:
   - Haz clic en "Canceladas" (1 reserva)
   - Revisas el motivo y tomas nota

---

## 🎯 Tips y Trucos

### ✅ Tip 1: Usa el toggle estratégicamente
- **"Todas"**: Para análisis generales y tendencias
- **"Solo del día"**: Para gestión operativa diaria

### ✅ Tip 2: Combina filtros
Los filtros del panel lateral se complementan con los clics en estadísticas:
- Filtra por piso + clic en "Creadas" = Reservas creadas de ese piso
- Filtra por tipo + clic en "Confirmadas" = Reservas confirmadas de ese tipo
- Filtra por correo + clic en "Canceladas" = Cancelaciones de ese usuario

### ✅ Tip 3: Limpiar filtros rápidamente
Hay 3 formas de limpiar el filtro de estado:
1. Clic en "Total de Reservas"
2. Doble clic en la tarjeta seleccionada
3. Botón de reset en el panel de filtros (limpia TODOS los filtros)

### ✅ Tip 4: Navegación por teclado
Las tarjetas son accesibles por teclado:
- Usa `Tab` para navegar entre tarjetas
- Presiona `Enter` o `Espacio` para seleccionar

### ✅ Tip 5: Indicadores visuales
Aprende a leer rápidamente la interfaz:
- **Anillo azul**: Filtro activo en esa categoría
- **Banner azul abajo**: Recordatorio del filtro activo
- **Texto en tarjeta**: "✓ Filtro activo" vs "Clic para filtrar"

---

## 📊 Escenarios de Negocio

### Escenario A: Alta demanda
**Situación**: El dashboard muestra Total=150 (modo "Todas", filtro de esta semana)

**Análisis**:
- Confirmadas=100 (67%) → Buena tasa de confirmación ✅
- Creadas=45 (30%) → Hay capacidad disponible 
- Canceladas=5 (3%) → Baja tasa de cancelación ✅

**Acción**:
- Enfocarse en confirmar las 45 creadas
- Clic en "Creadas" para procesarlas

---

### Escenario B: Día crítico
**Situación**: Dashboard en "Solo del día" muestra Total=35 para hoy

**Análisis**:
- Es un número alto para un solo día
- Creadas=15 → Hay que confirmar rápidamente
- Confirmadas=18 → La mayoría ya está lista
- Canceladas=2 → Espacios que se pueden reasignar

**Acción**:
- Procesar las 15 creadas prioritariamente
- Considerar liberar los 2 espacios cancelados

---

### Escenario C: Investigación de problema
**Situación**: Reportan que el Piso 7 tiene muchas cancelaciones

**Investigación**:
1. Filtrar por "Piso: 7"
2. Ver estadísticas generales (modo "Todas")
3. Observar: Total=40, Canceladas=12 (30%!)
4. Clic en "Canceladas" para ver detalles
5. Analizar patrones: ¿Mismo usuario? ¿Mismo tipo de espacio? ¿Misma franja horaria?

**Conclusión**:
- Alta tasa de cancelación detectada
- Investigar causas raíz (espacio en mal estado, difícil acceso, etc.)

---

## 🔄 Flujos Interactivos

### Flujo 1: De general a específico
```
Inicio: Dashboard en "Todas"
  ↓
Aplicar filtro de Piso (Piso 5)
  ↓
Cambiar a "Solo del día" (Lunes)
  ↓
Clic en "Creadas"
  ↓
Resultado: Reservas creadas del Piso 5 para el lunes
```

### Flujo 2: De específico a general
```
Inicio: Dashboard en "Solo del día" con filtro "Confirmadas"
  ↓
Clic en "Total" (quita filtro de estado)
  ↓
Cambiar a "Todas"
  ↓
Limpiar filtros (botón reset)
  ↓
Resultado: Vista completa de todas las reservas
```

---

## 🎨 Atajos Visuales

### Interpretación Rápida de Colores

| Color | Estado | Significado | Acción Sugerida |
|-------|--------|-------------|-----------------|
| 🟢 Verde | Confirmadas | Todo listo | Verificar check-in a la hora |
| 🟡 Amarillo | Creadas | Pendiente | Revisar y confirmar |
| 🔴 Rojo | Canceladas | Espacio libre | Puede reasignarse |
| 🔵 Azul | Total | Vista completa | Análisis general |

---

**¿Preguntas o sugerencias?** Consulta la documentación técnica en `GUIA_CONTADOR_ESTADISTICAS.md`

