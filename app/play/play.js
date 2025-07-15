"use client"
import { useEffect, useContext, useState, useRef } from 'react';

import NextImage from 'next/image'
import { useSearchParams, useRouter, usePathname, useParams } from 'next/navigation';
import dynamic from 'next/dynamic'

import useFullscreen from '@/hooks/useFullScreen';

const bugImages = [
    `${process.env.NEXT_PUBLIC_CDN}games/Four%20Frogs/Bugs/bug-1.png`,
    `${process.env.NEXT_PUBLIC_CDN}games/Four%20Frogs/Bugs/bug-2.png`,
    `${process.env.NEXT_PUBLIC_CDN}games/Four%20Frogs/Bugs/bug-3.png`,
    `${process.env.NEXT_PUBLIC_CDN}games/Four%20Frogs/Bugs/bug-4.png`,
    `${process.env.NEXT_PUBLIC_CDN}games/Four%20Frogs/Bugs/bug-5.png`,
    `${process.env.NEXT_PUBLIC_CDN}games/Four%20Frogs/Bugs/bug-6.png`,
    `${process.env.NEXT_PUBLIC_CDN}games/Four%20Frogs/Bugs/bug-7.png`,
    `${process.env.NEXT_PUBLIC_CDN}games/Four%20Frogs/Bugs/bug-8.png`
]

const muddyWaterZoneSize = 300

function getColorWithOpacity(colorName, opacity) {
    // Define a map of color names to RGB values
    const colorMap = {
        'Red': [255, 0, 0],
        'Green': [0, 255, 0],
        'Blue': [0, 0, 255],
        'Yellow': [255, 255, 0],
        // Add more colors as needed
    };

    // Check if the colorName is in the map
    if (colorName in colorMap) {
        // Get the RGB values for the color
        const [r, g, b] = colorMap[colorName];

        // Adjust opacity (0 to 1)
        const alpha = opacity / 100;

        // Return the RGBA string
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    } else {
        // If the color name is not found, return an error or a default color
        console.error(`Color "${colorName}" not found in the map`);
        // You can also return a default color, for example, black with 50% opacity
        return 'rgba(0, 0, 0, 0.5)';
    }
}

function getDirections(axes) {
    // Determine movement direction based on axes
    const isMovingUp = axes[1] < -0.5;
    const isMovingDown = axes[1] > 0.5;
    const isMovingLeft = axes[0] < -0.5;
    const isMovingRight = axes[0] > 0.5;

    // Update movement payload
    return {
        up: isMovingUp,
        down: isMovingDown,
        left: isMovingLeft,
        right: isMovingRight,
    };
}

function isMoving(movementPayload) {
    // Check if any property in the movement payload is true
    return Object.values(movementPayload).some((value) => value === true);
}

// import ROUTES from 'components/constants/routes';
// import Link from 'next/link';
// import ViewUserModal from '@/components/user/ViewUserModal/ViewUserModal';

import { useKeyboard } from "@/hooks/useKeyboard"
import powerups from '@/components/powerups';
import ArticlesButton from '@/components/UI/Button';
import ordinal_suffix_of from '@/util/ordinalSuffix';
// import IsDev from '@/components/IsDev';
import { useHotkeys } from 'react-hotkeys-hook';
import { useLocalStorageNew } from '@/hooks/useLocalStorageNew';
// import SingleInput from '@/components/Articles/SingleInput';
// import ArticlesDate from '@/components/Articles/Date';
import muddyWaterZones from '@/components/constants/muddyWaterZones';
import LeftPanelContent from '@/components/UI/LeftPanel';
import RightPanelContent from '@/components/UI/RightPanel';
import TouchControls from '@/components/UI/TouchControls';
import { useSocketStore } from '@/hooks/useSocketStore';

// const ControllerPreview = dynamic(
//     () => import('@/components/Games/ControllerPreview'),
//     { ssr: false }
// )

const InfoModal = dynamic(
    () => import('@/components/UI/InfoModal'),
    { ssr: false }
)

const SettingsModal = dynamic(
    () => import('@/components/UI/SettingsModal'),
    { ssr: false }
)

const InviteModal = dynamic(
    () => import('@/components/UI/InviteModal'),
    { ssr: false }
)

const ArticlesModal = dynamic(
    () => import('@/components/UI/ArticlesModal'),
    { ssr: false }
)

const GameCanvas = dynamic(
    () => import('@/components/GameCanvas'),
    { ssr: false }
)

let powerup_image

export default function FourFrogs() {

    const {
        socket,
    } = useSocketStore(state => ({
        socket: state.socket,
    }));

    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    // const params = Object.fromEntries(searchParams.entries());
    const params = useParams()
    const room = params?.room
    // const { room } = router.query

    // const chatMessagesRef = useRef()

    const { moveDown, moveUp, moveRight, moveLeft, drop } = useKeyboard()

    const [showInfoModal, setShowInfoModal] = useState(false)
    const [showSettingsModal, setShowSettingsModal] = useState(false)
    const [showInviteModal, setShowInviteModal] = useState(false)

    const [players, setPlayers] = useState([])
    const [bugs, setBugs] = useState([])
    const [gameState, setGameState] = useState({})

    const [debugTab, setDebugTab] = useState('Players')

    const [showGameOverModal, setShowGameOverModal] = useState(false)
    const [scoreboard, setScoreboard] = useState({
        list: [

        ]
    })

    const [renderMode, setRenderMode] = useState('2D')

    const [devDebugPanel, setDevDebugPanel] = useState(false)

    var canvas;
    var context;

    var static_canvas;
    var static_context;

    function drawRotated(x, y, degrees, color, image) {

        if (!static_context) {
            return
        } else {
            console.log("Valid context")
        }

        // canvas = document.getElementById('canvas');
        // canvas.width = 800;
        // canvas.height = 800;

        // context = canvas.getContext('2d');

        x = x + 80;
        y = y + 80;

        // var image = document.getElementById("pad" + color);

        let base_image = new Image();
        base_image.src = image;
        base_image.onload = function () {

            console.log("Image loaded")

            var image = base_image
            // context.drawImage(base_image, 0, 0);

            // save the unrotated context of the canvas so we can restore it later
            // the alternative is to untranslate & unrotate after drawing
            static_context.save();

            // move to the center of the canvas
            static_context.translate(x, y);

            // rotate the canvas to the specified degrees
            static_context.rotate(degrees * Math.PI / 180);

            // draw the image
            // since the context is rotated, the image will be rotated also
            static_context.drawImage(image, -image.width / 2, -image.width / 2);

            // we’re done with the rotating so restore the unrotated context
            static_context.restore();
        }

        // var image = base_image


        // // save the unrotated context of the canvas so we can restore it later
        // // the alternative is to untranslate & unrotate after drawing
        // context.save();

        // // move to the center of the canvas
        // context.translate(x, y);

        // // rotate the canvas to the specified degrees
        // context.rotate(degrees * Math.PI / 180);

        // // draw the image
        // // since the context is rotated, the image will be rotated also
        // context.drawImage(image, -image.width / 2, -image.width / 2);

        // // we’re done with the rotating so restore the unrotated context
        // context.restore();

    };

    function drawPads() {
        [
            {
                item_key: 'Blue',
                image: `${process.env.NEXT_PUBLIC_CDN}games/Four%20Frogs/Pads/lilypad-blue.svg`,
                x_y_deg: [800 - 160, 0, 30]
            },
            {
                item_key: 'Green',
                image: `${process.env.NEXT_PUBLIC_CDN}games/Four%20Frogs/Pads/lilypad-green.svg`,
                x_y_deg: [0, 800 - 160, 225]
            },
            {
                item_key: 'Yellow',
                image: `${process.env.NEXT_PUBLIC_CDN}games/Four%20Frogs/Pads/lilypad-yellow.svg`,
                x_y_deg: [800 - 160, 800 - 160, 145]
            },
            {
                item_key: 'Red',
                image: `${process.env.NEXT_PUBLIC_CDN}games/Four%20Frogs/Pads/lilypad-red.svg`,
                x_y_deg: [0, 0, 320]
            }
        ].map(item => {
            console.log(`Draw ${item.item_key} pad`)
            drawRotated(item.x_y_deg[0], item.x_y_deg[1], item.x_y_deg[2], `${item.item_key}`, item.image);

        })
    }

    function drawZones() {

        // Random Powerup Zone
        static_context.fillStyle = 'rgba(0, 0, 0, .5)';
        static_context.fillRect(200, 200, 400, 400);

        // Red Zone
        static_context.fillStyle = 'rgba(255,105,97,.5)';
        static_context.fillRect(0, 0, 400, 400);

        // Blue Zone
        static_context.fillStyle = 'rgba(173,216,230,.5)';
        static_context.fillRect(400, 0, 400, 400);

        // Green Zone
        static_context.fillStyle = 'rgba(144,238,144,.5)';
        static_context.fillRect(0, 400, 400, 400);

        // Yellow Zone
        static_context.fillStyle = 'rgba(239,239,143,.5)';
        static_context.fillRect(400, 400, 400, 400);

    }

    // function make_base() {
    //     base_image = new Image();
    //     base_image.src = 'img/base.png';
    //     base_image.onload = function () {
    //         context.drawImage(base_image, 0, 0);
    //     }
    // }

    useEffect(() => {

        canvas = document.getElementById('canvas');
        context = canvas.getContext('2d');
        canvas.width = 800;
        canvas.height = 800;
        context.clearRect(0, 0, 800, 800);

        static_canvas = document.getElementById('static-canvas');
        static_context = static_canvas.getContext('2d');
        static_canvas.width = 800;
        static_canvas.height = 800;
        // context.clearRect(0, 0, 800, 800);

        let bug_test_image = new Image();
        bug_test_image.src = `${process.env.NEXT_PUBLIC_CDN}games/Four%20Frogs/Bugs/bug-1.png`;
        // bug_test_image.onload = function () {
        //     console.log("Image loaded")
        // }

        var saved_images = bugImages.map(item => {
            let bug_image = new Image();
            bug_image.src = item;
            return bug_image
            // bug_image.onload = function () {
            //     console.log("Bug loaded")                
            // }
        })

        drawPads()

        drawZones()

        socket.on(`game:four-frogs-room-${room}`, function (data) {

            console.log("Four Frogs Game State Update", data)
            context.clearRect(0, 0, 800, 800);

            setGameState(data.game_state)
            setBugs(data.game_state.bugs)
            setPlayers(data.players)

            if (data.game_state.timer <= 0) {
                console.log("OVER")

                // let sortedPlayers = [...data.players].sort( (a,b) => {
                //     return 
                // })

                let builtList = [

                ]

                data.game_state.insectTrack.map((track, index) => {

                    let playerIndexes = [
                        {
                            player_key: 'Red',
                        },
                        {
                            player_key: 'Blue',
                        },
                        {
                            player_key: 'Green',
                        },
                        {
                            player_key: 'Yellow',
                        }
                    ]

                    let playerColor = playerIndexes[index].player_key
                    let playerLookup = data.players.find(player_obj => player_obj.fourFrogs.zone == playerColor.toLowerCase())

                    builtList.push({
                        ...playerLookup,
                        bugs: track
                    })

                })

                // Set scoreboard, most bugs and alive on top
                setScoreboard(prev => ({
                    ...prev,
                    list: [
                        ...builtList
                        // {
                        //     color: 'Red',
                        //     bugs: 5,
                        //     health: '5/5'
                        // },
                        // {
                        //     color: 'Blue',
                        //     bugs: 3,
                        //     health: '2/5'
                        // },
                        // {
                        //     color: 'Green',
                        //     bugs: 1,
                        //     health: '1/5'
                        // },
                        // {
                        //     color: 'Yellow',
                        //     bugs: 0,
                        //     health: '0/5'
                        // }
                    ]
                }))

                // setShowGameOverModal(true)

                if (showGameOverModal !== true) {
                    setShowGameOverModal(true)
                }

            }

            // Draw PLayers
            data.players.map(server_player_obj => {

                // console.log(server_player_obj)
                // return

                if (!server_player_obj?.fourFrogs) {
                    // No server data on user yet
                    return
                }

                var player = server_player_obj?.fourFrogs;

                var playerSize = 40;
                var draw = 'square';

                switch (player.powerup) {
                    case 'Tough Guy':
                        var playerSize = 60;
                        context.font = "10px Arial";
                        context.fillStyle = "#000";
                        context.textAlign = "center";
                        context.fillText(`Tough Guy - ${player?.powerup_timer || 0}`, player.x + playerSize / 2, player.y + 70);
                        break;
                    case 'Muddy Water':
                        context.font = "10px Arial";
                        context.fillStyle = "#000";
                        context.textAlign = "center";
                        context.fillText(`Muddy Water - ${player?.powerup_timer || 0}`, player.x + playerSize / 2, player.y + 55);

                        let muddyWaterZoneLookup = muddyWaterZones.find(obj => obj.zone == player.homeZone)

                        context.fillStyle = 'rgba(129, 77, 35, 0.5)';
                        context.fillRect(muddyWaterZoneLookup.x, muddyWaterZoneLookup.y, 300, 300);

                        player.color = "#964"
                        break;
                    case 'Stinky Frog':
                        context.font = "10px Arial";
                        context.fillStyle = "#000";
                        context.textAlign = "center";
                        context.fillText(`Stinky Frog - ${player?.powerup_timer || 0}`, player.x + playerSize / 2, player.y + 55);
                        context.fillStyle = 'rgba(129, 77, 35, 0.5)';
                        context.fillRect(player.x - playerSize * 1.5, player.y - playerSize * 1.5, playerSize * 4, playerSize * 4);
                        player.color = "#bbb"

                        // var img = document.getElementById("stink");
                        // context.drawImage(img, player.x, player.y - playerSize, 40, 40);
                        break;
                    case 4:
                        var draw = 'circle';
                        context.font = "10px Arial";
                        context.fillStyle = "#000";
                        context.textAlign = "center";
                        context.fillText(`Sphere - ${player?.powerup_timer || 0}`, player.x + playerSize / 2, player.y + 55);
                        break;
                }

                // Circle (Original)
                context.beginPath();
                context.fillStyle = (player?.color || 'Red');

                if (draw === 'square') {
                    context.fillRect(player.x, player.y, playerSize, playerSize);
                } else if (draw === 'circle') {
                    context.save();
                    // Move to the center of the canvas
                    context.translate(playerSize / 2, playerSize / 2);
                    context.arc(player.x, player.y, 25, 0, 2 * Math.PI);
                    context.fill();
                    context.restore();
                }

                // Left Eye
                context.beginPath();
                context.fillStyle = "#000";
                context.fillRect(player.x + 2.5, player.y + 2.5, 10, 10);
                context.fill();

                // Right Eye
                context.beginPath();
                context.fillStyle = "#000";
                context.fillRect(player.x + playerSize - 12.5, player.y + 2.5, 10, 10);
                context.fill();

                // Mouth
                context.beginPath();
                context.fillStyle = "#000";
                context.fillRect(player.x + 5, player.y + 20, playerSize - 10, playerSize / 4);
                context.fill();

                // Tongue
                context.beginPath();
                context.fillStyle = "#FFC0CB";

                if (player.drop == false) {
                    context.fillRect(player.x + 10, player.y + (playerSize / 4 + 15), playerSize - 20, playerSize / 6);
                } else {
                    context.fillRect(player.x + 10, player.y + (playerSize / 4 + 15), playerSize - 20, playerSize / 2);
                }
                context.fill();

                // Held Bugs
                if (player.holding.length == 1) {
                    player.holding.map(bug_index => {
                        context.beginPath();
                        context.drawImage(saved_images[data.game_state.bugs[bug_index] ? (data.game_state.bugs[bug_index]?.bugType - 1) : 0], player.x + 5, player.y + playerSize - 10, 30, 30);
                        context.fill();
                    })
                }

                if (player.holding.length > 1) {
                    player.holding.map((bug_index, holding_index) => {
                        context.beginPath();
                        context.drawImage(saved_images[data.game_state.bugs[bug_index]?.bugType - 1], ((player.x - 10) + holding_index * 20), player.y + playerSize - 20, 30, 30);
                        context.fill();
                    })
                }

                context.font = "10px Arial";
                context.fillStyle = "#000";
                context.textAlign = "center";

                // var playerNickname = player.nickname;
                // context.fillText(player.nickname, player.x + (playerSize / 2), player.y - 5);

                context.fillText(player.nickname, player.x + (playerSize / 2), player.y - 5);


            })

            // Draw Bugs
            data.game_state.bugs.map(server_bug_obj => {

                if (!server_bug_obj || server_bug_obj.heldBy) {
                    // No server data on bug yet
                    // Bugs being held get rendered with the user carrying it
                    return
                }

                var bug = server_bug_obj;

                var bugSize = 40;
                var draw = 'square';

                // Circle (Original)
                context.beginPath();
                context.fillStyle = (getColorWithOpacity(bug.color, 50));

                if (draw === 'square') {

                    // console.log(saved_images)

                    context.fillRect(bug.x, bug.y, bugSize, bugSize);
                    // context.drawImage(bug_test_image, server_bug_obj.x, server_bug_obj.y, 40, 40);
                    context.drawImage(saved_images[server_bug_obj.bugType - 1], server_bug_obj.x, server_bug_obj.y, 40, 40);

                    // static_context.drawImage(image, -image.width / 2, -image.width / 2);

                } else if (draw === 'circle') {
                    context.save();
                    // Move to the center of the canvas
                    context.translate(playerSize / 2, bugSize / 2);
                    context.arc(bug.x, bug.y, 25, 0, 2 * Math.PI);
                    context.fill();
                    context.restore();
                }
            })

            // Draw Active Powerups
            data.game_state.powerups.active.map(server_powerup_obj => {

                context.drawImage(powerup_image, server_powerup_obj.x, server_powerup_obj.y, 40, 40);

                context.font = "12px Arial";
                context.fillStyle = "#000";
                context.textAlign = "center";
                context.fillText(server_powerup_obj.name, server_powerup_obj.x + 20, server_powerup_obj.y - 10);

            })

            // Old active powerups, need to get health working again
            if (data.game_state.powerups.active.active === true && data.game_state.powerups.active.id === 5) {
                // Health is disabled for now...
                // var img = document.getElementById( "health" );
                // context.drawImage(img, powerups.active.x-20, 400-20, 40, 40);
            } else if (data.game_state.powerups.active.active === true && data.game_state.powerups.active.id != 5) {

                return

                // var img = document.getElementById("powerup-1");
                context.drawImage(powerup_image, data.game_state.powerups.active.x - 20, data.game_state.powerups.active.y - 20, 40, 40);

                context.font = "12px Arial";
                context.fillStyle = "#000";
                context.textAlign = "center";
                context.fillText(data.game_state.powerups.active.id, data.game_state.powerups.active.x - 0, data.game_state.powerups.active.y - 25);
            };

            return

            console.log(bugs);

            var keyNames = Object.keys(players);

            context.clearRect(0, 0, 800, 800);

            // Red Zone
            context.fillStyle = 'rgba(255,105,97,.5)';
            context.fillRect(0, 0, 400, 400);

            // IDK
            context.fillStyle = 'rgba(173,216,230,.5)';
            context.fillRect(400, 0, 400, 400);

            // IDK
            context.fillStyle = 'rgba(144,238,144,.5)';
            context.fillRect(0, 400, 400, 400);

            // IDK
            context.fillStyle = 'rgba(239,239,143,.5)';
            context.fillRect(400, 400, 400, 400);

            // Random Powerup Zone
            context.fillStyle = 'rgba(0, 0, 0, .5)';
            context.fillRect(200, 200, 400, 400);

            // if (powerups.active.id === 4 ) {

            //   try {
            //     if (players[keyNames[0]].powerup === 4) {
            //       context.fillStyle='rgba(255,105,97,.5)'; 
            //       context.fillRect(0, 0, 450, 450);
            //     } else if (players[keyNames[1]].powerup === 4) {
            //       context.fillStyle='rgba(173,216,230,.5)';
            //       context.fillRect(400, 0, 350, 450);
            //     } else if (players[keyNames[2]].powerup === 4) {
            //       context.fillStyle='rgba(144,238,144,.5)'; 
            //       context.fillRect(0, 400, 450, 350);
            //     } else if (players[keyNames[3]].powerup === 4) {
            //       context.fillStyle='rgba(239,239,143,.5)'; 
            //       context.fillRect(400, 400, 350, 350);
            //     }
            //   }
            //   catch(err) {

            //   }

            // }

            for (var id in players) {
                var player = players[id];

                var playerSize = 40;
                var draw = 'square';

                switch (player.powerup) {
                    case 'Tough Guy':
                        var playerSize = 60;
                        context.font = "10px Arial";
                        context.fillStyle = "#000";
                        context.textAlign = "center";
                        context.fillText('Tough Guy', player.x + playerSize / 2, player.y + 70);
                        break;
                    case 'Muddy Water':
                        context.font = "10px Arial";
                        context.fillStyle = "#000";
                        context.textAlign = "center";
                        context.fillText('Muddy Water', player.x + playerSize / 2, player.y + 55);
                        player.color = "#964"
                        break;
                    case 'Stinky Frog':
                        context.font = "10px Arial";
                        context.fillStyle = "#000";
                        context.textAlign = "center";
                        context.fillText('Stinky Frog', player.x + playerSize / 2, player.y + 55);

                        player.color = "#bbb"

                        var img = document.getElementById("stink");
                        context.drawImage(img, player.x, player.y - playerSize, 40, 40);
                        break;
                    case 4:
                        var draw = 'circle';
                        context.font = "10px Arial";
                        context.fillStyle = "#000";
                        context.textAlign = "center";
                        context.fillText('Sphere', player.x + playerSize / 2, player.y + 55);
                        break;
                }

                // Visual Perk Over rides
                // if (player.powerup === 0 ) {
                //   var playerSize = 60;
                //   context.font = "10px Arial";
                //   context.fillStyle = "#000";
                //   context.fillText('Tough Guy', player.x, player.y + 90);
                // }

                // if (player.powerup === 1) {
                //   console.log('Player detected with Muddy Water')
                //   context.font = "10px Arial";
                //   context.fillStyle = "#000";
                //   context.fillText('Muddy Water', player.x, player.y + 50);
                // }

                // if (player.powerup === 4) {
                //   var draw = 'circle';
                //   context.font = "10px Arial";
                //   context.fillStyle = "#000";
                //   context.fillText('Sphere', player.x, player.y + 50);
                // }

                // Circle (Original)
                context.beginPath();
                context.fillStyle = player.color;

                if (draw === 'square') {
                    context.fillRect(player.x, player.y, playerSize, playerSize);
                } else if (draw === 'circle') {
                    context.save();
                    // Move to the center of the canvas
                    context.translate(playerSize / 2, playerSize / 2);
                    context.arc(player.x, player.y, 25, 0, 2 * Math.PI);
                    context.fill();
                    context.restore();
                }

                // Left Eye
                context.beginPath();
                context.fillStyle = "#000";
                context.fillRect(player.x + 2.5, player.y + 2.5, 10, 10);
                context.fill();

                // Right Eye
                context.beginPath();
                context.fillStyle = "#000";
                context.fillRect(player.x + playerSize - 12.5, player.y + 2.5, 10, 10);
                context.fill();

                // Mouth
                context.beginPath();
                context.fillStyle = "#000";
                context.fillRect(player.x + 5, player.y + 20, playerSize - 10, playerSize / 4);
                context.fill();

                // Tongue
                context.beginPath();
                context.fillStyle = "#FFC0CB";

                if (player.tongue == false) {
                    context.fillRect(player.x + 10, player.y + (playerSize / 4 + 15), playerSize - 20, playerSize / 6);
                } else {
                    context.fillRect(player.x + 10, player.y + (playerSize / 4 + 15), playerSize - 20, playerSize / 2);
                }

                context.fill();

                context.font = "10px Arial";
                context.fillStyle = "#000";
                context.textAlign = "center";
                // var playerNickname = player.nickname;
                context.fillText(player.nickname, player.x + (playerSize / 2), player.y - 5);

            }

            if (powerups.active.active === true && powerups.active.id === 5) {
                // Health is disabled for now...
                // var img = document.getElementById( "health" );
                // context.drawImage(img, powerups.active.x-20, 400-20, 40, 40);
            } else if (powerups.active.active === true && powerups.active.id != 5) {
                var img = document.getElementById("powerup-1");
                context.drawImage(img, powerups.active.x - 20, powerups.active.y - 20, 40, 40);
            };

            // if (powerups.active.active === true) {
            //   var img = document.getElementById( "powerup" );
            //   context.drawImage(img, 400-20, 400-20, 40, 40);
            // };

            // context.font = "10px Arial";
            // context.fillStyle = "#000";
            // context.fillText( "Tough Guy", 305, 275 - 5 );
            // var img = document.getElementById( "powerup-1" );
            // context.drawImage(img, 305, 275, 50, 50);

            for (i = 0; i < bugs.length; i++) {
                var img = document.getElementById("bug-" + bugs[i].bugType);
                context.drawImage(img, bugs[i].x, bugs[i].y, 50, 50);
                // var player = i;
                // document.getElementById('bug-' + (i + 1) +'-info').innerHTML = 'X:' + bugs[i].x + ' Y:' + bugs[i].y + ' Holder:' + bugs[i].heldBy + ' Pad:' + bugs[i].pad;
            }

            minutes = parseInt(timer / 60, 10)
            seconds = parseInt(timer % 60, 10);

            // Place a 0 back in quotes to float zeros.
            minutes = minutes < 10 ? "" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            document.getElementById('time_left').innerHTML = minutes + ":" + seconds;

            document.getElementById('powerup_next').innerHTML = (`${timer - powerups.powerup_next}`);

            // If game time is 0 seconds then game is over and we can display the leaderboard now
            if (timer < 0) {
                $('.scoreboard-container').removeClass('d-none');
            }

            // Logging bugs info to debug info
            document.getElementById('bug-info').innerHTML = '';
            bugs.forEach((bug, i) => {
                var bugDiv = document.getElementById("bug-info");
                bugDiv.appendChild(document.createTextNode(`Bug ${i + 1} | X: ${bug.x} Y: ${bug.y} | Holder: ${bug.heldBy} | Pad: ${bug.pad}`));
                bugDiv.appendChild(document.createElement("br"));
            });

            // Logging powerups info to debug info
            document.getElementById('powerup-info').innerHTML = '';
            powerups_schedule.forEach((powerup, i) => {
                var powerupDiv = document.getElementById("powerup-info");
                powerupDiv.appendChild(document.createTextNode(`Powerup ${i + 1} | ${powerup.time}s | Perk: ${powerup.id}`));
                powerupDiv.appendChild(document.createElement("br"));
            });

            // var array = powerups_schedule;
            // console.log( findClosest(timer) );

            // Closset powerup time
            // function findClosest (value) {
            //   // By default that will be a big number
            //   var closestValue = Infinity;
            //   // We will store the index of the element
            //   var closestIndex = -1;
            //   for (var i = 0; i < array.length; ++i) {
            //     var diff = Math.abs(array[i].time - value);
            //     if (diff < closestValue) {
            //       closestValue = diff;
            //       closestIndex = i;
            //     }
            //   }
            //   return closestIndex;
            // }

            for (i = 0; i < insectTrack.length; i++) {

                document.getElementById('list-1').innerHTML = '';
                for (j = 0; j < insectTrack[0].length; j++) {
                    if (j != undefined || null) {
                        document.getElementById('list-1').innerHTML = document.getElementById('list-1').innerHTML.concat(' ' + insectTrack[0][j]);
                        // document.getElementById('list-1').innerHTML = document.getElementById('list-1').innerHTML.concat(' ' + '<img src="assets/img/bug-' + insectTrack[0][j] + '.png" width="20">');
                    }
                }

                document.getElementById('list-2').innerHTML = '';
                for (j = 0; j < insectTrack[1].length; j++) {
                    if (j != undefined || null) {
                        document.getElementById('list-2').innerHTML = document.getElementById('list-2').innerHTML.concat(' ' + insectTrack[1][j]);
                        // document.getElementById('list-2').innerHTML = document.getElementById('list-2').innerHTML.concat(' ' + '<img src="assets/img/bug-' + insectTrack[1][j] + '.png" width="20">');
                    }
                }

                document.getElementById('list-3').innerHTML = '';
                for (j = 0; j < insectTrack[2].length; j++) {
                    if (j != undefined || null) {
                        document.getElementById('list-3').innerHTML = document.getElementById('list-3').innerHTML.concat(' ' + insectTrack[2][j]);
                        // document.getElementById('list-3').innerHTML = document.getElementById('list-3').innerHTML.concat(' ' + '<img src="assets/img/bug-' + insectTrack[2][j] + '.png" width="20">');
                    }
                }

                document.getElementById('list-4').innerHTML = '';
                for (j = 0; j < insectTrack[3].length; j++) {
                    if (j != undefined || null) {
                        document.getElementById('list-4').innerHTML = document.getElementById('list-4').innerHTML.concat(' ' + insectTrack[3][j]);
                        // document.getElementById('list-4').innerHTML = document.getElementById('list-4').innerHTML.concat(' ' + '<img src="assets/img/bug-' + insectTrack[3][j] + '.png" width="20">');
                    }
                }

            }

            // document.getElementById('list-1').innerHTML= '<img id="bug-1" src="assets/img/bug-1.png" width="20">';

            try {
                stats_1.innerHTML = 'P: ' + players[keyNames[0]].powerup + ' X:' + players[keyNames[0]].x + ' Y: ' + players[keyNames[0]].y + ' R:' + players[keyNames[0]].r + ' Score:' + players[keyNames[0]].score + ' Hold:' + players[keyNames[0]].canHold + '<br>Zone:' + players[keyNames[0]].zone + ' Holding:' + players[keyNames[0]].holding + ' Tongue:' + players[keyNames[0]].tongue;
                document.getElementById('redHealth').innerHTML = players[keyNames[0]].health;
                stats_2.innerHTML = 'X:' + players[keyNames[1]].x + ' Y: ' + players[keyNames[1]].y + ' R:' + players[keyNames[1]].r + ' Score:' + players[keyNames[1]].score + '<br>Zone:' + players[keyNames[1]].zone + ' Holding:' + players[keyNames[1]].holding;
                document.getElementById('blueHealth').innerHTML = players[keyNames[1]].health;
                stats_3.innerHTML = 'X:' + players[keyNames[2]].x + ' Y: ' + players[keyNames[2]].y + ' R:' + players[keyNames[2]].r + ' Score:' + players[keyNames[2]].score + '<br>Zone:' + players[keyNames[2]].zone + ' Holding:' + players[keyNames[2]].holding;
                document.getElementById('greenHealth').innerHTML = players[keyNames[2]].health;
                stats_4.innerHTML = 'X:' + players[keyNames[3]].x + ' Y: ' + players[keyNames[3]].y + ' R:' + players[keyNames[3]].r + ' Score:' + players[keyNames[3]].score + '<br>Zone:' + players[keyNames[3]].zone + ' Holding:' + players[keyNames[3]].holding;
                document.getElementById('yellowHealth').innerHTML = players[keyNames[3]].health;
            }
            catch (err) {
                // console.log("Lobby not full yet");
            }

        });

    }, [room]);

    useEffect(() => {
        console.log("moveUp", moveUp)
    }, [moveUp]);

    useEffect(() => {
        console.log("moveDown", moveDown)
    }, [moveDown]);

    useEffect(() => {

        console.log("drop", drop)

        if (socket) {

            socket.emit('four-frogs-player-movement', {
                room, moveDown, moveUp, moveRight, moveLeft, drop
            });

        }

    }, [socket, drop]);

    useEffect(() => {

        if (!room || !socket) return;

        const handleGamepadInput = () => {
            const gamepad = navigator.getGamepads()[0]; // Assuming only one controller is connected

            if (gamepad) {

                setControllerState(gamepad);

                let directions = getDirections(gamepad.axes);
                let buttons = getDirections(gamepad.buttons);

                let dropPressed

                gamepad.buttons.forEach((button, index) => {
                    if (button.pressed && index == 0) {
                        dropPressed = true
                        // console.log(`Pressed: Button ${index}`);
                    }
                });

                if (isMoving(directions) || dropPressed) {
                    console.log("Emit movement shit!");

                    socket.emit('four-frogs-player-movement', {
                        room,
                        ...(directions.down && { moveDown: directions.down }),
                        ...(directions.up && { moveUp: directions.up }),
                        ...(directions.right && { moveRight: directions.right }),
                        ...(directions.left && { moveLeft: directions.left }),
                        drop: dropPressed,
                    });
                }
            }
        };

        // Start the monitoring loop with an interval
        const intervalId = setInterval(handleGamepadInput, 1000 / 30);

        return () => {
            // Stop the monitoring loop when the component is unmounted
            clearInterval(intervalId);
        };

    }, [room, socket, drop]);

    useEffect(() => {

        let movementEmit;

        if (socket) {

            movementEmit = setInterval(function () {

                if (moveDown || moveUp || moveRight || moveLeft) {
                    socket.emit('four-frogs-player-movement', {
                        room,
                        ...(moveDown && { moveDown }),
                        ...(moveUp && { moveUp }),
                        ...(moveRight && { moveRight }),
                        ...(moveLeft && { moveLeft }),
                        ...(drop && { drop }),
                    });
                }

            }, 1000 / 30);

        }

        return () => {
            clearInterval(movementEmit)
        }

    }, [socket, moveDown, moveUp, moveRight, moveLeft, drop]);

    const [ isMounted, setIsMounted ] = useState(false)

    useEffect(() => {

        return () => {

            if (!room || !isMounted) return

            console.log("Unmounted?", isMounted, room)

            socket.off(`game:four-frogs-room-${room}`);

            // socket.off('race-game-round-timer');

            socket.emit('leave-room', `game:four-frogs-room-${room}`, {
                client_version: '1',
                game_id: room
            });
            
        }

    }, [isMounted]);

    useEffect(() => {

        setIsMounted(true)

        powerup_image = new Image();
        powerup_image.src = `${process.env.NEXT_PUBLIC_CDN}games/Four%20Frogs/Powerups/powerup.jpg`;

        // socket.on(`four-frogs-player-chat`, function (data) {

        //     console.log("Four Frogs new chat message", data)

        //     if (data.data.socket_id !== socket?.id) {

        //         let message = {
        //             ...data.data
        //             // message: chatMessage,
        //             // date: new Date(),
        //             // color: players?.find(player => player.id == socket?.id)?.fourFrogs?.homeZone,
        //         }

        //         setChatMessages(prev => ([
        //             ...prev,
        //             message
        //         ]))

        //         setInterval(
        //             scrollToBottomOfChatMessages,
        //             1000
        //         );

        //     }

        // });

        // return () => {

        //     socket.off(`four-frogs-player-chat`);

        // }

    }, []);

    const [ joinAttempt, setJoinAttempt ] = useState(false)

    useEffect(() => {

        // let movementEmit;

        if (room && socket && !joinAttempt && isMounted) {

            console.log("Client trying to join room")

            setJoinAttempt(true)

            socket.emit('join-room', `game:four-frogs-room-${room}`, {
                game_id: room,
                nickname: JSON.parse(localStorage.getItem('game:nickname')),
                client_version: '1',
                config: {
                    powerups: [
                        // If creating a private game then pass game config
                        // ...powerups
                    ]
                }
            });

            // movementEmit = setInterval(function () {

            //     socket.emit('four-frogs-player-movement', {
            //         moveDown, moveUp, moveRight, moveLeft
            //     });

            // }, 1000 / 30);

        }

        // drawPads()



        return () => {

            // if (socket) {
            //     socket.emit('leave-room', 'game:four-frogs');
            // }

            // console.log("movementEmit clear interval")
            // clearInterval(movementEmit)
        }

    }, [socket, joinAttempt, isMounted]);

    const { isFullscreen, requestFullscreen, exitFullscreen } = useFullscreen();

    // const [showChat, setShowChat] = useState(false)

    // const [chatMessages, setChatMessages] = useState([])
    // const [chatMessage, setChatMessage] = useState('')

    // const scrollToBottomOfChatMessages = () => {
    //     if (chatMessagesRef.current) {
    //         chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    //     }
    // };

    useHotkeys('v', (event) => {

        if (renderMode == '2D') setRenderMode("3D")
        if (renderMode == '3D') setRenderMode("2D")

    });

    const [cameraShakeEnabled, setCameraShakeEnabled] = useState(false)

    const [showControllerState, setShowControllerState] = useState(false)
    const [controllerState, setControllerState] = useState(null);

    const [showMenu, setShowMenu] = useState(false)

    const [touchControlsEnabled, setTouchControlsEnabled] = useLocalStorageNew("game:touchControlsEnabled", false)

    let panelProps = {
        room,
        gameState,
        players,
        touchControlsEnabled,
        setTouchControlsEnabled,
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
        setShowInviteModal,
    }

    return (

        <div className={`four-frogs-game-page ${isFullscreen && 'fullscreen'}`} id='four-frogs-game-page'>

            {showGameOverModal &&
                <ArticlesModal
                    show={showGameOverModal}
                    setShow={setShowGameOverModal}
                    title="Game Over"
                    disableClose={true}
                    action={() => {
                        router.push('')
                    }}
                    actionText={'Exit Game'}
                >

                    {/* {[...gameState.insectTrack]
                        .sort((a, b) => b.length - a.length)
                        .map((track, index) => {

                            return (
                                <div key={index}>
                                    <div>Player {index + 1}</div>
                                    {JSON.stringify(track)}
                                </div>
                            )

                        })} */}

                    {
                        [...scoreboard.list]
                            .sort((a, b) => b.bugs.length - a.bugs.length)
                            .map((item, i) =>
                                <div key={i} className={`${(i + 1) < scoreboard.list.length && 'mb-4'}`}>

                                    <div>
                                        <div className="small">
                                            {ordinal_suffix_of(i + 1)} Place | <span style={{ textTransform: 'capitalize' }}>{item?.fourFrogs?.homeZone}</span> Frog
                                        </div>
                                    </div>

                                    <div style={{ fontSize: '1.5rem' }}>
                                        {item?.fourFrogs?.nickname || item?.fourFrogs?.homeZone || "?"} - {item.bugs.length} Bugs - {item?.fourFrogs?.health || 0} Health
                                    </div>

                                </div>
                            )}


                    {/* <hr /> */}

                    {/* <div className='d-flex justify-content-center text-center'>
                        <a href='https://articles.media' target="_blank" rel="noreferrer" className='w-100'>
                            <NextImage
                                priority
                                width={60}
                                height={60}
                                src={`${ process.env.NEXT_PUBLIC_CDN }profile_photos / starter / articles.jpg`}
                                alt="Articles Media Logo"
                                className='mb-2'
                            />
                            <div>
                                Visit Articles Media
                            </div>
                        </a>

                    </div> */}

                </ArticlesModal>
            }

            {showInfoModal &&
                <InfoModal
                    show={showInfoModal}
                    setShow={setShowInfoModal}
                />
            }

            {showSettingsModal &&
                <SettingsModal
                    show={showSettingsModal}
                    setShow={setShowSettingsModal}
                />
            }

            {showInviteModal &&
                <InviteModal
                    show={showInviteModal}
                    setShow={setShowInviteModal}
                />
            }

            <div className="background">
                <NextImage
                    src={`${process.env.NEXT_PUBLIC_CDN}games/Four%20Frogs/background.jpg`}
                    alt=""
                    fill
                    style={{ objectFit: 'cover' }}
                />
            </div>

            <div className="mobile-menu-wrap">

                <div className="menu-bar card card-articles p-1 justify-content-center">
                    <div>
                        <ArticlesButton
                            small
                            active={showMenu}
                            onClick={() => {
                                setShowMenu(prev => !prev)
                            }}
                        >
                            <i className="fad fa-bars"></i>
                            <span>Menu</span>
                        </ArticlesButton>
                    </div>
                </div>

                <div
                    className={`mobile-menu panel ${showMenu && 'show'}`}
                >

                    <div
                        className="menu-background"
                        style={{
                            backgroundImage: `url(${`${process.env.NEXT_PUBLIC_CDN}games/Four%20Frogs/bark.jpg`})`,
                            opacity: 0.5
                        }}
                    ></div>

                    <LeftPanelContent
                        {...panelProps}
                    />

                </div>

            </div>

            <TouchControls
                touchControlsEnabled={touchControlsEnabled}
            />

            <div className='mobile-players-info card'>
                <RightPanelContent
                    {...{
                        gameState,
                        players,
                        bugs,
                        debugTab,
                        setDebugTab,
                        devDebugPanel,
                        setDevDebugPanel
                    }}
                />
            </div>

            <div className='game-panel'>
                <div className='ratio ratio-1x1 canvas-container'>

                    <div className={`${renderMode == '3D' && 'd-none'}`}>
                        <canvas id="static-canvas"></canvas>
                        <canvas id="canvas"></canvas>
                    </div>

                    <div className={`${renderMode == '2D' && 'd-none'}`}>
                        {renderMode == '3D' &&
                            <GameCanvas
                                bugs={bugs}
                                players={players}
                                gameState={gameState}
                                cameraShakeEnabled={cameraShakeEnabled}
                            />
                        }
                    </div>

                </div>
            </div>

            {/* Left Panel */}
            <div
                className="panel panel-left d-none d-lg-flex"
                style={{ 
                    background: `url(${`${process.env.NEXT_PUBLIC_CDN}games/Four%20Frogs/bark.jpg`})`
                }}
            >

                <LeftPanelContent
                    {...panelProps}
                />

            </div>

            {/* Right Panel */}
            <div
                className="panel panel-right d-none d-lg-flex"
                style={{ background: `url(${`${process.env.NEXT_PUBLIC_CDN}games/Four%20Frogs/bark.jpg`})`}}
            >

                <RightPanelContent
                    {...{
                        gameState,
                        players,
                        bugs,
                        debugTab,
                        setDebugTab,
                        devDebugPanel,
                        setDevDebugPanel
                    }}
                />

            </div >

            {/* <div className="container">

                <div className="card card-articles mx-auto" style={{ "width": "max-content" }}>

                    <div className="card-body">
                        
                    </div>

                </div>

            </div> */}

        </div >
    );
}