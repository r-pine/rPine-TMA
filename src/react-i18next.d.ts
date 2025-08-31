import "react-i18next";
import { resources } from "./app/providers/i18n"; // Импорт объекта с переводами

declare module "react-i18next" {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface DefaultResources extends resources {}
}
