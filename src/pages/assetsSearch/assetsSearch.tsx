import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { Asset } from '../../store/assets/types';
import { searchAssets } from '../../entities/assets/api/assets.api';
import { useDebounce } from '../../shared/hooks/useDebounce';
import { selectWalletAddress, selectTonBalance } from '../../store/wallet/selectors';
import { selectUserAssets, selectAssetsLoading, selectAssets } from '../../store/assets/selectors';
import { updateUserAssets, fetchAssets } from '../../store/assets/thunks';
import { normalizeAssetName } from '../../entities/assets/model/utils';
import styles from './assetsSearch.module.css';
import { useTranslation } from 'react-i18next';


const formatBalance = (balance: string, decimals: number): string => {
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

const mergeAssets = (
	serverAssets: Asset[],
	userAssets: Asset[],
	tonBalance: number | null
): Asset[] => {
	const userAssetsByName: Record<string, Asset> = {};

	userAssets.forEach(asset => {
		const normalizedName = normalizeAssetName(asset.name);
		userAssetsByName[normalizedName] = asset;
	});

	let result: Asset[] = [];

	serverAssets.forEach(serverAsset => {
		const normalizedName = normalizeAssetName(serverAsset.name);
		const userAsset = userAssetsByName[normalizedName];

		let assetWithBalance: Asset;

		if (serverAsset.type === 'native' && normalizedName === 'toncoin') {
			assetWithBalance = {
				...serverAsset,
				balance: tonBalance?.toString() || '0',
			};
			result.unshift(assetWithBalance);
		} else if (userAsset) {
			assetWithBalance = {
				...serverAsset,
				balance: userAsset.balance || '0',
				showWarning: userAsset.showWarning
			};
			result.push(assetWithBalance);
			delete userAssetsByName[normalizedName];
		} else {
			result.push(serverAsset);
		}
	});

	Object.values(userAssetsByName).forEach(asset => {
		if (!(asset.type === 'native' && normalizeAssetName(asset.name) === 'toncoin')) {
			result.push(asset);
		}
	});

	return result;
};


interface AssetsSearchProps {
	onSelect?: (asset: Asset) => void;
	excludeAsset?: Asset | null;
}

export const AssetsSearch: React.FC<AssetsSearchProps> = ({ onSelect, excludeAsset }) => {
	const dispatch = useDispatch<AppDispatch>();
	const address = useSelector(selectWalletAddress);
	const tonBalanceStr = useSelector(selectTonBalance);
	const tonBalance = tonBalanceStr ? parseFloat(tonBalanceStr) : null;
	const userAssets = useSelector(selectUserAssets);
	const allAssets = useSelector(selectAssets);
	const isAssetsLoading = useSelector(selectAssetsLoading);
	const abortControllerRef = useRef<AbortController | null>(null);
	const [searchValue, setSearchValue] = useState('');
	const debouncedSearchValue = useDebounce(searchValue, 300);
	const [searchResults, setSearchResults] = useState<Asset[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [assetsRequested, setAssetsRequested] = useState(false);

	const { t } = useTranslation();

	const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchValue(e.target.value);
	}, []);

	useEffect(() => {
		if (!assetsRequested && allAssets.length === 0 && !isAssetsLoading) {
			dispatch(fetchAssets());
			setAssetsRequested(true);
		}
	}, [dispatch, allAssets.length, isAssetsLoading, assetsRequested]);

	useEffect(() => {
		if (address) {
			dispatch(updateUserAssets(address));
		}
	}, [address, dispatch]);

	useEffect(() => {
		if (!debouncedSearchValue.trim()) {
			setSearchResults([]);
			return;
		}
		if (abortControllerRef.current) {
			abortControllerRef.current.abort();
		}
		abortControllerRef.current = new AbortController();

		const searchForAssets = async () => {
			try {
				setLoading(true);
				setError(null);
				const response = await searchAssets({
					searchValue: debouncedSearchValue,
					userAssets: address ? [address] : [],
					signal: abortControllerRef.current?.signal
				});
				setSearchResults(response.assets);
			} catch (err) {
				if (err instanceof DOMException && err.name === 'AbortError') {
					return;
				}
				setError(err instanceof Error ? err.message : 'Search failed');
			} finally {
				setLoading(false);
			}
		};
		searchForAssets();

		return () => {
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}
		};
	}, [debouncedSearchValue, address]);

	const combinedAssets = useMemo(() => {
		if (searchResults.length > 0) {
			return mergeAssets(searchResults, userAssets, tonBalance);
		}
		if (!address) {
			return allAssets;
		}
		return mergeAssets(allAssets, userAssets, tonBalance);
	}, [address, userAssets, allAssets, searchResults, tonBalance]);

	const displayedAssets = useMemo(() => {
		let filteredAssets = combinedAssets;
		if (excludeAsset) {
			filteredAssets = filteredAssets.filter(
				asset => asset.address !== excludeAsset.address
			);
		}
		if (searchValue.trim()) {
			const searchLower = searchValue.toLowerCase();
			filteredAssets = filteredAssets.filter(asset =>
				asset.name.toLowerCase().includes(searchLower) ||
				asset.symbol.toLowerCase().includes(searchLower)
			);
		}
		return filteredAssets;
	}, [combinedAssets, searchValue, excludeAsset]);

	const displayedAssetsLimited = useMemo(() => {
		return displayedAssets.slice(0, 110);
	}, [displayedAssets]);

	const isPersistLoaded = useSelector((state: RootState) => state._persist?.rehydrated);

	if (!isPersistLoaded) {
		return <div className={styles.loading}>Initializing data...</div>;
	}

	return (
		<div className={styles.container}>
			<input
				type="text"
				placeholder={t('jetton_search')}
				value={searchValue}
				onChange={handleSearchChange}
				className={styles.searchInput}
				aria-label="Search cryptocurrency"
			/>

			<div className={styles.assetsContainer}>
				{displayedAssetsLimited.length > 0 ? (
					<>
						<div className={styles.assetsHeader}>{t('jetton_name')}:</div>
						<div className={styles.scrollableArea}>
							{(loading || isAssetsLoading) && displayedAssetsLimited.length === 0 && (
								<div className={styles.loading}>{t('jetton_search_loading')}...</div>
							)}

							{!loading && !isAssetsLoading && error && (
								<div className={styles.error} role="alert">
									{error}
								</div>
							)}

							<div className={styles.assetsList}>
								{displayedAssetsLimited.map((asset, index) => {
									return (
										<div
											key={`${asset.address}-${asset.symbol}-${index}`}
											className={`${styles.assetItem} ${onSelect ? styles.selectable : ''}`}
											role="listitem"
											onClick={() => {
												if (onSelect) {
													onSelect(asset);
												}
											}}
										>
											<div className={styles.assetTitle}>
												{asset.image && (
													<img
														src={asset.image}
														alt={asset.symbol}
														className={styles.assetImage}
														loading="lazy"
													/>
												)}
												{asset.symbol}
												{asset.showWarning && (
													<img
														src="/assets/icons/warning_icon.svg"
														alt="Warning"
														className={styles.warningIcon}
													/>
												)}
											</div>
											<span className={styles.assetBalance}>
												{asset.type === 'native' && normalizeAssetName(asset.name) === 'toncoin'
													? asset.balance
													: asset.balance ? formatBalance(asset.balance, asset.decimals) : '0.00'
												}
											</span>
										</div>
									);
								})}
							</div>
						</div>
					</>
				) : (
					<div className={styles.emptyContainer}>
							<div className={styles.emptyMessage}>{t('jetton_search_not_found')}</div>
						<img className={styles.emptyMessageImg} src="/assets/img/pine_unhappy_svg.svg" alt="sad pine" />
							<div className={styles.emptyMessage}>{t('jetton_search_try_again')}</div>
					</div>
				)}
			</div>
		</div>
	);
};
export default AssetsSearch;