import React, { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";

function ThreeScene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={0.6} />
      <pointLight position={[-5, -3, 5]} intensity={0.3} color="#a855f7" />
      <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.6}>
        <mesh position={[-3.5, 1.5, -2]}>
          <icosahedronGeometry args={[1.1, 0]} />
          <MeshDistortMaterial
            color="#06b6d4"
            emissive="#06b6d4"
            emissiveIntensity={0.15}
            transparent
            opacity={0.08}
            wireframe
            distort={0.25}
          />
        </mesh>
      </Float>
      <Float speed={0.8} rotationIntensity={0.3} floatIntensity={0.8}>
        <mesh position={[3.5, -1, -3]} rotation={[0.5, 0, 0]}>
          <torusKnotGeometry args={[0.9, 0.28, 64, 8]} />
          <MeshDistortMaterial
            color="#a855f7"
            emissive="#a855f7"
            emissiveIntensity={0.12}
            transparent
            opacity={0.06}
            wireframe
            distort={0.2}
          />
        </mesh>
      </Float>
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.4}>
        <mesh position={[1.5, 2.8, -4]} rotation={[0.3, 0.5, 0]}>
          <octahedronGeometry args={[0.7]} />
          <MeshDistortMaterial
            color="#06b6d4"
            emissive="#06b6d4"
            emissiveIntensity={0.2}
            transparent
            opacity={0.07}
            wireframe
            distort={0.3}
          />
        </mesh>
      </Float>
    </>
  );
}

const ThreeBackground = React.memo(function ThreeBackground() {
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0, rootMargin: "300px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (visible) setReady(true);
  }, [visible]);

  return (
    <div
      ref={ref}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden
    >
      {ready && (
        <Canvas
          camera={{ position: [0, 0, 6], fov: 50 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent" }}
          onCreated={({ scene }) => {
            scene.background = null;
          }}
        >
          <ThreeScene />
        </Canvas>
      )}
    </div>
  );
});

export default ThreeBackground;
