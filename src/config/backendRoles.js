// Mapeo de roles del backend basado en role_id
export const BACKEND_ROLE_IDS = {
  SUPER_ADMIN: 1,
  ADMIN: 2,
  REPORTS_VIEWER: 3
};

// Función helper para obtener el nombre del rol basado en el ID
export const getRoleNameById = (roleId) => {
  switch (roleId) {
    case BACKEND_ROLE_IDS.SUPER_ADMIN:
      return 'Superadministrador';
    case BACKEND_ROLE_IDS.ADMIN:
      return 'Administrador';
    case BACKEND_ROLE_IDS.REPORTS_VIEWER:
      return 'Reportes';
    default:
      return 'Usuario';
  }
};
