import { useGameStore } from "@/hooks/useGameStore";
import { useSocketStore } from "@/hooks/useSocketStore";
import { useStore } from "@/hooks/useStore";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function GameStatus() {

    const searchParams = useSearchParams()
    const searchParamsObject = Object.fromEntries(searchParams.entries());
    const { server, server_type } = searchParamsObject

    const gameState = useGameStore((state) => state.gameState);

    const [mounted, setMounted] = useState(false)
    useEffect(() => {
        setMounted(true)
    }, [])

    const {
        socket,
    } = useSocketStore(state => ({
        socket: state.socket,
    }));

    return (
        <>

            <div className="panel-content-group text-center mb-3">

                <h5 className="mb-0">Room: {server}</h5>
                <span
                    style={{
                        ...(true && { color: "rgb(255 0 0)" }),
                        // ...(false && {color: "rgb(0 0 0)"}),
                        fontWeight: 'bold'
                    }}
                >
                    {gameState.status} - {gameState.timer} seconds
                </span>

            </div>

            {/* <div className="panel-content-group text-center mb-3 p-3">
                {mounted &&
                    <QRCodeCanvas
                        value={
                            `${window.location.host}/play?server_id=${server_id}`
                        }
                        className=''
                        size={150}
                    />
                }
            </div> */}

            <button
                className='btn btn-four-frogs-primary w-100 mb-1'
                disabled={gameState.status !== 'In Lobby'}
                onClick={() => {
                    socket.emit(`game:${process.env.NEXT_PUBLIC_GAME_KEY}-start`, {
                        server: server,
                        settings: {}
                    });
                }}
            >
                <i className="fad fa-play"></i>
                <span>Start Game</span>
            </button>

        </>
    )

}