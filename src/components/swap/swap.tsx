import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { Asset } from '../../store/assets/types';
import { TokenSelectorButton } from '../TokenSelectorButton/TokenSelectorButton';
import { TokenSelectModal } from '../modals/tokenSelectModal.tsx/TokenSelectModal';
import { useSwapRoutes } from '../../store/swapRoutes/hooks';
import { useAssets } from '../../store/assets/hooks';
import { useDebounce } from '../../shared/hooks/useDebounce';
import { selectBalances, selectTonBalance } from '../../store/wallet/selectors';
import { selectUserAssets } from '../../store/assets/selectors';
import { normalizeAssetName } from '../../entities/assets/model/utils';
import styles from './swap.module.css';
import { SwapRouteInfo } from '../routes/SwapRouteInfo';
import { SwapTokenButton } from '../../entities/transactions/components/swapTokenButton.tsx/SwapTokenButton';
import { useWallet } from '../../store/wallet/hooks';
import { selectForceRefresh } from '../../store/swapRoutes/selectors';
import { setIntervalActive } from '../../store/swapRoutes/slice';

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

export const Swap: React.FC = () => {

	const { assets, loading: assetsLoading, loadAssets } = useAssets();
	const balances = useSelector(selectBalances);
	const tonBalance = useSelector(selectTonBalance);
	const userAssets = useSelector(selectUserAssets);
	const { address } = useWallet();
	const {

		outputAssetAmount,

		inputAssetUsdAmount,
		outputAssetUsdAmount,
		loading: swapLoading,
		setAmount,
		setInputAsset,
		setOutputAsset,
		loadRoute,
		resetOutputAmount,
		cancelActiveRequest,
		route
	} = useSwapRoutes();
	const forceRefresh = useSelector(selectForceRefresh);
	const prevForceRefreshRef = useRef(forceRefresh);
	const dispatch = useDispatch();

	const [selectedInputAsset, setSelectedInputAsset] = useState<Asset | null>(null);
	const [selectedOutputAsset, setSelectedOutputAsset] = useState<Asset | null>(null);
	const [isInputModalOpen, setIsInputModalOpen] = useState(false);
	const [isOutputModalOpen, setIsOutputModalOpen] = useState(false);
	const [inputValue, setInputValue] = useState('');
	const [hasInput, setHasInput] = useState(false);
	const debouncedInputValue = useDebounce(inputValue, 300);
	const [updateInterval, setUpdateInterval] = useState<number | null>(null);

	const { t } = useTranslation();

	const tonAsset = assets.find((asset) => asset.symbol === 'TON');
	const usdtAsset = assets.find((asset) => asset.symbol === 'USDT');

	const getAssetBalance = useCallback((asset: Asset | null) => {
		if (!asset) return '0';
		if (asset.type === 'native' && normalizeAssetName(asset.name) === 'toncoin') {
			return tonBalance?.toString() || '0';
		}

		const userAsset = userAssets.find(
			ua => normalizeAssetName(ua.name) === normalizeAssetName(asset.name)
		);

		return userAsset?.balance || '0';
	}, [tonBalance, userAssets]);

	useEffect(() => {
		loadAssets();
	}, []);

	useEffect(() => {
		if (tonAsset && usdtAsset) {
			setSelectedInputAsset(tonAsset);
			setSelectedOutputAsset(usdtAsset);
			setInputAsset(tonAsset.address);
			setOutputAsset(usdtAsset.address);
		}
	}, [assets]);

	useEffect(() => {
		if (debouncedInputValue && debouncedInputValue !== '0' && selectedInputAsset && selectedOutputAsset) {
			setAmount(debouncedInputValue);

			loadRoute({
				inputAssetAmount: debouncedInputValue,
				inputAssetAddress: selectedInputAsset.address,
				outputAssetAddress: selectedOutputAsset.address,
			});
		} else {
			if (updateInterval) {
				clearInterval(updateInterval);
				setUpdateInterval(null);
			}
			setAmount('');
			resetOutputAmount();
		}
	}, [debouncedInputValue, selectedInputAsset, selectedOutputAsset]);

	useEffect(() => {
		if (route && !swapLoading && debouncedInputValue && selectedInputAsset?.address && selectedOutputAsset?.address) {
			if (updateInterval) {
				clearInterval(updateInterval);
			}

			const interval = setInterval(() => {
				loadRoute({
					inputAssetAmount: debouncedInputValue,
					inputAssetAddress: selectedInputAsset.address,
					outputAssetAddress: selectedOutputAsset.address,
				});
			}, 5000);

			setUpdateInterval(interval);
			dispatch(setIntervalActive(true));

			return () => {
				if (interval) {
					clearInterval(interval);
				}
				dispatch(setIntervalActive(false));
			};
		}
	}, [route, swapLoading, debouncedInputValue, selectedInputAsset, selectedOutputAsset]);

	useEffect(() => {
		return () => {
			if (updateInterval) {
				clearInterval(updateInterval);
			}
		};
	}, []);

	useEffect(() => {
		if (address) {
		}
	}, [address, balances]);

	useEffect(() => {
		if (forceRefresh && !prevForceRefreshRef.current && inputValue && selectedInputAsset && selectedOutputAsset) {
			loadRoute({
				inputAssetAmount: inputValue,
				inputAssetAddress: selectedInputAsset.address,
				outputAssetAddress: selectedOutputAsset.address,
			});
		}
		prevForceRefreshRef.current = forceRefresh;
	}, [forceRefresh, inputValue, selectedInputAsset, selectedOutputAsset, loadRoute]);

	const handleInputAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		let value = e.target.value;

		value = value.replace(/[^\d.,]/g, '');

		value = value.replace(',', '.');

		const parts = value.split('.');
		if (parts.length > 2) {
			value = parts[0] + '.' + parts.slice(1).join('');
		}

		if (parts.length === 2 && parts[1].length > 2) {
			value = parts[0] + '.' + parts[1].slice(0, 2);
		}

		if (value.startsWith('.')) {
			value = '0' + value;
		}

		if (value.startsWith('0') && value.length > 1 && !value.startsWith('0.')) {
			value = value.substring(1);
		}

		cancelActiveRequest();
		setInputValue(value);
		setHasInput(!!value);

		if (!value) {
			if (updateInterval) {
				clearInterval(updateInterval);
				setUpdateInterval(null);
			}
			setAmount('');
			resetOutputAmount();
			dispatch(setIntervalActive(false));
		}
	};

	const handleSwitchTokens = () => {
		if (!selectedInputAsset || !selectedOutputAsset) return;
		const tempAsset = selectedInputAsset;
		setSelectedInputAsset(selectedOutputAsset);
		setSelectedOutputAsset(tempAsset);
		setInputAsset(selectedOutputAsset.address);
		setOutputAsset(selectedInputAsset.address);
		resetOutputAmount();
	};

	const handleInputAssetSelect = (asset: Asset) => {
		if (selectedInputAsset?.address !== asset.address) {
			resetOutputAmount();
		}
		setSelectedInputAsset(asset);
		setIsInputModalOpen(false);
		setInputAsset(asset.address);
	};

	const handleOutputAssetSelect = (asset: Asset) => {
		if (selectedOutputAsset?.address !== asset.address) {
			resetOutputAmount();
		}
		setSelectedOutputAsset(asset);
		setIsOutputModalOpen(false);
		setOutputAsset(asset.address);
	};

	const displayOutputAmount = () => {
		if (swapLoading || outputAssetAmount === '') {
			return '0.00';
		}
		const num = parseFloat(outputAssetAmount);
		return num.toFixed(2);
	};

	const isBalanceExceeded = () => {
		if (!selectedInputAsset || !inputValue) return false;
		const balance = getAssetBalance(selectedInputAsset);
		const inputNum = parseFloat(inputValue);
		const balanceNum = parseFloat(balance);
		return inputNum > balanceNum;
	};

	const handleSwap = () => {
		console.log('Swap transaction initiated');
	};


	return (
		<div className={styles.swapContainer}>
			<div className={styles.swapBlock}>
				<div className={styles.inputSection}>
					<div className={styles.amountText}>
						{t('amount_asset')} {selectedInputAsset?.symbol || ''}
					</div>

					<div className={styles.inputContainer}>
						<input
							type="text"
							value={inputValue}
							onChange={handleInputAmountChange}
							placeholder="0.00"
							className={`${styles.amountInput} ${isBalanceExceeded() ? styles.balanceExceeded : ''}`}
							disabled={assetsLoading || !selectedInputAsset}
							inputMode="numeric"
							min="0"
							step="any"
							lang="en"
						/>
						<TokenSelectorButton
							asset={selectedInputAsset}
							onClick={() => setIsInputModalOpen(true)}
							placeholder="Select Input Asset"
						/>
					</div>

					<div className={styles.balanceAmount}>
						<div className={styles.usdAmount}>
							${swapLoading ? '0.00' : (inputAssetUsdAmount?.toFixed(2) || '0.00')}
						</div>

						{selectedInputAsset && (
							<div className={styles.balanceInfo}>
								{selectedInputAsset.type === 'native' && normalizeAssetName(selectedInputAsset.name) === 'toncoin'
									? getAssetBalance(selectedInputAsset)
									: formatBalance(getAssetBalance(selectedInputAsset), selectedInputAsset.decimals)
								} {selectedInputAsset.symbol}
								<span className={styles.maxTag}>MAX</span>
							</div>
						)}
					</div>
				</div>

				<button
					className={styles.switchButton}
					onClick={handleSwitchTokens}
					disabled={!selectedInputAsset || !selectedOutputAsset}
				>
					<img src="/assets/icons/arrow_icon.svg" alt='switch' className={styles.switchIcon} />
				</button>

				<div className={styles.outputSection}>
					<div className={styles.amountText}>
						{t('amount_asset')} {selectedOutputAsset?.symbol || ''}
					</div>
					<div className={styles.outputContainer}>
						<input
							type="text"
							value={displayOutputAmount()}
							readOnly
							className={`${styles.amountInput} ${swapLoading ? styles.loading : ''}`}
							disabled={assetsLoading || !selectedOutputAsset}
							lang="en"
						/>
						<TokenSelectorButton
							asset={selectedOutputAsset}
							onClick={() => setIsOutputModalOpen(true)}
							placeholder="Select Output Asset"
						/>
					</div>

					<div className={styles.balanceAmount}>
						<div className={styles.usdAmount}>
							${swapLoading ? '0.00' : (outputAssetUsdAmount?.toFixed(2) || '0.00')}
						</div>
						{selectedOutputAsset && (
							<div className={styles.balanceInfo}>
								{selectedOutputAsset.type === 'native' && normalizeAssetName(selectedOutputAsset.name) === 'toncoin'
									? getAssetBalance(selectedOutputAsset)
									: formatBalance(getAssetBalance(selectedOutputAsset), selectedOutputAsset.decimals)
								} {selectedOutputAsset.symbol}
							</div>
						)}
					</div>
				</div>

				<div className={styles.swapButtonContainer}>
					<SwapTokenButton onSwap={handleSwap} />
				</div>
			</div>

			<div className={styles.routeInfoContainer}>
				<SwapRouteInfo
					hasInput={hasInput}
					showSkeleton={!!inputValue && (swapLoading || !route || !route.displayData)}
				/>
			</div>

			<TokenSelectModal
				isOpen={isInputModalOpen}
				onClose={() => setIsInputModalOpen(false)}
				onSelect={handleInputAssetSelect}
				excludeAsset={selectedOutputAsset}
			/>

			<TokenSelectModal
				isOpen={isOutputModalOpen}
				onClose={() => setIsOutputModalOpen(false)}
				onSelect={handleOutputAssetSelect}
				excludeAsset={selectedInputAsset}
			/>
		</div>
	);
};
