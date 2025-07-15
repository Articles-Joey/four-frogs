import React, { useRef } from 'react';
import { useFrame, useThree } from "@react-three/fiber"
import { useTexture } from '@react-three/drei';

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

export default function Bug(props) {

    const { bug } = props;

    const { camera } = useThree()

    const spriteRef = useRef();

    // Causing issues of undefined when still loading image

    // Load your texture/image
    // const texture = useTexture(
    //     bugImages[bug.bugType - 1]
    // );

    // useFrame allows you to animate the sprite
    useFrame(() => {
        // Update the sprite's position or any other properties here if needed
        spriteRef.current.lookAt(camera.position);
    });

    return (
        <sprite
            ref={spriteRef}
            scale={[40, 40, 40]} // Adjust the scale as needed
            position={props.position} // Set the initial position in 3D space
            transparent
        >
            <spriteMaterial
                attach="material"
                // map={texture}
                transparent
            />
        </sprite>
    );
};