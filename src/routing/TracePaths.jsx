import { useMemo } from 'react'
import { Line } from '@react-three/drei'
import * as THREE from 'three'
import { staticTracesData, tracesData, useStore } from '../store'

export default function TracePaths() {
    const activeTraceId = useStore(state => state.activeTraceId)
    // Add pulsing idle alpha or color logic if desired over time, 
    // but Line from drei doesn't easily support gradient lines without custom shaders.
    // We will use standard bright colors for active, and deep metallic for inactive.

    // Memoize geometry to avoid rebuilding all traces every frame
    const { signalLines, powerLines } = useMemo(() => {
        const sLines = []
        const pLines = []
        const duplicateCheck = new Set()

        Object.entries(tracesData).forEach(([id, trace]) => {
            // Build a hash for both directions to prevent rendering overlapped lines
            const hashForward = trace.points.map(p => p.join(',')).join('|')
            const hashBackward = [...trace.points].reverse().map(p => p.join(',')).join('|')

            if (!duplicateCheck.has(hashForward) && !duplicateCheck.has(hashBackward)) {
                duplicateCheck.add(hashForward)

                if (trace.isPower) {
                    pLines.push({ id, points: trace.points })
                } else {
                    sLines.push({ id, points: trace.points, matches: [id, id.split('->').reverse().join('->')] })
                }
            }
        })

        return { signalLines: sLines, powerLines: pLines }
    }, [])

    const { staticLines, groundLines, extraPowerLines } = useMemo(() => {
        const sLines = []
        const gLines = []
        const pLines = []

        Object.entries(staticTracesData).forEach(([id, trace]) => {
            if (trace.isGround) gLines.push({ id, points: trace.points })
            else if (trace.isPower) pLines.push({ id, points: trace.points })
            else sLines.push({ id, points: trace.points })
        })

        return { staticLines: sLines, groundLines: gLines, extraPowerLines: pLines }
    }, [])

    // Adjusted trace line widths according to prompt specification
    // Standard drei Line components scale thickness with scene, but visually we use these multipliers
    const signalWidth = 1.0 * 2.5
    const powerWidth = 1.8 * 2.5
    const groundWidth = 2.5 * 2.5

    return (
        <group position={[0, 0.05, 0]}>
            {/* Removed dead decorative traces mapping */}
            {/* Static Non-Interactive Traces (Crystal, LED local loops) */}
            {staticLines.map((line, idx) => (
                <Line
                    key={`static-${idx}`}
                    points={line.points}
                    color="#5c3a21" // Deeper Tarnished Etched copper for realism
                    lineWidth={signalWidth}
                />
            ))}

            {/* Ground Bus Lines */}
            {groundLines.map((line, idx) => (
                <Line
                    key={`ground-${idx}`}
                    points={line.points}
                    color="#5c3a21"
                    lineWidth={groundWidth}
                />
            ))}

            {/* Extra Power Distribution (Regulator) */}
            {extraPowerLines.map((line, idx) => (
                <Line
                    key={`ext-power-${idx}`}
                    points={line.points}
                    color="#633e24" // Slightly brighter for power
                    lineWidth={powerWidth}
                />
            ))}

            {/* Heavy power distribution traces */}
            {powerLines.map((line, idx) => (
                <Line
                    key={`power-${idx}`}
                    points={line.points}
                    color="#633e24"
                    lineWidth={powerWidth}
                    name={line.id}
                />
            ))}

            {/* Logic signal traces */}
            {signalLines.map((line, idx) => {
                const isActive = line.matches.includes(activeTraceId)
                // Implement glow logic: 
                // Idle = faint glow (low emissive like tarnished copper) #442b19
                // Active = strong neon pulse #00ff88
                const color = isActive ? "#00ff88" : "#442b19"

                return (
                    <Line
                        key={`signal-${idx}`}
                        points={line.points}
                        color={color}
                        lineWidth={signalWidth}
                        name={line.id}
                    // Bloom pass automatically picks up high brightness #00ff88
                    />
                )
            })}
        </group>
    )
}
