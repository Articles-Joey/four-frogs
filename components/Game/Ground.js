import { NearestFilter, RepeatWrapping, TextureLoader } from "three";

const texture = new TextureLoader().load(`textures/Grass/Poliigon_GrassPatchyGround_4585_BaseColor.jpg`)

function GrassPlane(props) {

    const width = props.width || 1600 ; // Set the width of the plane
    const height = props.height || 1600 ; // Set the height of the plane

    texture.magFilter = NearestFilter;
    texture.wrapS = RepeatWrapping
    texture.wrapT = RepeatWrapping
	texture.repeat.set(20, 10)

    return (
        <group {...props}>
            <mesh position={[0, 0, 0]}>
                <planeGeometry attach="geometry" args={[width, height]} />
                <meshStandardMaterial attach="material" map={texture} />
            </mesh>
        </group>
    );
};

export default GrassPlane