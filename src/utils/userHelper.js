import { ADMIN_ROLES } from '../config/adminRoles';
import { BACKEND_ROLE_IDS } from '../config/backendRoles';
import { getUserRoles } from '../Services/authService';

export const getUserData = () => {
  try {
    const userDataString = localStorage.getItem("userData");
    if (!userDataString) return null;
    
    return JSON.parse(userDataString);
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
};

// Obtener el rol principal del usuario basado en los roles del backend
export const getUserRoleFromBackend = () => {
  try {
    const roles = getUserRoles();
    console.log("[getUserRoleFromBackend] Roles obtenidos:", roles);
    
    // Si no hay roles, es usuario estándar
    if (!roles || roles.length === 0) {
      console.log("[getUserRoleFromBackend] No hay roles, usuario estándar");
      return ADMIN_ROLES.USER;
    }
    
    // Buscar el rol con mayor privilegio basado en role_id
    const superAdminRole = roles.find(role => role.id === BACKEND_ROLE_IDS.SUPER_ADMIN);
    if (superAdminRole) {
      console.log("[getUserRoleFromBackend] Usuario es Super Admin");
      return ADMIN_ROLES.SUPER_ADMIN;
    }
    
    const adminRole = roles.find(role => role.id === BACKEND_ROLE_IDS.ADMIN);
    if (adminRole) {
      console.log("[getUserRoleFromBackend] Usuario es Admin");
      return ADMIN_ROLES.ADMIN;
    }
    
    const reportsRole = roles.find(role => role.id === BACKEND_ROLE_IDS.REPORTS_VIEWER);
    if (reportsRole) {
      console.log("[getUserRoleFromBackend] Usuario es Reports Viewer");
      return ADMIN_ROLES.REPORTS_VIEWER;
    }
    
    // Si hay roles pero no coinciden con los IDs esperados, considerar como usuario
    console.log("[getUserRoleFromBackend] Roles encontrados pero no coinciden con IDs esperados:", roles);
    return ADMIN_ROLES.USER;
  } catch (error) {
    console.error("Error getting user role from backend:", error);
    return ADMIN_ROLES.USER;
  }
};

export const hasAdminAccess = () => {
  try {
    const role = getUserRoleFromBackend();
    const hasAccess = role === ADMIN_ROLES.SUPER_ADMIN || role === ADMIN_ROLES.ADMIN;
    console.log("[hasAdminAccess] Rol:", role, "Tiene acceso admin:", hasAccess);
    return hasAccess;
  } catch (error) {
    console.error("Error checking admin access:", error);
    return false;
  }
};

// Mantener esta función para compatibilidad con código existente
export const getUserRole = (email) => {
  // Ahora usamos los roles del backend en lugar del email
  return getUserRoleFromBackend();
};

export const canAccessReports = (email) => {
  const role = getUserRoleFromBackend();
  const canAccess = [ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.ADMIN, ADMIN_ROLES.REPORTS_VIEWER].includes(role);
  console.log("[canAccessReports] Rol:", role, "Puede acceder a reportes:", canAccess);
  return canAccess;
};

export const canReserveAnySpace = (email) => {
  const role = getUserRoleFromBackend();
  return [ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.ADMIN].includes(role);
};

// Función de debugging para verificar el estado de los roles
export const debugUserRoles = () => {
  console.log("=== DEBUG USER ROLES ===");
  const roles = getUserRoles();
  console.log("Roles en localStorage:", roles);
  const roleFromBackend = getUserRoleFromBackend();
  console.log("Rol detectado:", roleFromBackend);
  const hasAdmin = hasAdminAccess();
  console.log("Tiene acceso admin:", hasAdmin);
  const canReports = canAccessReports();
  console.log("Puede acceder a reportes:", canReports);
  console.log("=========================");
  return { roles, roleFromBackend, hasAdmin, canReports };
};