/* eslint-disable react-hooks/purity */
import { useMemo } from 'react'
import { Line, Html } from '@react-three/drei'
import * as THREE from 'three'
import { useStore, nodesData, pathsData } from '../store'
import Electron from './Electron'
import Components3D from './Components3D'

// Create a physical looking board
function Board() {
    return (
        <mesh receiveShadow position={[0, -0.5, 0]}>
            <boxGeometry args={[40, 1, 30]} />
            {/* A richer, deeper PCB green mask */}
            <meshStandardMaterial color="#0b4625" roughness={0.7} metalness={0.1} />
        </mesh>
    )
}

// Draw the traces using pre-computed path segments from store
function Traces() {
    const energy = useStore(state => state.energy)

    const linePoints = useMemo(() => {
        // Collect unique path segments
        const uniqueSegments = []
        const rawPaths = Object.values(pathsData)
        // To avoid duplicates, we only draw paths, we don't care about direction for static geometry
        const seen = new Set()

        rawPaths.forEach(path => {
            const hash = path.map(p => p.join(',')).join('|')
            const reverseHash = [...path].reverse().map(p => p.join(',')).join('|')

            if (!seen.has(hash) && !seen.has(reverseHash)) {
                uniqueSegments.push(path)
                seen.add(hash)
                seen.add(reverseHash)
            }
        })
        return uniqueSegments
    }, [])

    return (
        <group position={[0, 0.05, 0]}>
            {linePoints.map((points, idx) => (
                <Line
                    key={`trace-${idx}`}
                    points={points}
                    color={energy <= 0 ? "#5a4a16" : "#d4af37"} // Dim channels 40%
                    lineWidth={4}
                />
            ))}
        </group>
    )
}

// Represent nodes as pads or ICs
function NodeMap() {
    const currentNode = useStore((state) => state.currentNode)
    const isMoving = useStore((state) => state.isMoving)

    // Determine which node's panel should be shown
    // We only show the panel when we're stopped AT the node
    const activeDisplayNode = !isMoving ? currentNode : null

    return (
        <group position={[0, 0.04, 0]}>
            {Object.values(nodesData).map(node => {
                const isActive = activeDisplayNode === node.id
                const isCenter = node.id === 'center'

                return (
                    <group key={node.id} position={node.position}>
                        {/* Solder Pad Base */}
                        <mesh receiveShadow castShadow position={[0, 0.1, 0]}>
                            {isCenter ? (
                                <boxGeometry args={[3, 0.2, 3]} />
                            ) : (
                                <cylinderGeometry args={[0.5, 0.5, 0.1, 16]} />
                            )}
                            {/* Copper pad appearance */}
                            <meshStandardMaterial
                                color={isActive ? "#00ff88" : "#d4af37"}
                                metalness={0.9}
                                roughness={0.3}
                                emissive={isActive ? "#00ff88" : "#000"}
                                emissiveIntensity={isActive ? 0.3 : 0}
                            />
                        </mesh>

                        {/* Deeper chip body for center only */}
                        {isCenter && (
                            <mesh receiveShadow castShadow position={[0, 0.3, 0]}>
                                <boxGeometry args={[2.6, 0.4, 2.6]} />
                                <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
                            </mesh>
                        )}

                        {/* HTML Annotation Panel */}
                        {isActive && (
                            <Html
                                position={[0, 1.8, 0]}
                                center
                                zIndexRange={[100, 0]}
                                className="pointer-events-auto"
                            >
                                <div className="glass-panel text-white p-5 rounded-xl w-64 shadow-2xl animate-fade-in border-pcb-glow">
                                    <h2 className={`font-bold text-lg mb-2 text-pcb-glow`}>
                                        {node.label}
                                    </h2>
                                    <div className="h-0.5 w-full bg-slate-800 mb-3" />
                                    {isCenter ? (
                                        <div className="text-sm space-y-1 font-mono text-slate-300">
                                            <p>• AI Systems Developer</p>
                                            <p>• Embedded Systems Engineer</p>
                                            <p>• Patent-Oriented Innovator</p>
                                            <p>• GATE Aspirant | Target: 9.3+</p>
                                        </div>
                                    ) : (
                                        <div className="text-sm font-mono text-slate-400">
                                            <p>System activated. Accessing data logs...</p>
                                            {node.parent && <p className="text-[10px] mt-2 text-pcb-trace border border-pcb-trace/30 inline-block px-1 rounded">PARENT: {node.parent.toUpperCase()}</p>}
                                        </div>
                                    )}
                                </div>
                            </Html>
                        )}
                    </group>
                )
            })}
        </group>
    )
}

// Generate lots of tiny holes (vias) to make it look like a real PCB
function Vias() {
    const count = 150
    const vias = useMemo(() => {
        const arr = []
        for (let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * 35
            const z = (Math.random() - 0.5) * 25
            arr.push([x, 0.01, z])
        }
        return arr
    }, [])

    return (
        <group>
            {vias.map((pos, i) => (
                <group key={i} position={pos}>
                    {/* Metallic Rim */}
                    <mesh rotation={[-Math.PI / 2, 0, 0]}>
                        <ringGeometry args={[0.08, 0.15, 16]} />
                        <meshStandardMaterial color="#c0b080" roughness={0.4} metalness={0.8} side={THREE.DoubleSide} />
                    </mesh>
                    {/* Dark inner depression */}
                    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
                        <circleGeometry args={[0.08, 16]} />
                        <meshBasicMaterial color="#050505" />
                    </mesh>
                </group>
            ))}
        </group>
    )
}

export default function PCBScene() {
    return (
        <group>
            <Board />
            <Vias />
            <Components3D />
            <Traces />
            <NodeMap />
            <Electron />
        </group>
    )
}
