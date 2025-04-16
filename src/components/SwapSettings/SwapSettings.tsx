import React, { useCallback, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	selectMaxDepthType,
	selectMaxSplits,
	selectMaxSlippage
} from '../../store/settings/selectors';
import {
	setMaxDepth,
	setMaxSplits,
	setMaxSlippage,
	resetSwapSettings
} from '../../store/settings/settingsSlice';
import { SwapDepthType } from '../../store/settings/types';
import { initialState } from '../../store/settings/initialState';
import { useTranslation } from 'react-i18next';
import styles from './SwapSettings.module.css';

const SwapSettings: React.FC = () => {
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const maxDepthType = useSelector(selectMaxDepthType);
	const maxSplits = useSelector(selectMaxSplits);
	const maxSlippage = useSelector(selectMaxSlippage);
	const [localSlippage, setLocalSlippage] = useState(maxSlippage.toFixed(2));

	useEffect(() => {
		setLocalSlippage(maxSlippage.toFixed(2));
	}, [maxSlippage]);

	const handleDepthChange = useCallback((depth: SwapDepthType) => {
		dispatch(setMaxDepth(depth));
	}, [dispatch]);

	const handleSplitsChange = useCallback((splits: number) => {
		dispatch(setMaxSplits(splits));
	}, [dispatch]);

	const handleSlippageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value.replace('%', '');

		if (value === '') {
			setLocalSlippage('');
			return;
		}

		if (!/^\d*\.?\d*$/.test(value)) {
			return;
		}

		setLocalSlippage(value);
	}, []);

	const handleSlippageBlur = useCallback(() => {
		if (localSlippage === '') {
			dispatch(setMaxSlippage(0));
			setLocalSlippage('0.00');
			return;
		}

		const numValue = parseFloat(localSlippage);

		if (isNaN(numValue) || numValue < 0 || numValue > 100) {
			dispatch(setMaxSlippage(0));
			setLocalSlippage('0.00');
			return;
		}

		const formattedValue = numValue.toFixed(2);
		dispatch(setMaxSlippage(parseFloat(formattedValue)));
		setLocalSlippage(formattedValue);
	}, [localSlippage, dispatch]);

	const handleSetAutoSlippage = useCallback(() => {
		const defaultSlippage = initialState.swap.maxSlippage;
		dispatch(setMaxSlippage(defaultSlippage));
		setLocalSlippage(defaultSlippage.toFixed(2));
	}, [dispatch]);

	const handleReset = useCallback(() => {
		dispatch(resetSwapSettings());
	}, [dispatch]);

	const getRiskDescription = useCallback((type: SwapDepthType) => {
		switch (type) {
			case 'safe':
				return t('risk_safe');
			case 'normal':
				return t('risk_normal');
			case 'risky':
				return t('risk_risky');
			default:
				return '';
		}
	}, [t]);

	return (
		<div className={styles.container}>
			<div className={styles.section}>
				<div className={styles.headingSection}>
					<h3 className={styles.optionHeader}>{t('settings_slippage_header')} (%)</h3>
					<div className={styles.slippageContainer}>
						<button
							className={styles.autoButton}
							onClick={handleSetAutoSlippage}
						>
							AUTO
						</button>
						<div className={styles.inputWrapper}>
							<input
								type="text"
								value={localSlippage}
								onChange={handleSlippageChange}
								onBlur={handleSlippageBlur}
								className={styles.slippageInput}
								min="0"
								max="100"
							/>
							<span className={styles.percentSymbol}>%</span>
						</div>
					</div>
				</div>
				<p className={styles.optionDescription}>
					{t('settings_max_slippage_text')}
				</p>
			</div>

			<div className={styles.section}>
				<div className={styles.headingSection}>
					<h3 className={styles.optionHeader}>{t('settings_risk_header')}</h3>
					<div className={styles.buttonGroup}>
						<button
							className={maxDepthType === 'safe' ? styles.buttonSelected : styles.button}
							onClick={() => handleDepthChange('safe')}
						>
							SAFE
						</button>
						<button
							className={maxDepthType === 'normal' ? styles.buttonSelected : styles.button}
							onClick={() => handleDepthChange('normal')}
						>
							NORMAL
						</button>
						<button
							className={maxDepthType === 'risky' ? styles.buttonSelected : styles.button}
							onClick={() => handleDepthChange('risky')}
						>
							RISKY
						</button>
					</div>
				</div>
				<p className={styles.riskDescription}>
					{getRiskDescription(maxDepthType)}
				</p>
				<p className={styles.optionDescription}>
					{t('settings_risk_description')}
				</p>
			</div>

			<div className={styles.section}>
				<div className={styles.headingSection}>
					<h3 className={styles.optionHeader}>{t('settings_parallel_header')}</h3>
					<div className={styles.buttonGroup}>
						{[1, 2, 3, 4].map(split => (
							<button
								key={split}
								className={maxSplits === split ? styles.buttonSelected : styles.button}
								onClick={() => handleSplitsChange(split)}
							>
								{split}
							</button>
						))}
					</div>
				</div>
				<p className={styles.optionDescription}>
					{t('settings_parallel_description')}
				</p>
			</div>
			<button className={styles.resetButton} onClick={handleReset}>
				{t('settings_reset_button')}
			</button>
		</div>
	);
};

export default SwapSettings; 