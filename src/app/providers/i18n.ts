import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationsEn from '../../shared/locales/en/translation.json';
import translationsRu from '../../shared/locales/ru/translation.json';

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
		lng: getUserLanguage(),
		fallbackLng: 'en',
		interpolation: {
			escapeValue: false,
		},
	});

export default i18n;