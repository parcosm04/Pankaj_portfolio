import * as THREE from 'three'
import { resistorsList, decouplingCapacitors, powerCapacitors, cornerVias, extraComponents, ledList, useStore } from '../store'

export function Resistor({ position, rotation }) {
    return (
        <group position={position} rotation={rotation}>
            <mesh receiveShadow castShadow position={[0, 0.4, 0]}>
                <boxGeometry args={[2.6, 0.8, 1]} />
                <meshStandardMaterial color="#d2b48c" roughness={0.9} />
            </mesh>
            {/* Color Bands (Red, Black, Brown, Gold) */}
            <mesh position={[-0.8, 0.41, 0]}>
                <boxGeometry args={[0.2, 0.82, 1.02]} />
                <meshStandardMaterial color="#cc0000" roughness={0.7} />
            </mesh>
            <mesh position={[-0.4, 0.41, 0]}>
                <boxGeometry args={[0.2, 0.82, 1.02]} />
                <meshStandardMaterial color="#000000" roughness={0.7} />
            </mesh>
            <mesh position={[0, 0.41, 0]}>
                <boxGeometry args={[0.2, 0.82, 1.02]} />
                <meshStandardMaterial color="#8b4513" roughness={0.7} />
            </mesh>
            <mesh position={[0.8, 0.41, 0]}>
                <boxGeometry args={[0.2, 0.82, 1.02]} />
                <meshStandardMaterial color="#ffd700" metalness={0.6} roughness={0.4} />
            </mesh>

            {/* End caps to bring total length to 3 */}
            <mesh receiveShadow castShadow position={[-1.4, 0.4, 0]}>
                <boxGeometry args={[0.2, 0.82, 1.02]} />
                <meshStandardMaterial color="#c0c0c0" metalness={0.8} />
            </mesh>
            <mesh receiveShadow castShadow position={[1.4, 0.4, 0]}>
                <boxGeometry args={[0.2, 0.82, 1.02]} />
                <meshStandardMaterial color="#c0c0c0" metalness={0.8} />
            </mesh>
        </group>
    )
}

export function CeramicCapacitor({ position, rotation = [0, 0, 0] }) {
    return (
        <group position={position} rotation={rotation}>
            <mesh receiveShadow castShadow position={[0, 0.5, 0]}>
                <boxGeometry args={[1.8, 1, 1.8]} />
                <meshStandardMaterial color="#e3c598" roughness={0.9} />
            </mesh>
            {/* End caps to bring length to 2 */}
            <mesh receiveShadow castShadow position={[-0.95, 0.5, 0]}>
                <boxGeometry args={[0.1, 1.02, 1.82]} />
                <meshStandardMaterial color="#c0c0c0" metalness={0.8} />
            </mesh>
            <mesh receiveShadow castShadow position={[0.95, 0.5, 0]}>
                <boxGeometry args={[0.1, 1.02, 1.82]} />
                <meshStandardMaterial color="#c0c0c0" metalness={0.8} />
            </mesh>
        </group>
    )
}

export function ElectrolyticCapacitor({ position }) {
    return (
        <group position={position}>
            {/* 3x3 with Height 3 -> Radius 1.5, Height 3 */}
            <mesh receiveShadow castShadow position={[0, 1.5, 0]}>
                <cylinderGeometry args={[1.5, 1.5, 3, 16]} />
                <meshStandardMaterial color="#0b1b3d" metalness={0.4} roughness={0.6} />
            </mesh>
            <mesh receiveShadow castShadow position={[0, 3.01, 0]}>
                <circleGeometry args={[1.5, 16]} rotation={[-Math.PI / 2, 0, 0]} />
                <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.2} />
            </mesh>
        </group>
    )
}

export function ClockCrystal({ position }) {
    return (
        <group position={position}>
            {/* Metallic casing 4x2x1 */}
            <mesh receiveShadow castShadow position={[0, 0.5, 0]}>
                <boxGeometry args={[4, 1, 2]} />
                <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.3} />
            </mesh>
        </group>
    )
}

export function VoltageRegulator({ position }) {
    return (
        <group position={position}>
            {/* Black heatsink 6x4x2 */}
            <mesh receiveShadow castShadow position={[0, 1, 0]}>
                <boxGeometry args={[6, 2, 4]} />
                <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
            </mesh>
            {/* Metallic tab */}
            <mesh position={[0, 2.05, -1]}>
                <boxGeometry args={[4, 0.1, 2]} />
                <meshStandardMaterial color="#c0c0c0" metalness={0.8} roughness={0.4} />
            </mesh>
        </group>
    )
}

export function StatusLED({ position, active }) {
    const energy = useStore(state => state.energy)
    const isPowered = energy > 0

    return (
        <group position={position}>
            <mesh position={[0, 0.5, 0]}>
                <boxGeometry args={[1.5, 1, 1.5]} />
                <meshStandardMaterial color={active && isPowered ? "#00ff88" : "#225533"} emissive={active && isPowered ? "#00ff88" : "#000000"} emissiveIntensity={active && isPowered ? 2 : 0} />
            </mesh>
            {/* Small lens */}
            <mesh position={[0, 1.2, 0]}>
                <sphereGeometry args={[0.6, 16, 16]} />
                <meshStandardMaterial color={active && isPowered ? "#aaffcc" : "#44aa66"} emissive={active && isPowered ? "#00ff88" : "#000000"} emissiveIntensity={active && isPowered ? 2.5 : 0} transparent opacity={0.8} />
            </mesh>
        </group>
    )
}

export default function ConnectedParts() {
    const activeNode = useStore(state => state.currentNode)

    return (
        <group>
            {/* Series Resistors manually placed along traces */}
            {resistorsList.map((res, i) => (
                <Resistor key={`resistor-${i}`} position={res.position} rotation={res.rotation} />
            ))}

            {/* Decoupling Capacitors for Project ICs */}
            {decouplingCapacitors.map((cap, i) => (
                <CeramicCapacitor key={`decouple-${i}`} position={cap.position} />
            ))}

            {/* Power Electrolytic Filter Capacitors near center */}
            {powerCapacitors.map((cap, i) => (
                <ElectrolyticCapacitor key={`power-cap-${i}`} position={cap.position} />
            ))}

            {/* Corner Vias EXACTLY at specified turns */}
            {cornerVias.map((via, i) => (
                <mesh key={`via-${i}`} position={[via.position[0], -0.05, via.position[2]]} rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[0.2, 0.6, 16]} />
                    <meshStandardMaterial color="#b87333" metalness={0.9} roughness={0.2} side={THREE.DoubleSide} />
                </mesh>
            ))}

            {/* Extra Components */}
            <ClockCrystal position={extraComponents.clockCrystal.position} />
            {extraComponents.crystalCaps.map((cap, i) => (
                <CeramicCapacitor key={`crycap-${i}`} position={cap.position} />
            ))}

            <VoltageRegulator position={extraComponents.voltageRegulator.position} />
            {extraComponents.vrCaps.map((cap, i) => (
                <ElectrolyticCapacitor key={`vrcap-${i}`} position={cap.position} />
            ))}

            {/* Status LEDs for Project ICs */}
            {ledList.map((led, i) => {
                // Map LED index to specific node to determine if its active for idle glow
                // 0: desktop, 1: medimeal, 2: rc_car, 3: lifi, 4: spectrum, 5: mosfet
                const nodes = ['desktop_assist', 'medimeal', 'rc_car', 'lifi', 'spectrum', 'mosfet']
                const isActive = activeNode === nodes[i]
                return <StatusLED key={`led-${i}`} position={led.position} active={isActive} />
            })}
        </group>
    )
}
