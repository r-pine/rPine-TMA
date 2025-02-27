import i18n from '../../app/providers/i18n';

const TestTranslationButton = () => {
	const handleTranslate = () => {
		const currentLang = i18n.language;
		const newLang = currentLang === 'en' ? 'ru' : 'en'; // Переключение между 'en' и 'ru'
		i18n.changeLanguage(newLang); // Меняем язык
		console.log(`Language switched to: ${newLang}`); // Лог для проверки
	};

	return (
		<button onClick={handleTranslate}>
			Translate
		</button>
	);
};

export default TestTranslationButton;