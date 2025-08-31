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
    setLoading,
} from "../../store/swapRoutes/slice";
import { formatBalance } from "../../shared/utils/formatBalance";
import { MaxValueExchangeButton } from "../MaxValueExchangeButton/MaxValueExchangeButton";

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
    const [updateInterval, setUpdateInterval] = useState<number | null>(null);

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

    useEffect(() => {
        if (tonAsset && usdtAsset) {
            setSelectedInputAsset(tonAsset);
            setSelectedOutputAsset(usdtAsset);
            setInputAsset(tonAsset.address);
            setOutputAsset(usdtAsset.address);
        }
    }, [assets, tonAsset, usdtAsset, setInputAsset, setOutputAsset]);

    useEffect(() => {
        if (
            debouncedInputValue &&
            debouncedInputValue !== "0" &&
            selectedInputAsset &&
            selectedOutputAsset
        ) {
            // Если есть значение, устанавливаем его и запускаем запрос
            setAmount(debouncedInputValue);

            loadRoute({
                inputAssetAmount: debouncedInputValue,
                inputAssetAddress: selectedInputAsset.address,
                outputAssetAddress: selectedOutputAsset.address,
            });
        } else if (debouncedInputValue === "" || debouncedInputValue === "0") {
            // Если значение пустое или 0, очищаем данные с задержкой debounce
            console.log("Debounced input is empty, clearing data");
            setAmount("");
            resetOutputAmount();
            // Очищаем route данные когда поле пустое
            dispatch(resetRouteData());
        }
    }, [
        debouncedInputValue,
        selectedInputAsset,
        selectedOutputAsset,
        dispatch,
        loadRoute,
        resetOutputAmount,
        setAmount,
    ]);

    useEffect(() => {
        // Запускаем интервал только когда есть route (т.е. уже был первый успешный запрос)
        // и все необходимые данные
        if (
            route &&
            debouncedInputValue &&
            selectedInputAsset?.address &&
            selectedOutputAsset?.address
        ) {
            if (updateInterval) {
                clearInterval(updateInterval);
            }

            const startNextRequest = () => {
                // Проверяем, что запрос не в процессе выполнения
                if (!swapLoading) {
                    console.log("Starting interval request:", {
                        inputAssetAmount: debouncedInputValue,
                        inputAssetAddress: selectedInputAsset.address,
                        outputAssetAddress: selectedOutputAsset.address,
                        swapLoading,
                    });
                    loadRoute({
                        inputAssetAmount: debouncedInputValue,
                        inputAssetAddress: selectedInputAsset.address,
                        outputAssetAddress: selectedOutputAsset.address,
                    });
                } else {
                    console.log("Skipping request - already loading:", {
                        swapLoading,
                    });
                }
            };

            // НЕ делаем первый запрос сразу - он уже был сделан в useEffect для debouncedInputValue
            // startNextRequest();

            // Запросы через 20 секунд после завершения предыдущего
            const interval = setInterval(() => {
                console.log(
                    "Interval triggered, checking if can send next request..."
                );
                // Если запрос завис (loading слишком долго), принудительно сбрасываем
                if (swapLoading) {
                    console.warn("Request seems stuck, forcing reset...");
                    // Принудительно сбрасываем loading состояние
                    dispatch(setLoading(false));
                }
                startNextRequest();
            }, 10000);

            setUpdateInterval(interval);
            dispatch(setIntervalActive(true));

            return () => {
                if (interval) {
                    clearInterval(interval);
                }
                dispatch(setIntervalActive(false));
            };
        }
    }, [
        route,
        debouncedInputValue,
        selectedInputAsset,
        selectedOutputAsset,
        swapLoading,
        dispatch,
        loadRoute,
        updateInterval,
    ]);

    useEffect(() => {
        return () => {
            if (updateInterval) {
                clearInterval(updateInterval);
            }
        };
    }, [updateInterval]);

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
            loadRoute({
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
        loadRoute,
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

        if (!value && updateInterval) {
            clearInterval(updateInterval);
            setUpdateInterval(null);
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
