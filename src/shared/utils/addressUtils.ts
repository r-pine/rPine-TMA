import { Address } from 'ton-core';
import { Buffer } from 'buffer';

if (typeof window !== 'undefined') {
	(window as any).Buffer = Buffer;
}

const addressCache = new Map<string, string>();

export const convertToUserFriendlyAddress = (rawAddress: string): string => {
	if (!rawAddress) return '';

	if (addressCache.has(rawAddress)) {
		return addressCache.get(rawAddress)!;
	}

	try {
		const address = Address.parse(rawAddress);
		const userFriendlyAddress = address.toString({ bounceable: false, urlSafe: true });

		addressCache.set(rawAddress, userFriendlyAddress);

		return userFriendlyAddress;
	} catch (error) {
		console.error('Error converting address:', error);
		return rawAddress;
	}
}; 