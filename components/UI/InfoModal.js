import { useEffect, useState } from "react";

import Image from "next/image";
import dynamic from 'next/dynamic'

// import { useSelector } from 'react-redux'

import { Modal } from "react-bootstrap"

import ViewUserModal from "@/components/UI/ViewUserModal"

// import BasicLoading from "@/components/loading/BasicLoading";

// import powerups from "app/(site)/community/games/four-frogs/components/powerups";

// import games from "../constants/games";
const games = []

import IsDev from "@/components/UI/IsDev";
import ArticlesButton from "./Button";

export default function GameInfoModal({
    show,
    setShow,
    credits
}) {

    const [showModal, setShowModal] = useState(true)

    const [lightboxData, setLightboxData] = useState(null)

    // const userReduxState = useSelector((state) => state.auth.user_details);
    const userReduxState = false

    const [showVideo, setShowVideo] = useState()

    useEffect(() => {

        if (!show.item) {
            setShow({
                ...show,
                item: games.find(game_obj => game_obj.name == show.game)
            })
        }

    }, [])

    return (
        <>
            <Modal
                className="articles-modal games-info-modal"
                size='md'
                show={showModal}
                centered
                scrollable
                onExited={() => {
                    setShow(false)
                }}
                onHide={() => {
                    setShowModal(false)
                }}
            >

                <Modal.Header closeButton>
                    <Modal.Title>Game Info</Modal.Title>
                </Modal.Header>

                <Modal.Body className="flex-column p-0">

                    <div className="p-3">

                        <div className="fw-bold mb-2">
                            {show.game || 'No game property provided'}
                        </div>

                        <div className="">
                            {show?.item?.short_description}
                        </div>

                        <div>TODO - Import from global games project</div>

                    </div>

                    {show?.item?.welcome &&
                        <div className="p-3 py-2 border-bottom">

                            <b>Welcome to {show?.item?.name}</b>
                            <p className='small mb-2'>
                                {show?.item?.welcome?.preview_text}
                            </p>

                            <div className="ratio ratio-16x9">
                                <img src={show?.item?.welcome?.preview_gif} alt="" />
                            </div>

                        </div>
                    }

                    {show?.item?.inspiration &&
                        <div className="p-3 border-bottom">
                            <div className="mb-2 fw-bold">Inspiration</div>
                            <div>{show?.item?.inspiration?.text}</div>
                            {show?.item?.inspiration?.video &&
                                <div className="inspiration-video-wrapper">

                                    {!showVideo &&
                                        <div
                                            className="play-button"
                                            onClick={() => {
                                                setShowVideo(true)
                                            }}
                                        >
                                            <div><i style={{ color: 'red' }} className="fab fa-youtube fa-4x me-0"></i></div>
                                            <div className="label">Play Video</div>
                                        </div>
                                    }

                                    <div style={{ position: 'relative' }} className="ratio ratio-16x9 bg-dark">

                                        {showVideo ?
                                            <iframe
                                                width="100%"
                                                height="100%"
                                                src={`https://www.youtube.com/embed/${show?.item?.inspiration?.video}?autoplay=1&mute=1`}
                                                title="YouTube video player"
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                allowFullScreen
                                            ></iframe>
                                            :
                                            <>
                                                {/* <img
                                                    onClick={() => {
                                                        setShowVideo(true)
                                                    }}
                                                    src={`${process.env.NEXT_PUBLIC_CDN}games/Race Game/inspo-animation.webp`}
                                                    fill
                                                    alt=""
                                                    style={{ objectFit: 'contain', maxWidth: '100%' }}
                                                    loading="lazy"
                                                /> */}
                                            </>
                                        }

                                    </div>

                                </div>
                            }
                        </div>
                    }

                    {show?.item?.attributions &&
                        <div className="p-3">
                            <div className="mb-2 fw-bold">Attributions</div>
                            <div>{show?.item?.attributions}</div>
                        </div>
                    }

                </Modal.Body>

                <Modal.Footer className="justify-content-between">

                    <div></div>

                    <ArticlesButton variant="outline-dark" onClick={() => {
                        setShow(false)
                    }}>
                        Close
                    </ArticlesButton>

                </Modal.Footer>

            </Modal>
        </>
    )

}