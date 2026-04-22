import React, { useRef } from 'react';
import { useFrame, useThree } from "@react-three/fiber"
import { Text, useTexture } from '@react-three/drei';

import { ModelGrasshopper } from '@/components/Models/Grasshopper';
import { Model as ModelAnt } from '@/components/Models/Ant';
import { Model as ModelCaterpillar } from '@/components/Models/Caterpillar';
import { Model as ModelLadybug } from '@/components/Models/Ladybug';
import { Model as ModelSpider } from '@/components/Models/Spider';

// Map bugType number to component
const bugTypeComponentMap = {
    1: ModelAnt,
    2: ModelCaterpillar,
    3: ModelGrasshopper,
    4: ModelLadybug,
    5: ModelSpider,
    6: ModelGrasshopper, // Placeholder, update as needed
    7: ModelGrasshopper, // Placeholder, update as needed
    8: ModelGrasshopper  // Placeholder, update as needed
};

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

    const BugComponent = bugTypeComponentMap[bug.bugType] || null;
    return (
        <group
            position={props.position}
            ref={spriteRef}
        >

            {/* <Text scale={8}>
                {bug.bugType}
            </Text> */}

            {BugComponent && <BugComponent />}

            {/* <sprite
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
            </sprite> */}

        </group>
    );
};