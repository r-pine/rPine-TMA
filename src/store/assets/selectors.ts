import { RootState } from '../store';

export const selectAssets = (state: RootState) => state.assets.assets;

export const selectUserAssets = (state: RootState) => state.assets.userAssets;

export const selectAssetsLoading = (state: RootState) => state.assets.loading;

export const selectAssetsError = (state: RootState) => state.assets.error;

export const selectAssetByAddress = (state: RootState, address: string) =>
	state.assets.assets.find((asset) => asset.address === address);

export const selectUserAssetByAddress = (state: RootState, address: string) =>
	state.assets.userAssets.find((asset) => asset.address === address); 