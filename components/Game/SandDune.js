import React, { useMemo } from "react";
import * as THREE from "three";
import { useLoader } from "@react-three/fiber";

export default function SandDune({ 
  innerSquare = 15, 
  outerSquare = 20, 
  height = 4, 
  segments = 150,
  textureUrl = "textures/Sand/COL_1K.jpg" // Pass your image link here
}) {
  
  // 1. Load the texture if a URL is provided
  const texture = textureUrl ? useLoader(THREE.TextureLoader, textureUrl) : null;

  // Optional: Ensure the texture repeats nicely over the large terrain instead of stretching
  if (texture) {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(10, 10); // Adjust these numbers to change the texture scale
  }

  const geometry = useMemo(() => {
    // Total width/depth of the plane needs to comfortably fit the outer square boundary
    const totalSize = outerSquare * 2 + 6;
    
    const geo = new THREE.PlaneGeometry(totalSize, totalSize, segments, segments);
    geo.rotateX(-Math.PI / 2); // Lay flat on XZ plane

    const positionAttribute = geo.attributes.position;
    const midPoint = (innerSquare + outerSquare) / 2; // Peak line of the square ridge
    const halfWidth = (outerSquare - innerSquare) / 2; // Distance from peak to either edge

    for (let i = 0; i < positionAttribute.count; i++) {
      const x = positionAttribute.getX(i);
      const z = positionAttribute.getZ(i);

      // Square distance: Find the absolute maximum between X and Z coordinates
      const currentSquareDist = Math.max(Math.abs(x), Math.abs(z));

      let currentHeight = 0;

      // Only elevate the terrain if it falls between the 15 and 20 square bounds
      if (currentSquareDist >= innerSquare && currentSquareDist <= outerSquare) {
        // Normalize the position relative to the ridge peak (-1 at inner square, 0 at peak, 1 at outer square)
        const normalizedDist = (currentSquareDist - midPoint) / halfWidth;

        // Cosine formula to create a perfectly smooth, continuous square ridge
        currentHeight = height * (Math.cos(normalizedDist * Math.PI) + 1) / 2;
      }

      positionAttribute.setY(i, currentHeight);
    }

    geo.computeVertexNormals();
    return geo;
  }, [innerSquare, outerSquare, height, segments]);

  return (
    <mesh geometry={geometry} castShadow receiveShadow position={[0, -2, 0]}>
      <meshStandardMaterial 
        map={texture} // Applies the texture
        color={texture ? "#ffffff" : "#e2bc8a"} // Tint white if texturing, otherwise use sand color
        roughness={0.9} 
        metalness={0.1} 
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}