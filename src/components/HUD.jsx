import { useEffect } from 'react'
import { useStore } from '../store'
import { RefreshCw, Zap, Cpu } from 'lucide-react'

export default function HUD() {
    const { energy, frequency, recharge } = useStore()

    useEffect(() => {
        const handleKey = (e) => {
            if (e.key.toLowerCase() === 'r') {
                recharge()
            }
        }
        window.addEventListener('keydown', handleKey)
        return () => window.removeEventListener('keydown', handleKey)
    }, [recharge])

    return (
        <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-6">

            {/* Top Bar */}
            <div className="flex justify-between items-start">
                <div className="glass-panel p-4 rounded-lg pointer-events-auto flex items-center space-x-3">
                    <Cpu className="text-pcb-glow" size={24} />
                    <div>
                        <h1 className="text-sm font-bold text-pcb-glow tracking-widest uppercase">System Core</h1>
                        <p className="text-xs text-slate-300 font-mono">Status: ONLINE</p>
                    </div>
                </div>

                <div className="flex flex-col space-y-3 pointer-events-auto">
                    {/* Energy Bar */}
                    <div className="glass-panel p-3 rounded-lg flex items-center space-x-3 min-w-[200px]">
                        <Zap className={`text-pcb-glow ${energy < 20 ? 'animate-pulse text-red-500' : ''}`} size={20} />
                        <div className="flex-1">
                            <div className="flex justify-between text-xs mb-1 font-mono">
                                <span className="text-slate-300">Energy</span>
                                <span className="text-pcb-glow">{energy}%</span>
                            </div>
                            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-300 ${energy < 20 ? 'bg-red-500' : 'bg-pcb-glow shadow-[0_0_10px_#00ff88]'}`}
                                    style={{ width: `${energy}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Brain Freq */}
                    <div className="glass-panel p-3 rounded-lg flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-400">Brain Freq</span>
                        <span className="text-pcb-glow font-bold">{frequency} GHz</span>
                    </div>

                    {/* Mobile warning / controls hint */}
                    <div className="mt-2 text-right">
                        <p className="text-[10px] text-slate-500 font-mono">Press 'R' to recharge</p>
                        <p className="text-[10px] text-slate-500 font-mono">Use Arrow Keys to Navigate</p>
                    </div>
                </div>
            </div>

            {/* Future: Mobile on-screen controls can go here (bottom right/left) */}
            <div className="flex justify-between md:hidden pointer-events-auto opacity-50 hover:opacity-100 transition-opacity">
                {/* Simple D-pad could be added here */}
            </div>
        </div>
    )
}
