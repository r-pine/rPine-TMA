/**
 * Утилита для исправления маршрутизации в Telegram Mini App
 * Обрабатывает URL с параметрами Telegram WebApp и перенаправляет на корректные маршруты
 */

export function fixTelegramRoutes() {
    // Проверяем, запущено ли приложение в Telegram WebApp
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
        const currentUrl = window.location.href;

        // Если URL содержит параметры Telegram WebApp
        if (
            currentUrl.includes("tgWebAppData") ||
            currentUrl.includes("query_id")
        ) {
            const baseUrl = window.location.origin;
            const newUrl = `${baseUrl}/#/`;

            // Очищаем URL и перенаправляем на главную страницу
            window.history.replaceState({}, "", newUrl);

            console.log(
                "Telegram WebApp параметры обработаны, перенаправление на главную страницу"
            );
            return true;
        }
    }

    return false;
}

/**
 * Извлекает и декодирует данные пользователя Telegram из initData
 */
export function getTelegramUserData() {
    if (typeof window !== "undefined" && window.Telegram?.WebApp?.initData) {
        try {
            const initData = window.Telegram.WebApp.initData;
            const params = new URLSearchParams(initData);
            const userJson = params.get("user");

            if (userJson) {
                return JSON.parse(decodeURIComponent(userJson));
            }
        } catch (error) {
            console.warn(
                "Ошибка при парсинге данных пользователя Telegram:",
                error
            );
        }
    }

    return null;
}

/**
 * Проверяет, запущено ли приложение в Telegram WebApp
 */
export function isTelegramWebApp(): boolean {
    return (
        typeof window !== "undefined" &&
        !!window.Telegram?.WebApp &&
        !!window.Telegram.WebApp.initData
    );
}

// Автоматическое исправление маршрутов при загрузке
if (typeof window !== "undefined") {
    // Запускаем исправление после загрузки DOM
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", fixTelegramRoutes);
    } else {
        fixTelegramRoutes();
    }
}
