import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationsEn from './locales/en/translation.json';
import translationsRu from './locales/ru/translation.json';

const getUserLanguage = (): string => {
	const telegramLang = window.Telegram?.WebApp?.initDataUnsafe?.user?.language_code;
	if (telegramLang === 'ru') {
		return 'ru';
	}
	return 'en';
};

i18n
	.use(initReactI18next)
	.init({
		resources: {
			en: {
				translation: translationsEn,
			},
			ru: {
				translation: translationsRu,
			},
		},
		lng: getUserLanguage(), // Устанавливаем язык на основе функции
		fallbackLng: 'en', // Запасной язык
		interpolation: {
			escapeValue: false, // React сам экранирует строки
		},
	});

export default i18n;