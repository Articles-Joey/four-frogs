"use client";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Slider from "@mui/material/Slider";
import { OrbitControls, Outlines, Sky, Text3D } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import { useStore } from "@/hooks/useStore";
import Bug from "@/components/Game/Bug";
import FrogCharacter from "@/components/Game/FrogCharacter";
import Pad from "@/components/Game/Pad";
import Ocean from "@/components/Game/Ocean";
import Link from "next/link";
import { degToRad } from "three/src/math/MathUtils.js";

const fontUrl = "font/Minnie_Regular.json"

const BUG_PLANE_CONFIG = {
    width: 8,
    height: 4,
    center: [-0, 2.9, 1.0], // [X, Y, Z]
};

export default function HeroScene() {

    const canvasRef = useRef();
    const [target, setTarget] = useState([0, 1, 0]);
    const [debug, setDebug] = useState(false);

    const darkMode = useStore((state) => state.darkMode)
    const toggleDarkMode = useStore(state => state.toggleDarkMode);

    const handleCapture = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // The background will be transparent if alpha: true and no background is set in the scene
        const dataUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.download = `scene-capture-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
    };

    return (
        <Box className="background-page" sx={{ position: 'relative', width: '100%', height: '100vh' }}>

            <Box sx={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                zIndex: 10,
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
            }}>
                <Button
                    onClick={handleCapture}
                    sx={{
                        padding: '8px 16px',
                        background: 'rgba(0, 0, 0, 0.8)',
                        color: '#fff',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    📷 Capture Transparent PNG
                </Button>

                <Box sx={{ display: "flex" }}>

                        <Button
                            component={Link}
                            href="/"
                            sx={{
                                padding: '8px 16px',
                                background: 'rgba(0, 0, 0, 0.8)',
                                color: '#fff',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            🏠
                        </Button>

                    <Button
                        onClick={() => {
                            toggleDarkMode();
                        }}
                        sx={{
                            padding: '8px 16px',
                            background: 'rgba(0, 0, 0, 0.8)',
                            color: '#fff',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
                    </Button>

                    <Button
                        onClick={() => setDebug(!debug)}
                        sx={{
                            padding: '8px 16px',
                            background: debug ? 'rgba(255, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.8)',
                            color: '#fff',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        {debug ? '🚫 Debug: ON' : '🛠️ Debug: OFF'}
                    </Button>
                </Box>

                <Box sx={{
                    background: 'rgba(0, 0, 0, 0.8)',
                    padding: '10px',
                    borderRadius: '4px',
                    color: '#fff',
                    fontSize: '12px'
                }}>
                    <strong>LookAt Target (Y)</strong><br />
                    <Slider
                        aria-label="LookAt Target (Y)"
                        min={-5}
                        max={10}
                        step={0.1}
                        value={target[1]}
                        onChange={(_, value) => setTarget([0, value, 0])}
                        sx={{ width: '100%' }}
                    />
                </Box>
            </Box>

            <Canvas
                gl={{
                    preserveDrawingBuffer: true,
                    alpha: true
                }}
                onCreated={({ gl }) => {
                    canvasRef.current = gl.domElement;
                }}
                camera={{
                    position: [0, 20, 200],
                    fov: 50,
                }}
            >
                <OrbitControls
                    makeDefault
                    target={target}
                />

                {darkMode ?
                    <>
                        <Sky
                            distance={1000}
                            sunPosition={[0, -1, 0]}
                            inclination={0}
                            azimuth={0.25}
                        />

                        <ambientLight intensity={3} />
                    </>
                    :
                    <>
                        <Sky
                            distance={1000}
                            sunPosition={[0, 1, 0]}
                            inclination={0}
                            azimuth={0.25}
                        />

                        <ambientLight intensity={5} />
                    </>
                }

                <GameName />

                <group position={[-150, 1, 0]}>
                    {[
                        {
                            color: "red",
                            position: [0, 0, 0],
                            tongueExtended: true
                        },
                        {
                            color: "blue",
                            position: [1, 0, 0],
                            tongueExtended: false
                        },
                        {
                            color: "green",
                            position: [2, 0, 0],
                            tongueExtended: false
                        },
                        {
                            color: "yellow",
                            position: [3, 0, 0],
                            tongueExtended: true
                        },
                    ].map((props, index) => (
                        <group key={index}
                            position={[
                                100 * index,
                                25,
                                index === 0 || index === 3 ? 30 : 0
                            ]}
                            rotation={[
                                0,
                                (index === 0) ?
                                    degToRad(30)
                                    :
                                    index === 3 ?
                                        degToRad(-30)
                                        :
                                        0,
                                0
                            ]}
                        >

                            <FrogCharacter
                                key={index}
                                // bodySize={0.5}
                                {...props}
                            />

                            <group
                                scale={0.5}
                                position={[
                                    props.position[0],
                                    props.position[1] - 25,
                                    props.position[2]
                                ]}
                            >
                                <Pad
                                    // position={[0, 0, 0]}
                                    // rotation={[-Math.PI / 2, 0, Math.PI / 4.5]}
                                    // scale={0.01}
                                    {...props}
                                />
                            </group>

                        </group>
                    ))}
                </group>

                <RandomBugs
                    debug={debug}
                />

                <Ocean
                    position={[0, -1, 0]}
                />

                {/* <Character
                    color={"green"}
                    position={[-1, 1, 0]}
                />
                <Character
                    color={"red"}
                    position={[0, 1, 0]}
                />
                <Character
                    color={"green"}
                    position={[1, 1, 0]}
                />
                <Character
                    color={"green"}
                    position={[1, 1, 0]}
                /> */}

            </Canvas>
        </Box>
    )

}

function RandomBugs({ count = 16, debug = false }) {

    const bugs = useMemo(() => {
        const { width, height, center } = BUG_PLANE_CONFIG;
        return Array.from({ length: count }, (_, index) => {
            // Calculate randomized starting positions within the bounds defined in BUG_PLANE_CONFIG
            const x = center[0] + (Math.random() - 0.5) * width;
            const y = center[1] + (Math.random() - 0.5) * height;
            const z = center[2];

            return {
                id: `${index}-${Date.now()}-${Math.random()}`,
                bugType: Math.floor(Math.random() * 8) + 1,
                basePosition: [x, y, z],
                drift: 20 + Math.random() * 200,
                speed: 0.5 + Math.random() * 0.5,
                wobble: 10 + Math.random() * 100,
                phase: Math.random() * Math.PI * 2,
            };
        });
    }, [count]);

    return (
        <group>
            {debug && (
                <mesh position={BUG_PLANE_CONFIG.center}>
                    <planeGeometry args={[BUG_PLANE_CONFIG.width, BUG_PLANE_CONFIG.height]} />
                    <meshBasicMaterial color="black" wireframe transparent opacity={0.3} />
                </mesh>
            )}
            {bugs.map((bug) => (
                <WanderingBug key={bug.id} bug={bug} />
            ))}
        </group>
    );
}

function WanderingBug({ bug }) {
    const groupRef = useRef();

    useFrame((state) => {
        if (!groupRef.current) return;

        const t = state.clock.getElapsedTime() * bug.speed + bug.phase;

        // Move randomly across a flat plane (X-Y)
        groupRef.current.position.set(
            bug.basePosition[0] + Math.cos(t) * bug.drift,
            bug.basePosition[1] + Math.sin(t * 1.6) * bug.wobble,
            bug.basePosition[2] // Fixed Z in front of text
        );
    });

    return (
        <group
            ref={groupRef}
            position={bug.basePosition}
            scale={1}
            rotation={[Math.PI / 2, 0, 0]} // Rotate so it's "on its side" relative to the plane
        >
            <Bug position={[0, 0, 0]} bug={bug} />
        </group>
    );
}

function GameName() {
    // Safely retrieve and split the name
    const gameName = process.env.NEXT_PUBLIC_GAME_NAME || "";
    const words = gameName.split(' ');

    const colors = ['red', 'blue', 'yellow', 'green'];
    // const colors = ['black'];

    // IMPORTANT: Splitting letters means you lose the font's natural kerning.
    // You will likely need to adjust this letterSpacing value based on your specific font and size.
    const letterSpacing = 1;

    return (
        <group position={[-2.1, 0, 0]} scale={100}>

            {/* First Word */}
            {words[0] && (
                <group position={[0.3, 3.3, 0]}>
                    {words[0].split('').map((char, index) => (
                        <Text3D
                            key={`word1-${index}`}
                            position={[index * letterSpacing, 0, 0]}
                            font={fontUrl}
                        >
                            {char}
                            <meshBasicMaterial color={colors[index % colors.length]} />

                            {/* The Outline Component */}
                            <Outlines thickness={1} color="black" />
                        </Text3D>
                    ))}
                </group>
            )}

            {/* Second Word */}
            {words[1] && (
                <group position={[0, 2, 0]}>
                    {words[1].split('').map((char, index) => {
                        const colorIndex = index % colors.length;

                        return (
                            <Text3D
                                key={`word2-${index}`}
                                position={[index * letterSpacing, 0, 0]}
                                font={fontUrl}
                            >
                                {char}
                                <meshBasicMaterial color={colors[colorIndex]} />

                                {/* The Outline Component */}
                                <Outlines thickness={1} color="black" />
                            </Text3D>
                        );
                    })}
                </group>
            )}

        </group>
    );
}
