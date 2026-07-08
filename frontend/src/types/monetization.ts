export interface AdRewardState {
  hasTemporaryAccess: boolean;
  expiresAt: number; // Timestamp in milliseconds (e.g., Date.now() + 24 * 60 * 60 * 1000)
}

// Payment method details for Deuna! and Bank Transfer
export interface PaymentMethodDetails {
  type: 'deuna' | 'bank_transfer';
  label: string;
  accountName: string;
  accountNumber?: string;
  accountType?: 'Ahorros' | 'Corriente';
  bankName?: string;
  phoneNumber?: string;
  cedula?: string;
}
