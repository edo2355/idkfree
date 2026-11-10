export interface KYCProvider {
  name: string;
  isAvailable(countryCode: string): boolean;
  startVerification(userId: string, userData: any): Promise<{ sessionId: string; redirectUrl?: string; }>;
}

export class TelegramProvider implements KYCProvider {
  name = 'telegram';
  isAvailable(countryCode: string) { return true; }
  async startVerification(userId: string, userData: any) { 
    return { sessionId: `tg_${userId}_${Date.now()}`, redirectUrl: 'https://t.me/idkfree_kyc_bot' }; 
  }
}

export class SumsubProvider implements KYCProvider {
  name = 'sumsub';
  isAvailable(countryCode: string) { return countryCode !== 'CU' && countryCode !== 'IR'; }
  async startVerification(userId: string, userData: any) { 
    return { sessionId: `sum_${userId}_${Date.now()}` }; 
  }
}

export class ManualReviewProvider implements KYCProvider {
  name = 'manual';
  isAvailable(countryCode: string) { return true; } // Último recurso
  async startVerification(userId: string, userData: any) { 
    return { sessionId: `man_${userId}_${Date.now()}` }; 
  }
}

export class KYCManager {
  private providers: KYCProvider[] = [
    new SumsubProvider(),
    new TelegramProvider(),
    new ManualReviewProvider()
  ];

  getAvailableProviders(countryCode: string): string[] {
    return this.providers.filter(p => p.isAvailable(countryCode)).map(p => p.name);
  }

  async startVerification(userId: string, countryCode: string, userData: any, preferredProvider?: string) {
    const available = this.providers.filter(p => p.isAvailable(countryCode));
    
    if (preferredProvider) {
      const chosen = available.find(p => p.name === preferredProvider);
      if (chosen) return chosen.startVerification(userId, userData);
    }

    for (const provider of available) {
      try {
        console.log(`[KYC] Iniciando con ${provider.name} para ${userId}`);
        return await provider.startVerification(userId, userData);
      } catch (error) {
        console.warn(`[KYC] ${provider.name} falló. Fallback...`);
      }
    }
    throw new Error('Ningún KYC disponible');
  }
}

export const kycManager = new KYCManager();
