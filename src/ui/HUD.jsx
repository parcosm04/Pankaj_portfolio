import { useEffect, useState } from 'react'
import { useStore } from '../store'
import { Activity, Zap, Cpu, AlertTriangle } from 'lucide-react'

export default function HUD({ onReturnToCore }) {
    const { energy, isMoving, bootStage, isIntroShown, setIntroShown } = useStore()

    const [displayFreq, setDisplayFreq] = useState("3.20")
    const [displaySignal, setDisplaySignal] = useState("-25")

    // Overlay State Pattern
    const [showOverlay, setShowOverlay] = useState(!isIntroShown)
    const [overlayExiting, setOverlayExiting] = useState(false)
    const [isRecharging, setIsRecharging] = useState(false)
    const [mobileHint, setMobileHint] = useState(typeof window !== 'undefined' && window.innerWidth < 768 && !isIntroShown)

    // Keyboard commands
    useEffect(() => {
        const handleKey = (e) => {
            if (e.key.toLowerCase() === 'r' && energy > 0 && !isRecharging) {
                // Instantly reset to center normally
                useStore.setState({ energy: 100, currentNode: 'center' })
            }
        }
        window.addEventListener('keydown', handleKey)
        return () => window.removeEventListener('keydown', handleKey)
    }, [energy, isRecharging])

    // Manage the ONE-TIME cinematic entry overlay
    useEffect(() => {
        if (bootStage === 'ready' && !isIntroShown) {
            const exitTimer = setTimeout(() => {
                setOverlayExiting(true)
            }, 2000)

            const hintTimer = setTimeout(() => {
                setMobileHint(false)
            }, 4500)

            const removeTimer = setTimeout(() => {
                setShowOverlay(false)
                setIntroShown(true)
            }, 3500)

            return () => {
                clearTimeout(exitTimer)
                clearTimeout(hintTimer)
                clearTimeout(removeTimer)
            }
        }
    }, [bootStage, isIntroShown, setIntroShown])

    // --- VCC DRAIN SYSTEM (REMOVED) ---


    // --- DYNAMIC FREQUENCY & SIGNAL SYSTEM ---
    useEffect(() => {
        if (bootStage !== 'ready') return;

        const interval = setInterval(() => {
            const state = useStore.getState();
            const eng = state.energy;
            const moving = state.isMoving;
            const node = state.currentNode;

            // VCC Depleted
            if (eng <= 0) {
                setDisplayFreq("0.00");
                setDisplaySignal("-∞");
                return;
            }

            // Frequency Logic
            let baseFreq = 2.9; // Idle: 2.8 - 3.0
            if (moving) baseFreq = 3.25; // Moving: 3.1 - 3.4

            // Random fluctuation
            let freqVariance = (Math.random() * 0.2) - 0.1;

            // Drop when VCC < 20%
            if (eng < 20) {
                baseFreq -= (20 - eng) * 0.05;
                freqVariance *= 2; // More unstable
            }

            let currentFreq = Math.max(0, baseFreq + freqVariance);
            setDisplayFreq(currentFreq.toFixed(2));

            // Signal Logic
            let baseSignal = -30;
            if (node === 'center') {
                baseSignal = -25; // Strong
            } else if (['spectrum', 'mosfet'].includes(node)) {
                baseSignal = -50; // Medium mid-board
            } else {
                baseSignal = -75; // Weak at edges
            }

            let sigVariance = (Math.random() * 8) - 4;
            if (eng < 20) {
                sigVariance = (Math.random() * 20) - 10; // High fluctuation
            }

            const currentSignal = Math.floor(baseSignal + sigVariance);
            setDisplaySignal(currentSignal.toString());

        }, 800)
        return () => clearInterval(interval)
    }, [bootStage, energy])

    // --- RECHARGE SYSTEM (REMOVED) ---
    const handleRecharge = () => {
        // Removed
    }

    return (
        <div className={`absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-8 font-mono transition-opacity duration-1000 ${bootStage !== 'ready' ? 'opacity-0' : 'opacity-100'}`}>

            {/* Boot overlay text - SINGLE ENTRY ONLY */}
            {(bootStage === 'ready' && showOverlay) && (
                <div
                    className={`absolute inset-0 flex items-center justify-center pointer-events-none z-50 transition-all duration-[1500ms] ease-out
                    ${overlayExiting ? 'opacity-0 -translate-y-[20px] blur-[4px]' : 'opacity-100 translate-y-0 blur-0'}`}
                >
                    <h2 className="text-xl md:text-3xl tracking-[0.5em] text-white hero-glow uppercase font-bold text-center">
                        ENTC SYSTEM ARCHITECTURE v1.0
                    </h2>
                </div>
            )}

            {/* Top Bar - REMOVED TO PREVENT FAKE SYSTEM UI */}


            {/* Bottom Interface Hints */}
            <div className={`w-full text-center flex flex-col items-center pb-4 transition-opacity duration-1000 ${energy <= 0 ? 'opacity-10' : 'opacity-70'}`}>
                <button
                    onClick={onReturnToCore}
                    className="mb-6 px-6 py-2 text-[10px] tracking-widest text-[#00FF41] border border-[#00FF41]/30 hover:bg-[#00FF41]/10 transition-colors uppercase cursor-pointer pointer-events-auto shadow-[0_0_10px_rgba(0,255,65,0)] hover:shadow-[0_0_10px_rgba(0,255,65,0.2)]"
                >
                    &lt; Back to System Core
                </button>
                <p className="text-xs text-pcb-trace font-bold mb-1 tracking-widest uppercase">&gt;&gt;&gt; Instruction Set Loaded</p>
                <p className="text-sm text-slate-300 mb-1">Use <span className="text-pcb-glow font-bold">[Arrow Keys]</span> to Route Current Through the System</p>
                <p className="text-xs text-slate-500">Press <span className="text-slate-300">['R']</span> to Reset to Main Processor | Top-Down Follow Active. Scroll Up to return.</p>
            </div>

            {/* POWER FAILURE POPUP - REMOVED TO PREVENT SUSPICIOUS BEHAVIOR */}


            {/* MOBILE NAVIGATION HINT */}
            <div className={`absolute bottom-32 left-1/2 transform -translate-x-1/2 flex flex-col items-center justify-center pointer-events-none z-[60] transition-opacity duration-1000 ${mobileHint ? 'opacity-100' : 'opacity-0'} md:hidden bg-[#0a1a12]/90 p-4 border border-pcb-glow/50 rounded-lg shadow-[0_0_15px_rgba(0,255,136,0.2)] backdrop-blur-md`}>
                <p className="text-pcb-glow text-xs font-bold font-mono tracking-widest uppercase mb-2">&gt; Touch Navigation</p>
                <p className="text-white/80 text-xs font-mono text-center mb-1">Tap Nodes to Route Signal</p>
                <p className="text-white/80 text-xs font-mono text-center">Scroll Up to Exit</p>
            </div>



        </div>
    )
}
