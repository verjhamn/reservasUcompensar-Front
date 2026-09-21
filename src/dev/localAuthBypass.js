import { ADMIN_ROLES } from "../config/adminRoles";
import { BACKEND_ROLE_IDS, getRoleNameById } from "../config/backendRoles";
import { EVENTS, STORAGE_KEYS } from "../config/events";

const PROFILE_KEY = "local-auth-test-profile";
const LOCAL_AUTH_TOKEN = "local-dev-auth-token";
const TRUE_VALUES = new Set(["1", "true", "yes", "on"]);
const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]"]);

export const LOCAL_AUTH_SESSION_CLEARED = "local-auth-session-cleared";
export const LOCAL_AUTH_ROLES = [
  { value: ADMIN_ROLES.USER, label: "Usuario estandar", id: null },
  { value: ADMIN_ROLES.REPORTS_VIEWER, label: "Reportes", id: BACKEND_ROLE_IDS.REPORTS_VIEWER },
  { value: ADMIN_ROLES.ADMIN, label: "Administrador", id: BACKEND_ROLE_IDS.ADMIN },
  { value: ADMIN_ROLES.SUPER_ADMIN, label: "Superadministrador", id: BACKEND_ROLE_IDS.SUPER_ADMIN },
];

export const isLocalAuthBypassEnabled = () => (
  import.meta.env.DEV
  && TRUE_VALUES.has(String(import.meta.env.VITE_LOCAL_AUTH_BYPASS ?? "").toLowerCase())
  && typeof window !== "undefined"
  && LOCAL_HOSTS.has(window.location.hostname)
);

export const getLocalAuthProfile = () => {
  if (!isLocalAuthBypassEnabled()) return null;

  try {
    const profile = JSON.parse(sessionStorage.getItem(PROFILE_KEY));
    return profile
      && typeof profile.email === "string"
      && profile.email.trim()
      && LOCAL_AUTH_ROLES.some(({ value }) => value === profile.role)
      ? profile : null;
  } catch {
    return null;
  }
};

export const getDefaultLocalAuthProfile = () => getLocalAuthProfile() ?? {
  email: import.meta.env.VITE_LOCAL_AUTH_EMAIL || "usuario.local@example.com",
  role: ADMIN_ROLES.USER,
};

export const ensureLocalAuthBypassSession = ({ notify = false } = {}) => {
  const profile = getLocalAuthProfile();
  if (!profile) return false;

  const givenName = import.meta.env.VITE_LOCAL_AUTH_GIVEN_NAME || "Usuario";
  const surname = import.meta.env.VITE_LOCAL_AUTH_SURNAME || "Local";
  const user = {
    id: `local-test:${profile.email}`,
    displayName: `${givenName} ${surname}`,
    givenName,
    surname,
    mail: profile.email,
    userPrincipalName: profile.email,
    jobTitle: import.meta.env.VITE_LOCAL_AUTH_JOB_TITLE || "Usuario local",
    localAuthBypass: true,
  };
  const selectedRole = LOCAL_AUTH_ROLES.find(({ value }) => value === profile.role);
  const roles = selectedRole.id === null
    ? [] : [{ id: selectedRole.id, name: getRoleNameById(selectedRole.id) }];

  localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
  localStorage.setItem(STORAGE_KEYS.USER_ID, user.id);
  localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, LOCAL_AUTH_TOKEN);
  localStorage.setItem(STORAGE_KEYS.USER_ROLES, JSON.stringify(roles));
  localStorage.setItem(STORAGE_KEYS.MODAL_SHOWN, "true");

  if (notify) {
    window.dispatchEvent(new CustomEvent(EVENTS.USER_ROLES_UPDATED, { detail: roles }));
    window.dispatchEvent(new Event("storage"));
  }

  return true;
};

export const startLocalAuthSession = ({ email, role }) => {
  if (!isLocalAuthBypassEnabled()) return false;
  if (!email.trim() || !LOCAL_AUTH_ROLES.some(({ value }) => value === role)) {
    throw new Error("Selecciona un rol y un correo validos.");
  }

  sessionStorage.setItem(PROFILE_KEY, JSON.stringify({ email: email.trim(), role }));
  return ensureLocalAuthBypassSession({ notify: true });
};

export const clearLocalAuthBypassSession = () => {
  if (!isLocalAuthBypassEnabled()) return;

  sessionStorage.removeItem(PROFILE_KEY);
  Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
  window.dispatchEvent(new Event("storage"));
  window.dispatchEvent(new Event(LOCAL_AUTH_SESSION_CLEARED));
};
