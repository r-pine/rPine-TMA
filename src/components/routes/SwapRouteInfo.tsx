import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { Route, DisplayData } from '../../store/swapRoutes/types';
import { useTranslation } from 'react-i18next';
import styles from './SwapRouteInfo.module.css';
import { selectAssetByAddress } from '../../store/assets/selectors';

const selectExchangeRate = (state: RootState) => state.swapRoutes.exchangeRate;
const selectRoute = (state: RootState) => state.swapRoutes.route;

interface SwapRouteInfoProps {
	hasInput: boolean;
}

export const SwapRouteInfo: React.FC<SwapRouteInfoProps> = ({ hasInput }) => {
	const exchangeRate = useSelector(selectExchangeRate);
	const route = useSelector(selectRoute);
	const { t } = useTranslation();

	const [isDataVisible, setIsDataVisible] = useState(false);
	const [isUpdating, setIsUpdating] = useState(false);
	const [previousData, setPreviousData] = useState<DisplayData | null>(null);

	useEffect(() => {
		if (route?.displayData) {
			if (isDataVisible) {
				// Если данные уже были видны, показываем состояние обновления
				// Сохраняем предыдущие данные для плавного перехода
				setPreviousData(route.displayData);
				setIsUpdating(true);
				const timer = setTimeout(() => {
					setIsUpdating(false);
				}, 150);
				return () => clearTimeout(timer);
			} else {
				// Первое появление данных
				setIsDataVisible(true);
				setPreviousData(route.displayData);
			}
		} else {
			// Если route данных нет, сбрасываем состояния анимации
			setIsDataVisible(false);
			setIsUpdating(false);
			setPreviousData(null);
		}
		// Убираем else блок - компонент остается видимым после первого появления
	}, [route?.displayData, isDataVisible]);

	// ВАЖНО: хуки должны вызываться в одном и том же порядке на каждом рендере.
	// Поэтому вычисляем данные и вызываем useSelector ДОО любых ранних return.
	const displayData = route?.displayData || previousData;
	const inputSymbol = displayData?.routes?.[0]?.routeSteps?.[0]?.inputAsset?.symbol ?? '';
	const lastRoute = displayData?.routes?.[displayData.routes.length - 1];
	const lastStep = lastRoute?.routeSteps?.[lastRoute.routeSteps.length - 1];
	const outputSymbol = lastStep?.outputAsset?.symbol ?? '';
	const outputAddress = lastStep?.outputAsset?.address;

	// Метаданные выходного ассета из list-assets (для decimals)
	const outputAssetMeta = useSelector((state: RootState) => (
		outputAddress ? selectAssetByAddress(state, outputAddress) : undefined
	));
	// USDT всегда 6 знаков, иначе берём decimals из метаданных или делаем fallback = 9
	const outputDecimals = outputAssetMeta?.symbol === 'USDT' ? 6 : (outputAssetMeta?.decimals ?? 9);

	if (!hasInput) {
		return null;
	}

	// Показываем компонент если есть hasInput, даже если данных еще нет
	// Это позволит плавно появиться при первом получении данных
	if (!displayData && !isDataVisible) {
		return null;
	}

	const hasRoutes = displayData?.routes !== null;

	return (
		<div className={styles.container}>
			{hasRoutes && exchangeRate && (
				<div className={`${styles.exchangeRate} ${isDataVisible ? styles.visible : ''} ${isUpdating ? styles.updating : ''}`}>
					1 {inputSymbol} = {exchangeRate.toFixed(outputDecimals)} {outputSymbol}
				</div>
			)}
			<div className={styles.borderContainer}>
				<div className={`${styles.routeInfo} ${isDataVisible ? styles.visible : ''} ${isUpdating ? styles.updating : ''}`}>
					<div className={styles.infoItem}>
						<span className={styles.label}>{t('route_max_slippage')}</span>
						<span className={`${styles.value} ${isUpdating ? styles.updating : ''}`}>
							{displayData?.maxSlippage?.toFixed(2) ?? '0.00'}%
						</span>
					</div>
					<div className={styles.infoItem}>
						<span className={styles.label}>{t('recieve_tokens_text')}</span>
						<span className={`${styles.value} ${isUpdating ? styles.updating : ''}`}>
							{displayData?.minOutputAssetAmount != null
								? displayData.minOutputAssetAmount.toFixed(outputDecimals)
								: (0).toFixed(outputDecimals)
							} {outputSymbol}
						</span>
					</div>
					<div className={styles.infoItem}>
						<span className={styles.label}>{t('fee_swap_text')}</span>
						<span className={`${styles.value} ${isUpdating ? styles.updating : ''}`}>
							{displayData?.routingFeePercent?.toFixed(2) ?? '0.00'}%
						</span>
					</div>
				</div>
				<div className={`${styles.routesContainer} ${isDataVisible ? styles.visible : ''} ${isUpdating ? styles.updating : ''}`}>
					{hasRoutes && <h3 className={styles.routesTitle}>{t('route_text')}</h3>}
					{!hasRoutes ? (
						<div className={styles.routeNotFound}>{t('route_not_found')}</div>
					) : displayData?.routes?.map((route: Route, index: number) => (
						<div key={index} className={styles.routeRow}>
							<span className={styles.percent}>{route.inputPercent}%</span>
							<img src="/assets/icons/stroke_line.svg" alt="route line" className={styles.strokeLine} />
							<div className={styles.stepsOverlay}>
								{route.routeSteps?.map((step, stepIndex) => (
									<div key={stepIndex} className={styles.stepContainer}>
										<img src={step.dex?.image} alt="DEX" className={styles.dexImage} />
										<span className={styles.assetsGroup}>
											<img src={step.inputAsset?.image} alt="Input Asset" className={styles.assetImage} />
											<img src={step.outputAsset?.image} alt="Output Asset" className={styles.assetImage} />
										</span>
									</div>
								))}
							</div>
							<span className={styles.percent}>{route.inputPercent}%</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default SwapRouteInfo; 