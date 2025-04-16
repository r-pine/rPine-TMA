import i18n from '../../app/providers/i18n';

const TestTranslationButton = () => {
	const handleTranslate = () => {
		const currentLang = i18n.language;
		const newLang = currentLang === 'en' ? 'ru' : 'en';
		i18n.changeLanguage(newLang);
		console.log(`Language switched to: ${newLang}`);
	};

	return (
		<button onClick={handleTranslate}>
			Translate
		</button>
	);
};

export default TestTranslationButton;