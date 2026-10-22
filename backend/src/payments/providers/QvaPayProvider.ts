import { PaymentProvider, PaymentResult } from '../types.js';

export class QvaPayProvider implements PaymentProvider {
  private appId: string;
  private appSecret: string;

  constructor(appId: string, appSecret: string) {
    this.appId = appId;
    this.appSecret = appSecret;
  }

  async createPayment(amount: number, currency: string, metadata: any): Promise<PaymentResult> {
    // Llamada directa a la API de QvaPay usando fetch (Node 20+)
    const response = await fetch('https://api.qvapay.com/v2/create_invoice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'app-id': this.appId,
        'app-secret': this.appSecret,
      },
      body: JSON.stringify({
        amount: amount,
        description: metadata.description || 'Pago en IDKFREE',
        remote_id: metadata.orderId,
        webhook: metadata.webhookUrl,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error de QvaPay: ${response.status}`);
    }

    const data = await response.json();
    return {
      id: data.transaction_uuid,
      url: data.url,
      status: 'pending',
    };
  }

  async handleWebhook(payload: any, signature?: string): Promise<boolean> {
    if (payload && payload.status === 'PAID') {
      console.log(`✅ Pago QvaPay confirmado para la orden: ${payload.remote_id}`);
      return true;
    }
    return false;
  }

  async refund(transactionId: string, amount: number): Promise<boolean> {
    console.warn('Reembolsos de QvaPay se gestionan manualmente.');
    return false;
  }
}
