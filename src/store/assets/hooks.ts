import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchAssets, updateUserAssets } from './thunks';
import {
	selectAssets,
	selectUserAssets,
	selectAssetsLoading,
	selectAssetsError,
	selectAssetByAddress,
	selectUserAssetByAddress,
} from './selectors';

export const useAssets = () => {
	const dispatch = useDispatch<AppDispatch>();

	const assets = useSelector(selectAssets);
	const userAssets = useSelector(selectUserAssets);
	const loading = useSelector(selectAssetsLoading);
	const error = useSelector(selectAssetsError);

	const getAssetByAddress = (address: string) =>
		useSelector((state: RootState) => selectAssetByAddress(state, address));

	const getUserAssetByAddress = (address: string) =>
		useSelector((state: RootState) => selectUserAssetByAddress(state, address));

	const loadAssets = () => dispatch(fetchAssets());
	const updateUserAssetsList = (address: string) => dispatch(updateUserAssets(address));

	return {
		assets,
		userAssets,
		loading,
		error,
		getAssetByAddress,
		getUserAssetByAddress,
		loadAssets,
		updateUserAssetsList,
	};
}; 