"use client";
import Box from "@mui/material/Box";
import { panelContentSx } from "@/components/UI/panelStyles";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ArticlesButton from "@/components/UI/Button";
import { useGameStore } from "@/hooks/useGameStore";
import { useSocketStore } from "@/hooks/useSocketStore";
import { useSearchParams } from "next/navigation";

export default function GameStatus() {

    const searchParams = useSearchParams()
    const searchParamsObject = Object.fromEntries(searchParams.entries());
    const { server, server_type } = searchParamsObject

    const gameState = useGameStore((state) => state.gameState);

    const {
        socket,
    } = useSocketStore(state => ({
        socket: state.socket,
    }));

    return (
        <>

            <Box sx={{ ...panelContentSx, textAlign: "center", mb: "1rem" }}>

                <Box component="h5" sx={{ mt: 0, mb: 0, fontSize: "1.25rem", fontWeight: 500, lineHeight: 1.2 }}>Room: {server}</Box>
                <Box component="span"
                    sx={{
                        ...(true && { color: "rgb(255 0 0)" }),
                        // ...(false && {color: "rgb(0 0 0)"}),
                        fontWeight: 'bold'
                    }}
                >
                    {gameState.status} - {gameState.timer} seconds
                </Box>

            </Box>

            

            <ArticlesButton
                variant="four-frogs-primary"
                sx={{ width: "100%", mb: "0.25rem" }}
                disabled={gameState.status !== 'In Lobby'}
                onClick={() => {
                    socket.emit(`game:${process.env.NEXT_PUBLIC_GAME_KEY}-start`, {
                        server: server,
                        settings: {}
                    });
                }}
            >
                <PlayArrowIcon  sx={{ fontSize: "1em", mr: "0.2rem", verticalAlign: "middle" }} />
                <Box component="span">Start Game</Box>
            </ArticlesButton>

        </>
    )

}
