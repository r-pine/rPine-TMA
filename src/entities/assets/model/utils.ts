import { Asset } from '../../../store/assets/types';

export const normalizeAssetName = (name: string): string => {
	return name.toLowerCase().trim();
};

export const normalizeAddress = (address: string): string => {
	return address.replace(/^0:/, '');
};

export const areAssetsEqual = (asset1: Asset, asset2: Asset): boolean => {
	return normalizeAddress(asset1.address) === normalizeAddress(asset2.address);
}; 