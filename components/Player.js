import { useRef } from 'react';

import { useFrame } from '@react-three/fiber';
import Bug from './Bug';
import muddyWaterZones from './constants/muddyWaterZones';
import { Billboard, Text } from '@react-three/drei';

const frogSize = 50

export default function Player(props) {

    const { player, bugs } = props

    let muddyWaterZoneLookup = muddyWaterZones.find(obj => obj.zone == player.homeZone)

    const playerRef = useRef();

    const cameraAngle = Math.PI / 2;

    let bodySize = frogSize
    let heightAdjustment = 0
    let spaceMultiplier = 1

    if (player.powerup == 'Tough Guy') {
        bodySize = frogSize * 2
        heightAdjustment = 20
        spaceMultiplier = 2
    }

    // Use the useFrame hook to update the camera position based on the player's position
    useFrame(({ camera }) => {
        const cameraDistance = 100; // Adjust this distance as needed
        const x = playerRef.current.position.x / 0.25 + cameraDistance * Math.cos(cameraAngle);
        const y = playerRef.current.position.y / 0.25 + cameraDistance * Math.sin(cameraAngle);

        // camera.position.set(x, y, camera.position.z);
        // camera.lookAt(playerRef.current.position.x, playerRef.current.position.y, 0);

        // camera.position.copy(playerRef.current.position);
        // camera.lookAt(playerRef.current.position.x, playerRef.current.position.y, 0);
    });

    return (
        <group position={[0, heightAdjustment, 0]}>

            {/* Muddy Water zone if powerup active on player */}
            {player.powerup == "Muddy Water" &&
                <group position={[0, -20, 0]}>

                    <mesh position={[muddyWaterZoneLookup.x + 125, 0, muddyWaterZoneLookup.y + 125]}>
                        <boxGeometry args={[300, 10, 300]} />
                        <meshStandardMaterial
                            color={'saddlebrown'}
                            opacity={0.75}
                            transparent
                        />
                    </mesh>

                </group>
            }

            {/* Actual Player */}
            <group
                ref={playerRef}
                position={props.position}
            // rotation={props.rotation}
            >

                {player.powerup &&
                    <Billboard
                        follow={true}
                        lockX={false}
                        lockY={false}
                        lockZ={false} // Lock the rotation on the z axis (default=false)
                        position={[0, bodySize, 0]}
                    >

                        <mesh position={[0, 0, -1]}>
                            <boxGeometry args={[130, 25, 1]} />
                            <meshStandardMaterial
                                color={'white'}
                                transparent
                                opacity={0.5}
                            />
                        </mesh>

                        <Text
                            // ref={textRef}
                            renderOrder={0}
                            // Adjust the Y-coordinate based on your preference
                            fontSize={16}
                            color="black"
                            anchorX="center"
                            backgroundColor='white'
                            fontWeight='bold'
                            anchorY="middle"
                            side={'both'}
                            rotation={[0, 0, 0]}
                        >
                            {player.powerup} - {player.powerup_timer || 0}
                        </Text>

                    </Billboard>
                }

                {player.powerup == "Stinky Frog" &&
                    <mesh position={[0, 0, -1]}>
                        <boxGeometry args={[150, 25, 150]} />
                        <meshStandardMaterial
                            color={'limegreen'}
                            transparent
                            opacity={0.5}
                        />
                    </mesh>
                }

                {/* Body */}
                <mesh position={[0, 0, 0]}>
                    <boxGeometry args={[bodySize, bodySize, bodySize]} />
                    <meshStandardMaterial
                        color={props.color}
                    />
                </mesh>

                {/* Mouth */}
                <mesh position={[0, -12.5 * spaceMultiplier, bodySize / 2]}>
                    <boxGeometry args={[
                        (bodySize / 1.5),
                        (bodySize / 4),
                        1
                    ]} />
                    <meshStandardMaterial
                        color={'black'}
                    />
                </mesh>

                {/* Tongue */}
                <mesh position={[0, -15.5 * spaceMultiplier, bodySize / 2 + 1]}>
                    <boxGeometry args={[
                        (bodySize / 2),
                        (bodySize / 6),
                        (player.drop ? 60 : 1)
                    ]} />
                    <meshStandardMaterial
                        color={'pink'}
                    />
                </mesh>

                {/* Left Eye */}
                <mesh position={[-10 * spaceMultiplier, 15, bodySize / 2]}>
                    <boxGeometry args={[
                        (bodySize / 4),
                        (bodySize / 4),
                        1
                    ]} />
                    <meshStandardMaterial
                        color={'black'}
                    />
                </mesh>

                {/* Right Eye */}
                <mesh position={[10 * spaceMultiplier, 15, bodySize / 2]}>
                    <boxGeometry args={[
                        (bodySize / 4),
                        (bodySize / 4),
                        1
                    ]} />
                    <meshStandardMaterial
                        color={'black'}
                    />
                </mesh>

                {player?.holding.length == 1 &&

                    player?.holding.map(bug_index => {

                        return (
                            <Bug
                                position={[0, 40 * spaceMultiplier, 0]}
                                bug={{
                                    bugType: bugs[bug_index].bugType
                                }}
                                key={bug_index}
                            />
                        )
                    })

                }

                {player?.holding.length > 1 &&

                    <group position={[0, heightAdjustment, 0]}>

                        {player?.holding.map((bug_index, holding_index) => {

                            return (
                                <Bug
                                    position={[((0 - 20) + (holding_index * 20)), 40, 0]}
                                    bug={{
                                        bugType: bugs[bug_index].bugType
                                    }}
                                    key={bug_index}
                                />
                            )
                        })}

                    </group>

                }

            </group>

        </group>
    );
};