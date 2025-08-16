import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../store';
import { fetchRoute, resetSwap } from './thunks';
import {
	selectInputAssetAmount,
	selectInputAssetAddress,
	selectOutputAssetAddress,
	selectExchangeRate,
	selectOutputAssetAmount,
	selectInputAssetUsdAmount,
	selectOutputAssetUsdAmount,
	selectRoute,
	selectSwapRoutesLoading,
	selectSwapRoutesError,
	selectIsSwapReady,
} from './selectors';
import {
	setInputAssetAmount,
	setInputAssetAddress,
	setOutputAssetAddress,
	setLoading,
	resetOutputAmount as resetOutput,
	setError,
} from './slice';
import { useRef } from 'react';
import { FetchRouteParams } from './types';

export const useSwapRoutes = () => {
	const dispatch = useDispatch<AppDispatch>();
	const abortControllerRef = useRef<AbortController | null>(null);

	const inputAssetAmount = useSelector(selectInputAssetAmount);
	const inputAssetAddress = useSelector(selectInputAssetAddress);
	const outputAssetAddress = useSelector(selectOutputAssetAddress);
	const exchangeRate = useSelector(selectExchangeRate);
	const outputAssetAmount = useSelector(selectOutputAssetAmount);
	const inputAssetUsdAmount = useSelector(selectInputAssetUsdAmount);
	const outputAssetUsdAmount = useSelector(selectOutputAssetUsdAmount);
	const route = useSelector(selectRoute);
	const loading = useSelector(selectSwapRoutesLoading);
	const error = useSelector(selectSwapRoutesError);
	const isSwapReady = useSelector(selectIsSwapReady);

	const setAmount = (amount: string) => {
		dispatch(setInputAssetAmount(amount));
	};

	const setInputAsset = (address: string | null) => {
		if (abortControllerRef.current) {
			abortControllerRef.current.abort();
			abortControllerRef.current = null;
			dispatch(setLoading(false));
			// НЕ очищаем output данные при отмене запроса - они должны сохраняться до получения новых
			// dispatch(resetOutput());
		}
		dispatch(setInputAssetAddress(address));
	};

	const setOutputAsset = (address: string | null) => {
		if (abortControllerRef.current) {
			abortControllerRef.current.abort();
			abortControllerRef.current = null;
			dispatch(setLoading(false));
			// НЕ очищаем output данные при отмене запроса - они должны сохраняться до получения новых
			// dispatch(resetOutput());
		}
		dispatch(setOutputAssetAddress(address));
	};

	const resetOutputAmount = () => {
		dispatch(resetOutput());
	};

	const cancelActiveRequest = () => {
		if (abortControllerRef.current) {
			abortControllerRef.current.abort();
			abortControllerRef.current = null;
			dispatch(setLoading(false));
			resetOutputAmount();
		}
	};

	const cancelActiveRequestOnly = () => {
		if (abortControllerRef.current) {
			abortControllerRef.current.abort();
			abortControllerRef.current = null;
			dispatch(setLoading(false));
			// НЕ очищаем данные - только отменяем запрос
		}
	};

	const loadRoute = (params: Omit<FetchRouteParams, 'signal'>) => {
		if (!params.inputAssetAmount || params.inputAssetAmount === '0') {
			dispatch(setLoading(false));
			dispatch(resetOutput());
			return;
		}

		console.log('loadRoute called with params:', params);

		if (abortControllerRef.current) {
			console.log('Aborting previous request...');
			abortControllerRef.current.abort();
			abortControllerRef.current = null;
			dispatch(setLoading(false));

		}

		abortControllerRef.current = new AbortController();
		const signal = abortControllerRef.current.signal;

		console.log('Starting new request...');
		dispatch(setLoading(true));

		dispatch(fetchRoute({ ...params, signal }))
			.then((result) => {
				console.log('fetchRoute result:', result);
				// Не останавливаем загрузку при ошибках, позволяем интервалу продолжать работу
				if (result) {
					// Если есть результат, сбрасываем ошибку
					dispatch(setError(null));
				}
				// При ошибке (result === null) не делаем ничего - ошибка уже установлена в thunk
				// и интервал продолжит работать
			})
			.catch((error) => {
				console.log('fetchRoute error:', error);
				if (error.name === 'AbortError') {
					dispatch(setLoading(false));
					// НЕ очищаем output данные при AbortError - они должны сохраняться
					// dispatch(resetOutput());
				} else {
					// При других ошибках логируем, но не останавливаем работу
					console.warn('Error in loadRoute:', error);
					// Не вызываем dispatch(setLoading(false)) - пусть loading остается true
					// чтобы интервал не отправлял новые запросы до завершения текущего
				}
			})
			.finally(() => {
				console.log('fetchRoute finally - clearing abort controller');
				abortControllerRef.current = null;
			});
	};

	const reset = () => dispatch(resetSwap());

	return {
		inputAssetAmount,
		inputAssetAddress,
		outputAssetAddress,
		exchangeRate,
		outputAssetAmount,
		inputAssetUsdAmount,
		outputAssetUsdAmount,
		route,
		loading,
		error,
		isSwapReady,
		setAmount,
		setInputAsset,
		setOutputAsset,
		loadRoute,
		resetOutputAmount,
		cancelActiveRequest,
		cancelActiveRequestOnly,
		reset,
	};
};
