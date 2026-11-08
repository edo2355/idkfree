import { PaymentProvider } from './types.js';
import { QvaPayProvider } from './providers/QvaPayProvider.js';

export class PaymentRouter {
  private providers: Record<string, PaymentProvider> = {};

  constructor() {
    const appId = process.env.QVAPAY_APP_ID;
    const appSecret = process.env.QVAPAY_APP_SECRET;

    if (!appId || !appSecret) {
      throw new Error('[PaymentRouter] Faltan QVAPAY_APP_ID o QVAPAY_APP_SECRET en las variables de entorno');
    }

    this.providers['qvapay'] = new QvaPayProvider(appId, appSecret);
  }

  getProvider(countryCode: string): PaymentProvider {
    // Por ahora, todos los países usan QvaPay
    // Futuro: agregar Stripe, MercadoPago, etc.
    return this.providers['qvapay'];
  }
}
