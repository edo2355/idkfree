export interface PaymentResult {
  id: string;
  url?: string;
  clientSecret?: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface PaymentProvider {
  createPayment(amount: number, currency: string, metadata: any): Promise<PaymentResult>;
  handleWebhook(payload: any, signature?: string): Promise<boolean>;
  refund(transactionId: string, amount: number): Promise<boolean>;
}
