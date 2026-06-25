import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import { useStore, nodesData, electronPositionRef } from '../store'
import { Trail, Sparkles } from '@react-three/drei'

export default function ElectronCore() {
    const meshRef = useRef()
    const lightRef = useRef()

    const { isMoving, currentPath, completeMove, currentNode, bootStage, quality } = useStore()
    const spawnVal = useRef({ scale: 0, light: 0 })

    useEffect(() => {
        if (bootStage === 'ready') {
            gsap.to(spawnVal.current, {
                scale: 1,
                light: 3,
                duration: 1.5,
                ease: 'power3.out'
            })
        } else {
            spawnVal.current = { scale: 0, light: 0 }
        }
    }, [bootStage])

    // Create a timeline for the electron
    const tl = useRef(null)

    useEffect(() => {
        if (!isMoving && nodesData[currentNode] && meshRef.current) {
            const pos = nodesData[currentNode].position
            meshRef.current.position.set(pos[0], 1, pos[2])
            if (lightRef.current) lightRef.current.position.set(pos[0], 1, pos[2])
        }
    }, [currentNode, isMoving])

    // React to new path
    useEffect(() => {
        if (isMoving && currentPath.length > 0 && meshRef.current) {
            if (tl.current) tl.current.kill() // Kill old animations

            tl.current = gsap.timeline({
                onComplete: () => {
                    completeMove()
                }
            })

            // Calculate total distance for consistent speed
            const segments = []

            // Starting point is current position
            let lastPoint = new THREE.Vector3().copy(meshRef.current.position)

            for (let i = 0; i < currentPath.length; i++) {
                const target = new THREE.Vector3(currentPath[i][0], 1, currentPath[i][2])
                const dist = lastPoint.distanceTo(target)
                segments.push({ target, dist })
                lastPoint = target
            }

            // 20 units per second speed
            const speed = 20

            segments.forEach(seg => {
                const duration = seg.dist / speed
                tl.current.to(meshRef.current.position, {
                    x: seg.target.x,
                    z: seg.target.z,
                    duration: duration,
                    ease: "none" // Linear electrical flow
                })
                // Sync light with mesh
                tl.current.to(lightRef.current.position, {
                    x: seg.target.x,
                    z: seg.target.z,
                    duration: duration,
                    ease: "none"
                }, "<") // Run at the same time
            })
        }
    }, [isMoving, currentPath, completeMove])

    useFrame((state) => {
        if (meshRef.current) {
            // Sync the global reference for the camera
            electronPositionRef.current.copy(meshRef.current.position)

            // Pulsing glow effect multiplied by spawning scale
            const pulse = 1 + Math.sin(state.clock.elapsedTime * 20) * 0.15
            meshRef.current.scale.setScalar(pulse * spawnVal.current.scale)

            // Slight intensity flicker multiplied by spawn light
            if (lightRef.current) {
                lightRef.current.intensity = spawnVal.current.light * (0.95 + Math.random() * 0.1)
            }
        }
    })

    return (
        <group>
            {/* Short fading spline trail behind the electron */}
            <Trail
                width={1.5}
                length={5} // 5-segment spline
                color={new THREE.Color('#00ff88')}
                attenuation={(t) => t * t} // Natural decay of width/opacity fade 1 -> 0 over 0.7s roughly matches 5 segments at speed 10
            >
                <mesh ref={meshRef}>
                    {/* White emissive central core: Radius 0.4 */}
                    <sphereGeometry args={[0.4, 16, 16]} />
                    <meshBasicMaterial color="#ffffff" />

                    {/* Neon green outer glow sphere: Radius 0.9 */}
                    <mesh>
                        <sphereGeometry args={[0.9, 16, 16]} />
                        <meshBasicMaterial color="#00ff88" transparent opacity={0.3} blending={THREE.AdditiveBlending} depthWrite={false} />
                    </mesh>

                    {/* 2-4 small floating spark particles */}
                    {quality === 'high' && <Sparkles count={3} scale={1.5} size={3.5} color="#aaffcc" speed={0.4} />}
                </mesh>
            </Trail>

            <pointLight
                ref={lightRef}
                color="#00ff88"
                intensity={3}
                distance={8}
                decay={2}
                // Removed castShadow on moving light as BakeShadows breaks it and it tanks performance
            />
        </group>
    )
}
