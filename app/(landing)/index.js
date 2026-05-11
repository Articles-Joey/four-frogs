"use client"
import { useEffect, useContext, useState, Suspense } from 'react';

import Link from 'next/link'

import logo from '../icon.png'

import { useSocketStore } from '@/hooks/useSocketStore';
import { useStore } from '@/hooks/useStore';

import PageTemplateLandingPage from '@articles-media/articles-dev-box/PageTemplateLandingPage';
import RotatingMascot from '@/components/UI/RotatingMascot';

export default function FourFrogsLobbyPage() {

    const darkMode = useStore((state) => state.darkMode)

    return (
        <>
            <PageTemplateLandingPage
                useSocketStore={useSocketStore}
                useStore={useStore}
                RotatingMascot={RotatingMascot}
                Link={Link}
                logoImage={logo.src}
                // disableHero={true}
                // CardBodyOverride={<></>}
                // LandingBackgroundAnimation={<></>}
                backgroundImage={
                    darkMode ?
                        "img/dark-background.webp"
                        :
                        "img/background.webp"
                }
                // singlePlayerConfig={{}}
                multiplayerConfig={{
                    type: "WebSocket",
                    // comingSoon: true,
                    defaultServers: 4,
                    privateServerSupport: false,
                }}
                // brandingTextClass="jaro-primary"
            />
        </>
    );
}