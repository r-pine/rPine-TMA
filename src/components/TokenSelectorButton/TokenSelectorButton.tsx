import React from 'react';
import { Asset } from '../../store/assets/types';
import styles from './TokenSelectorButton.module.css';

interface TokenSelectorButtonProps {
	asset?: Asset | null;
	onClick: () => void;
	placeholder?: string;
}

export const TokenSelectorButton: React.FC<TokenSelectorButtonProps> = ({
	asset,
	onClick,
	placeholder = 'Select token'
}) => {
	return (
		<button
			className={`${styles.tokenSelectorButton} tokenSelectorButton`}
			onClick={onClick}
			type="button"
		>
			{asset?.image && (
				<img
					src={asset.image}
					alt={asset.symbol}
					className={styles.tokenImage}
				/>
			)}
			<span className={styles.tokenSymbol}>
				{asset?.symbol || placeholder}
			</span>
			<svg className={styles.dropdown_icon} width="10" height="10" viewBox="0 0 15 7" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M13.3337 1L7.50032 6L1.66699 1" stroke="#ECECEC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
			</svg>
		</button>
	);
}; 