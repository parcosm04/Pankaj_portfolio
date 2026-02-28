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

    // --- VCC DRAIN SYSTEM ---
    useEffect(() => {
        if (bootStage !== 'ready' || energy <= 0 || isRecharging) return;

        const interval = setInterval(() => {
            useStore.setState(state => {
                if (state.energy <= 0) return {};
                // Movement drain faster than idle
                const drainRate = state.isMoving ? 1.0 : 0.3;
                let newEnergy = state.energy - drainRate;
                if (newEnergy < 0) newEnergy = 0;
                return { energy: Number(newEnergy.toFixed(1)) };
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [bootStage, energy, isRecharging])

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

    const handleRecharge = () => {
        if (isRecharging) return;
        setIsRecharging(true);

        let currentEnergy = 0;
        // Animate 0 to 100 in 2 seconds (updates approx every 50ms = 40 frames)
        // 100 / 40 = 2.5 per frame
        const rechargeInterval = setInterval(() => {
            currentEnergy += 2.5;
            if (currentEnergy >= 100) {
                currentEnergy = 100;
                clearInterval(rechargeInterval);
                setIsRecharging(false);
            }
            useStore.setState({ energy: Number(currentEnergy.toFixed(1)) });

            // If we hit 100, we could reset to center or just let them pick up where they are.
            // Leaving them where they are feels more like a real system recovery.
        }, 50);
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

            {/* Top Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 md:gap-0" style={{ fontSize: 'clamp(12px, 2vw, 16px)' }}>
                {/* Left diagnostic */}
                <div className="w-full md:w-auto bg-[#0a1a12]/80 backdrop-blur-sm p-4 rounded-sm border-l-4 border-pcb-glow flex items-center space-x-3 shadow-lg pointer-events-auto">
                    <Cpu className="text-pcb-glow animate-pulse" size={24} />
                    <div>
                        <h1 className="text-[1em] font-bold text-pcb-glow uppercase tracking-widest">System Core: Pankaj</h1>
                        <p className="text-[0.8em] text-slate-300">Status: {isMoving ? 'ROUTING SIGNAL...' : 'ONLINE & STABLE'}</p>
                    </div>
                </div>

                {/* Right vitals */}
                <div className="flex flex-col space-y-3 pointer-events-auto w-full md:w-64">

                    <div className="bg-[#0a1a12]/80 p-3 rounded-sm border border-pcb-glow/30 flex items-center space-x-3">
                        <Zap className={`text-pcb-glow ${energy < 20 ? 'animate-pulse text-red-500' : ''}`} size={18} />
                        <div className="flex-1">
                            <div className="flex justify-between text-[0.8em] mb-1">
                                <span className="text-slate-400">System VCC</span>
                                <span className="text-pcb-glow">{energy}%</span>
                            </div>
                            <div className="w-full bg-slate-900 rounded-sm h-1">
                                <div
                                    className={`h-full transition-all duration-300 ${energy < 20 ? 'bg-red-500' : 'bg-pcb-glow shadow-[0_0_8px_#00ff88]'}`}
                                    style={{ width: `${energy}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex space-x-2 dashboard-advanced">
                        <div className="bg-[#0a1a12]/80 p-3 rounded-sm border border-pcb-glow/30 flex items-center justify-between text-[0.8em] flex-1">
                            <span className="text-slate-500">Brain Freq</span>
                            <span className={`${energy <= 0 ? 'text-red-500 font-bold animate-pulse' : 'text-pcb-glow font-bold transition-all duration-300'}`}>{displayFreq} GHz</span>
                        </div>
                        <div className="bg-[#0a1a12]/80 p-3 rounded-sm border border-pcb-glow/30 flex items-center justify-between text-[0.8em] flex-1">
                            <Activity size={14} className="text-slate-400 mr-2" />
                            <span className={`${energy <= 0 ? 'text-red-500 font-bold animate-pulse' : 'text-pcb-glow font-bold'}`}>{displaySignal} dBm</span>
                        </div>
                    </div>

                </div>
            </div>

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

            {/* POWER FAILURE POPUP */}
            <div className={`absolute inset-0 flex items-center justify-center pointer-events-none z-40 transition-all duration-300 ${energy <= 0 && energy < 25 ? 'opacity-100 backdrop-blur-[2px]' : 'opacity-0 backdrop-blur-0'}`}>
                <div className={`pointer-events-auto bg-[#050505]/95 border border-white/20 p-6 md:p-8 flex flex-col items-center w-[90%] max-w-[400px] shadow-[0_0_50px_rgba(0,0,0,0.8)] transition-transform duration-500 ${energy <= 0 && !isRecharging ? 'scale-100' : 'scale-95'}`}>
                    <AlertTriangle className="text-red-500 mb-4 animate-pulse" size={32} />
                    <h2 className="text-lg md:text-xl font-bold tracking-[0.3em] md:tracking-[0.4em] text-white mb-2 uppercase text-center">Power Failure</h2>
                    <p className="text-xs font-mono text-slate-400 mb-8 text-center leading-relaxed">System VCC Depleted.<br />Signal Transmission Halted.</p>
                    <button
                        onClick={handleRecharge}
                        disabled={isRecharging}
                        className="px-8 py-3 bg-transparent border border-white/30 hover:border-white text-xs font-mono tracking-[0.2em] text-white transition-all uppercase hover:bg-white/5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isRecharging ? 'RECHARGING...' : 'INITIATE RECHARGE'}
                    </button>
                </div>
            </div>

            {/* MOBILE NAVIGATION HINT */}
            <div className={`absolute bottom-32 left-1/2 transform -translate-x-1/2 flex flex-col items-center justify-center pointer-events-none z-[60] transition-opacity duration-1000 ${mobileHint ? 'opacity-100' : 'opacity-0'} md:hidden bg-[#0a1a12]/90 p-4 border border-pcb-glow/50 rounded-lg shadow-[0_0_15px_rgba(0,255,136,0.2)] backdrop-blur-md`}>
                <p className="text-pcb-glow text-xs font-bold font-mono tracking-widest uppercase mb-2">&gt; Touch Navigation</p>
                <p className="text-white/80 text-xs font-mono text-center mb-1">Tap Nodes to Route Signal</p>
                <p className="text-white/80 text-xs font-mono text-center">Scroll Up to Exit</p>
            </div>

            {/* ZOOM CONTROLS */}
            <div className={`absolute bottom-8 right-8 pointer-events-auto flex flex-col gap-3 z-[60] transition-opacity duration-1000 ${bootStage !== 'ready' ? 'opacity-0' : 'opacity-100'}`}>
                <button onClick={() => useStore.getState().setZoomLevel(-0.15)} className="w-10 h-10 rounded-full bg-[#0a1a12]/90 border border-pcb-glow/50 text-pcb-glow font-bold hover:bg-pcb-glow/20 flex items-center justify-center text-xl shadow-[0_0_15px_rgba(0,255,136,0.2)] backdrop-blur-md transition-all active:scale-95" title="Zoom In">+</button>
                <button onClick={() => useStore.getState().setZoomLevel(0.15)} className="w-10 h-10 rounded-full bg-[#0a1a12]/90 border border-pcb-glow/50 text-pcb-glow font-bold hover:bg-pcb-glow/20 flex items-center justify-center text-xl shadow-[0_0_15px_rgba(0,255,136,0.2)] backdrop-blur-md transition-all active:scale-95" title="Zoom Out">−</button>
            </div>

        </div>
    )
}
