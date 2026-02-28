import { useRef } from 'react'
import { Html, Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useStore, nodesData } from '../store'

// Central Hub Processor Model
function MainProcessor({ isActive }) {
    const energy = useStore(state => state.energy)

    return (
        <group>
            {/* Massive IC Body */}
            <mesh receiveShadow castShadow position={[0, 1, 0]}>
                <boxGeometry args={[14, 2, 14]} />
                {/* Apply normal bump/color differential slightly darker */}
                <meshStandardMaterial color="#080808" roughness={0.9} />
            </mesh>

            {/* Engraved Logo/Marking */}
            <Text position={[0, 2.02, 3]} rotation={[-Math.PI / 2, 0, 0]} fontSize={1.2} color="#1a1a1a" opacity={0.6}>
                CORE PROCESSOR
            </Text>

            {/* Emissive center core indicator */}
            <mesh position={[0, 2.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[2, 2]} />
                <meshBasicMaterial color={isActive && energy > 0 ? "#00ff88" : "#0a1f11"} />
            </mesh>

            {/* Many silver tiny pins along edges connecting to board */}
            {[...Array(30)].map((_, i) => (
                <group key={i}>
                    {/* Top edge pins */}
                    <mesh position={[-6.8 + i * 0.47, 0.4, -7.1]}>
                        <boxGeometry args={[0.2, 0.8, 0.4]} />
                        <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.2} />
                    </mesh>
                    {/* Bottom edge pins */}
                    <mesh position={[-6.8 + i * 0.47, 0.4, 7.1]}>
                        <boxGeometry args={[0.2, 0.8, 0.4]} />
                        <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.2} />
                    </mesh>
                    {/* Left edge pins */}
                    <mesh position={[-7.1, 0.4, -6.8 + i * 0.47]}>
                        <boxGeometry args={[0.4, 0.8, 0.2]} />
                        <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.2} />
                    </mesh>
                    {/* Right edge pins */}
                    <mesh position={[7.1, 0.4, -6.8 + i * 0.47]}>
                        <boxGeometry args={[0.4, 0.8, 0.2]} />
                        <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.2} />
                    </mesh>
                </group>
            ))}
        </group>
    )
}

// Smaller generic project IC node
function ProjectIC({ isActive, isPower, id }) {
    const energy = useStore(state => state.energy)

    if (isPower) return null // Power inlet is handled in connected parts

    // Add slight height variance per chip based on string length to look more realistic
    const heightVariant = (id.length % 3) * 0.1

    return (
        <group position={[0, heightVariant, 0]}>
            <mesh receiveShadow castShadow position={[0, 0.75, 0]}>
                <boxGeometry args={[10, 1.5, 10]} />
                <meshStandardMaterial color="#151515" roughness={0.85} />
            </mesh>
            <Text position={[0, 1.51, 0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={1} color="#444" opacity={0.7}>
                {id.toUpperCase().substring(0, 8)}
            </Text>

            {/* Status LED representing the node activation */}
            <mesh position={[4, 1.51, 4]} rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[0.3, 16]} />
                <meshStandardMaterial color={isActive && energy > 0 ? "#00ff88" : "#222"} emissive={isActive && energy > 0 ? "#00ff88" : "#000"} emissiveIntensity={isActive && energy > 0 ? 1.5 : 0} />
            </mesh>

            {/* Solder side-pins */}
            {[...Array(15)].map((_, i) => (
                <group key={`pin-${i}`}>
                    <mesh position={[-4.5 + i * 0.65, 0.4, -5.1]}>
                        <boxGeometry args={[0.3, 0.8, 0.4]} />
                        <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.2} />
                    </mesh>
                    <mesh position={[-4.5 + i * 0.65, 0.4, 5.1]}>
                        <boxGeometry args={[0.3, 0.8, 0.4]} />
                        <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.2} />
                    </mesh>
                </group>
            ))}
        </group>
    )
}

function FloatingHUD({ node }) {
    const groupRef = useRef()

    useFrame((state) => {
        if (groupRef.current) {
            // Slight floating animation exactly 0.5 units above PCB target y = 2.5
            groupRef.current.position.y = 2.5 + Math.sin(state.clock.elapsedTime * 2.0) * 0.1
        }
    })

    return (
        <group ref={groupRef}>
            <Html
                position={[0, 0, 0]}
                center
                zIndexRange={[100, 0]}
                className="pointer-events-none"
            >
                {/* Holographic Panel UI Upgrade - Glassmorphism, Neon glow border */}
                <div className="bg-[#05150c]/50 backdrop-blur-xl border border-pcb-glow/60 shadow-[0_0_25px_rgba(0,255,136,0.3)] text-white p-5 rounded-lg w-72 transition-all duration-500 animate-fade-in-up">
                    <div className="flex items-center space-x-3 mb-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-pcb-glow animate-pulse block shadow-[0_0_10px_#00ff88]"></span>
                        <h2 className="font-bold text-sm tracking-widest uppercase text-pcb-glow drop-shadow-md border-b border-pcb-trace/40 pb-1 w-full flex-1">
                            {node.label}
                        </h2>
                    </div>

                    <div className="text-xs font-mono text-[#aaffcc] space-y-2 drop-shadow-sm leading-relaxed">
                        {node.details ? node.details.map((detail, idx) => {
                            if (detail.isHeader) {
                                return <p key={idx}>&gt; <span className="text-pcb-bg font-bold bg-[#aaffcc] px-1 rounded-sm">{detail.label}</span></p>
                            } else if (detail.text) {
                                return <p key={idx} className="text-slate-200 opacity-90">&gt; {detail.text}</p>
                            } else if (detail.key) {
                                return (
                                    <p key={idx}>
                                        &gt; {detail.key}:{' '}
                                        <span className={detail.key === 'STATUS' ? 'text-pcb-glow' : 'text-white'}>
                                            {detail.val}
                                        </span>
                                    </p>
                                )
                            }
                            return null;
                        }) : (
                            // Fallback if details are missing
                            <p>&gt; <span className="text-white animate-pulse">Routing Details...</span></p>
                        )}
                    </div>
                </div>
            </Html>
        </group>
    )
}

export default function ICModules() {
    const currentNode = useStore((state) => state.currentNode)
    const isMoving = useStore((state) => state.isMoving)

    // Only show panels if not moving
    const displayNode = !isMoving ? currentNode : null

    return (
        <group position={[0, 0.05, 0]}>
            {Object.values(nodesData).map(node => {
                const isActive = displayNode === node.id
                const isCenter = node.id === 'center'
                const isPower = node.id === 'power_in'

                return (
                    <group key={node.id} position={node.position}>
                        {isCenter ? (
                            <MainProcessor isActive={isActive} />
                        ) : (
                            <ProjectIC isActive={isActive} isPower={isPower} id={node.id} />
                        )}

                        {/* Animated Glassmorphism HUD Panel */}
                        {isActive && !isPower && (
                            <FloatingHUD node={node} />
                        )}
                    </group>
                )
            })}
        </group>
    )
}
