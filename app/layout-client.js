"use client"
import { Suspense } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import packageInfo from '@/package.json';

import { useStore } from '@/hooks/useStore';
import { useAudioStore } from '@/hooks/useAudioStore';
import useTouchControlsStore from '@/hooks/useTouchControlsStore';
import { useSocketStore } from '@/hooks/useSocketStore';

import DarkModeHandler from "@articles-media/articles-dev-box/DarkModeHandler";
import GlobalBody from '@articles-media/articles-dev-box/GlobalBody';
import GlobalClientModals from '@articles-media/articles-dev-box/GlobalClientModals';
import HotkeyHandler from '@articles-media/articles-dev-box/HotkeyHandler';
import { useHotkeys } from 'react-hotkeys-hook';

export default function LayoutClient() {

    return (
        <>
            <GlobalBody />
            <DarkModeHandler
                useStore={useStore}
            />
            <Suspense>

                <GlobalClientModals
                    useStore={useStore}
                    useAudioStore={useAudioStore}
                    useTouchControlsStore={useTouchControlsStore}
                    useSocketStore={useSocketStore}

                    packageInfo={packageInfo}
                    settingsModalConfig={{
                        tabs: {
                            'Graphics': {
                                darkMode: true,
                                landingAnimation: true
                            },
                            'Audio': {
                                sliders: [
                                    ...useAudioStore.getState().audioSettings ?
                                        Object.keys(useAudioStore.getState().audioSettings).filter(key => key !== "enabled").map(key => ({
                                            key,
                                            label: key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
                                        }))
                                        :
                                        [],
                                ]
                            },
                            'Controls': {
                                touchControls: true
                                // defaultKeyBindings: {
                                //     // moveUp: "W",
                                //     // moveDown: "S",
                                //     // moveLeft: "A",
                                //     // moveRight: "D",
                                // }
                            },
                            'Multiplayer': {
                                serverUrl: true,
                            },
                            'Other': {
                                // toontownMode: true,
                            },
                            'Debug': {
                                children: <></>,
                            }
                        }
                    }}
                    infoModalConfig={{
                        previewImage: "img/game-preview.jpg",
                        appendContent: <Box sx={{ mt: '1rem' }}>
                            <Typography variant="h6" component="h5">Controls</Typography>
                            <Typography component="p" sx={{ mb: '1rem' }}>
                                Can be customized in the settings.
                            </Typography>
                            <Box
                                component="img"
                                src={`${process.env.NEXT_PUBLIC_CDN}games/Four Frogs/controls.png`}
                                alt="Four Frogs controls"
                                sx={{
                                    width: '100%',
                                    objectFit: 'contain'
                                }}
                            />
                        </Box>
                    }}
                />

                <HotkeyHandler
                    useStore={useStore}
                    useHotkeys={useHotkeys}
                />

            </Suspense>
        </>
    );
}
