"use client"
import { useEffect } from "react";

import dynamic from "next/dynamic";

// import { useStore } from "@/hooks/useStore";
// import { usePinballGameStore } from "@/hooks/usePinballGameStore";

import { useStore } from "@/hooks/useStore";

const InfoModal = dynamic(
    () => import('@/components/UI/InfoModal'),
    { ssr: false }
)

const SettingsModal = dynamic(
    () => import('@/components/UI/SettingsModal'),
    { ssr: false }
)

const CreditsModal = dynamic(
    () => import('@/components/UI/CreditsModal'),
    { ssr: false }
)

export default function LayoutClient({ children }) {

    const theme = useStore(state => state.theme);
    // const darkMode = useStore(state => state.darkMode)
    // const setDarkMode = useStore(state => state.setDarkMode)

    const showInfoModal = useStore((state) => state.showInfoModal)
    const setShowInfoModal = useStore((state) => state.setShowInfoModal)

    const showSettingsModal = useStore((state) => state.showSettingsModal)
    const setShowSettingsModal = useStore((state) => state.setShowSettingsModal)

    const showCreditsModal = useStore((state) => state.showCreditsModal)
    const setShowCreditsModal = useStore((state) => state.setShowCreditsModal)

    useEffect(() => {

        if (theme == null) {
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            useStore.getState().setTheme(prefersDark ? "Dark" : "Light");
        }

        if (theme == "Dark") {
            document.body.setAttribute("data-bs-theme", 'dark');
        } else {
            document.body.setAttribute("data-bs-theme", 'light');
        }

    }, [theme]);

    return (
        <>

            {showInfoModal &&
                <InfoModal
                    show={showInfoModal}
                    setShow={setShowInfoModal}
                />
            }

            {showCreditsModal &&
                <CreditsModal
                    show={showCreditsModal}
                    setShow={setShowCreditsModal}
                />
            }

            {showSettingsModal &&
                <SettingsModal
                    show={showSettingsModal}
                    setShow={setShowSettingsModal}
                />
            }

        </>
    );
}
