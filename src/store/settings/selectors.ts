import { RootState } from '../store';
import { createSelector } from '@reduxjs/toolkit';
import { SwapDepthValues } from './types';

const selectSwapSettings = (state: RootState) => state.settings.swap;

export const selectMaxDepthType = createSelector(
	[selectSwapSettings],
	(swap) => swap.maxDepth
);

export const selectMaxDepthValue = createSelector(
	[selectMaxDepthType],
	(maxDepth) => SwapDepthValues[maxDepth]
);

export const selectMaxSplits = createSelector(
	[selectSwapSettings],
	(swap) => swap.maxSplits
);

export const selectMaxSlippage = createSelector(
	[selectSwapSettings],
	(swap) => swap.maxSlippage
);

export const selectAllSwapSettings = createSelector(
	[selectSwapSettings],
	(swap) => swap
);

export const selectSwapSettingsForApi = createSelector(
	[selectMaxDepthValue, selectMaxSplits, selectMaxSlippage],
	(maxDepth, maxSplits, maxSlippage) => ({
		maxDepth: maxDepth.toString(),
		maxSplits: maxSplits.toString(),
		maxSlippage: maxSlippage.toFixed(2)
	})
); 