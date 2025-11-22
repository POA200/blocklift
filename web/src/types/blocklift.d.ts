export interface PaymentRecord {
	reference: string;
	amountMinor: number; // minor units (kobo)
	donorName: string;
	donorEmail: string;
	timestamp: number; // epoch ms
}

