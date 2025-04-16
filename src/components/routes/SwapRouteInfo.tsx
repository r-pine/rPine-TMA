import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { Route } from '../../store/swapRoutes/types';
import { Skeleton } from '../../shared/ui/Skeleton';
import { useTranslation } from 'react-i18next';
import styles from './SwapRouteInfo.module.css';

const selectExchangeRate = (state: RootState) => state.swapRoutes.exchangeRate;
const selectRoute = (state: RootState) => state.swapRoutes.route;

interface SwapRouteInfoProps {
	hasInput: boolean;
	showSkeleton: boolean;
}

export const SwapRouteInfo: React.FC<SwapRouteInfoProps> = ({ hasInput, showSkeleton }) => {
	const exchangeRate = useSelector(selectExchangeRate);
	const route = useSelector(selectRoute);
	const { t } = useTranslation();

	if (!hasInput) {
		return null;
	}

	const displayData = route?.displayData;

	if (!displayData && !showSkeleton) {
		return null;
	}

	const inputSymbol = displayData?.routes?.[0]?.routeSteps?.[0]?.inputAsset?.symbol ?? '';
	const lastRoute = displayData?.routes?.[displayData.routes.length - 1];
	const lastStep = lastRoute?.routeSteps?.[lastRoute.routeSteps.length - 1];
	const outputSymbol = lastStep?.outputAsset?.symbol ?? '';

	const hasRoutes = displayData?.routes !== null;

	return (
		<div className={styles.container}>
			{showSkeleton ? (
				<div className={styles.exchangeRate}>
					<Skeleton width={200} height={20} />
				</div>
			) : hasRoutes && exchangeRate && (
				<div className={styles.exchangeRate}>
					1 {inputSymbol} = {exchangeRate.toFixed(6)} {outputSymbol}
				</div>
			)}
			<div className={styles.borderContainer}>
				<div className={styles.routeInfo}>
					<div className={styles.infoItem}>
						<span className={styles.label}>{t('route_max_slippage')}</span>
						{showSkeleton ? (
							<Skeleton width={80} height={20} />
						) : (
							<span className={styles.value}>{displayData?.maxSlippage?.toFixed(2) ?? '0.00'}%</span>
						)}
					</div>
					<div className={styles.infoItem}>
						<span className={styles.label}>{t('recieve_tokens_text')}</span>
						{showSkeleton ? (
							<Skeleton width={120} height={20} />
						) : (
							<span className={styles.value}>{displayData?.minOutputAssetAmount ?? '0'} {outputSymbol}</span>
						)}
					</div>
					<div className={styles.infoItem}>
						<span className={styles.label}>{t('fee_swap_text')}</span>
						{showSkeleton ? (
							<Skeleton width={60} height={20} />
						) : (
							<span className={styles.value}>{displayData?.routingFeePercent?.toFixed(2) ?? '0.00'}%</span>
						)}
					</div>
				</div>
				<div className={styles.routesContainer}>
					{hasRoutes && <h3 className={styles.routesTitle}>{t('route_text')}</h3>}
					{showSkeleton ? (
						<div className={styles.routeItem}>
							<Skeleton width="100%" height={60} />
						</div>
					) : !hasRoutes ? (
						<div className={styles.routeNotFound}>{t('route_not_found')}</div>
					) : displayData?.routes?.map((route: Route, index: number) => (
						<div key={index} className={styles.routeItem}>
							{route.routeSteps?.map((step, stepIndex) => (
								<div key={stepIndex} className={styles.routeStep}>
									<span className={styles.percent}>{route.inputPercent}%</span>
									<div className={styles.lineContainer}>
										<img src="/assets/icons/stroke_line.svg" alt="route line" className={styles.strokeLine} />
										<div className={styles.stepContainer}>
											<img src={step.dex?.image} alt="DEX" className={styles.dexImage} />
											<span className={styles.assetsGroup}>
												<img src={step.inputAsset?.image} alt="Input Asset" className={styles.assetImage} />
												<img src={step.outputAsset?.image} alt="Output Asset" className={styles.assetImage} />
											</span>
										</div>
									</div>
									<span className={styles.percent}>{route.inputPercent}%</span>
								</div>
							))}
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default SwapRouteInfo; 