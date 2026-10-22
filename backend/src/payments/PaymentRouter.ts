import { PaymentProvider } from './types.js';
import { QvaPayProvider } from './providers/QvaPayProvider.js';

export class PaymentRouter {
  private providers: Record<string, PaymentProvider> = {};

  constructor() {
    // Solo registramos QvaPay para este ejemplo. Stripe iría aquí también.
    this.providers['qvapay'] = new QvaPayProvider(
      process.env.QVAPAY_APP_ID || 'app_id_fake',
      process.env.QVAPAY_APP_SECRET || 'app_secret_fake'
    );
  }

  getProvider(countryCode: string): PaymentProvider {
    if (countryCode === 'CU') {
      return this.providers['qvapay'];
    }
    // Por defecto, por ahora usamos QvaPay
    return this.providers['qvapay'];
  }
}
