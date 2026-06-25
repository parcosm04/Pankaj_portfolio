/* eslint-disable react-hooks/purity */
import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useStore, electronPositionRef } from '../store'
import { Text } from '@react-three/drei'

import TracePaths from '../routing/TracePaths'
import ElectronCore from '../electron/ElectronCore'
import ConnectedParts from '../components/ConnectedParts'
import ICModules from '../components/ICModules'

// The strict dark green realistic PCB base
function Board() {
    // Generate a procedural noise normal map for the PCB surface texture
    const normalMap = useRef(null)

    if (!normalMap.current) {
        const size = 512
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const context = canvas.getContext('2d')
        const imgData = context.createImageData(size, size)

        // Generate high frequency noise for PCB fiberglass/epoxy texture
        for (let i = 0; i < imgData.data.length; i += 4) {
            // Base flat normal is [128, 128, 255]
            // We perturb the X and Y (R and G channels) slightly for noise
            const noiseX = (Math.random() - 0.5) * 50
            const noiseY = (Math.random() - 0.5) * 50

            imgData.data[i] = 128 + noiseX     // R (X vector)
            imgData.data[i + 1] = 128 + noiseY // G (Y vector)
            imgData.data[i + 2] = 255          // B (Z vector - mostly pointing up)
            imgData.data[i + 3] = 255          // A
        }

        context.putImageData(imgData, 0, 0)
        const texture = new THREE.CanvasTexture(canvas)
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping
        texture.repeat.set(10, 10) // Repeat across the board
        normalMap.current = texture
    }

    return (
        <group>
            {/* The primary dark green PCB with slight bevel */}
            <mesh receiveShadow position={[0, -0.5, 0]}>
                {/* Add bevel segments (widthSegments, heightSegments, depthSegments) */}
                <boxGeometry args={[120, 1, 80, 4, 1, 4]} />
                {/* Deep dark green solder mask with high roughness for matte finish and noise normal map */}
                <meshStandardMaterial
                    color="#0a2e1c"
                    roughness={0.65} // Roughness variation roughly 0.6-0.75 simulated via normal
                    metalness={0.15}
                    normalMap={normalMap.current}
                    normalScale={new THREE.Vector2(0.15, 0.15)} // intensity 0.15
                />
            </mesh>

            {/* Edge Bevel Glow / Detail */}
            <mesh receiveShadow position={[0, -0.5, 0]}>
                <boxGeometry args={[120.4, 0.8, 80.4]} />
                <meshStandardMaterial color="#051a0f" roughness={0.9} />
            </mesh>

            {/* A slightly larger pure black base to act as the border shadow */}
            <mesh receiveShadow position={[0, -0.6, 0]}>
                <boxGeometry args={[122, 1, 82]} />
                <meshBasicMaterial color="#000000" />
            </mesh>

            {/* Mounting Holes (4 corners) */}
            {[[-55, -35], [55, -35], [-55, 35], [55, 35]].map((pos, idx) => (
                <group key={`hole-${idx}`} position={[pos[0], 0, pos[1]]}>
                    {/* Metallic Pad Ring */}
                    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
                        <ringGeometry args={[2, 3, 32]} />
                        <meshStandardMaterial color="#d4d4d4" metalness={0.8} roughness={0.4} />
                    </mesh>
                    {/* Dark center hole illusion */}
                    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.011, 0]}>
                        <circleGeometry args={[2, 32]} />
                        <meshBasicMaterial color="#000" opacity={0.8} transparent />
                    </mesh>
                </group>
            ))}

            {/* Silkscreen Text Layer */}
            <group position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                {/* Ground and Power buses */}
                <Text position={[-55, 36.5, 0]} fontSize={1.2} color="white" anchorX="center" anchorY="middle" opacity={0.8}>GND</Text>
                <Text position={[-50, 2, 0]} fontSize={1.2} color="white" anchorX="center" anchorY="middle" opacity={0.8}>VCC</Text>

                {/* Main branding/versioning */}
                <Text position={[0, 7, 0]} fontSize={2} color="white" anchorX="center" anchorY="middle" opacity={0.8} transparent>PCB REV 1.0</Text>
                <Text position={[0, 38, 0]} fontSize={1.2} color="white" anchorX="center" anchorY="middle" opacity={0.6} transparent>Designed by Pankaj Pandit</Text>

                {/* Edge String */}
                <Text position={[-58, 0, 0]} rotation={[0, 0, Math.PI / 2]} fontSize={1.5} color="#aaa" anchorX="center" anchorY="middle" opacity={0.5}>ENTC SYSTEM ARCHITECTURE v1.0</Text>

                {/* Example Component Labels matching design requirements */}
                <Text position={[-18, -10.5, 0]} fontSize={1.0} color="white" opacity={0.8}>U1</Text>
                <Text position={[18, -10.5, 0]} fontSize={1.0} color="white" opacity={0.8}>U2</Text>
                <Text position={[-18, 10.5, 0]} fontSize={1.0} color="white" opacity={0.8}>U3</Text>
                <Text position={[18, 10.5, 0]} fontSize={1.0} color="white" opacity={0.8}>U4</Text>

                <Text position={[-38, -20, 0]} fontSize={1.0} color="white" opacity={0.8}>U5</Text>
                <Text position={[-38, 20, 0]} fontSize={1.0} color="white" opacity={0.8}>U6</Text>
                <Text position={[38, -20, 0]} fontSize={1.0} color="white" opacity={0.8}>U7</Text>

                {/* Resistors (R1-R12) & Capacitors (C1-C12) */}
                <Text position={[-18, -15.5, 0]} fontSize={0.8} color="white" opacity={0.7}>R1</Text>
                <Text position={[-18, 15.5, 0]} fontSize={0.8} color="white" opacity={0.7}>R2</Text>
                <Text position={[-30, 20, 0]} fontSize={0.8} color="white" opacity={0.7}>R3</Text>
                <Text position={[-30, -20, 0]} fontSize={0.8} color="white" opacity={0.7}>R4</Text>
                <Text position={[8, -35, 0]} fontSize={0.8} color="white" opacity={0.7}>R5</Text>
                <Text position={[8, 35, 0]} fontSize={0.8} color="white" opacity={0.7}>R6</Text>

                <Text position={[-30, 23, 0]} fontSize={0.8} color="white" opacity={0.7}>C1</Text>
                <Text position={[-30, 17, 0]} fontSize={0.8} color="white" opacity={0.7}>C2</Text>
                <Text position={[-30, -23, 0]} fontSize={0.8} color="white" opacity={0.7}>C3</Text>
                <Text position={[-30, -17, 0]} fontSize={0.8} color="white" opacity={0.7}>C4</Text>
                <Text position={[50, -23, 0]} fontSize={0.8} color="white" opacity={0.7}>C5</Text>
                <Text position={[50, -17, 0]} fontSize={0.8} color="white" opacity={0.7}>C6</Text>
                <Text position={[10, 38, 0]} fontSize={0.8} color="white" opacity={0.7}>C7</Text>
                <Text position={[10, 32, 0]} fontSize={0.8} color="white" opacity={0.7}>C8</Text>
            </group>
        </group>
    )
}

// Smooth, damped cinematic camera follow
function FollowCamera() {
    const { zoomLevel, bootStage, setBootStage } = useStore()

    // Start at Y=80 if we are in the boot sequence
    const isBootingSequence = bootStage === 'landing' || bootStage === 'booting' || bootStage === 'descending'
    const camTarget = useRef(new THREE.Vector3(0, isBootingSequence ? 80 : 25, 35))
    const lookTarget = useRef(new THREE.Vector3(0, 0, 0))
    const prevElectronPos = useRef(new THREE.Vector3())

    // Timed descent to standard view
    useEffect(() => {
        if (bootStage === 'descending') {
            const timer = setTimeout(() => {
                setBootStage('ready')
            }, 1400)
            return () => clearTimeout(timer)
        }
    }, [bootStage, setBootStage])

    useFrame((state, delta) => {
        const electronPos = electronPositionRef.current

        const velocity = new THREE.Vector3().subVectors(electronPos, prevElectronPos.current)
        prevElectronPos.current.copy(electronPos)

        const anticipation = new THREE.Vector3(
            Math.sign(velocity.x) * (Math.abs(velocity.x) > 0.05 ? 3 : 0),
            0,
            Math.sign(velocity.z) * (Math.abs(velocity.z) > 0.05 ? 3 : 0)
        )

        // Use high offset during boot sequences, normal offset when portrait-ready
        const isMobileScreen = window.innerWidth < 768;
        // Shift Z significantly back and slightly up for portrait alignment
        const targetY = isBootingSequence ? 80 : (isMobileScreen ? 55 : 25)
        const offset = new THREE.Vector3(0, targetY * (zoomLevel || 1.0), (isMobileScreen ? 60 : 35) * (zoomLevel || 1.0))

        // Micro floating idle animation
        const floatY = Math.sin(state.clock.elapsedTime * 0.3) * 0.2

        // Desired camera position = electron position + fixed offset + float + anticipation
        const desiredPosition = new THREE.Vector3()
            .copy(electronPos)
            .add(offset)
            .add(anticipation)
        desiredPosition.y += floatY

        // Interpolate quickly during the descent phase to cover the large Y=80 -> Y=25 distance smoothly
        const isMobile = window.innerWidth < 768;
        const baseLerp = isMobile ? 0.02 : 0.05;
        const lerpFactor = bootStage === 'descending' ? 2.5 * delta : baseLerp
        camTarget.current.lerp(desiredPosition, lerpFactor)

        // Interpolate target direction instead of instant lookAt
        lookTarget.current.lerp(electronPos, isMobile ? 0.04 : 0.08)

        state.camera.position.copy(camTarget.current)
        state.camera.lookAt(lookTarget.current)
    })

    return null
}

// No decorative vias, removing that function body entirely
function DecorativeVias() {
    return null
}

export default function MainScene() {
    return (
        <group>
            <fog attach="fog" args={['#000000', 60, 200]} />

            <FollowCamera />

            {/* Lighting Balance - Soft top, slight back-right rim */}
            <ambientLight intensity={0.1} color="#ffffff" />

            {/* Soft top light */}
            <directionalLight position={[0, 40, 5]} intensity={0.9} castShadow shadow-mapSize={[1024, 1024]} color="#ffffff" shadow-bias={-0.0001} />

            {/* Slight rim light from back-right */}
            <directionalLight position={[40, 10, -40]} intensity={0.15} color="#00ff88" />

            {/* Core PCB highlighting */}
            <pointLight position={[0, 15, 0]} intensity={0.2} color="#00ff88" distance={60} />

            <Board />
            <DecorativeVias />
            <TracePaths />
            <ConnectedParts />
            <ICModules />

            <ElectronCore />
        </group>
    )
}
