import React, { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import { BackSide, type Mesh } from "three";

function EarthScene() {
  const earthRef = useRef<Mesh>(null);
  const glowRef = useRef<Mesh>(null);

  useEffect(() => {
    let angle = 0;
    const interval = setInterval(() => {
      angle += 0.002;
      if (earthRef.current) earthRef.current.rotation.y = angle;
      if (glowRef.current) glowRef.current.rotation.y = angle * 0.7;
    }, 16);
    return () => clearInterval(interval);
  }, []);

  return (
    <group>
      <Float speed={0.6} rotationIntensity={0.1} floatIntensity={0.4}>
        <mesh ref={earthRef}>
          <sphereGeometry args={[1.6, 48, 48]} />
          <meshPhongMaterial
            color="#0a4d6e"
            emissive="#06b6d4"
            emissiveIntensity={0.08}
            wireframe
            transparent
            opacity={0.35}
          />
        </mesh>
        <mesh ref={glowRef}>
          <sphereGeometry args={[1.55, 32, 32]} />
          <MeshDistortMaterial
            color="#06b6d4"
            emissive="#06b6d4"
            emissiveIntensity={0.4}
            transparent
            opacity={0.12}
            distort={0.15}
          />
        </mesh>
        <mesh>
          <sphereGeometry args={[1.85, 32, 32]} />
          <meshBasicMaterial
            color="#06b6d4"
            transparent
            opacity={0.04}
            side={BackSide}
          />
        </mesh>
        <mesh rotation={[0.6, 0, 0]}>
          <torusGeometry args={[2.2, 0.015, 16, 64]} />
          <meshBasicMaterial color="#a855f7" transparent opacity={0.12} />
        </mesh>
        <mesh rotation={[-0.3, 0.5, 0]}>
          <torusGeometry args={[2.5, 0.01, 16, 80]} />
          <meshBasicMaterial color="#06b6d4" transparent opacity={0.07} />
        </mesh>
        {Array.from({ length: 40 }).map((_, i) => {
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          const r = 2 + Math.random() * 1.5;
          return (
            <mesh
              key={i}
              position={[
                r * Math.sin(phi) * Math.cos(theta),
                r * Math.sin(phi) * Math.sin(theta),
                r * Math.cos(phi),
              ]}
            >
              <sphereGeometry args={[0.02 + Math.random() * 0.03, 4, 4]} />
              <meshBasicMaterial
                color={Math.random() > 0.5 ? "#06b6d4" : "#a855f7"}
                transparent
                opacity={0.3 + Math.random() * 0.4}
              />
            </mesh>
          );
        })}
      </Float>
    </group>
  );
}

const InteractiveEarth = React.memo(function InteractiveEarth() {
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
      className="relative h-[350px] md:h-[420px] w-full overflow-hidden rounded-3xl"
      role="img"
      aria-label="Interactive 3D Earth visualization"
    >
      <div className="absolute inset-0 bg-gradient-to-t from-deep-navy via-transparent to-transparent pointer-events-none z-10" />
      {ready && (
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent" }}
          onCreated={({ scene }) => {
            scene.background = null;
          }}
        >
          <ambientLight intensity={0.3} />
          <pointLight position={[5, 3, 5]} intensity={0.8} />
          <pointLight position={[-4, -2, 3]} intensity={0.3} color="#a855f7" />
          <EarthScene />
        </Canvas>
      )}
    </div>
  );
});

export default InteractiveEarth;
