import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Billboard, Text } from "@react-three/drei";
import { TextureLoader, Vector3 } from 'three';

const frogSize = 40

const texture = new TextureLoader().load(`${process.env.NEXT_PUBLIC_CDN}games/Four%20Frogs/Powerups/powerup.jpg`)

export default function Powerup(props) {

    const { powerup } = props

    const textRef = useRef();

    // useFrame(({ camera }) => {
    //     // Calculate the direction from the orb to the camera
    //     const direction = new Vector3();
    //     camera.getWorldPosition(direction);

    //     // LookAt the camera
    //     textRef.current.lookAt(direction);
    // });

    return (
        <group
            position={props.position}
        >

            {/* Body */}
            <mesh position={[40, 0, 40]}>
                <boxGeometry args={[frogSize, frogSize, frogSize]} />
                <meshStandardMaterial
                    // color={'brown'}
                    map={texture}
                />
            </mesh>

            <Billboard
                follow={true}
                lockX={false}
                lockY={false}
                lockZ={false} // Lock the rotation on the z axis (default=false)
                position={[40, 50, 40]}
            >

                <mesh position={[0, 0, -1]}>
                    <boxGeometry args={[120, 25, 1]} />
                    <meshStandardMaterial
                        color={'white'}
                        transparent
                        opacity={0.5}
                    />
                </mesh>

                <Text
                    ref={textRef}
                    renderOrder={0}
                    // Adjust the Y-coordinate based on your preference
                    fontSize={18}
                    color="black"
                    anchorX="center"
                    backgroundColor='white'
                    fontWeight='bold'
                    anchorY="middle"
                    side={'both'}
                    rotation={[0, 0, 0]}
                >
                    {powerup.name}
                </Text>

            </Billboard>



        </group>
    );
};