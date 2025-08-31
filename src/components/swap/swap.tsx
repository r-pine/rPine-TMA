import React, { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { Asset } from "../../store/assets/types";
import { TokenSelectorButton } from "../TokenSelectorButton/TokenSelectorButton";
import { TokenSelectModal } from "../modals/tokenSelectModal.tsx/TokenSelectModal";
import { useSwapRoutes } from "../../store/swapRoutes/hooks";
import { useAssets } from "../../store/assets/hooks";
import { useDebounce } from "../../shared/hooks/useDebounce";
import { selectBalances, selectTonBalance } from "../../store/wallet/selectors";
import { selectUserAssets } from "../../store/assets/selectors";
import { normalizeAssetName } from "../../entities/assets/model/utils";
import styles from "./swap.module.css";
import { SwapRouteInfo } from "../routes/SwapRouteInfo";
import { SwapTokenButton } from "./SwapTokenButton/SwapTokenButton";
import { useWallet } from "../../store/wallet/hooks";
import { selectForceRefresh } from "../../store/swapRoutes/selectors";
import {
    setIntervalActive,
    resetRouteData,
} from "../../store/swapRoutes/slice";
import { formatBalance } from "../../shared/utils/formatBalance";
import { MaxValueExchangeButton } from "../MaxValueExchangeButton/MaxValueExchangeButton";

// Глобальная переменная для отслеживания активного интервала (для отладки)
let globalSwapInterval: number | null = null;

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
        cancelActiveRequestOnly,
        route,
    } = useSwapRoutes();
    const forceRefresh = useSelector(selectForceRefresh);
    const prevForceRefreshRef = useRef(forceRefresh);
    const dispatch = useDispatch();

    const [selectedInputAsset, setSelectedInputAsset] = useState<Asset | null>(
        null
    );
    const [selectedOutputAsset, setSelectedOutputAsset] =
        useState<Asset | null>(null);
    const [isInputModalOpen, setIsInputModalOpen] = useState(false);
    const [isOutputModalOpen, setIsOutputModalOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [hasInput, setHasInput] = useState(false);
    const debouncedInputValue = useDebounce(inputValue, 300);
    const updateIntervalRef = useRef<number | null>(null);

    // Состояния для плавных переходов
    const [isOutputVisible, setIsOutputVisible] = useState(false);
    const [isOutputUpdating, setIsOutputUpdating] = useState(false);
    const [prevOutputAmount, setPrevOutputAmount] = useState<string>("");

    const { t } = useTranslation();

    const tonAsset = assets.find((asset) => asset.symbol === "TON");
    const usdtAsset = assets.find((asset) => asset.symbol === "USDT");

    // Эффект для плавных переходов output amount
    useEffect(() => {
        if (outputAssetAmount && outputAssetAmount !== "") {
            if (isOutputVisible && prevOutputAmount !== outputAssetAmount) {
                // Если данные уже были видны и изменились, показываем состояние обновления
                setIsOutputUpdating(true);
                setPrevOutputAmount(outputAssetAmount);
                const timer = setTimeout(() => {
                    setIsOutputUpdating(false);
                }, 150);
                return () => clearTimeout(timer);
            } else if (!isOutputVisible) {
                // Первое появление данных
                setIsOutputVisible(true);
                setPrevOutputAmount(outputAssetAmount);
            }
        } else {
            setIsOutputVisible(false);
            setIsOutputUpdating(false);
        }
    }, [outputAssetAmount, isOutputVisible, prevOutputAmount]);

    const getAssetBalance = useCallback(
        (asset: Asset | null) => {
            if (!asset) return "0";
            if (
                asset.type === "native" &&
                normalizeAssetName(asset.name) === "toncoin"
            ) {
                return tonBalance?.toString() || "0";
            }

            const userAsset = userAssets.find(
                (ua) =>
                    normalizeAssetName(ua.name) ===
                    normalizeAssetName(asset.name)
            );

            return userAsset?.balance || "0";
        },
        [tonBalance, userAssets]
    );

    useEffect(() => {
        loadAssets();
    }, [loadAssets]);

    // Создаем стабильные ссылки для setInputAsset и setOutputAsset
    const setInputAssetRef = useRef(setInputAsset);
    const setOutputAssetRef = useRef(setOutputAsset);
    setInputAssetRef.current = setInputAsset;
    setOutputAssetRef.current = setOutputAsset;

    useEffect(() => {
        if (tonAsset && usdtAsset) {
            setSelectedInputAsset(tonAsset);
            setSelectedOutputAsset(usdtAsset);
            setInputAssetRef.current(tonAsset.address);
            setOutputAssetRef.current(usdtAsset.address);
        }
    }, [assets, tonAsset, usdtAsset]); // Убираем функции из зависимостей

    // Создаем стабильные ссылки на функции чтобы избежать циклов в useEffect
    const loadRouteRef = useRef(loadRoute);
    const setAmountRef = useRef(setAmount);
    const resetOutputAmountRef = useRef(resetOutputAmount);

    // Обновляем refs при изменении функций
    loadRouteRef.current = loadRoute;
    setAmountRef.current = setAmount;
    resetOutputAmountRef.current = resetOutputAmount;

    useEffect(() => {
        // Очищаем интервал при изменении debouncedInputValue
        if (updateIntervalRef.current) {
            clearInterval(updateIntervalRef.current);
            updateIntervalRef.current = null;
            dispatch(setIntervalActive(false));
        }

        if (
            debouncedInputValue &&
            debouncedInputValue !== "0" &&
            selectedInputAsset &&
            selectedOutputAsset
        ) {
            // Если есть значение, устанавливаем его и запускаем запрос
            console.log(
                "✅ Debounced input changed, making initial request:",
                debouncedInputValue
            );
            setAmountRef.current(debouncedInputValue);

            loadRouteRef.current({
                inputAssetAmount: debouncedInputValue,
                inputAssetAddress: selectedInputAsset.address,
                outputAssetAddress: selectedOutputAsset.address,
            });
        } else if (debouncedInputValue === "" || debouncedInputValue === "0") {
            // Если значение пустое или 0, очищаем данные с задержкой debounce
            console.log("🧹 Debounced input is empty, clearing data");
            setAmountRef.current("");
            resetOutputAmountRef.current();
            // Очищаем route данные когда поле пустое
            dispatch(resetRouteData());
        }
    }, [
        debouncedInputValue,
        selectedInputAsset,
        selectedOutputAsset,
        dispatch,
        // НЕ включаем функции в зависимости, используем refs
    ]);

    const swapLoadingRef = useRef(swapLoading);
    swapLoadingRef.current = swapLoading;

    const startIntervalRequest = useCallback(() => {
        // Проверяем, что запрос не в процессе выполнения и значение еще валидно
        if (
            !swapLoadingRef.current &&
            debouncedInputValue &&
            debouncedInputValue !== "0" &&
            selectedInputAsset &&
            selectedOutputAsset
        ) {
            console.log("Starting interval request:", {
                inputAssetAmount: debouncedInputValue,
                inputAssetAddress: selectedInputAsset.address,
                outputAssetAddress: selectedOutputAsset.address,
            });
            loadRoute({
                inputAssetAmount: debouncedInputValue,
                inputAssetAddress: selectedInputAsset.address,
                outputAssetAddress: selectedOutputAsset.address,
            });
        } else {
            console.log("Skipping interval request - conditions not met", {
                swapLoading: swapLoadingRef.current,
                debouncedInputValue,
                hasInputAsset: !!selectedInputAsset,
                hasOutputAsset: !!selectedOutputAsset,
            });
        }
    }, [
        debouncedInputValue,
        selectedInputAsset,
        selectedOutputAsset,
        loadRoute,
    ]);

    useEffect(() => {
        // Очищаем предыдущий интервал
        if (updateIntervalRef.current) {
            clearInterval(updateIntervalRef.current);
            updateIntervalRef.current = null;
            dispatch(setIntervalActive(false));
        }

        // Очищаем глобальный интервал если он есть
        if (globalSwapInterval) {
            console.log("Clearing previous global interval");
            clearInterval(globalSwapInterval);
            globalSwapInterval = null;
        }

        // Запускаем интервал только когда есть route (т.е. уже был первый успешный запрос)
        // и все необходимые данные, и НЕТ активной загрузки
        if (
            route &&
            debouncedInputValue &&
            debouncedInputValue !== "0" &&
            selectedInputAsset?.address &&
            selectedOutputAsset?.address &&
            !swapLoading // Важно: интервал запускается только когда нет активной загрузки
        ) {
            console.log("Setting up interval for route updates");

            // Устанавливаем интервал на 20 секунд
            const interval = setInterval(() => {
                console.log("🔄 Interval triggered, checking conditions...");
                startIntervalRequest();
            }, 20000);

            updateIntervalRef.current = interval;
            globalSwapInterval = interval;
            dispatch(setIntervalActive(true));

            return () => {
                if (updateIntervalRef.current) {
                    clearInterval(updateIntervalRef.current);
                    updateIntervalRef.current = null;
                }
                if (globalSwapInterval) {
                    clearInterval(globalSwapInterval);
                    globalSwapInterval = null;
                }
                dispatch(setIntervalActive(false));
            };
        } else {
            console.log("❌ Not setting interval:", {
                hasRoute: !!route,
                debouncedInputValue,
                hasInputAsset: !!selectedInputAsset?.address,
                hasOutputAsset: !!selectedOutputAsset?.address,
                swapLoading,
            });
        }
    }, [
        route,
        debouncedInputValue,
        selectedInputAsset?.address,
        selectedOutputAsset?.address,
        swapLoading, // Добавляем обратно swapLoading в зависимости для правильной синхронизации
        dispatch,
        startIntervalRequest,
    ]);

    useEffect(() => {
        return () => {
            if (updateIntervalRef.current) {
                clearInterval(updateIntervalRef.current);
                updateIntervalRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (address) {
            // Обработка адреса
        }
    }, [address, balances]);

    useEffect(() => {
        if (
            forceRefresh &&
            !prevForceRefreshRef.current &&
            inputValue &&
            selectedInputAsset &&
            selectedOutputAsset
        ) {
            loadRouteRef.current({
                inputAssetAmount: inputValue,
                inputAssetAddress: selectedInputAsset.address,
                outputAssetAddress: selectedOutputAsset.address,
            });
        }
        prevForceRefreshRef.current = forceRefresh;
    }, [
        forceRefresh,
        inputValue,
        selectedInputAsset,
        selectedOutputAsset,
        // НЕ включаем loadRoute в зависимости
    ]);

    const handleInputAmountChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        let value = e.target.value;

        value = value.replace(/[^\d.,]/g, "");

        value = value.replace(",", ".");

        const parts = value.split(".");
        if (parts.length > 2) {
            value = parts[0] + "." + parts.slice(1).join("");
        }

        if (parts.length === 2 && parts[1].length > 2) {
            value = parts[0] + "." + parts[1].slice(0, 2);
        }

        if (value.startsWith(".")) {
            value = "0" + value;
        }

        if (
            value.startsWith("0") &&
            value.length > 1 &&
            !value.startsWith("0.")
        ) {
            value = value.substring(1);
        }

        // Отменяем только активный запрос, но не очищаем данные
        cancelActiveRequestOnly();
        setInputValue(value);
        setHasInput(!!value);

        if (!value && updateIntervalRef.current) {
            clearInterval(updateIntervalRef.current);
            updateIntervalRef.current = null;
            dispatch(setIntervalActive(false));
        }
    };

    const switchButtonRef = useRef<HTMLButtonElement>(null);

    const handleSwitchTokens = () => {
        if (!selectedInputAsset || !selectedOutputAsset) return;

        // Меняем местами активы
        const tempAsset = selectedInputAsset;
        setSelectedInputAsset(selectedOutputAsset);
        setSelectedOutputAsset(tempAsset);
        setInputAsset(selectedOutputAsset.address);
        setOutputAsset(selectedInputAsset.address);
        resetOutputAmount();

        // Программно сбрасываем фокус и активное состояние кнопки
        if (switchButtonRef.current) {
            // Сначала убираем фокус с кнопки
            switchButtonRef.current.blur();

            // Затем принудительно сбрасываем все стили, которые могли остаться
            // Для этого временно делаем кнопку недоступной и сразу возвращаем обратно
            switchButtonRef.current.disabled = true;
            setTimeout(() => {
                if (switchButtonRef.current) {
                    switchButtonRef.current.disabled = false;
                }
            }, 10);
        }
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
        // Если есть данные в outputAssetAmount, показываем их даже во время загрузки
        if (outputAssetAmount && outputAssetAmount !== "") {
            const num = parseFloat(outputAssetAmount);
            return num.toFixed(2);
        }
        // Если данных нет, показываем 0.00
        return "0.00";
    };

    const isBalanceExceeded = () => {
        if (!selectedInputAsset || !inputValue) return false;
        const balance = getAssetBalance(selectedInputAsset);
        const inputNum = parseFloat(inputValue);
        const balanceNum = parseFloat(balance);
        return inputNum > balanceNum;
    };

    const handleSwap = () => {
        console.log("Swap transaction initiated");
    };

    const handleMaxClick = () => {
        if (selectedInputAsset) {
            const rawBalance = getAssetBalance(selectedInputAsset);
            let formattedBalance;
            if (
                selectedInputAsset.type === "native" &&
                normalizeAssetName(selectedInputAsset.name) === "toncoin"
            ) {
                formattedBalance = rawBalance;
            } else {
                formattedBalance = formatBalance(
                    rawBalance,
                    selectedInputAsset.decimals
                );
            }

            setInputValue(formattedBalance);
            setHasInput(!!formattedBalance);
        }
    };

    return (
        <div className={styles.swapContainer}>
            <div className={styles.swapBlock}>
                <div className={styles.inputSection}>
                    <div className={styles.amountText}>
                        {t("amount_asset")} {selectedInputAsset?.symbol || ""}
                    </div>

                    <div className={styles.inputContainer}>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={handleInputAmountChange}
                            placeholder="0.00"
                            className={`${styles.amountInput} ${
                                isBalanceExceeded()
                                    ? styles.balanceExceeded
                                    : ""
                            }`}
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
                        <div
                            className={`${styles.usdAmount} ${
                                isOutputVisible ? styles.visible : ""
                            } ${isOutputUpdating ? styles.updating : ""}`}
                        >
                            $
                            {swapLoading
                                ? "0.00"
                                : inputAssetUsdAmount?.toFixed(2) || "0.00"}
                        </div>

                        {selectedInputAsset && (
                            <div className={styles.balanceInfo}>
                                {selectedInputAsset.type === "native" &&
                                normalizeAssetName(selectedInputAsset.name) ===
                                    "toncoin"
                                    ? getAssetBalance(selectedInputAsset)
                                    : formatBalance(
                                          getAssetBalance(selectedInputAsset),
                                          selectedInputAsset.decimals
                                      )}{" "}
                                {selectedInputAsset.symbol}
                                <MaxValueExchangeButton
                                    onMaxClick={handleMaxClick}
                                />
                            </div>
                        )}
                    </div>
                </div>

                <button
                    ref={switchButtonRef}
                    className={styles.switchButton}
                    onClick={handleSwitchTokens}
                    disabled={!selectedInputAsset || !selectedOutputAsset}
                >
                    <img
                        src="/assets/icons/arrow_icon.svg"
                        alt="switch"
                        className={styles.switchIcon}
                    />
                </button>

                <div className={styles.outputSection}>
                    <div className={styles.amountText}>
                        {t("amount_asset")} {selectedOutputAsset?.symbol || ""}
                    </div>
                    <div className={styles.outputContainer}>
                        <input
                            type="text"
                            value={displayOutputAmount()}
                            readOnly
                            className={`${styles.amountInput} ${
                                swapLoading ? styles.loading : ""
                            } ${isOutputVisible ? styles.visible : ""} ${
                                isOutputUpdating ? styles.updating : ""
                            }`}
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
                        <div
                            className={`${styles.usdAmount} ${
                                isOutputVisible ? styles.visible : ""
                            } ${isOutputUpdating ? styles.updating : ""}`}
                        >
                            $
                            {swapLoading
                                ? "0.00"
                                : outputAssetUsdAmount?.toFixed(2) || "0.00"}
                        </div>
                        {selectedOutputAsset && (
                            <div className={styles.balanceInfo}>
                                {selectedOutputAsset.type === "native" &&
                                normalizeAssetName(selectedOutputAsset.name) ===
                                    "toncoin"
                                    ? getAssetBalance(selectedOutputAsset)
                                    : formatBalance(
                                          getAssetBalance(selectedOutputAsset),
                                          selectedOutputAsset.decimals
                                      )}{" "}
                                {selectedOutputAsset.symbol}
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.swapButtonContainer}>
                    <SwapTokenButton onSwap={handleSwap} />
                </div>
            </div>

            <div className={styles.routeInfoContainer}>
                <SwapRouteInfo hasInput={hasInput} />
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
