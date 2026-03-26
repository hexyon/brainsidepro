import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere } from "@react-three/drei";
import { brainRegions } from "@/data/brainRegions";
import * as THREE from "three";

interface BrainNodeProps {
  position: [number, number, number];
  color: string;
  isActive: boolean;
  onClick: () => void;
}

const BrainNode = ({ position, color, isActive, onClick }: BrainNodeProps) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current && isActive) {
      meshRef.current.scale.x = 1 + Math.sin(Date.now() * 0.003) * 0.15;
      meshRef.current.scale.y = meshRef.current.scale.x;
      meshRef.current.scale.z = meshRef.current.scale.x;
    }
  });

  return (
    <Sphere
      ref={meshRef}
      args={[isActive ? 0.12 : 0.06, 16, 16]}
      position={position}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
    >
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={isActive ? 0.8 : 0.1}
        transparent
        opacity={isActive ? 1 : 0.3}
      />
    </Sphere>
  );
};

interface BrainModelProps {
  activeRegionIds: string[];
  onSelectRegion: (id: string) => void;
}

const BrainModel = ({ activeRegionIds, onSelectRegion }: BrainModelProps) => {
  return (
    <div className="w-full h-full min-h-[300px] rounded-xl overflow-hidden neural-border">
      <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={0.8} />
        <pointLight position={[-5, -5, -5]} intensity={0.3} color="#8b5cf6" />

        {/* Brain shell */}
        <Sphere args={[1.5, 32, 32]}>
          <meshStandardMaterial
            color="#1a1f36"
            transparent
            opacity={0.08}
            wireframe
          />
        </Sphere>

        {/* Brain regions as nodes */}
        {brainRegions.map(region => (
          <BrainNode
            key={region.id}
            position={[region.position.x, region.position.y, region.position.z]}
            color={region.color}
            isActive={activeRegionIds.includes(region.id)}
            onClick={() => onSelectRegion(region.id)}
          />
        ))}

        <OrbitControls
          enablePan={false}
          enableZoom={false}
          autoRotate
          autoRotateSpeed={0.5}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={(3 * Math.PI) / 4}
        />
      </Canvas>
    </div>
  );
};

export default BrainModel;
