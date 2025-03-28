import { AUTHORIZED_EMAILS, ADMIN_ROLES } from '../config/adminRoles';

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

export const hasAdminAccess = () => {
  try {
    const userData = getUserData();
    if (!userData?.mail) return false;

    return AUTHORIZED_EMAILS.super_admin.includes(userData.mail) || 
           AUTHORIZED_EMAILS.admin.includes(userData.mail);

  } catch (error) {
    console.error("Error checking admin access:", error);
    return false;
  }
};

export const getUserRole = (email) => {
  if (!email) return ADMIN_ROLES.USER;
  
  if (AUTHORIZED_EMAILS.super_admin.includes(email)) {
    return ADMIN_ROLES.SUPER_ADMIN;
  } else if (AUTHORIZED_EMAILS.admin.includes(email)) {
    return ADMIN_ROLES.ADMIN;
  } else if (AUTHORIZED_EMAILS.reports_viewer.includes(email)) {
    return ADMIN_ROLES.REPORTS_VIEWER;
  }
  
  return ADMIN_ROLES.USER;
};

export const canAccessReports = (email) => {
  const role = getUserRole(email);
  return [ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.ADMIN, ADMIN_ROLES.REPORTS_VIEWER].includes(role);
};

export const canReserveAnySpace = (email) => {
  const role = getUserRole(email);
  return [ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.ADMIN].includes(role);
};