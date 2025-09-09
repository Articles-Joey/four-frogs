import ArticlesButton from "@/components/UI/Button";
import ArticlesDate from "@/components/UI/ArticlesDate";
// import SingleInput from "@/components/Articles/SingleInput";
import IsDev from "@/components/UI/IsDev";
import Link from "next/link";
import { useLocalStorageNew } from "@/hooks/useLocalStorageNew";
import ControllerPreview from "@/components/UI/ControllerPreview";

// import ROUTES from 'components/constants/routes';

import { useEffect, useRef, useState } from "react";
import { useSocketStore } from "@/hooks/useSocketStore";

const LeftPanelContent = (props) => {

    const {
        room,
        gameState,
        players,
        touchControlsEnabled,
        setTouchControlsEnabled,
        reloadScene,
        controllerState,
        isFullscreen,
        requestFullscreen,
        exitFullscreen,
        setShowMenu,
        // showChat,
        // setShowChat,
        // chatMessages,
        // setChatMessages,
        // chatMessage,
        // setChatMessage,
        renderMode,
        setRenderMode,
        cameraShakeEnabled,
        setCameraShakeEnabled,
        setShowSettingsModal,
        setShowInfoModal,
        setShowInviteModal
    } = props;

    const {
        socket,
    } = useSocketStore(state => ({
        socket: state.socket,
    }));

    const [onlineInteractionsWarning, setOnlineInteractionsWarning] = useLocalStorageNew("game:onlineInteractionsWarning", false)

    const chatMessagesRef = useRef()

    const scrollToBottomOfChatMessages = () => {
        if (chatMessagesRef.current) {
            chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
        }
    };

    const [showChat, setShowChat] = useState(false)
    const [chatMessages, setChatMessages] = useState([])
    const [chatMessage, setChatMessage] = useState('')

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

    return (
        <div className="text-dark">

            <div className="panel-content-group text-center mb-3">

                <h5 className="mb-0">Room: {room}</h5>
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

            <button
                className='btn btn-four-frogs-primary w-100 mb-1'
                disabled={gameState.status !== 'In Lobby'}
                onClick={() => {
                    socket.emit('four-frogs-start', {
                        server: room,
                        settings: {}
                    });
                }}
            >
                <i className="fad fa-play"></i>
                <span>Start Game</span>
            </button>

            <div className='buttons-wrap mb-2'>

                <Link href={'/'}>
                    <div className='btn btn-four-frogs-primary w-100'>
                        <div>Leave Game</div>
                    </div>
                </Link>

                <ArticlesButton
                    small
                    className=""
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
                    {isFullscreen && <span>Exit </span>}
                    {!isFullscreen && <span><i className='fad fa-expand'></i></span>}
                    <span>Fullscreen</span>
                </ArticlesButton>

                <div
                    className='btn btn-four-frogs-primary'
                    onClick={() => {
                        setShowInfoModal({
                            game: 'Four Frogs'
                        })
                    }}
                >
                    <div>Info & Controls</div>
                </div>

                <div
                    className='btn btn-four-frogs-primary'
                    onClick={() => {
                        setShowSettingsModal(true)
                    }}
                >
                    <div>Settings</div>
                </div>

                <div
                    className='btn btn-four-frogs-primary'
                    onClick={() => {
                        // setShowInviteModal(true)
                        setShowInviteModal({
                            type: 'Game',
                            game_name: 'Four Frogs',
                            server_id: room
                        })
                    }}
                >
                    <div>Invite</div>
                </div>

                <ArticlesButton
                    small
                    className=""
                    variant='four-frogs-primary'
                    active={showChat}
                    onClick={() => {
                        setShowChat(prev => !prev)
                    }}
                >
                    <span>Chat</span>
                    <span className="badge bg-dark ms-1">
                        {chatMessages.length || 0}
                    </span>
                </ArticlesButton>

            </div>

            {showChat &&
                <div className="panel-content-group text-dark p-0">

                    <div className='small text-muted p-1 d-flex justify-content-between align-items-center border-bottom border-dark'>

                        <div className="fw-bold">
                            Game Chat
                        </div>

                        <ArticlesButton
                            small
                            className=""
                            variant='four-frogs-primary'
                            active={showChat}
                            onClick={() => {
                                setShowChat(false)
                            }}
                        >
                            <i className="fad fa-times me-0"></i>
                        </ArticlesButton>

                    </div>

                    <div className='p-2'>

                        {!onlineInteractionsWarning &&
                            <div>
                                <div className='small mb-2'>
                                    {`Online interactions are not rated! There is no way for Articles Media to predict what you'll hear and see online. If you wish to use the chat please accept.`}
                                </div>
                                <ArticlesButton
                                    small
                                    className="w-100"
                                    variant='four-frogs-primary'
                                    active={showChat}
                                    onClick={() => {
                                        setOnlineInteractionsWarning(true)
                                    }}
                                >
                                    <span>Accept Warning</span>
                                </ArticlesButton>
                            </div>
                        }

                        {onlineInteractionsWarning &&
                            <div>

                                <div ref={chatMessagesRef} className='mb-1' style={{ maxHeight: '200px', overflow: 'auto' }}>
                                    {chatMessages.map((chat, chat_i) => {
                                        return (
                                            <div key={chat_i}>

                                                <div className='small text-muted'>
                                                    <ArticlesDate date={chat?.date} />
                                                </div>

                                                <div>{chat?.color} - {chat?.message}</div>

                                            </div>
                                        )
                                    })}
                                </div>

                                <div className='d-flex'>
                                    <div className='flex-grow-1'>
                                        {/* <SingleInput
                                            small
                                            value={chatMessage}
                                            setValue={setChatMessage}
                                            noMargin
                                        /> */}
                                        <input
                                            id="room-code"
                                            className="form-control"
                                            value={chatMessage}
                                            onChange={e => setChatMessage(e.target.value)}
                                        ></input>
                                    </div>
                                    <ArticlesButton
                                        small
                                        className=""
                                        variant='articles'
                                        active={false}
                                        onClick={() => {

                                            console.log(socket)

                                            let data = {
                                                message: chatMessage,
                                                date: new Date(),
                                                color: players?.find(player => player.id == socket?.id)?.fourFrogs?.homeZone,
                                                socket_id: socket?.id
                                            }

                                            socket.emit('four-frogs-player-chat', {
                                                room,
                                                data
                                            });

                                            setChatMessages(prev => ([
                                                ...prev,
                                                data
                                            ]))

                                            setChatMessage('')

                                            setInterval(
                                                scrollToBottomOfChatMessages,
                                                1000
                                            );

                                        }}
                                    >
                                        <i className="fad fa-paper-plane me-0"></i>
                                    </ArticlesButton>
                                </div>

                            </div>
                        }

                    </div>
                </div>
            }

            <div className='mb-2'>

                <div className="badge bg-dark mb-1">
                    Touch Controls
                </div>

                <div>
                    <ArticlesButton
                        variant='four-frogs-primary'
                        className="w-50"
                        active={!touchControlsEnabled}
                        onClick={() => {
                            setTouchControlsEnabled(false)
                        }}
                    >
                        <i className="fad fa-redo"></i>
                        Off
                    </ArticlesButton>

                    <ArticlesButton
                        variant='four-frogs-primary'
                        className="w-50"
                        active={touchControlsEnabled}
                        onClick={() => {
                            setTouchControlsEnabled(true)
                        }}
                    >
                        <i className="fad fa-redo"></i>
                        On
                    </ArticlesButton>
                </div>

            </div>

            <div>
                <div className="badge bg-dark mb-1">
                    Render Mode
                </div>
                <div className="d-flex mb-1">
                    <ArticlesButton
                        variant='four-frogs-primary'
                        className="w-50"
                        disabled={renderMode == '2D'}
                        onClick={() => {
                            setRenderMode("2D")
                        }}
                    >
                        2D
                        <span className="badge bg-dark ms-1">v</span>
                    </ArticlesButton>
                    <ArticlesButton
                        variant='four-frogs-primary'
                        className="w-50"
                        disabled={renderMode == '3D'}
                        onClick={() => {
                            setRenderMode("3D")
                        }}
                    >
                        3D
                        <span className="badge bg-dark ms-1">v</span>
                    </ArticlesButton>
                </div>
            </div>

            <IsDev>

                {renderMode == '3D' &&
                    <div className='mb-2'>
                        <ArticlesButton
                            variant='four-frogs-primary'
                            className="w-50"
                            onClick={() => {
                                setCameraShakeEnabled(prev => !prev)
                            }}
                        >
                            <span style={{ fontSize: '0.7rem' }}>Camera Shake</span>
                            <span className="badge bg-dark ms-1">{cameraShakeEnabled ? 'On' : 'Off'}</span>
                        </ArticlesButton>
                        <ArticlesButton
                            variant='four-frogs-primary'
                            className="w-50"
                            onClick={() => {
                                setCameraShakeEnabled(prev => !prev)
                            }}
                        >
                            <span style={{ fontSize: '0.76rem' }}>Camera Lock</span>
                            <span className="badge bg-dark ms-1">{cameraShakeEnabled ? 'On' : 'Off'}</span>
                        </ArticlesButton>
                    </div>
                }

            </IsDev>

            {controllerState?.connected &&
                <div className="panel-content-group p-0 text-dark">

                    <div className="p-1 border-bottom border-dark">
                        <div className="fw-bold" style={{ fontSize: '0.7rem' }}>
                            {controllerState?.id}
                        </div>
                    </div>

                    <div className='p-1'>
                        <ArticlesButton
                            small
                            className="w-100"
                            active={showControllerState}
                            onClick={() => {
                                setShowControllerState(prev => !prev)
                            }}
                        >
                            {showControllerState ? 'Hide' : 'Show'} Controller Preview
                        </ArticlesButton>
                    </div>

                    {showControllerState && <div className='p-3'>

                        <ControllerPreview
                            controllerState={controllerState}
                            showJSON={true}
                            showVibrationControls={true}
                            maxHeight={300}
                            showPreview={true}
                        />
                    </div>}

                </div>
            }

            {/* TODO - One day, lets get the game finished first */}
            {/* <div className="panel-content-group card rounded-0 p-0">

                    <div className="card-header border-bottom border-dark d-flex justify-content-between align-items-center">
                        <h5 className='mb-0'>Spectators</h5>
                        <h5 className='mb-0'>0</h5>
                    </div>

                    <div
                        style={{ minHeight: '250px' }}
                        className='p-3'
                    >
                        {`< SpectatorsGameBoard > `}
                    </div>

                </div> */}

        </div>
    )
}

export default LeftPanelContent