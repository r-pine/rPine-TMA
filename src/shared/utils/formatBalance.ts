export const formatBalance = (balance: string, decimals: number): string => {
	try {
		const num = parseFloat(balance);
		if (isNaN(num) || num < 0) {
			return '0.00';
		}
		return (num / 10 ** decimals).toFixed(2);
	} catch (e) {
		return '0.00';
	}
};