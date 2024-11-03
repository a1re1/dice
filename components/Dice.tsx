"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useSpring, animated } from "@react-spring/three";
import { RoundedBox } from "@react-three/drei";
import { Group } from "three";

const faceRotations = {
  1: [0, 0, 0],
  2: [0, -Math.PI / 2, 0],
  3: [Math.PI / 2, 0, 0],
  4: [-Math.PI / 2, 0, 0],
  5: [0, Math.PI / 2, 0],
  6: [Math.PI, 0, 0],
};

// Component for creating a dot
const Dot = ({
  position,
  isSelected,
}: {
  position: [number, number, number];
  isSelected: boolean;
}) => (
  <mesh position={position}>
    <circleGeometry args={[0.15, 32]} />
    <meshStandardMaterial color={isSelected ? "red" : "black"} />
  </mesh>
);

// Component for a dice face
const DiceFace = ({
  dots,
  position,
  rotation = [0, 0, 0],
  isSelected = false,
}: {
  dots: [number, number, number][];
  position: [number, number, number];
  rotation: [number, number, number];
  isSelected: boolean;
}) => (
  <group position={position} rotation={rotation}>
    {dots.map((pos, index) => (
      <Dot key={index} position={pos} isSelected={isSelected} />
    ))}
  </group>
);

export function Dice({
  rolling,
  result,
}: {
  rolling: boolean;
  result: number;
}) {
  const meshRef = useRef<Group>();

  const { rotation } = useSpring({
    rotation: rolling
      ? [
          Math.random() * Math.PI * 8,
          Math.random() * Math.PI * 8,
          Math.random() * Math.PI * 8,
        ]
      : faceRotations[result as keyof typeof faceRotations],
    config: {
      mass: 2,
      tension: 200,
      friction: rolling ? 20 : 40,
    },
  });

  useFrame(() => {
    if (rolling && meshRef.current) {
      meshRef.current.rotation.x += 0.1;
      meshRef.current.rotation.y += 0.1;
      meshRef.current.rotation.z += 0.1;
    }
  });

  return (
    <animated.group ref={meshRef as any} rotation={rotation as any}>
      <RoundedBox
        args={[2, 2, 2]} // Width, height, depth
        radius={0.15} // Corner radius
        smoothness={4} // Optional: Number of curve segments
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#ffffff" metalness={0.1} roughness={0.2} />
      </RoundedBox>

      {/* Face 1 (Front) */}
      <DiceFace
        position={[0, 0, 1.01]}
        rotation={[0, 0, 0]}
        dots={[[0, 0, 0]]}
        isSelected={result === 1}
      />

      {/* Face 2 (Right) */}
      <DiceFace
        position={[1.01, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
        dots={[
          [-0.35, 0.35, 0],
          [0.35, -0.35, 0],
        ]}
        isSelected={result === 2}
      />

      {/* Face 3 (Top) */}
      <DiceFace
        position={[0, 1.01, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        dots={[
          [-0.5, -0.5, 0],
          [0, 0, 0],
          [0.5, 0.5, 0],
        ]}
        isSelected={result === 3}
      />

      {/* Face 4 (Bottom) */}
      <DiceFace
        position={[0, -1.01, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        dots={[
          [-0.35, -0.35, 0],
          [-0.35, 0.35, 0],
          [0.35, -0.35, 0],
          [0.35, 0.35, 0],
        ]}
        isSelected={result === 4}
      />

      {/* Face 5 (Left) */}
      <DiceFace
        position={[-1.01, 0, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        dots={[
          [-0.5, -0.5, 0],
          [-0.5, 0.5, 0],
          [0, 0, 0],
          [0.5, -0.5, 0],
          [0.5, 0.5, 0],
        ]}
        isSelected={result === 5}
      />

      {/* Face 6 (Back) */}
      <DiceFace
        position={[0, 0, -1.01]}
        rotation={[-Math.PI, 0, 0]}
        dots={[
          [-0.35, -0.6, 0],
          [-0.35, 0, 0],
          [-0.35, 0.6, 0],
          [0.35, -0.6, 0],
          [0.35, 0, 0],
          [0.35, 0.6, 0],
        ]}
        isSelected={result === 6}
      />
    </animated.group>
  );
}
