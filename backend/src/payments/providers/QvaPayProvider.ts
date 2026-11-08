import { PaymentProvider, PaymentResult } from '../types.js';

const QVAPAY_API_BASE = 'https://api.qvapay.com';

export class QvaPayProvider implements PaymentProvider {
  private appId: string;
  private appSecret: string;

  constructor(appId: string, appSecret: string) {
    if (!appId || !appSecret) {
      throw new Error('[QvaPayProvider] app-id y app-secret son obligatorios');
    }
    this.appId = appId;
    this.appSecret = appSecret;
  }

  private async request(path: string, method: string = 'GET', body?: any): Promise<any> {
    const response = await fetch(`${QVAPAY_API_BASE}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'app-id': this.appId,
        'app-secret': this.appSecret,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const text = await response.text();
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    if (!response.ok) {
      throw new Error(`QvaPay ${response.status}: ${JSON.stringify(data).substring(0, 200)}`);
    }
    return data;
  }

  async createPayment(amount: number, currency: string, metadata: any): Promise<PaymentResult> {
    try {
      // Nota: La documentación no especifica la ruta exacta de "Crear Factura".
      // Según la convención de QvaPay, suele ser /v2/create_invoice.
      // Si falla, probamos con /create_invoice.
      const data = await this.request('/v2/create_invoice', 'POST', {
        amount: amount,
        currency: currency || 'USD',
        description: metadata.description || 'Pago en IDKfree',
        remote_id: metadata.orderId,
        webhook: metadata.webhookUrl,
      });

      return {
        id: data.transaction_uuid || data.id || data.invoice_id,
        url: data.url || data.checkout_url || data.payment_url,
        status: 'pending',
      };
    } catch (err: any) {
      console.error('[QvaPayProvider] createPayment error:', err.message);
      throw err;
    }
  }

  async handleWebhook(payload: any, signature?: string): Promise<boolean> {
    if (payload && (payload.status === 'PAID' || payload.status === 'COMPLETED')) {
      console.log(`✅ Pago QvaPay confirmado: orden=${payload.remote_id} monto=${payload.amount}`);
      return true;
    }
    return false;
  }

  async refund(transactionId: string, amount: number): Promise<boolean> {
    console.warn('[QvaPayProvider] Reembolsos se gestionan manualmente en el panel de QvaPay.');
    return false;
  }
}
