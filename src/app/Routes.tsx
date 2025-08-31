import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import * as motion from "motion/react-client";
import { AnimatePresence } from "motion/react";
import { useEffect } from "react";
import Home from "../pages/home/Home";
import NFTPage from "../pages/nft/NFTPage";
import { ModalOutlet } from "../components/modals/ModalOutlet";
import { AirswapPage } from "../pages/airswap/AirswapPage";
import { AirdropPage } from "../pages/airdrop/AirdropPage";

export const AppRoutes = () => {
    const location = useLocation();

    // Обработка Telegram WebApp параметров при запуске
    useEffect(() => {
        // Если URL содержит параметры Telegram WebApp, очищаем URL
        if (
            location.pathname.includes("tgWebAppData") ||
            location.search.includes("tgWebAppData")
        ) {
            // Параметры уже обрабатываются в getTelegramData()
            window.history.replaceState(
                {},
                "",
                window.location.origin + window.location.pathname.split("?")[0]
            );
        }
    }, [location]);

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
            >
                <Routes location={location}>
                    <Route path="/" element={<Home />} />
                    <Route path="/nft" element={<NFTPage />} />
                    <Route element={<ModalOutlet />}>
                        <Route path="/airswap" element={<AirswapPage />} />
                        <Route path="/airdrop" element={<AirdropPage />} />
                    </Route>
                    {/* Catch-all route для обработки неизвестных путей, включая Telegram WebApp параметры */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </motion.div>
        </AnimatePresence>
    );
};
