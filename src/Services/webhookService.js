// Servicio para manejar webhooks de roles (preparado para implementación futura)
import roleSyncService from './roleSyncService';

class WebhookService {
  constructor() {
    this.isListening = false;
  }

  // Iniciar escucha de webhooks (cuando se implemente)
  startListening() {
    if (this.isListening) {
      return;
    }

    this.isListening = true;
    
    // Aquí se configurará el endpoint para recibir webhooks
    // cuando el backend implemente la funcionalidad
    
    console.log('[WebhookService] Preparado para recibir webhooks de roles');
  }

  // Detener escucha de webhooks
  stopListening() {
    this.isListening = false;
    console.log('[WebhookService] Escucha de webhooks detenida');
  }

  // Procesar webhook recibido
  handleRoleChangeWebhook(webhookData) {
    try {
      console.log('[WebhookService] Procesando webhook de cambio de roles:', webhookData);
      
      // Validar datos del webhook
      if (!webhookData || !webhookData.userId) {
        console.error('[WebhookService] Datos de webhook inválidos');
        return;
      }

      // Verificar si el webhook es para el usuario actual
      const currentUserId = localStorage.getItem('userId');
      if (webhookData.userId !== currentUserId) {
        console.log('[WebhookService] Webhook no es para el usuario actual');
        return;
      }

      // Notificar al servicio de sincronización
      roleSyncService.handleWebhookNotification(webhookData);
      
    } catch (error) {
      console.error('[WebhookService] Error procesando webhook:', error);
    }
  }

  // Obtener estado del servicio
  getStatus() {
    return {
      isListening: this.isListening
    };
  }
}

// Instancia singleton
const webhookService = new WebhookService();

export default webhookService;
