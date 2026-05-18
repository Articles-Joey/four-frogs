export default function Zone(props) {

    return (
        <mesh position={props.position} rotation={[-Math.PI / 2, 0, 0]} >
            <planeGeometry attach="geometry" args={[400, 400]} />
            <meshStandardMaterial attach="material" color={props.color} transparent opacity={0.5} />
        </mesh>
    );
};