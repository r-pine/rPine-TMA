import { useSelector } from 'react-redux';
import { selectSwapSettingsForApi } from '../store/settings/selectors';

export const useSwapSettingsParams = () => {
	const settings = useSelector(selectSwapSettingsForApi);

	return settings;
};

export const appendSwapSettingsToParams = (
	params: Record<string, string>,
	settings: { maxDepth: string, maxSplits: string, maxSlippage: string }
) => {
	return {
		...params,
		maxDepth: settings.maxDepth,
		maxSplits: settings.maxSplits,
		maxSlippage: settings.maxSlippage
	};
}; 