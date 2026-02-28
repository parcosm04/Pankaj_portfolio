import { create } from 'zustand'
import * as THREE from 'three'

// Mutable reference for the camera to follow the electron without React re-renders
export const electronPositionRef = { current: new THREE.Vector3(0, 1, 0) }

export const nodesData = {
    center: {
        id: 'center', label: 'PANKAJ PANDIT – ENTC ENGINEER', position: [0, 0, 0], size: [14, 2, 14], type: 'processor',
        details: [
            { label: 'SYS CORE', isHeader: true },
            { text: 'Embedded + AI Architect' },
            { text: 'Control Systems Focus' },
            { text: 'Hardware–Software Integration' }
        ]
    },

    desktop_assist: {
        id: 'desktop_assist', label: 'INTELLIGENT DESKTOP ASSISTANT', position: [-40, 0, 20], size: [10, 1.5, 10], type: 'ic',
        details: [
            { key: 'ENGINE', val: 'Voice Recognition' },
            { key: 'CORE', val: 'Command Processing Logic' },
            { key: 'STACK', val: 'Python + API Integration' },
            { key: 'DOMAIN', val: 'Human–Machine Interface' },
            { key: 'STATUS', val: 'Functional Build' }
        ]
    },
    medimeal: {
        id: 'medimeal', label: 'MEDIMEAL – AI FOOD ANALYSIS', position: [-40, 0, -20], size: [10, 1.5, 10], type: 'ic',
        details: [
            { key: 'ENGINE', val: 'Ingredient Intelligence' },
            { key: 'DATA', val: 'OpenFoodFacts + USDA' },
            { key: 'SYS', val: 'Allergen Detection Logic' },
            { key: 'UI', val: 'Responsive Web Interface' },
            { key: 'STATUS', val: 'Active Development' }
        ]
    },

    rc_car: {
        id: 'rc_car', label: 'RC CAR – CONTROL SYS PROTOTYPE', position: [40, 0, 20], size: [10, 1.5, 10], type: 'ic',
        details: [
            { key: 'MCU', val: 'Arduino + L293D' },
            { key: 'NAV', val: 'IR Remote + Feedback' },
            { key: 'LOGIC', val: 'Closed-Loop Steering' },
            { key: 'ACTUATION', val: 'Dual DC Motors + Servo' },
            { key: 'STATUS', val: 'Functional Prototype' }
        ]
    },
    lifi: {
        id: 'lifi', label: 'LI-FI COMMUNICATION PROTOTYPE', position: [40, 0, -20], size: [10, 1.5, 10], type: 'ic',
        details: [
            { key: 'PRINCIPLE', val: 'Visible Light Transmission' },
            { key: 'TX', val: 'LED Modulation Circuit' },
            { key: 'RX', val: 'Photodiode Receiver' },
            { key: 'DOMAIN', val: 'Optical Wireless Communication' },
            { key: 'STATUS', val: 'Academic Prototype' }
        ]
    },

    spectrum: {
        id: 'spectrum', label: 'AUDIO SPECTRUM ANALYZER', position: [0, 0, 35], size: [10, 1.5, 10], type: 'ic',
        details: [
            { key: 'METHOD', val: 'Fast Fourier Transform' },
            { key: 'OUTPUT', val: 'Magnitude + Phase Spectrum' },
            { key: 'ENV', val: 'MATLAB / Simulink' },
            { key: 'DOMAIN', val: 'Frequency Analysis' },
            { key: 'STATUS', val: 'Completed' }
        ]
    },
    mosfet: {
        id: 'mosfet', label: 'MOSFET TESTER – DEVICE CHAR.', position: [0, 0, -35], size: [10, 1.5, 10], type: 'ic',
        details: [
            { key: 'TEST', val: 'N & P Channel Detection' },
            { key: 'PARAM', val: 'Threshold Voltage (Vth)' },
            { key: 'CHECK', val: 'Gate-Drain-Source Mapping' },
            { key: 'SYS', val: 'Analog Measurement Circuit' },
            { key: 'STATUS', val: 'Prototype' }
        ]
    },
}

export const connections = {
    center: {
        LeftUp: 'desktop_assist',
        LeftDown: 'medimeal',
        RightUp: 'rc_car',
        RightDown: 'lifi',
        Up: 'spectrum',
        Down: 'mosfet'
    },
    desktop_assist: { Center: 'center', Right: 'spectrum' },
    medimeal: { Center: 'center', Right: 'mosfet' },
    rc_car: { Center: 'center', Left: 'spectrum' },
    lifi: { Center: 'center', Left: 'mosfet' },
    spectrum: { Center: 'center', Left: 'desktop_assist', Right: 'rc_car' },
    mosfet: { Center: 'center', Left: 'medimeal', Right: 'lifi' }
}

export const tracesData = {
    'center->desktop_assist': { points: [[0, 0.02, 7], [-20, 0.02, 7], [-20, 0.02, 20], [-35, 0.02, 20]] },
    'center->medimeal': { points: [[0, 0.02, -7], [-20, 0.02, -7], [-20, 0.02, -20], [-35, 0.02, -20]] },

    'center->rc_car': { points: [[0, 0.02, 7], [20, 0.02, 7], [20, 0.02, 20], [35, 0.02, 20]] },
    'center->lifi': { points: [[0, 0.02, -7], [20, 0.02, -7], [20, 0.02, -20], [35, 0.02, -20]] },

    'center->spectrum': { points: [[0, 0.02, 7], [0, 0.02, 20], [0, 0.02, 30]] },
    'center->mosfet': { points: [[0, 0.02, -7], [0, 0.02, -20], [0, 0.02, -30]] },

    // Alternate routes (Secondary Inter-IC Signal Routes)
    'desktop_assist->spectrum': { points: [[-40, 0.02, 20], [-25, 0.02, 20], [-25, 0.02, 30], [-5, 0.02, 30], [0, 0.02, 30]] },
    'rc_car->spectrum': { points: [[40, 0.02, 20], [25, 0.02, 20], [25, 0.02, 30], [5, 0.02, 30], [0, 0.02, 30]] },
    'medimeal->mosfet': { points: [[-40, 0.02, -20], [-25, 0.02, -20], [-25, 0.02, -30], [-5, 0.02, -30], [0, 0.02, -30]] },
    'lifi->mosfet': { points: [[40, 0.02, -20], [25, 0.02, -20], [25, 0.02, -30], [5, 0.02, -30], [0, 0.02, -30]] }
}

export const staticTracesData = {
    'clock_crystal': { points: [[-8, 0.02, 4], [-7, 0.02, 4]], isStatic: true },
    'power_regulator': { points: [[-50, 0.02, 0], [-30, 0.02, 0], [-30, 0.02, 10], [-5, 0.02, 10], [0, 0.02, 7]], isPower: true },
    'ground_bus': { points: [[-55, 0.02, -38], [55, 0.02, -38]], isGround: true },

    // LED Ground Return loops (connecting to Z=-38 ground bus)
    'led_gnd_desktop': { points: [[-32, 0.02, 20], [-32, 0.02, 35], [-53, 0.02, 35], [-53, 0.02, -38]], isGround: true },
    'led_gnd_care': { points: [[-32, 0.02, -20], [-32, 0.02, -38]], isGround: true },
    'led_gnd_rc': { points: [[32, 0.02, 20], [32, 0.02, 35], [53, 0.02, 35], [53, 0.02, -38]], isGround: true },
    'led_gnd_lifi': { points: [[32, 0.02, -20], [32, 0.02, -38]], isGround: true },
    'led_gnd_spectrum': { points: [[8, 0.02, 35], [20, 0.02, 35], [20, 0.02, 4], [30, 0.02, 4], [30, 0.02, -38]], isGround: true },
    'led_gnd_mosfet': { points: [[8, 0.02, -35], [8, 0.02, -38]], isGround: true },

    // LED local traces (IC -> Resistor -> LED)
    'led_desktop': { points: [[-40, 0.02, 20], [-32, 0.02, 20]], isStatic: true },
    'led_care': { points: [[-40, 0.02, -20], [-32, 0.02, -20]], isStatic: true },
    'led_rc': { points: [[40, 0.02, 20], [32, 0.02, 20]], isStatic: true },
    'led_lifi': { points: [[40, 0.02, -20], [32, 0.02, -20]], isStatic: true },
    'led_spectrum': { points: [[0, 0.02, 35], [8, 0.02, 35]], isStatic: true },
    'led_mosfet': { points: [[0, 0.02, -35], [8, 0.02, -35]], isStatic: true },
}

// Auto-reverse paths for logical connections back to center
Object.keys(tracesData).forEach(hashForward => {
    const [fromId, toId] = hashForward.split('->')
    const hashBackward = `${toId}->${fromId}`
    tracesData[hashBackward] = { points: [...tracesData[hashForward].points].reverse() }
})

export const resistorsList = [
    { position: [-20, 0, 10.5], rotation: [0, 0, 0] },
    { position: [-20, 0, 15.5], rotation: [0, 0, 0] },
    { position: [-20, 0, -10.5], rotation: [0, 0, 0] },
    { position: [-20, 0, -15.5], rotation: [0, 0, 0] },
    { position: [20, 0, 10.5], rotation: [0, 0, 0] },
    { position: [20, 0, 15.5], rotation: [0, 0, 0] },
    { position: [20, 0, -10.5], rotation: [0, 0, 0] },
    { position: [20, 0, -15.5], rotation: [0, 0, 0] },
    { position: [0, 0, 12], rotation: [0, 0, 0] },
    { position: [0, 0, 17], rotation: [0, 0, 0] },
    { position: [0, 0, -12], rotation: [0, 0, 0] },
    { position: [0, 0, -17], rotation: [0, 0, 0] },

    // LED Current Limit Resistors
    { position: [-35, 0, 20], rotation: [0, 0, 0] },
    { position: [-35, 0, -20], rotation: [0, 0, 0] },
    { position: [35, 0, 20], rotation: [0, 0, 0] },
    { position: [35, 0, -20], rotation: [0, 0, 0] },
    { position: [4, 0, 35], rotation: [0, 0, 0] },
    { position: [4, 0, -35], rotation: [0, 0, 0] },
]

export const ledList = [
    { position: [-32, 0, 20] },
    { position: [-32, 0, -20] },
    { position: [32, 0, 20] },
    { position: [32, 0, -20] },
    { position: [8, 0, 35] },
    { position: [8, 0, -35] },
]

export const decouplingCapacitors = [
    { position: [-32, 0, 23] },
    { position: [-32, 0, 17] },
    { position: [-32, 0, -23] },
    { position: [-32, 0, -17] },
    { position: [48, 0, 23] },
    { position: [48, 0, 17] },
    { position: [48, 0, -23] },
    { position: [48, 0, -17] },
    { position: [8, 0, 38] },
    { position: [8, 0, 32] },
    { position: [8, 0, -38] },
    { position: [8, 0, -32] },

    // Secondary Decoupling Capacitors (Extra 1 per IC)
    { position: [-48, 0, 20] }, // Desktop
    { position: [-48, 0, -20] }, // CareForYou
    { position: [48, 0, 20] }, // RC Car
    { position: [48, 0, -20] }, // LiFi
    { position: [-8, 0, 35] }, // Spectrum
    { position: [-8, 0, -35] } // Airvana
]

export const extraComponents = {
    clockCrystal: { position: [-8, 0, 4] },
    crystalCaps: [{ position: [-10, 0, 6] }, { position: [-6, 0, 6] }],
    voltageRegulator: { position: [-50, 0, 0] },
    vrCaps: [{ position: [-55, 0, 5] }, { position: [-45, 0, 5] }]
}

export const powerCapacitors = [
    { position: [-10, 0, 10] },
    { position: [10, 0, -10] }
]

export const cornerVias = [
    { position: [-20, 0, 7] }, { position: [-20, 0, 20] },   // Desktop
    { position: [-20, 0, -7] }, { position: [-20, 0, -20] }, // CareForYou
    { position: [20, 0, 7] }, { position: [20, 0, 20] },     // RC car
    { position: [20, 0, -7] }, { position: [20, 0, -20] },   // LiFi
    { position: [0, 0, 20] },                                // Spectrum
    { position: [0, 0, -20] },                               // Airvana

    // Alternate route vias
    { position: [-25, 0, 20] }, { position: [-25, 0, 30] }, { position: [-5, 0, 30] }, // A
    { position: [25, 0, 20] }, { position: [25, 0, 30] }, { position: [5, 0, 30] },    // B
    { position: [-25, 0, -20] }, { position: [-25, 0, -30] }, { position: [-5, 0, -30] }, // C
    { position: [25, 0, -20] }, { position: [25, 0, -30] }, { position: [5, 0, -30] },    // D

    // Regulator Trace vias
    { position: [-30, 0, 0] }, { position: [-30, 0, 10] }, { position: [-5, 0, 10] }
]

export const useStore = create((set, get) => ({
    bootStage: 'landing', // 'landing' | 'booting' | 'descending' | 'ready'
    isIntroShown: false,
    currentNode: 'center',
    targetNode: null,
    isMoving: false,
    currentPath: [],
    activeTraceId: null,
    energy: 100,
    frequency: 3.2,
    zoomLevel: 1.0,
    toggleLeft: false,
    toggleRight: false,

    setBootStage: (stage) => set({ bootStage: stage }),
    setIntroShown: (val) => set({ isIntroShown: val }),

    setZoomLevel: (delta) => set((state) => ({
        zoomLevel: Math.max(0.5, Math.min(2.0, state.zoomLevel + delta))
    })),

    initiateMove: (directionKey) => {
        const state = get()
        if (state.isMoving) return
        if (state.energy <= 0) return // Block if VCC depleted

        let dir = null;
        if (state.currentNode === 'center') {
            if (directionKey === 'ArrowDown') dir = 'Up'
            else if (directionKey === 'ArrowUp') dir = 'Down'
            else if (directionKey === 'ArrowLeft') {
                dir = state.toggleLeft ? 'LeftDown' : 'LeftUp'
                set({ toggleLeft: !state.toggleLeft })
            }
            else if (directionKey === 'ArrowRight') {
                dir = state.toggleRight ? 'RightDown' : 'RightUp'
                set({ toggleRight: !state.toggleRight })
            }
        } else {
            // Secondary paths via arrow keys 
            if (directionKey === 'ArrowRight' && state.currentNode === 'desktop_assist') dir = 'Right'
            else if (directionKey === 'ArrowRight' && state.currentNode === 'medimeal') dir = 'Right'
            else if (directionKey === 'ArrowLeft' && state.currentNode === 'rc_car') dir = 'Left'
            else if (directionKey === 'ArrowLeft' && state.currentNode === 'lifi') dir = 'Left'

            // From top/bottom poles
            else if (directionKey === 'ArrowLeft' && state.currentNode === 'spectrum') dir = 'Left'
            else if (directionKey === 'ArrowRight' && state.currentNode === 'spectrum') dir = 'Right'
            else if (directionKey === 'ArrowLeft' && state.currentNode === 'mosfet') dir = 'Left'
            else if (directionKey === 'ArrowRight' && state.currentNode === 'mosfet') dir = 'Right'

            // Default return to center if not matching a valid secondary branch
            else if (directionKey === 'ArrowUp' && (state.currentNode === 'desktop_assist' || state.currentNode === 'rc_car' || state.currentNode === 'spectrum')) dir = 'Center'
            else if (directionKey === 'ArrowDown' && (state.currentNode === 'medimeal' || state.currentNode === 'lifi' || state.currentNode === 'mosfet')) dir = 'Center'
            else dir = 'Center' // Fallback escape
        }

        const edges = connections[state.currentNode]
        if (edges && edges[dir]) {
            const nextId = edges[dir]
            const pathHash = `${state.currentNode}->${nextId}`
            const trace = tracesData[pathHash]

            if (trace) {
                set({
                    targetNode: nextId,
                    isMoving: true,
                    currentPath: trace.points,
                    activeTraceId: pathHash,
                    energy: Math.max(0, state.energy - 3)
                })
            }
        }
    },

    completeMove: () => {
        const state = get()
        set({
            currentNode: state.targetNode,
            targetNode: null,
            isMoving: false,
            currentPath: [],
            activeTraceId: null
        })
    },

    recharge: () => set({ energy: 100, currentNode: 'center' })
}))
