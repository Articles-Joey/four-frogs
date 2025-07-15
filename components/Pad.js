export default function Pad(props) {

    return (
        <mesh position={props.position} rotation={props.rotation} >
            {/* <planeGeometry args={[5, 5]} /> 
            <meshBasicMaterial map={texture} transparent /> */}
            <cylinderGeometry args={[100, 100, 5, 100]} />
            <meshStandardMaterial color={props.color} />
        </mesh>
    );
};