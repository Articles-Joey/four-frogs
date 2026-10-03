"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import { useSocketStore } from "@/hooks/useSocketStore";
import { useStore } from "@/hooks/useStore";
import PageTemplateLandingPage from "@articles-media/articles-dev-box/PageTemplateLandingPage";
import ArticlesButton from "@/components/UI/Button";
import PrivateGameModal from "@/components/UI/PrivateGameModal";
import IsDev from "@/components/UI/IsDev";

const LandingBackgroundAnimation = dynamic(
    () => import("@/components/Game/LandingBackgroundAnimation"),
    { ssr: false },
);
const RotatingMascot = dynamic(
    () => import("@/components/UI/RotatingMascot"),
    { ssr: false },
);

export default function FourFrogsLobbyPage() {
    const darkMode = useStore((state) => state.darkMode);
    const showPrivateGameModal = useStore((state) => state.showPrivateGameModal);
    const setShowPrivateGameModal = useStore((state) => state.setShowPrivateGameModal);

    return (
        <Box
            sx={{
                position: "relative",
                isolation: "isolate",
                "& .landing-page": {
                    flexGrow: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "100vh",
                },
                "& .servers": { display: "grid", gap: "5px", gridTemplateColumns: "repeat(2, minmax(0, 1fr))" },
                "& .server": {
                    p: "0.5rem",
                    border: "1px solid rgba(0,0,0,0.25)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                },
                "& .ad-wrap": {
                    mt: "1rem",
                    "@media (min-width: 992px)": {
                        mt: 0,
                        display: "block",
                        position: "absolute",
                        right: "1rem",
                        top: "50%",
                        transform: "translateY(-50%)",
                    },
                },
                "& .background-wrap": {
                    position: "fixed",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    zIndex: -1,
                    "& img": { filter: "blur(2px)" },
                },
            }}
        >
            {showPrivateGameModal && (
                <PrivateGameModal show={showPrivateGameModal} setShow={setShowPrivateGameModal} />
            )}
            <PageTemplateLandingPage
                useSocketStore={useSocketStore}
                useStore={useStore}
                RotatingMascot={RotatingMascot}
                Link={Link}
                useRouter={useRouter}
                logoImage="img/thumbnail.webp"
                LandingBackgroundAnimation={<LandingBackgroundAnimation />}
                heroOverride={
                    <Box
                        component="img"
                        src={darkMode ? "img/hero-dark.webp" : "img/hero.webp"}
                        alt="Four Frogs"
                        sx={{ width: "100%" }}
                    />
                }
                backgroundImage={darkMode ? "img/dark-background.webp" : "img/background.webp"}
                CardBodyAppendContent={
                    <IsDev>
                        <ArticlesButton sx={{ mt: "1rem", width: "100%" }} onClick={() => setShowPrivateGameModal(true)}>
                            Custom Games
                        </ArticlesButton>
                    </IsDev>
                }
                multiplayerConfig={{
                    type: "WebSocket",
                    defaultServers: 2,
                    privateServerSupport: false,
                    onlinePlayersTemplate: "2.0",
                }}
            />
        </Box>
    );
}
