import 'react-i18next';
import { resources } from './i18n'; // Импорт объекта с переводами

declare module 'react-i18next' {
	interface DefaultResources extends resources { }
}