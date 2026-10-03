"use client";
import Box from "@mui/material/Box";
import { useState, useEffect } from "react";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

import { ModelGrasshopper } from "../Models/Grasshopper";
import { ModelAnt } from "../Models/Ant";
import { ModelLadybug } from "../Models/Ladybug";
import { ModelCaterpillar } from "../Models/Caterpillar";
import { ModelSpider } from "../Models/Spider";

// Defined outside the component to prevent recreation on every render loop
const modelsToCycle = [
    {
        name: 'Grasshopper',
        component: <ModelGrasshopper scale={0.2} position={[0, -1, 0]} />
    },
    {
        name: 'Ant',
        component: <ModelAnt scale={0.1} position={[0, 0, 0]} />
    },
    {
        name: 'Ladybug',
        component: <ModelLadybug scale={4} position={[0, -1, 0]} />
    },
    {
        name: 'Caterpillar',
        component: <ModelCaterpillar scale={2} position={[0, -1, 0]} />
    },
    {
        name: 'Spider',
        component: <ModelSpider scale={0.015} position={[0, -1, 0]} />
    }
];

export default function RotatingMascot() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        // Set up the 3-second timer
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % modelsToCycle.length);
        }, 3000);

        // Clean up the interval when the component unmounts
        return () => clearInterval(interval);
    }, []);

    return (
        <Box className="rotating-mascot-container" sx={{ width: "100%", height: "100%" }}>
            <Canvas>
                <OrbitControls
                    autoRotate
                    enableZoom={false}
                    enablePan={false}
                    enableRotate={false}
                    autoRotateSpeed={10}
                />

                <ambientLight intensity={2} />

                
                {modelsToCycle[currentIndex].component}

            </Canvas>
        </Box>
    );
}