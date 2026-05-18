import { NearestFilter, RepeatWrapping, TextureLoader } from "three";

const texture = new TextureLoader().load(`${process.env.NEXT_PUBLIC_CDN}games/Race Game/grass.jpg`)

function GrassPlane(props) {

    const width = 1600 || props.width; // Set the width of the plane
    const height = 800 || props.height; // Set the height of the plane

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