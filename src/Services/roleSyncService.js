import { fetchAuthToken, getUserRoles } from './authService';
import { getUserData } from './SSOServices/graphService';
import { EVENTS } from '../config/events';

// Configuración de sincronización
const SYNC_CONFIG = {
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000
};

class RoleSyncService {
  constructor() {
    this.isSyncing = false;
    this.retryCount = 0;
    this.isActive = false;
  }

  // Iniciar sincronización (solo por visibilidad)
  startAutoSync() {
    if (this.isActive) {
      return;
    }

    this.isActive = true;
    
    // Solo sincronizar cuando la ventana vuelve a estar visible
    this.setupVisibilityListener();

    // Sincronizar inmediatamente al iniciar
    this.syncRoles();
  }

  // Detener sincronización
  stopAutoSync() {
    this.isActive = false;
    this.removeVisibilityListener();
  }

  // Configurar listener de visibilidad de ventana
  setupVisibilityListener() {
    this.handleVisibilityChange = () => {
      if (!document.hidden && this.isActive) {
        this.syncRoles();
      }
    };
    
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
  }

  // Remover listener de visibilidad
  removeVisibilityListener() {
    if (this.handleVisibilityChange) {
      document.removeEventListener('visibilitychange', this.handleVisibilityChange);
      this.handleVisibilityChange = null;
    }
  }

  // Sincronizar roles manualmente
  async syncRoles(force = false) {
    if (this.isSyncing && !force) {
      console.log('[RoleSync] Sincronización ya en progreso, omitiendo...');
      return;
    }

    const userData = getUserData();
    if (!userData) {
      console.log('[RoleSync] No hay usuario logueado, omitiendo sincronización');
      return;
    }

    this.isSyncing = true;
    
    try {
      // Obtener roles actuales del localStorage
      const currentRoles = getUserRoles();

      // Obtener roles del backend
      await fetchAuthToken();
      
      // Obtener roles actualizados
      const updatedRoles = getUserRoles();

      // Verificar si hubo cambios
      const rolesChanged = this.compareRoles(currentRoles, updatedRoles);
      
      if (rolesChanged) {
        // Disparar evento personalizado para notificar cambios
        window.dispatchEvent(new CustomEvent(EVENTS.USER_ROLES_UPDATED, { 
          detail: { 
            oldRoles: currentRoles, 
            newRoles: updatedRoles,
            source: 'roleSync'
          } 
        }));
        
        this.retryCount = 0;
      }

    } catch (error) {
      console.error('[RoleSync] Error durante sincronización:', error);
      await this.handleSyncError();
    } finally {
      this.isSyncing = false;
    }
  }

  // Comparar roles para detectar cambios
  compareRoles(oldRoles, newRoles) {
    if (oldRoles.length !== newRoles.length) {
      return true;
    }

    // Comparar por ID de rol
    const oldIds = oldRoles.map(role => role.id).sort();
    const newIds = newRoles.map(role => role.id).sort();
    
    return JSON.stringify(oldIds) !== JSON.stringify(newIds);
  }

  // Manejar errores de sincronización
  async handleSyncError() {
    this.retryCount++;
    
    if (this.retryCount < SYNC_CONFIG.MAX_RETRIES) {
      console.log(`[RoleSync] Reintentando en ${SYNC_CONFIG.RETRY_DELAY}ms (intento ${this.retryCount}/${SYNC_CONFIG.MAX_RETRIES})`);
      
      setTimeout(() => {
        this.syncRoles(true);
      }, SYNC_CONFIG.RETRY_DELAY);
    } else {
      console.error('[RoleSync] Máximo de reintentos alcanzado');
      this.retryCount = 0;
    }
  }

  // Sincronización forzada (para uso manual)
  async forceSync() {
    console.log('[RoleSync] Sincronización forzada iniciada');
    await this.syncRoles(true);
  }

  // Verificar si la sincronización está activa
  isServiceActive() {
    return this.isActive;
  }

  // Método para recibir notificaciones de webhook (preparado para futuro)
  handleWebhookNotification(webhookData) {
    if (!this.isActive) {
      return;
    }

    // Cuando implementen el webhook, aquí se procesará la notificación
    console.log('[RoleSync] Webhook recibido:', webhookData);
    this.syncRoles(true); // Forzar sincronización
  }

  // Obtener estado del servicio
  getStatus() {
    return {
      isActive: this.isActive,
      isSyncing: this.isSyncing,
      retryCount: this.retryCount
    };
  }
}

// Instancia singleton
const roleSyncService = new RoleSyncService();

export default roleSyncService;
