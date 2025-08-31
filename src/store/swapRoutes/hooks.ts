import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../store";
import { fetchRoute, resetSwap } from "./thunks";
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
} from "./selectors";
import {
    setInputAssetAmount,
    setInputAssetAddress,
    setOutputAssetAddress,
    setLoading,
    resetOutputAmount as resetOutput,
    setError,
} from "./slice";
import { useRef } from "react";
import { FetchRouteParams } from "./types";

export const useSwapRoutes = () => {
    const dispatch = useDispatch<AppDispatch>();
    const abortControllerRef = useRef<AbortController | null>(null);
    const lastRequestRef = useRef<string | null>(null);

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

    const loadRoute = (params: Omit<FetchRouteParams, "signal">) => {
        if (!params.inputAssetAmount || params.inputAssetAmount === "0") {
            dispatch(setLoading(false));
            dispatch(resetOutput());
            lastRequestRef.current = null;
            return;
        }

        // Создаем уникальный ключ для запроса
        const requestKey = `${params.inputAssetAmount}_${params.inputAssetAddress}_${params.outputAssetAddress}`;

        // Проверяем дедупликацию - если такой же запрос уже выполняется, игнорируем
        if (loading && lastRequestRef.current === requestKey) {
            console.log("Skipping duplicate request:", requestKey);
            return;
        }

        console.log("loadRoute called with params:", params);
        lastRequestRef.current = requestKey;

        if (abortControllerRef.current) {
            console.log("Aborting previous request...");
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }

        abortControllerRef.current = new AbortController();
        const signal = abortControllerRef.current.signal;

        console.log("Starting new request...");
        dispatch(setLoading(true));

        dispatch(fetchRoute({ ...params, signal }))
            .then((result) => {
                console.log("fetchRoute result:", result);
                // Очищаем ключ запроса при завершении
                if (lastRequestRef.current === requestKey) {
                    lastRequestRef.current = null;
                }

                if (result) {
                    // Если есть результат, сбрасываем ошибку
                    dispatch(setError(null));
                }
            })
            .catch((error) => {
                console.log("fetchRoute error:", error);
                // Очищаем ключ запроса при ошибке
                if (lastRequestRef.current === requestKey) {
                    lastRequestRef.current = null;
                }

                if (error.name === "AbortError") {
                    // НЕ очищаем output данные при AbortError - они должны сохраняться
                } else {
                    // При других ошибках логируем
                    console.warn("Error in loadRoute:", error);
                }
            })
            .finally(() => {
                console.log("fetchRoute finally - clearing abort controller");
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
