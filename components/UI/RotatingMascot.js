import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { ModelGrasshopper } from "../Models/Grasshopper";



export default function RotatingMascot() {
    return (
        <div className="rotating-mascot-container w-100 h-100">
            <Canvas>

                <OrbitControls
                    autoRotate
                    enableZoom={false}
                    enablePan={false}
                    enableRotate={false}
                    autoRotateSpeed={10}
                />

                <ambientLight intensity={2} />

                <ModelGrasshopper 
                    scale={0.2}
                    position={[0, -1, 0]}
                />        

            </Canvas>
        </div>
    );
}