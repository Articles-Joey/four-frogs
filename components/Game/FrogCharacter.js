import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from 'three';
import { Outlines } from "@react-three/drei";

export default function FrogCharacter({
    scale = 1,
    bodySize = 50,
    ...props
}) {

    // const frogSize = bodySize
    // let bodySize = frogSize

    let heightAdjustment = 0
    let spaceMultiplier = 1

    const tongueRef = useRef()

    const lighterColor = useMemo(() => {
        // Create a new color from the prop, then blend it 50% (0.5) towards white
        return new THREE.Color(props.color).lerp(new THREE.Color('white'), 0.1)
    }, [props.color])

    useFrame((state, delta) => {
        if (tongueRef.current) {
            const targetScale = props.tongueExtended ? 1 : 0.01
            tongueRef.current.scale.z = THREE.MathUtils.lerp(tongueRef.current.scale.z, targetScale, 1 - Math.exp(-15 * delta))
        }
    })

    const Eye = ({ x }) => (
        <group>
            {/* Eye */}
            <mesh position={[x, 25, bodySize / 1.50]}>
                <boxGeometry args={[
                    (bodySize / 4),
                    (bodySize / 4),
                    1
                ]} />
                <meshStandardMaterial color={'black'} />
            </mesh>

            {/* Eye Spec */}
            <mesh position={[x, 25, bodySize / 1.48]}>
                <boxGeometry args={[
                    (bodySize / 16),
                    (bodySize / 16),
                    1
                ]} />
                <meshStandardMaterial color={'white'} />
            </mesh>

            {/* Eye Bulge */}
            <mesh position={[x, 25, bodySize / 2]}>
                <boxGeometry args={[bodySize / 3, bodySize / 3, bodySize / 3]} />
                <meshStandardMaterial color={lighterColor} />

                <Outlines thickness={2} color="black" />
            </mesh>
        </group>
    )

    const Leg = ({ x }) => (
        <group>
            {/* Leg */}
            <mesh position={[x, -bodySize / 2.5, bodySize / 6]}>
                <boxGeometry args={[bodySize / 4, bodySize / 4, bodySize / 1]} />
                <meshStandardMaterial color={lighterColor} />

                <Outlines thickness={2} color="black" />
            </mesh>
        </group>
    )

    return (
        <group scale={scale} {...props}>

            {/* Body */}
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[bodySize, bodySize, bodySize]} />
                <meshStandardMaterial
                    color={props.color}
                />

                <Outlines thickness={2} color="black" />
            </mesh>

            {/* Mouth */}
            <mesh position={[0, -5.5 * spaceMultiplier, bodySize / 2]}>
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
            <group
                ref={tongueRef}
                position={[0, -9.5 * spaceMultiplier, bodySize / 1.95]}
                scale={[1, 1, 0.05]}
            >
                <mesh position={[0, 0, 15]}>
                    <boxGeometry args={[
                        (bodySize / 2),
                        (bodySize / 6),
                        30
                    ]} />
                    <meshStandardMaterial
                        color={'pink'}
                    />
                </mesh>
            </group>

            <Leg x={-bodySize / 2.2 * spaceMultiplier} />
            <Leg x={bodySize / 2.2 * spaceMultiplier} />

            <Eye x={-bodySize / 3.5 * spaceMultiplier} />
            <Eye x={bodySize / 3.5 * spaceMultiplier} />

        </group>
    )
}