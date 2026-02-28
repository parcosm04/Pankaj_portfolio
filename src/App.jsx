import { useEffect, useState, useRef } from 'react'
import gsap from 'gsap'
import { Canvas } from '@react-three/fiber'
import { BakeShadows } from '@react-three/drei'
import { EffectComposer, Bloom, DepthOfField } from '@react-three/postprocessing'

import { useStore } from './store'
import MainScene from './scenes/MainScene'
import EnvironmentEffects from './components/EnvironmentEffects'
import HUD from './ui/HUD'
import Landing from './ui/Landing'

function DynamicEffects() {
  const isMoving = useStore((state) => state.isMoving)

  return (
    <EffectComposer disableNormalPass>
      {/* Subtle depth-of-field blur on far ICs. 0 when moving to see routing. */}
      {/* focalLength scaled to avoid blurring the actual board too much */}
      <DepthOfField focusDistance={0.02} focalLength={0.08} bokehScale={isMoving ? 0 : 3.0} height={480} />
      <Bloom luminanceThreshold={0.3} mipmapBlur intensity={2.0} />
    </EffectComposer>
  )
}

function AudioSystem() {
  const isMoving = useStore(state => state.isMoving)
  const bootStage = useStore(state => state.bootStage)
  const hasPlayedInitRef = useRef(false)
  const humRef = useRef(null)

  useEffect(() => {
    // Basic oscillator implementation since we don't have assets yet to rely on
    // This creates a very subtle low hum, professional tone.
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return
    const ctx = new AudioContext()

    // Ambient hum
    const humOsc = ctx.createOscillator()
    humOsc.type = 'sine'
    humOsc.frequency.setValueAtTime(55, ctx.currentTime) // Low hum 55hz

    const humGain = ctx.createGain()
    humGain.gain.setValueAtTime(0.015, ctx.currentTime) // Very quiet

    humOsc.connect(humGain)
    humGain.connect(ctx.destination)
    humOsc.start()
    humRef.current = { osc: humOsc, gain: humGain, ctx }

    return () => {
      humOsc.stop()
      humOsc.disconnect()
      ctx.close()
    }
  }, [])

  // Entry shock effect when reaching 'ready' state
  useEffect(() => {
    if (!humRef.current || bootStage !== 'ready' || hasPlayedInitRef.current) return
    const { ctx, gain } = humRef.current

    // Quick, sharp electrical entry click/pulse
    gain.gain.setValueAtTime(0.015, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 0.05)
    gain.gain.exponentialRampToValueAtTime(0.015, ctx.currentTime + 0.3)

    hasPlayedInitRef.current = true
  }, [bootStage])

  // Spark/pulse sound on turn/move
  useEffect(() => {
    if (!humRef.current || !isMoving) return
    const { ctx, gain } = humRef.current

    // Quick burst to simulate electrical pulse
    gain.gain.setValueAtTime(0.015, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.1)
    gain.gain.exponentialRampToValueAtTime(0.015, ctx.currentTime + 0.6)
  }, [isMoving])

  return null
}

function App() {
  const initiateMove = useStore((state) => state.initiateMove)
  const bootStage = useStore((state) => state.bootStage)
  const [hasEntered, setHasEntered] = useState(false)

  const handleReturnToCore = () => {
    if (useStore.getState().bootStage === 'exiting_pcb') return;
    useStore.getState().setBootStage('exiting_pcb');

    // Exact premium easing
    const customEase = "cubic-bezier(0.4, 0.0, 0.2, 1)";

    // PCB world dims, Energy contraction animation (conceptually handled by black fade here for global exit)
    // Fade to black (0.2s)
    gsap.to('#global-transition-overlay', {
      opacity: 1,
      duration: 0.2,
      ease: customEase,
      onComplete: () => {
        setHasEntered(false);
        useStore.getState().setBootStage('landing');

        // Core fades in (0.5s making total ~700ms)
        gsap.to('#global-transition-overlay', {
          opacity: 0,
          duration: 0.5,
          ease: customEase
        });
      }
    });
  }

  useEffect(() => {
    // Only listen for keys and wheel if they have entered the PCB area
    if (!hasEntered) return

    const handleKeyDown = (e) => {
      const allowedKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']
      if (!allowedKeys.includes(e.key)) return
      initiateMove(e.key)
    }

    const handleWheel = (e) => {
      // Return to landing page on strong scroll up
      if (e.deltaY < -30) {
        handleReturnToCore();
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('wheel', handleWheel)
    }
  }, [initiateMove, hasEntered])

  return (
    <div className="w-screen h-screen overflow-hidden relative font-sans text-white bg-cinematic">
      {/* 2D Landing Intro overlay (slides away on scroll) */}
      {!hasEntered && <Landing onEnter={() => setHasEntered(true)} />}

      <div className="vignette-overlay"></div>

      {hasEntered && bootStage === 'descending' && (
        <div className="absolute inset-0 z-40 bg-black pointer-events-none scene-reveal-overlay"></div>
      )}

      {/* 3D Canvas Layer */}
      <Canvas
        shadows
        className="absolute inset-0 z-0 transparent"
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 1.5]}
      >
        <MainScene />
        <EnvironmentEffects />
        <DynamicEffects />
        <BakeShadows />
      </Canvas>

      {/* Embedded Ambient Audio system */}
      {hasEntered && <AudioSystem />}

      {/* 2D HTML Overlay Layer (PCB UI) */}
      {hasEntered && <HUD onReturnToCore={handleReturnToCore} />}

      {/* Master Transition Overlay for Exiting PCB World */}
      <div id="global-transition-overlay" className="absolute inset-0 z-[100] bg-black pointer-events-none opacity-0"></div>
    </div>
  )
}

export default App
