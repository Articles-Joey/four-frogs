"use client"
import { useEffect, useContext, useState, Suspense } from 'react';

import Link from 'next/link'

// import logo from '../icon.png'

import { useSocketStore } from '@/hooks/useSocketStore';
import { useStore } from '@/hooks/useStore';

import PageTemplateLandingPage from '@articles-media/articles-dev-box/PageTemplateLandingPage';
import RotatingMascot from '@/components/UI/RotatingMascot';
import ArticlesButton from '@/components/UI/Button';
import PrivateGameModal from '@/components/UI/PrivateGameModal';
import IsDev from '@/components/UI/IsDev';
import LandingBackgroundAnimation from '@/components/Game/LandingBackgroundAnimation';

export default function FourFrogsLobbyPage() {

    const darkMode = useStore((state) => state.darkMode)
    const showPrivateGameModal = useStore((state) => state.showPrivateGameModal)
    const setShowPrivateGameModal = useStore((state) => state.setShowPrivateGameModal)

    return (
        <>
            {showPrivateGameModal &&
                <PrivateGameModal
                    show={showPrivateGameModal}
                    setShow={setShowPrivateGameModal}
                />
            }
            <PageTemplateLandingPage
                useSocketStore={useSocketStore}
                useStore={useStore}
                RotatingMascot={RotatingMascot}
                Link={Link}
                logoImage={"img/thumbnail.webp"}
                LandingBackgroundAnimation={
                    <LandingBackgroundAnimation />
                }
                heroOverride={
                    darkMode ?
                        <img
                            src="img/hero-dark.webp"
                            alt="Hero Image"
                            className="w-100"
                        />
                        :
                        <img
                            src="img/hero.webp"
                            alt="Hero Image"
                            className="w-100"
                        />
                }
                // disableHero={true}
                // CardBodyOverride={<></>}
                // LandingBackgroundAnimation={<></>}
                backgroundImage={
                    darkMode ?
                        "img/dark-background.webp"
                        :
                        "img/background.webp"
                }
                CardBodyAppendContent={
                    <>
                        <IsDev>
                            <ArticlesButton
                                className="mt-3 w-100"
                                onClick={() => {
                                    setShowPrivateGameModal(true)
                                }}
                            >
                                Custom Games
                            </ArticlesButton>
                        </IsDev>
                    </>
                }
                // singlePlayerConfig={{}}
                multiplayerConfig={{
                    type: "WebSocket",
                    // comingSoon: true,
                    defaultServers: 2,
                    privateServerSupport: false,
                    onlinePlayersTemplate: "2.0",

                }}
            // brandingTextClass="jaro-primary"
            />
        </>
    );
}