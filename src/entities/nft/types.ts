export interface Message {
	id: string;
	amount: number;
	recipient: string;
	stateInit?: string;
	payload?: string;
}

export interface NFTPayload {
	messages: Message[];
}

export interface SendTransactionRequest {
	validUntil: number;
	messages: {
		address: string;
		amount: string;
		stateInit?: string;
		payload?: string;
	}[];
}