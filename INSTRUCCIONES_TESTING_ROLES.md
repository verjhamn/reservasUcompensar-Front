# 🧪 Instrucciones para Testing de Roles

## 🔍 **Problema Identificado**
Todos los usuarios aparecen como "Usuario Estándar" en lugar de usar los roles del backend.

## 🛠️ **Cambios Implementados para Debug**

### 1. **Logs de Debugging Agregados**
- ✅ Logs en `authService.js` para ver la respuesta del backend
- ✅ Logs en `userHelper.js` para ver la detección de roles
- ✅ Función `debugUserRoles()` para verificar el estado completo

### 2. **Botones de Debug Temporales**
- ✅ Botones en el Header (versión móvil) para simular diferentes roles
- ✅ Función `simulateRole()` para probar la lógica de roles

## 🧪 **Cómo Probar**

### **Paso 1: Verificar Logs en la Consola**
1. Abre la aplicación y haz login
2. Abre las DevTools (F12) → Console
3. Busca estos logs:
   ```
   [authService] Roles guardados: [...]
   [getUserRoleFromBackend] Roles obtenidos: [...]
   [getUserRoleFromBackend] Usuario es Super Admin
   [hasAdminAccess] Rol: super_admin Tiene acceso admin: true
   ```

### **Paso 2: Usar Botones de Debug**
1. Haz login en la aplicación
2. En móvil, abre el menú hamburguesa
3. Verás botones de debug:
   - **Super Admin** (rosa) - Debe mostrar todos los botones
   - **Admin** (azul) - Debe mostrar Admin y Reportes
   - **Reportes** (verde) - Solo debe mostrar Reportes
   - **Usuario** (gris) - Solo debe mostrar Mis Reservas

### **Paso 3: Verificar Comportamiento Esperado**

| Rol | Botones Visibles | Consola Debe Mostrar |
|-----|------------------|---------------------|
| Super Admin | Catálogo, Mis Reservas, **Administrar Reservas**, **Reportes** | `super_admin`, `Tiene acceso admin: true` |
| Admin | Catálogo, Mis Reservas, **Administrar Reservas**, **Reportes** | `admin`, `Tiene acceso admin: true` |
| Reportes | Catálogo, Mis Reservas, **Reportes** | `reports_viewer`, `Tiene acceso admin: false` |
| Usuario | Catálogo, Mis Reservas | `user`, `Tiene acceso admin: false` |

## 🔧 **Debugging Manual**

### **Verificar localStorage**
```javascript
// En la consola del navegador:
console.log("userRoles:", JSON.parse(localStorage.getItem("userRoles") || "[]"));
console.log("userData:", JSON.parse(localStorage.getItem("userData") || "{}"));
```

### **Ejecutar Debug Function**
```javascript
// En la consola del navegador:
import { debugUserRoles } from './src/utils/userHelper';
debugUserRoles();
```

## 🚨 **Posibles Problemas**

### **1. Roles no se guardan**
- **Síntoma**: `[getUserRoleFromBackend] Roles obtenidos: []`
- **Causa**: El backend no está enviando roles o la estructura es diferente
- **Solución**: Verificar la respuesta del endpoint `/login`

### **2. Roles se guardan pero no se detectan**
- **Síntoma**: `[getUserRoleFromBackend] Roles encontrados pero no coinciden con IDs esperados`
- **Causa**: Los IDs de roles no coinciden con los esperados (1, 2, 3)
- **Solución**: Verificar que el backend envíe `role.id` correcto

### **3. Roles se detectan pero permisos no funcionan**
- **Síntoma**: Rol detectado correctamente pero botones no aparecen
- **Causa**: Problema en las funciones `hasAdminAccess()` o `canAccessReports()`
- **Solución**: Verificar logs de estas funciones

## 📋 **Checklist de Testing**

- [ ] Login funciona correctamente
- [ ] Logs aparecen en consola
- [ ] Roles se guardan en localStorage
- [ ] Función `getUserRoleFromBackend()` detecta rol correcto
- [ ] Botones de debug funcionan
- [ ] Botones de la aplicación aparecen según el rol
- [ ] Permisos se aplican correctamente

## 🎯 **Próximos Pasos**

1. **Si todo funciona con botones de debug**: El problema está en la respuesta del backend
2. **Si no funciona con botones de debug**: El problema está en la lógica del frontend
3. **Una vez confirmado**: Remover botones de debug y logs temporales

## 📞 **Información para el Backend**

El frontend espera esta estructura en la respuesta del `/login`:

```json
{
  "data": {
    "roles": [
      {
        "id": 1,  // 1=SuperAdmin, 2=Admin, 3=Reportes
        "name": "Superadministrador"
      }
    ]
  },
  "roles": ["Superadministrador"]  // Array de nombres (opcional)
}
```
