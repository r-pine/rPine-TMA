export type SwapDepthType = 'safe' | 'normal' | 'risky';

export const SwapDepthValues: Record<SwapDepthType, number> = {
	safe: 1,
	normal: 2,
	risky: 3
};

export interface SwapSettings {
	maxDepth: SwapDepthType;
	maxSplits: number;
	maxSlippage: number;
}

export interface SettingsState {
	swap: SwapSettings;
} 