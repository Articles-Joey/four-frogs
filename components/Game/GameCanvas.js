import { memo, Suspense, useEffect, useState } from 'react';

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Sky, CameraShake, Stats } from '@react-three/drei'

import Tree from '@/components/Game/Tree'

import { useHotkeys } from 'react-hotkeys-hook';
import GrassPlane from '@/components/Game/Ground';
import Bug from '@/components/Game/Bug';
import Player from '@/components/Game/Player';
import Pad from '@/components/Game/Pad';
import Powerup from './Powerup';
import Zone from '@/components/Game/Zone';
import Ocean from './Ocean';
import { Sunflower } from '@/components/Game/Sunflower';
import { OrangeFlower } from '@/components/Game/OrangeFlower';
import { useStore } from '@/hooks/useStore';
import { useGameStore } from '@/hooks/useGameStore';
import SandDune from './SandDune';
import Trees from './Trees';
import GrassBlades from './GrassBlades';

// import Center from './Center';
// import Spinner from './Spinner';
// import OutsideWalls from './OutsideWalls';
// import CenterWalls from './CenterWalls';
// import SectionWalls from './SectionWalls';
// import Seat from './Seat';

function angle(num) {
    return num * Math.PI / 180
}

// const flowerGroups = [
//     { type: <Sunflower/>, position: [0, 0, 0] },
//     { type: <OrangeFlower/>, position: [0, 0, 0] },
// ];

// const createFlowerGroup = (type, position) => (
//     <group scale={20} position={position}>
//         {Array.from({ length: 10 }).map((_, index) => (
//             createElement(type, { key: index, position: [0, index * 50, 0] })
//         ))}
//     </group>
// );

function GameCanvas({
    landingAnimationMode = false
}) {

    const gameState = useGameStore((state) => state.gameState);
    const players = useGameStore((state) => state.gameState.players);
    const bugs = useGameStore((state) => state.gameState.bugs);

    const cameraShakeEnabled = useStore((state) => state.cameraShakeEnabled);
    const showStats = useStore((state) => state?.debugConfig?.showStats);
    const darkMode = useStore((state) => state.darkMode);

    const [reload, setReload] = useState(false)

    const [showGrid, setShowGrid] = useState(false)

    useEffect(() => {

        if (reload) {
            setReload(false)
        }

    }, [reload])

    useHotkeys('2', () => {
        console.log("2 is used to reload game for Dev debugging")
        setReload(true)
    });

    useHotkeys('g', () => {
        setShowGrid(prev => !prev)
    });

    return (
        <>
            {!reload &&
                <Canvas camera={{ position: [0, 200, 200], fov: 50 }}>

                    {showStats && <>
                        <Stats className="stats-overlay" />
                    </>}

                    {darkMode ?
                        <>
                            {/* <hemisphereLight color="white" groundColor="white" intensity={.8} /> */}

                            <ambientLight intensity={0.7} />

                            {/* <spotLight position={[10, 200, 10]} angle={0.5} intensity={15000} penumbra={1} color={'white'} /> */}

                            <Sky
                                // distance={450000}
                                sunPosition={[100, -1, 100]}
                                inclination={0.5}
                                azimuth={0.25}
                            />
                            
                        </>
                        :
                        <>
                            <hemisphereLight color="white" groundColor="white" intensity={1.2} />

                            <ambientLight intensity={1} />

                            <spotLight position={[10, 200, 10]} angle={0.5} intensity={15000} penumbra={1} color={'white'} />

                            <Sky
                                // distance={450000}
                                sunPosition={[100, 200, 100]}
                                inclination={0.5}
                                azimuth={0.25}
                            />
                        </>
                    }

                    {showGrid &&
                        <>
                            <gridHelper
                                args={[100, 100, 0xff0000, 'teal']}
                                position={[0, 1, 0]}
                            />
                            <axesHelper scale={30} args={[5]} />
                        </>
                    }

                    <Suspense>
                        <SandDune innerSquare={87} outerSquare={150} height={5} segments={150} />
                    </Suspense>

                    <Suspense>
                        <GrassBlades />
                    </Suspense>

                    <Suspense>
                        <Trees
                            innerSquare={200}
                            outerSquare={400}
                            count={80}
                        // TreeComponent={MyCustomTree} <-- optional override
                        />
                    </Suspense>

                    <Suspense>
                        <group scale={0.25}>

                            <group scale={2}>
                                <GrassPlane
                                    rotation={[-Math.PI / 2, 0, 0]}
                                    position={[0, -1, 0]}
                                    width={1000 * 2}
                                    height={1000 * 2}
                                />
                            </group>

                            <group scale={20} position={[-420, 15, -400]}>

                                {[...Array(9)].map((item, i) => {
                                    return (
                                        <OrangeFlower
                                            key={i}
                                            position={[0, 0, (i * 5)]}
                                        />
                                    )
                                })}

                            </group>

                            <group scale={20} position={[420, 15, -400]}>

                                {[...Array(9)].map((item, i) => {
                                    return (
                                        <Sunflower
                                            key={i}
                                            position={[0, 0, (i * 5)]}
                                        />
                                    )
                                })}

                            </group>

                            {/* Bowl - Front Back  */}
                            {/* <GrassPlane rotation={[-Math.PI / 3, 0, 0]} position={[0, -1, -400]} />
                            <GrassPlane rotation={[-Math.PI / 1.5, 0, 0]} position={[0, -1, 400]} /> */}

                            {/* Bowl - Left Right */}
                            {/* <GrassPlane rotation={[-Math.PI / 2, -Math.PI / 4, Math.PI / 2]} position={[400, -1, 0]} />
                            <GrassPlane rotation={[-Math.PI / 2, Math.PI / 4, Math.PI / 2]} position={[-400, -1, 0]} /> */}

                            <group position={[200, 0, 200]}>
                                <Ocean position={[-200, -1, -200]} />
                            </group>

                            {/* Zones */}
                            <group position={[-200, 1, -200]}>
                                <Zone color='red' position={[0, 0, 0]} />
                                <Zone color='blue' position={[400, 0, 0]} />
                                <Zone color='green' position={[0, 0, 400]} />
                                <Zone color='yellow' position={[400, 0, 400]} />
                            </group>

                            {/* Pads */}
                            <group position={[-300, 1.25, -300]}>

                                <Pad
                                    position={[0, 0, 0]}
                                    // rotation={[-Math.PI / 2, 0, Math.PI / 4.5]}
                                    color={'Red'}
                                />

                                <Pad
                                    position={[600, 0, 0]}
                                    // rotation={[-Math.PI / 2, 0, -Math.PI / 4.5]}
                                    color={'Blue'}
                                />

                                <Pad
                                    position={[0, 0, 600]}
                                    // rotation={[-Math.PI / 2, 0, Math.PI / 1.3]}
                                    color={'Green'}
                                />

                                <Pad
                                    position={[600, 0, 600]}
                                    // rotation={[-Math.PI / 2, 0, -Math.PI / 1.3]}
                                    color={'Yellow'}
                                />

                            </group>

                            {/* Players */}
                            <group position={[-400 + 25, 26, -400 + 25]}>

                                {players?.map((server_player_obj, bug_index) => {

                                    var player = server_player_obj?.fourFrogs;

                                    if (!server_player_obj || server_player_obj.heldBy) {
                                        // No server data on bug yet
                                        // Bugs being held get rendered with the user carrying it
                                        return
                                    }

                                    return (
                                        <Player
                                            position={[player.x, 0, player.y]}
                                            key={bug_index}
                                            player={player}
                                            color={player.homeZone}
                                            bugs={bugs}
                                        />
                                    )

                                })}

                                {/* <Player
                                    position={[0, 0, 0]}
                                    rotation={[0, Math.PI / 4.5, 0]}
                                    color={'Red'}
                                />
    
                                <Player
                                    position={[10, 0, 0]}
                                    rotation={[0, -Math.PI / 4.5, 0]}
                                    color={'Blue'}
                                />
    
                                <Player
                                    position={[0, 0, 10]}
                                    rotation={[0, Math.PI / 1.3, 0]}
                                    color={'Green'}
                                />
    
                                <Player
                                    position={[10, 0, 10]}
                                    rotation={[0, -Math.PI / 1.3, 0]}
                                    color={'Yellow'}
                                /> */}

                            </group>

                            {/* Bugs */}
                            <group position={[-400 + 25, 26, -400 + 25]}>

                                {bugs?.map((server_bug_obj, bug_index) => {

                                    if (!server_bug_obj || server_bug_obj.heldBy) {
                                        // No server data on bug yet
                                        // Bugs being held get rendered with the user carrying it
                                        return
                                    }

                                    return (
                                        <Bug
                                            position={[server_bug_obj.x, 0, server_bug_obj.y]}
                                            bug={server_bug_obj}
                                            key={bug_index}
                                        />
                                    )

                                })}

                            </group>

                            {/* Powerups */}
                            <group position={[-400 - 20, 0.5, -400 - 20]}>

                                {gameState?.powerups?.active?.map(powerup_obj => {

                                    return (
                                        <Powerup
                                            key={powerup_obj.id}
                                            powerup={powerup_obj}
                                            position={[powerup_obj.x, 20, powerup_obj.y]}
                                        />
                                    )

                                })}

                            </group>

                        </group>
                    </Suspense>

                    {/* <Physics gravity={[0, -30, 0]}>

                    </Physics> */}

                    <OrbitControls
                        // autoRotate 
                        // autoRotateSpeed={0.75} 
                        target={[0, 0, 0]}
                    />

                    {cameraShakeEnabled &&
                        <CameraShake
                            maxYaw={0.01}
                            maxPitch={0.01}
                            maxRoll={0.01}
                            yawFrequency={0.25}
                            pitchFrequency={0.25}
                            rollFrequency={0.4}
                        />
                    }

                </Canvas>
            }
        </>
    )
}

export default memo(GameCanvas)