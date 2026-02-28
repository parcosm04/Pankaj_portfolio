import * as THREE from 'three'

function Resistor({ position, rotation }) {
    return (
        <group position={position} rotation={rotation}>
            {/* Primary ceramic body (tan/beige base) */}
            <mesh receiveShadow castShadow position={[0, 0.1, 0]}>
                <boxGeometry args={[0.5, 0.2, 0.3]} />
                <meshStandardMaterial color="#d4c4a8" roughness={0.8} />
            </mesh>
            {/* Color bands for realism */}
            <mesh receiveShadow position={[-0.15, 0.105, 0]}>
                <boxGeometry args={[0.05, 0.21, 0.31]} />
                <meshStandardMaterial color="#8b4513" roughness={0.9} />
            </mesh>
            <mesh receiveShadow position={[0, 0.105, 0]}>
                <boxGeometry args={[0.05, 0.21, 0.31]} />
                <meshStandardMaterial color="#000000" roughness={0.9} />
            </mesh>
            <mesh receiveShadow position={[0.15, 0.105, 0]}>
                <boxGeometry args={[0.05, 0.21, 0.31]} />
                <meshStandardMaterial color="#b8860b" roughness={0.9} />
            </mesh>

            {/* Silver end caps */}
            <mesh receiveShadow castShadow position={[-0.3, 0.1, 0]}>
                <boxGeometry args={[0.1, 0.22, 0.32]} />
                <meshStandardMaterial color="#e0e0e0" metalness={0.9} roughness={0.3} />
            </mesh>
            <mesh receiveShadow castShadow position={[0.3, 0.1, 0]}>
                <boxGeometry args={[0.1, 0.22, 0.32]} />
                <meshStandardMaterial color="#e0e0e0" metalness={0.9} roughness={0.3} />
            </mesh>
        </group>
    )
}

function Capacitor({ position, rotation, isElectrolytic = false }) {
    if (isElectrolytic) {
        return (
            <group position={position} rotation={rotation}>
                {/* Electrolytic Capacitor (Tall, dark blue body + silver top) */}
                <mesh receiveShadow castShadow position={[0, 0.6, 0]}>
                    <cylinderGeometry args={[0.3, 0.3, 1.2, 16]} />
                    <meshStandardMaterial color="#0f2537" roughness={0.4} metalness={0.2} />
                </mesh>
                <mesh receiveShadow castShadow position={[0, 1.21, 0]}>
                    <cylinderGeometry args={[0.3, 0.3, 0.05, 16]} />
                    <meshStandardMaterial color="#d0d0d0" metalness={0.9} roughness={0.2} />
                </mesh>
            </group>
        )
    }

    return (
        <group position={position} rotation={rotation}>
            {/* SMD Ceramic Cap (Beige tone) */}
            <mesh receiveShadow castShadow position={[0, 0.1, 0]}>
                <boxGeometry args={[0.4, 0.2, 0.3]} />
                <meshStandardMaterial color="#c2b092" roughness={0.6} metalness={0.1} />
            </mesh>
            {/* Solder caps */}
            <mesh receiveShadow castShadow position={[-0.2, 0.1, 0]}>
                <boxGeometry args={[0.08, 0.21, 0.31]} />
                <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.4} />
            </mesh>
            <mesh receiveShadow castShadow position={[0.2, 0.1, 0]}>
                <boxGeometry args={[0.08, 0.21, 0.31]} />
                <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.4} />
            </mesh>
        </group>
    )
}

export default function Components3D() {
    return (
        <group>
            {/* Add a few decorative larger ICs scattered around */}
            <group position={[-8, 0.1, -6]}>
                <mesh receiveShadow castShadow position={[0, 0.1, 0]}>
                    <boxGeometry args={[1.5, 0.2, 1.5]} />
                    <meshStandardMaterial color="#111" roughness={0.7} />
                </mesh>
            </group>
            <group position={[10, 0.1, 5]}>
                <mesh receiveShadow castShadow position={[0, 0.15, 0]}>
                    <boxGeometry args={[2, 0.3, 1]} />
                    <meshStandardMaterial color="#111" roughness={0.8} />
                </mesh>
            </group>
        </group>
    )
}
