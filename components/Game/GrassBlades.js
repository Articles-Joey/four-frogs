import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { DoubleSide, Object3D, Color } from 'three';
import { useStore } from "@/hooks/useStore";

const BLADE_WIDTH = 0.5;
const BLADE_HEIGHT_MIN = 2;
const BLADE_HEIGHT_MAX = 5;

const QUALITY_SETTINGS = {
    Low: { density: 0.6 },
    Medium: { density: 1.0 },
    High: { density: 1.4 },
};

// Define the square boundaries
const INNER_SQUARE = 140;
const OUTER_SQUARE = 350;

const GRASS_AREA = OUTER_SQUARE + 1; // Bound pre-generation to only what is needed
const BLADE_SPACING = 3; // Spacing between blades inside the zone

// Pre-generate static blade positions ONLY inside the defined cutout square area
const allBlades = (() => {
    const data = [];
    for (let x = -GRASS_AREA; x < GRASS_AREA; x += BLADE_SPACING) {
        for (let z = -GRASS_AREA; z < GRASS_AREA; z += BLADE_SPACING) {
            const jitterX = x + (Math.random() - 0.5) * BLADE_SPACING;
            const jitterZ = z + (Math.random() - 0.5) * BLADE_SPACING;

            // Apply the Square Chebyshev Distance formula
            const currentSquareDist = Math.max(Math.abs(jitterX), Math.abs(jitterZ));

            // Strictly filter out any coordinates falling outside your square path
            if (currentSquareDist >= INNER_SQUARE && currentSquareDist <= OUTER_SQUARE) {
                const height = BLADE_HEIGHT_MIN + Math.random() * (BLADE_HEIGHT_MAX - BLADE_HEIGHT_MIN);
                const rotY = Math.random() * Math.PI;
                const color = new Color().setHSL(
                    0.30 + Math.random() * 0.05, // Hue: Shifts toward true green
                    0.4 + Math.random() * 0.3,   // Saturation: Rich, natural tones
                    0.1 + Math.random() * 0.12   // Lightness: Lowered for a deep, dark green
                );

                data.push({ x: jitterX, z: jitterZ, height, rotY, r: color.r, g: color.g, b: color.b });
            }
        }
    }
    return data;
})();

const MAX_VISIBLE_BLADES = 70000;

const GrassBlades = () => {
    const meshRef = useRef();
    const dummy = useMemo(() => new Object3D(), []);
    const timeRef = useRef(0);

    const graphicsQuality = useStore(state => state.graphicsQuality);
    const { density } = QUALITY_SETTINGS[graphicsQuality] || QUALITY_SETTINGS.Medium;
    const colorsRef = useRef(new Float32Array(MAX_VISIBLE_BLADES * 3));

    useFrame((_, delta) => {
        if (!meshRef.current) return;
        timeRef.current += delta;

        let count = 0;
        const cols = colorsRef.current;

        for (let i = 0; i < allBlades.length && count < MAX_VISIBLE_BLADES; i++) {
            const blade = allBlades[i];

            // Skip blades based on graphics density settings (deterministic skip)
            if (density < 1.4 && (i % 10) / 10 >= density) continue;

            const sway = Math.sin(timeRef.current * 2.0 + blade.x * 1.5 + blade.z * 1.0) * 0.12;

            // Placed flat at Y baseline (-1)
            dummy.position.set(blade.x, -1 + blade.height / 2, blade.z);
            dummy.rotation.set(sway, blade.rotY, sway * 0.5);
            dummy.scale.set(BLADE_WIDTH, blade.height, BLADE_WIDTH);
            dummy.updateMatrix();
            meshRef.current.setMatrixAt(count, dummy.matrix);

            cols[count * 3] = blade.r;
            cols[count * 3 + 1] = blade.g;
            cols[count * 3 + 2] = blade.b;

            count++;
        }

        // Hide remaining instances by scaling to zero
        if (count < meshRef.current.count) {
            dummy.scale.set(0, 0, 0);
            dummy.updateMatrix();
            for (let i = count; i < meshRef.current.count; i++) {
                meshRef.current.setMatrixAt(i, dummy.matrix);
            }
        }

        meshRef.current.count = count;
        meshRef.current.instanceMatrix.needsUpdate = true;

        // Update colors
        const colorAttr = meshRef.current.geometry.getAttribute('color');
        if (colorAttr) {
            colorAttr.array.set(cols.subarray(0, count * 3));
            colorAttr.needsUpdate = true;
        }
    });

    return (
        <instancedMesh ref={meshRef} args={[null, null, MAX_VISIBLE_BLADES]} frustumCulled={false}>
            <planeGeometry args={[1, 1]} />
            <meshStandardMaterial
                side={DoubleSide}
                vertexColors
                alphaTest={0.5}
            />
            <instancedBufferAttribute attach="geometry-attributes-color" args={[colorsRef.current, 3]} />
        </instancedMesh>
    );
};

export default GrassBlades;