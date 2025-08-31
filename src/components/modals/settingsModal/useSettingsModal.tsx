import { useState } from "react";
import SettingsModal from "./SettingsModal";

export const useSettingsModal = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openSettingsModal = () => setIsModalOpen(true);
    const closeSettingsModal = () => setIsModalOpen(false);

    const SettingsModalComponent = (
        <SettingsModal isOpen={isModalOpen} onClose={closeSettingsModal} />
    );

    return {
        openSettingsModal,
        closeSettingsModal,
        SettingsModalComponent,
    };
};
