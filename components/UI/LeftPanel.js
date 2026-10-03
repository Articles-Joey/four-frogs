"use client";
import Box from "@mui/material/Box";
import { panelContentSx } from "@/components/UI/panelStyles";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import CloseIcon from "@mui/icons-material/Close";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import ArticlesButton from "@/components/UI/Button";
// import SingleInput from "@/components/Articles/SingleInput";
import Link from "next/link";
// import { useLocalStorageNew } from "@/hooks/useLocalStorageNew";

// import ROUTES from 'components/constants/routes';

import { useEffect, useRef, useState } from "react";
import { useSocketStore } from "@/hooks/useSocketStore";
import { memo } from "react";
import useFullscreen from '@articles-media/articles-dev-box/useFullscreen';
import { useStore } from "@/hooks/useStore";

// import { QRCodeCanvas } from 'qrcode.react';
import { useSearchParams } from "next/navigation";
import GameStatus from "./LeftPanel/GameStatus";

const LeftPanelContent = () => {

    const searchParams = useSearchParams()
    const searchParamsObject = Object.fromEntries(searchParams.entries());
    const { server_id, server_type } = searchParamsObject

    const { isFullscreen, requestFullscreen, exitFullscreen } = useFullscreen();

    const renderMode = useStore((state) => state.renderMode);
    const setRenderMode = useStore((state) => state.setRenderMode);

    const touchControlsEnabled = useStore((state) => state.touchControlsEnabled);
    const setTouchControlsEnabled = useStore((state) => state.setTouchControlsEnabled);

    // const gameState = useStore((state) => state.gameState);

    // const showInfoModal = useStore((state) => state.showInfoModal)
    const setShowInfoModal = useStore((state) => state.setShowInfoModal)
    const setShowSettingsModal = useStore((state) => state.setShowSettingsModal)

    const cameraShakeEnabled = useStore((state) => state.cameraShakeEnabled);
    const setCameraShakeEnabled = useStore((state) => state.setCameraShakeEnabled);

    const cameraLocked = useStore((state) => state.cameraLocked);
    const setCameraLocked = useStore((state) => state.setCameraLocked);

    const showInviteModal = useStore((state) => state.showInviteModal);
    const setShowInviteModal = useStore((state) => state.setShowInviteModal);

    const {
        // room,
        // gameState,
        players,
        // touchControlsEnabled,
        // setTouchControlsEnabled,
        reloadScene,
        controllerState,
        // isFullscreen,
        // requestFullscreen,
        // exitFullscreen,
        setShowMenu,
        // showChat,
        // setShowChat,
        // chatMessages,
        // setChatMessages,
        // chatMessage,
        // setChatMessage,
        // renderMode,
        // setRenderMode,
        // cameraShakeEnabled,
        // setCameraShakeEnabled,
        // setShowSettingsModal,
        // setShowInfoModal,
        // setShowInviteModal
    } = {
        // gameState: {
        //     status: null,
        // }
    };

    const {
        socket,
    } = useSocketStore(state => ({
        socket: state.socket,
    }));

    // const [onlineInteractionsWarning, setOnlineInteractionsWarning] = useLocalStorageNew("game:onlineInteractionsWarning", false)

    const chatMessagesRef = useRef()

    const scrollToBottomOfChatMessages = () => {
        if (chatMessagesRef.current) {
            chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
        }
    };

    const [showChat, setShowChat] = useState(false)
    const [chatMessages, setChatMessages] = useState([])
    const [chatMessage, setChatMessage] = useState('')

    // const [mounted, setMounted] = useState(false)
    // useEffect(() => {
    //     setMounted(true)
    // }, [])

    useEffect(() => {

        socket.on(`four-frogs-player-chat`, function (data) {

            console.log("Four Frogs new chat message", data)

            if (data.data.socket_id !== socket?.id) {

                let message = {
                    ...data.data
                    // message: chatMessage,
                    // date: new Date(),
                    // color: players?.find(player => player.id == socket?.id)?.fourFrogs?.homeZone,
                }

                setChatMessages(prev => ([
                    ...prev,
                    message
                ]))

                setInterval(
                    scrollToBottomOfChatMessages,
                    1000
                );

            }

        });

        return () => {

            socket.off(`four-frogs-player-chat`);

        }

    }, []);

    useEffect(() => {
        console.log("Remount")
    });

    return (
        <Box sx={{ color: "#212529" }}>

            <GameStatus />

            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "5px", mb: "0.5rem" }}>

                <ArticlesButton component={Link} href="/" variant="four-frogs-primary" sx={{ width: "100%" }}>
                    Leave Game
                </ArticlesButton>

                <ArticlesButton
                    small
                    
                    variant='four-frogs-primary'
                    active={isFullscreen}
                    onClick={() => {
                        if (isFullscreen) {
                            exitFullscreen()
                        } else {
                            requestFullscreen('four-frogs-game-page')
                        }
                    }}
                >
                    {isFullscreen && <Box component="span">Exit </Box>}
                    {!isFullscreen && <Box component="span"><FullscreenIcon  sx={{ fontSize: "1em", mr: "0.2rem", verticalAlign: "middle" }} /></Box>}
                    <Box component="span">Fullscreen</Box>
                </ArticlesButton>

                <ArticlesButton
                    variant="four-frogs-primary"
                    onClick={() => {
                        setShowInfoModal({
                            game: 'Four Frogs'
                        })
                    }}
                >
                    <Box>Info</Box>
                </ArticlesButton>

                <ArticlesButton
                    variant="four-frogs-primary"
                    onClick={() => {
                        setShowSettingsModal(true)
                    }}
                >
                    <Box>Settings</Box>
                </ArticlesButton>

                <ArticlesButton
                    active={showInviteModal}
                    variant="four-frogs-primary"
                    onClick={() => {
                        // setShowInviteModal(true)
                        setShowInviteModal({
                            type: 'Game',
                            game_name: 'Four Frogs',
                            server_id: server_id
                        })
                    }}
                >
                    <Box>Invite</Box>
                </ArticlesButton>

                <ArticlesButton
                    small
                    
                    variant='four-frogs-primary'
                    active={showChat}
                    onClick={() => {
                        setShowChat(prev => !prev)
                    }}
                >
                    <Box component="span">Chat</Box>
                    <Box component="span" sx={{ display: "inline-block", px: "0.65em", py: "0.35em", fontSize: "0.75em", fontWeight: 700, lineHeight: 1, textAlign: "center", whiteSpace: "nowrap", verticalAlign: "baseline", borderRadius: "0.375rem", bgcolor: "#212529", color: "#fff", ml: "0.25rem" }}>
                        {chatMessages.length || 0}
                    </Box>
                </ArticlesButton>

            </Box>

            {showChat &&
                <Box sx={{ ...panelContentSx, color: "#212529", p: "0" }}>

                    <Box sx={{ fontSize: "0.875em", p: "0.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid", borderColor: "#212529" }}>

                        <Box sx={{ fontWeight: 700 }}>
                            Game Chat
                        </Box>

                        <ArticlesButton
                            small
                            
                            variant='four-frogs-primary'
                            active={showChat}
                            onClick={() => {
                                setShowChat(false)
                            }}
                        >
                            <CloseIcon  sx={{ fontSize: "1em", mr: "0", verticalAlign: "middle" }} />
                        </ArticlesButton>

                    </Box>

                    <Box sx={{ p: "0.5rem" }}>

                        

                        

                    </Box>
                </Box>
            }

            <Box sx={{ mb: "0.5rem" }}>

                <Box sx={{ display: "inline-block", px: "0.65em", py: "0.35em", fontSize: "0.75em", fontWeight: 700, lineHeight: 1, textAlign: "center", whiteSpace: "nowrap", verticalAlign: "baseline", borderRadius: "0.375rem", bgcolor: "#212529", color: "#fff", mb: "0.25rem" }}>
                    Touch Controls
                </Box>

                <Box>
                    <ArticlesButton
                        variant='four-frogs-primary'
                        sx={{ width: "50%", opacity: touchControlsEnabled ? 0.5 : 1 }}
                        active={!touchControlsEnabled}
                        onClick={() => {
                            setTouchControlsEnabled(false)
                        }}
                        
                    >
                        <RestartAltIcon  sx={{ fontSize: "1em", mr: "0.2rem", verticalAlign: "middle" }} />
                        Off
                    </ArticlesButton>

                    <ArticlesButton
                        variant='four-frogs-primary'
                        sx={{ width: "50%", opacity: !touchControlsEnabled ? 0.5 : 1 }}
                        active={touchControlsEnabled}
                        onClick={() => {
                            setTouchControlsEnabled(true)
                        }}
                        
                    >
                        <RestartAltIcon  sx={{ fontSize: "1em", mr: "0.2rem", verticalAlign: "middle" }} />
                        On
                    </ArticlesButton>
                </Box>

            </Box>

            <Box>
                <Box sx={{ display: "inline-block", px: "0.65em", py: "0.35em", fontSize: "0.75em", fontWeight: 700, lineHeight: 1, textAlign: "center", whiteSpace: "nowrap", verticalAlign: "baseline", borderRadius: "0.375rem", bgcolor: "#212529", color: "#fff", mb: "0.25rem" }}>
                    Render Mode
                </Box>
                <Box sx={{ display: "flex", mb: "0.25rem" }}>
                    <ArticlesButton
                        variant='four-frogs-primary'
                        sx={{ width: "50%", opacity: renderMode !== '2D' ? 0.5 : 1 }}
                        // disabled={renderMode !== '2D'}
                        active={renderMode === '2D'}
                        
                        onClick={() => {
                            setRenderMode("2D")
                        }}
                    >
                        2D
                        <Box component="span" sx={{ display: "inline-block", px: "0.65em", py: "0.35em", fontSize: "0.75em", fontWeight: 700, lineHeight: 1, textAlign: "center", whiteSpace: "nowrap", verticalAlign: "baseline", borderRadius: "0.375rem", bgcolor: "#212529", color: "#fff", ml: "0.25rem" }}>v</Box>
                    </ArticlesButton>
                    <ArticlesButton
                        variant='four-frogs-primary'
                        sx={{ width: "50%", opacity: renderMode !== '3D' ? 0.5 : 1 }}
                        // disabled={renderMode !== '3D'}
                        active={renderMode === '3D'}
                        
                        onClick={() => {
                            setRenderMode("3D")
                        }}
                    >
                        3D
                        <Box component="span" sx={{ display: "inline-block", px: "0.65em", py: "0.35em", fontSize: "0.75em", fontWeight: 700, lineHeight: 1, textAlign: "center", whiteSpace: "nowrap", verticalAlign: "baseline", borderRadius: "0.375rem", bgcolor: "#212529", color: "#fff", ml: "0.25rem" }}>v</Box>
                    </ArticlesButton>
                </Box>
            </Box>

            

            {renderMode == '3D' &&
                <Box sx={{ mb: "0.5rem" }}>
                    <ArticlesButton
                        variant='four-frogs-primary'
                        sx={{ width: "50%" }}
                        onClick={() => {
                            setCameraShakeEnabled(!cameraShakeEnabled)
                        }}
                    >
                        <Box component="span" sx={{ fontSize: '0.7rem' }}>Camera Shake</Box>
                        <Box component="span" sx={{ display: "inline-block", px: "0.65em", py: "0.35em", fontSize: "0.75em", fontWeight: 700, lineHeight: 1, textAlign: "center", whiteSpace: "nowrap", verticalAlign: "baseline", borderRadius: "0.375rem", bgcolor: "#212529", color: "#fff", ml: "0.25rem" }}>{cameraShakeEnabled ? 'On' : 'Off'}</Box>
                    </ArticlesButton>
                    <ArticlesButton
                        variant='four-frogs-primary'
                        sx={{ width: "50%" }}
                        // disabled={true}
                        onClick={() => {
                            setCameraLocked(!cameraLocked)
                        }}
                    >
                        <Box component="span" sx={{ fontSize: '0.76rem' }}>Camera Lock</Box>
                        <Box component="span" sx={{ display: "inline-block", px: "0.65em", py: "0.35em", fontSize: "0.75em", fontWeight: 700, lineHeight: 1, textAlign: "center", whiteSpace: "nowrap", verticalAlign: "baseline", borderRadius: "0.375rem", bgcolor: "#212529", color: "#fff", ml: "0.25rem" }}>{cameraLocked ? 'On' : 'Off'}</Box>
                    </ArticlesButton>
                </Box>
            }

            

            {controllerState?.connected &&
                <Box sx={{ ...panelContentSx, p: "0", color: "#212529" }}>

                    <Box sx={{ p: "0.25rem", borderBottom: "1px solid", borderColor: "#212529" }}>
                        <Box sx={{ fontWeight: 700, fontSize: "0.7rem" }}>
                            {controllerState?.id}
                        </Box>
                    </Box>

                    <Box sx={{ p: "0.25rem" }}>
                        <ArticlesButton
                            small
                            sx={{ width: "100%" }}
                            active={showControllerState}
                            onClick={() => {
                                setShowControllerState(prev => !prev)
                            }}
                        >
                            {showControllerState ? 'Hide' : 'Show'} Controller Preview
                        </ArticlesButton>
                    </Box>

                    

                </Box>
            }

            
            

        </Box>
    )
}

export default memo(LeftPanelContent)
