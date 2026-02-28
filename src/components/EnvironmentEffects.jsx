/* eslint-disable react-hooks/purity */
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Grid } from '@react-three/drei'
import { useStore } from '../store'

function DataGrid() {
    return (
        <group position={[0, -8, 0]}>
            {/* The base Grid from drei can handle infinite/fading planes perfectly */}
            <Grid
                args={[300, 300]}
                cellSize={5}
                cellThickness={0.2}
                cellColor="#00ff88"
                sectionSize={0} // Disable sections to just have a uniform 5-unit grid
                fadeDistance={150}
                fadeStrength={1}
            >
                <meshBasicMaterial transparent opacity={0.05} depthWrite={false} color="#00ff88" toneMapped={false} />
            </Grid>
        </group>
    )
}

function FloatingParticles() {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const count = isMobile ? 30 : 100
    const pointsRef = useRef()

    // Create random positions initially
    const particles = useMemo(() => {
        const positions = new Float32Array(count * 3)
        const speeds = new Float32Array(count)
        const xzDrift = new Float32Array(count * 2)

        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 150       // x
            positions[i * 3 + 1] = (Math.random() - 0.5) * 100   // y (-50 to 50)
            positions[i * 3 + 2] = (Math.random() - 0.5) * 100   // z

            speeds[i] = 0.01 + Math.random() * 0.02              // Slow upward drift
            xzDrift[i * 2] = (Math.random() - 0.5) * 0.01        // Slight X random motion
            xzDrift[i * 2 + 1] = (Math.random() - 0.5) * 0.01    // Slight Z random motion
        }
        return { positions, speeds, xzDrift }
    }, [count])

    useFrame(() => {
        if (pointsRef.current) {
            const positions = pointsRef.current.geometry.attributes.position.array

            const state = useStore.getState();
            const eng = state.energy;
            const speedMultiplier = eng <= 0 ? 0.05 : 1.0;

            for (let i = 0; i < count; i++) {
                // Upward drift
                positions[i * 3 + 1] += particles.speeds[i] * speedMultiplier

                // Slight random X/Z motion
                positions[i * 3] += particles.xzDrift[i * 2] * Math.sin(Date.now() * 0.001 + i) * speedMultiplier
                positions[i * 3 + 2] += particles.xzDrift[i * 2 + 1] * Math.cos(Date.now() * 0.001 + i) * speedMultiplier

                // Reset when reaching upper boundary
                if (positions[i * 3 + 1] > 40) {
                    positions[i * 3 + 1] = -60
                    positions[i * 3] = (Math.random() - 0.5) * 150
                    positions[i * 3 + 2] = (Math.random() - 0.5) * 100
                }
            }

            pointsRef.current.geometry.attributes.position.needsUpdate = true
        }
    })

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={particles.positions.length / 3}
                    array={particles.positions}
                    itemSize={3}
                />
            </bufferGeometry>
            {/* Size 0.3 units roughly, soft green-white */}
            <pointsMaterial size={0.3} color="#e0ffe8" transparent opacity={0.05} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
        </points>
    )
}

function GlowHalo() {
    const energy = useStore(state => state.energy)

    // Generate a procedural radial gradient for the halo
    const haloTexture = useMemo(() => {
        const canvas = document.createElement('canvas')
        canvas.width = 256
        canvas.height = 256
        const ctx = canvas.getContext('2d')
        const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128)
        gradient.addColorStop(0, 'rgba(0, 255, 136, 1)')
        gradient.addColorStop(1, 'rgba(0, 255, 136, 0)')
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, 256, 256)
        return new THREE.CanvasTexture(canvas)
    }, [])

    return (
        <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[140, 140]} />
            <meshBasicMaterial
                map={haloTexture}
                transparent
                opacity={energy <= 0 ? 0.005 : 0.02}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
                toneMapped={false}
            />
        </mesh>
    )
}

export default function EnvironmentEffects() {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    if (isMobile) return null;

    return (
        <group>
            <DataGrid />
            <FloatingParticles />
            <GlowHalo />
        </group>
    )
}
