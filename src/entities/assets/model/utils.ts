import { Asset } from '../../../store/assets/types';

export const normalizeAssetName = (name: string): string => {
	return name.toLowerCase().trim();
};

// Тикеры нативного токена сети. TON переименовывается в GRAM,
// поэтому учитываем оба варианта на случай, если сервис начнёт отдавать GRAM.
export const NATIVE_SYMBOLS = ['TON', 'GRAM'];
// Возможные значения name нативного токена (например "Toncoin" / "Gram").
export const NATIVE_ASSET_NAMES = ['toncoin', 'gram'];

// Визуальное переименование тикера: TON/GRAM всегда отображается как GRAM.
export const getDisplaySymbol = (symbol?: string | null): string => {
	if (!symbol) return '';
	return isNativeSymbol(symbol) ? 'GRAM' : symbol;
};

// Проверка, что symbol относится к нативному токену (TON или GRAM).
export const isNativeSymbol = (symbol?: string | null): boolean => {
	if (!symbol) return false;
	return NATIVE_SYMBOLS.includes(symbol.toUpperCase());
};

// Проверка, что name относится к нативному токену (toncoin или gram).
export const isNativeAssetName = (name?: string | null): boolean => {
	if (!name) return false;
	return NATIVE_ASSET_NAMES.includes(normalizeAssetName(name));
};

export const normalizeAddress = (address: string): string => {
	return address.replace(/^0:/, '');
};

export const areAssetsEqual = (asset1: Asset, asset2: Asset): boolean => {
	return normalizeAddress(asset1.address) === normalizeAddress(asset2.address);
}; 