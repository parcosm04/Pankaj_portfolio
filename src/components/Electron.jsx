import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore, nodesData } from '../store'

export default function Electron() {
    const meshRef = useRef()
    const lightRef = useRef()

    const { isMoving, currentPath, pathIndex, reachWaypoint, currentNode } = useStore()

    const currentPos = useRef(new THREE.Vector3(...nodesData['center'].position))
    const speed = 15 // Units per second

    useEffect(() => {
        if (!isMoving && nodesData[currentNode]) {
            const pos = nodesData[currentNode].position
            currentPos.current.set(pos[0], 0.2, pos[2])
        }
    }, [currentNode, isMoving])

    useFrame((state, delta) => {
        if (!meshRef.current) return

        if (isMoving && currentPath.length > 0) {
            const targetWaypoint = new THREE.Vector3(...currentPath[pathIndex])
            targetWaypoint.y = 0.2 // Slightly above board

            // Move at constant speed towards target
            const distance = currentPos.current.distanceTo(targetWaypoint)
            const moveDistance = speed * delta

            if (distance <= moveDistance) {
                // Snap to waypoint and advance
                currentPos.current.copy(targetWaypoint)
                reachWaypoint()
            } else {
                // Lerp based on distance to ensure constant speed
                currentPos.current.lerp(targetWaypoint, moveDistance / distance)
            }
        }

        meshRef.current.position.copy(currentPos.current)
        if (lightRef.current) {
            lightRef.current.position.copy(currentPos.current)
        }

        // Add a slight pulsing scale effect
        const scale = 1 + Math.sin(state.clock.elapsedTime * 15) * 0.2
        meshRef.current.scale.setScalar(scale)
    })

    return (
        <>
            <mesh ref={meshRef}>
                <sphereGeometry args={[0.15, 16, 16]} />
                <meshBasicMaterial color="#00ff88" />
            </mesh>

            <pointLight
                ref={lightRef}
                color="#00ff88"
                intensity={2.5}
                distance={6}
                decay={2}
                castShadow
            />
        </>
    )
}
