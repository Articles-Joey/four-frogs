"use client"
import { useEffect, useContext, useState, Suspense } from 'react';

import Image from 'next/image'
import Link from 'next/link'
import dynamic from 'next/dynamic'

// import { useSelector, useDispatch } from 'react-redux'

// import { useForm, useWatch } from "react-hook-form";

// import ROUTES from 'components/constants/routes'

import ArticlesButton from '@/components/UI/Button';
// import SingleInput from '@/components/Articles/SingleInput';
// import { useLocalStorageNew } from '@/hooks/useLocalStorageNew';
import IsDev from '@/components/UI/IsDev';
import { useSocketStore } from '@/hooks/useSocketStore';
import { useStore } from '@/hooks/useStore';
// import CreditsModal from '@/components/UI/CreditsModal';

// const Ad = dynamic(() => import('components/Ads/Ad'), {
//     ssr: false,
// });

// const PrivateGameModal = dynamic(
//     () => import('@/components/UI/PrivateGameModal'),
//     { ssr: false }
// )

import GameScoreboard from '@articles-media/articles-dev-box/GameScoreboard';
import Ad from '@articles-media/articles-dev-box/Ad';

import useUserDetails from '@articles-media/articles-dev-box/useUserDetails';
import useUserToken from '@articles-media/articles-dev-box/useUserToken';
import { PieMenu } from '@articles-media/articles-gamepad-helper';

const ReturnToLauncherButton = dynamic(() =>
    import('@articles-media/articles-dev-box/ReturnToLauncherButton'),
    { ssr: false }
);

const game_name = "Four Frogs";

export default function FourFrogsLobbyPage() {

    const {
        socket,
    } = useSocketStore(state => ({
        socket: state.socket,
    }));

    const {
        data: userToken,
        error: userTokenError,
        isLoading: userTokenLoading,
        mutate: userTokenMutate
    } = useUserToken(
        "3018"
    );

    const {
        data: userDetails,
        error: userDetailsError,
        isLoading: userDetailsLoading,
        mutate: userDetailsMutate
    } = useUserDetails({
        token: userToken
    });

    // const userReduxState = useSelector((state) => state.auth.user_details)
    const userReduxState = false

    const darkMode = useStore((state) => state.darkMode)
    const toggleDarkMode = useStore((state) => state.toggleDarkMode)

    // const [nickname, setNickname] = useLocalStorageNew("game:nickname", userReduxState.display_name)
    const nickname = useStore(state => state.nickname)
    const setNickname = useStore(state => state.setNickname)
    const _hasHydrated = useStore(state => state._hasHydrated)

    // const showCreditsModal = useStore((state) => state.showCreditsModal)
    const setShowCreditsModal = useStore((state) => state.setShowCreditsModal)

    // const showInfoModal = useStore((state) => state.showInfoModal)
    const setShowInfoModal = useStore((state) => state.setShowInfoModal)

    // const showSettingsModal = useStore((state) => state.showSettingsModal)
    const setShowSettingsModal = useStore((state) => state.setShowSettingsModal)

    // const { register, handleSubmit, watch, formState: { errors } } = useForm({
    //     defaultValues: {
    //         // "Cover Fees": false
    //         nickname: userReduxState.username
    //     }
    // });

    // const [showInfoModal, setShowInfoModal] = useState(false)
    // const [showSettingsModal, setShowSettingsModal] = useState(false)
    // const [showPrivateGameModal, setShowPrivateGameModal] = useState(false)

    const [lobbyDetails, setLobbyDetails] = useState({
        players: [],
        games: [],
    })

    // useEffect(() => {

    //     if (socket) {
    //         socket.emit('join-room', 'four-frogs');
    //     }

    //     return () => {
    //         if (socket) {
    //             socket.emit('leave-room', 'four-frogs');
    //         }
    //     }

    // }, [socket]);

    useEffect(() => {

        // setShowInfoModal(localStorage.getItem('game:four-frogs:rulesAnControls') === 'true' ? true : false)

        // if (userReduxState._id) {
        //     console.log("Is user")
        // }

        socket.on('game:four-frogs-landing-details', function (msg) {
            console.log('game:four-frogs-landing-details', msg)

            if (JSON.stringify(msg) !== JSON.stringify(lobbyDetails)) {
                setLobbyDetails(msg)
            }
        });

        return () => {
            socket.off('game:four-frogs-landing-details');
        };

    }, [socket])

    // useEffect(() => {

    //     localStorage.setItem('game:four-frogs:rulesAnControls', showInfoModal)

    // }, [showInfoModal])

    const setRandomNickname = () => {
        const randomNicknames = [
            "FroggyMaster",
            "JumpingJester",
            "LilyPadLord",
            "ToadallyAwesome",
            "CroakCommander",
            "SwampSurfer",
            "PondPatrol",
            "RibbitRanger",
            "LeapFrogLegend",
            "TadpoleTitan",
            "BogBoss",
            "MarshMonarch",
            "FlyCatcher",
            "GreenGlider",
            "AmphibianAce",
            "WetlandWarrior",
            "HopsHero",
            "SlipperyScout",
            "MudSkipper",
            "LotusLeaper"
        ];

        const randomIndex = Math.floor(Math.random() * randomNicknames.length);
        setNickname(randomNicknames[randomIndex]);
    }

    // Only do once so user can set name from nothing without retriggering
    const [initialRandomName, setInitialRandomName] = useState(false)
    useEffect(() => {

        // console.log("nickname", nickname)
        // console.log("rehydrated", _hasHydrated)

        if (!nickname && _hasHydrated && !initialRandomName) {
            console.log("No nickname set, set a random!")
            setRandomNickname()
            setInitialRandomName(true)
        }

    }, [nickname, _hasHydrated])

    useEffect(() => {

        if (socket.connected) {
            console.log("Joining four-frogs-landing room")
            socket.emit('join-room', 'game:four-frogs-landing');
        }

        return function cleanup() {
            socket.emit('leave-room', 'game:four-frogs-landing')
        };

    }, [socket.connected]);

    return (

        <div className="four-frogs-lobby-page">

            <Suspense>
                <PieMenu
                    options={[
                        {
                            label: 'Settings',
                            icon: 'fad fa-cog',
                            callback: () => {
                                setShowSettingsModal(prev => !prev)
                            }
                        },
                        {
                            label: 'Go Back',
                            icon: 'fad fa-arrow-left',
                            callback: () => {
                                window.history.back()
                            }
                        },
                        {
                            label: 'Credits',
                            icon: 'fad fa-info-circle',
                            callback: () => {
                                setShowCreditsModal(true)
                            }
                        },
                        {
                            label: 'Game Launcher',
                            icon: 'fad fa-gamepad',
                            callback: () => {
                                window.location.href = 'https://games.articles.media';
                            }
                        },
                        {
                            label: `${darkMode ? "Light" : "Dark"} Mode`,
                            icon: 'fad fa-palette',
                            callback: () => {
                                toggleDarkMode()
                            }
                        }
                    ]}
                    onFinish={(event) => {
                        console.log("Event", event)
                        if (event.callback) {
                            event.callback()
                        }
                    }}
                />
            </Suspense>

            {/* {showPrivateGameModal &&
                <PrivateGameModal
                    show={showPrivateGameModal}
                    setShow={setShowPrivateGameModal}
                />
            } */}

            <div className='background-wrap'>
                {
                    darkMode ?
                        <Image
                            src={`/img/dark-background.webp`}
                            alt=""
                            fill
                            style={{ objectFit: 'cover' }}
                        />
                        :
                        <Image
                            src={`${process.env.NEXT_PUBLIC_CDN}games/Four%20Frogs/background.jpg`}
                            alt=""
                            fill
                            style={{ objectFit: 'cover' }}
                        />
                }

            </div>

            <div className="container d-flex flex-column-reverse flex-lg-row justify-content-center align-items-center">

                <div
                    className=''
                    style={{ "width": "20rem" }}
                >

                    <div className="card card-articles mb-3" >

                        {/* <div style={{ position: 'relative', height: '200px' }}>
                            <Image
                                src={Logo}
                                alt=""
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                        </div> */}

                        <div className="card-header">

                            <div className=''>
                                <div className="form-group articles mb-0">

                                    <label htmlFor="nickname">Nickname</label>

                                    {/* <SingleInput
                                        value={nickname}
                                        setValue={setNickname}
                                    /> */}

                                    <div className='d-flex'>
                                        <input
                                            type="text"
                                            placeholder={"Display name or username"}
                                            value={nickname}
                                            onChange={(e) => {
                                                setNickname(e.target.value)
                                            }}
                                            className={`form-control form-control-sm`}
                                        />
                                        <ArticlesButton
                                            onClick={setRandomNickname}
                                        >
                                            <i className="fad fa-random me-0"></i>
                                        </ArticlesButton>
                                    </div>

                                </div>

                            </div>

                            <div style={{ fontSize: '0.8rem' }}>Visible to all players</div>

                        </div>

                        <div className="card-body">

                            <div className="fw-bold mb-1 small text-center">
                                {lobbyDetails.players.length || 0} player{lobbyDetails.players.length > 1 && 's'} in the lobby.
                            </div>

                            {/* <div className='small fw-bold'>Public Servers</div> */}

                            <div className="servers">

                                {[1, 2, 3, 4].map(id => {

                                    let lobbyLookup = lobbyDetails?.fourFrogsGlobalState?.games?.find(lobby =>
                                        parseInt(lobby.server_id) == id
                                    )

                                    return (
                                        <div key={id} className="server">

                                            <div className='d-flex justify-content-between align-items-center w-100 mb-2'>
                                                <div className="mb-0" style={{ fontSize: '0.9rem' }}><b>Server {id}</b></div>
                                                <div className='mb-0'>{lobbyLookup?.players?.length || 0}/4</div>
                                            </div>

                                            <div className='d-flex justify-content-around w-100 mb-1'>
                                                {[1, 2, 3, 4].map(player_count => {

                                                    let playerLookup = false

                                                    if (lobbyLookup?.players?.length >= player_count) playerLookup = true

                                                    return (
                                                        <div key={player_count} className="icon" style={{
                                                            width: '20px',
                                                            height: '20px',
                                                            ...(playerLookup ? {
                                                                backgroundColor: 'black',
                                                            } : {
                                                                backgroundColor: 'gray',
                                                            }),
                                                            border: '1px solid black'
                                                        }}>

                                                        </div>
                                                    )
                                                })}
                                            </div>

                                            <Link
                                                href={{
                                                    pathname: `/play`,
                                                    query: {
                                                        server_id: id,
                                                    }
                                                }}
                                            >

                                                <ArticlesButton
                                                    small
                                                    className="px-5"
                                                >
                                                    Join
                                                </ArticlesButton>
                                            </Link>

                                        </div>
                                    )
                                })}

                            </div>

                            {/* TODO - Finish ability to start a practice game against bots or a private game with friends */}
                            <div className='d-none'>
                                <div className='small fw-bold  mt-3 mb-1'>Or</div>

                                <div className='d-flex'>

                                    <ArticlesButton
                                        className={`w-50`}
                                        onClick={() => {
                                            // TODO
                                            alert("Coming Soon!")
                                        }}
                                    >
                                        <i className="fad fa-robot"></i>
                                        Practice
                                    </ArticlesButton>

                                    <ArticlesButton
                                        className={`w-50`}
                                        onClick={() => {
                                            // setShowPrivateGameModal(prev => !prev)
                                        }}
                                    >
                                        <i className="fad fa-lock"></i>
                                        Private Game
                                    </ArticlesButton>

                                </div>
                            </div>

                            <IsDev className={'mt-3'}>
                                <div>
                                    <ArticlesButton
                                        className="w-50"
                                        variant='warning'
                                        onClick={() => {
                                            socket.emit('game:four-frogs:reset', '');
                                        }}
                                    >
                                        Reset Server
                                    </ArticlesButton>
                                </div>
                            </IsDev>

                        </div>

                        <div className="card-footer d-flex flex-wrap justify-content-center">

                            <div className='w-50 d-flex'>
                                <ArticlesButton
                                    small
                                    className={`w-100`}
                                    onClick={() => {
                                        setShowSettingsModal(prev => !prev)
                                    }}
                                >
                                    <i className="fad fa-cog"></i>
                                    Settings
                                </ArticlesButton>
                                <ArticlesButton
                                    small
                                    className={``}
                                    onClick={() => {
                                        toggleDarkMode()
                                    }}
                                >
                                    <i className={`fad ${darkMode ? "fa-sun" : "fa-moon"}`}></i>
                                </ArticlesButton>
                            </div>

                            <ArticlesButton
                                small
                                className={`w-50`}
                                onClick={() => {
                                    setShowInfoModal(true)
                                }}
                            >
                                <i className="fad fa-info-square"></i>
                                Rules & Controls
                            </ArticlesButton>

                            {/* <Link href={ROUTES.GAMES} className='w-50'>
                                <ArticlesButton
                                    className={`w-100`}
                                    small
                                    onClick={() => {
    
                                    }}
                                >
                                    <i className="fad fa-sign-out fa-rotate-180"></i>
                                    Leave Game
                                </ArticlesButton>
                            </Link> */}

                            <ArticlesButton
                                className={`w-50`}
                                small
                                onClick={() => {
                                    setShowCreditsModal(true)
                                }}
                            >
                                <i className="fad fa-users"></i>
                                Credits
                            </ArticlesButton>

                            <Link href={"https://github.com/Articles-Joey/four-frogs"} target='_blank' className={`w-50`}>
                                <ArticlesButton
                                    className={`w-100`}
                                    small
                                >
                                    <i className="fab fa-github"></i>
                                    Github
                                </ArticlesButton>
                            </Link>

                        </div>

                    </div>

                    <ReturnToLauncherButton />

                </div>

                {/* <Ad section={"Games"} section_id={'Four Frogs'} /> */}

                <GameScoreboard
                    game={game_name}
                    style="Default"
                    darkMode={darkMode ? true : false}
                />

                <Ad
                    style="Default"
                    section={"Games"}
                    section_id={game_name}
                    darkMode={darkMode ? true : false}
                    user_ad_token={userToken}
                    userDetails={userDetails}
                    userDetailsLoading={userDetailsLoading}
                />

            </div>
        </div>
    );
}