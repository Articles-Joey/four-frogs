import React from "react";

export default function Pad(props) {
    // 80% of a full 360-degree circle (in radians)
    const percentArc = Math.PI * 2 * 0.95; 

    return (
        <mesh position={props.position} rotation={props.rotation}>
            {/* 
              CylinderGeometry arguments:
              [radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength]
            */}
            <cylinderGeometry 
                args={[
                    100,               // radiusTop
                    100,               // radiusBottom
                    5,                 // height
                    64,                // radialSegments (lowered from 100 to save performance, adjust as needed)
                    1,                 // heightSegments
                    false,             // openEnded
                    0,                 // thetaStart (where the circle starts drawing)
                    percentArc         // thetaLength (how far around the circle goes)
                ]} 
            />
            <meshStandardMaterial color={props.color} />
        </mesh>
    );
}