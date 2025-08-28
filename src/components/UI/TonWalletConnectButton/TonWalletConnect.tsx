import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import * as motion from 'motion/react-client';
import { useWalletStore } from '../../../store/wallet/useWalletStore';
import { useTonConnectUI } from '@tonconnect/ui-react';
import styles from './TonWalletConnect.module.css';

const TonWalletConnect = ({ customStyle, className }: { customStyle?: string, className?: string }) => {
	const { t } = useTranslation();
	const [tonConnectUI] = useTonConnectUI();
	const { address, formattedAddress, isConnected, connect, disconnect } = useWalletStore(tonConnectUI);
	const [isDropdownVisible, setDropdownVisible] = useState(false);
	const [copied, setCopied] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const handleWalletAction = async () => {
		if (isConnected) {
			await disconnect();
		} else {
			await connect();
		}
	};

	const toggleDropdown = () => {
		setDropdownVisible((prev) => !prev);
	};

	const handleCopy = () => {
		setCopied(true);
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setDropdownVisible(false);
			}
		};

		if (isDropdownVisible) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isDropdownVisible]);

	useEffect(() => {
		if (copied) {
			const timer = setTimeout(() => setCopied(false), 2000);
			return () => clearTimeout(timer);
		}
	}, [copied]);

	return (
		<div className={className}>
			{isConnected ? (
				<div>
					<motion.button
						className={`${styles.connect_button} ${customStyle || ''}`}
						onClick={toggleDropdown}
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
					>
						{formattedAddress}
						<svg className={styles.dropdown_icon} width="15" height="7" viewBox="0 0 15 7" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M13.3337 1L7.50032 6L1.66699 1" stroke="#ECECEC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
					</motion.button>
					{isDropdownVisible && (
						<div ref={dropdownRef} className={styles.dropdown}>
							<CopyToClipboard text={address || ''} onCopy={handleCopy}>
								<button className={styles.dropdown_copy_option}>
									<svg className={styles.copy_icon} width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M8.4375 1.25H2.8125C2.72962 1.25 2.65013 1.28292 2.59153 1.34153C2.53292 1.40013 2.5 1.47962 2.5 1.5625C2.5 1.64538 2.53292 1.72487 2.59153 1.78347C2.65013 1.84208 2.72962 1.875 2.8125 1.875H8.125V7.1875C8.125 7.27038 8.15792 7.34987 8.21653 7.40847C8.27513 7.46708 8.35462 7.5 8.4375 7.5C8.52038 7.5 8.59987 7.46708 8.65847 7.40847C8.71708 7.34987 8.75 7.27038 8.75 7.1875V1.5625C8.75 1.47962 8.71708 1.40013 8.65847 1.34153C8.59987 1.28292 8.52038 1.25 8.4375 1.25V1.25Z" fill="#011318" />
										<path d="M7.1875 2.5H1.5625C1.38991 2.5 1.25 2.63991 1.25 2.8125V8.4375C1.25 8.61009 1.38991 8.75 1.5625 8.75H7.1875C7.36009 8.75 7.5 8.61009 7.5 8.4375V2.8125C7.5 2.63991 7.36009 2.5 7.1875 2.5Z" fill="#011318" />
									</svg>
									{t('copy_address_button')}
								</button>
							</CopyToClipboard>
							{copied && <span className={styles.copied_text}>{t('copy_address_success')}</span>}

							<button className={styles.dropdown_disconnect_option} onClick={handleWalletAction}>
								<svg className={styles.disconnect_icon} width="9" height="8" viewBox="0 0 9 8" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M6.91016 3.77734C6.96884 3.83659 7.00176 3.91661 7.00176 4C7.00176 4.08339 6.96884 4.16341 6.91016 4.22266L4.09766 7.03516C4.03767 7.09249 3.95798 7.12465 3.875 7.125C3.83353 7.12482 3.79245 7.11687 3.75391 7.10156C3.69703 7.07766 3.6485 7.03745 3.61444 6.98601C3.58038 6.93457 3.56231 6.8742 3.5625 6.8125V4.3125H0.75C0.66712 4.3125 0.587634 4.27958 0.529029 4.22097C0.470424 4.16237 0.4375 4.08288 0.4375 4C0.4375 3.91712 0.470424 3.83763 0.529029 3.77903C0.587634 3.72042 0.66712 3.6875 0.75 3.6875H3.5625V1.1875C3.56231 1.1258 3.58038 1.06543 3.61444 1.01399C3.6485 0.962551 3.69703 0.922344 3.75391 0.898437C3.81163 0.875923 3.87455 0.870212 3.93538 0.881963C3.99621 0.893715 4.05247 0.92245 4.09766 0.964844L6.91016 3.77734ZM7.9375 0.25V7.75" fill="#011318" />
								</svg>
								{t('disconnect_button')}
							</button>
						</div>
					)}
				</div>
			) : (
				<motion.button
					className={`${styles.connect_button} ${customStyle || ''}`}
					onClick={handleWalletAction}
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.95 }}>{t('wallet_connect_button')}
				</motion.button>
			)}
		</div>
	);
};

export default TonWalletConnect;
