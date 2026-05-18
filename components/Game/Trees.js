import React, { useMemo } from "react";
import Tree from "./Tree";

// A placeholder Tree component. Replace this with your actual 3D model!
function DummyTree({ scale, rotation, position }) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Trunk */}
      <mesh position={[0, 1, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.4, 2, 8]} />
        <meshStandardMaterial color="#5c4033" roughness={0.9} />
      </mesh>
      {/* Leaves */}
      <mesh position={[0, 2.5, 0]} castShadow>
        <coneGeometry args={[1, 2, 8]} />
        <meshStandardMaterial color="#2e5c1e" roughness={0.6} />
      </mesh>
    </group>
  );
}

export default function Trees({ 
  innerSquare = 15, 
  outerSquare = 20, 
  count = 100, 
  TreeComponent = DummyTree 
}) {
  
  // Generate tree transforms once and cache them
  const treeInstances = useMemo(() => {
    const instances = [];
    let attempts = 0;
    
    // Keep generating until we hit our desired count (or a safety escape hatch)
    while (instances.length < count && attempts < count * 10) {
      attempts++;

      // Pick a random point anywhere within the total outer boundary box
      const x = (Math.random() - 0.5) * (outerSquare * 2);
      const z = (Math.random() - 0.5) * (outerSquare * 2);

      // Check the square distance (Chebyshev distance)
      const currentSquareDist = Math.max(Math.abs(x), Math.abs(z));

      // Validate that it falls strictly within the cutout square zone
      if (currentSquareDist >= innerSquare && currentSquareDist <= outerSquare) {
        
        // Randomizations
        const randomScale = 1 + Math.random() * 9; // Scales between 1 and 10
        const randomRotationY = Math.random() * Math.PI * 2; // Full 360 rotation

        // Hardcoded to baseline 0
        const y = 0;

        instances.push({
          id: instances.length,
          position: [x, y, z],
          rotation: [0, randomRotationY, 0],
          scale: [randomScale, randomScale, randomScale]
        });
      }
    }

    return instances;
  }, [innerSquare, outerSquare, count]);

  return (
    <group>
      {treeInstances.map((tree) => (
        <Tree
          key={tree.id}
          position={tree.position}
          rotation={tree.rotation}
          scale={tree.scale}
        />
      ))}
    </group>
  );
}