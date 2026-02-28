import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useStore } from '../store'

export default function Landing({ onEnter }) {
    const { bootStage, setBootStage } = useStore()

    const containerRef = useRef(null)
    const overlayRef = useRef(null)
    const icRef = useRef(null)
    const textGroupRef = useRef(null)
    const subtitleGlowRef = useRef(null)
    const scanlineRef = useRef(null)
    const canvasRef = useRef(null)

    // UI Refs for directional views
    const centerViewRef = useRef(null)
    const leftViewRef = useRef(null)
    const rightViewRef = useRef(null)
    const topViewRef = useRef(null)

    // 'center', 'left', 'right', 'top'
    const [, setViewDirection] = useState('center')
    const viewDirectionRef = useRef('center')

    const nameText = "PANKAJ PANDIT"

    // Particles and Pulses
    const particles = useRef([])
    const pulses = useRef([])
    const transitionStreams = useRef([])
    const manualPulseTriggered = useRef(0)
    const mouseRef = useRef({ x: -1000, y: -1000 })
    const touchStartRef = useRef(null)

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const isMobile = window.innerWidth < 768;
            const newParticles = [];

            const electronCount = isMobile ? 25 : 49;
            for (let i = 0; i < electronCount; i++) {
                newParticles.push({
                    type: 'electron',
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                    vx: (Math.random() - 0.5) * 0.05,
                    vy: (Math.random() - 0.5) * 0.05,
                    size: 0.8,
                    alpha: Math.random() * 0.2 + 0.1
                })
            }

            const protonCount = isMobile ? 8 : 17;
            for (let i = 0; i < protonCount; i++) {
                newParticles.push({
                    type: 'proton',
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                    vx: (Math.random() - 0.5) * 0.02,
                    vy: (Math.random() - 0.5) * 0.02,
                    size: 1.5,
                    alpha: Math.random() * 0.3 + 0.2
                })
            }
            particles.current = newParticles;
        }
    }, [])

    // Handle directional scrolling coordinate system
    useEffect(() => {
        let isTransitioning = false;
        let scrollTimeout = null;

        const handleWheel = (e) => {
            if (bootStage !== 'landing' || isTransitioning) return
            e.preventDefault();

            if (scrollTimeout) return;
            scrollTimeout = setTimeout(() => { scrollTimeout = null }, 800);

            const threshold = 20;
            let targetDirection = viewDirectionRef.current;
            const dir = viewDirectionRef.current;

            if (dir === 'center') {
                if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                    if (e.deltaY > threshold) {
                        initiatePCBTransition();
                        return;
                    } else if (e.deltaY < -threshold) {
                        targetDirection = 'top';
                    }
                } else {
                    if (e.deltaX > threshold) targetDirection = 'right';
                    else if (e.deltaX < -threshold) targetDirection = 'left';
                }
            } else if (dir === 'left') {
                if (e.deltaX > threshold || Math.abs(e.deltaY) > threshold) targetDirection = 'center';
            } else if (dir === 'right') {
                if (e.deltaX < -threshold || Math.abs(e.deltaY) > threshold) targetDirection = 'center';
            } else if (dir === 'top') {
                if (e.deltaY > threshold || Math.abs(e.deltaX) > threshold) targetDirection = 'center';
            }

            if (targetDirection !== dir) {
                isTransitioning = true;
                triggerDirectionalTransition(targetDirection, () => {
                    isTransitioning = false;
                });
            }
        }

        const handleKeyDown = (e) => {
            if (bootStage !== 'landing' || isTransitioning) return;
            const dir = viewDirectionRef.current;
            let targetDirection = dir;

            if (dir === 'center') {
                if (e.key === 'ArrowDown') {
                    initiatePCBTransition();
                    return;
                } else if (e.key === 'ArrowUp') {
                    targetDirection = 'top';
                } else if (e.key === 'ArrowLeft') {
                    targetDirection = 'left';
                } else if (e.key === 'ArrowRight') {
                    targetDirection = 'right';
                }
            } else if (dir === 'left') {
                if (e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'Escape') targetDirection = 'center';
            } else if (dir === 'right') {
                if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'Escape') targetDirection = 'center';
            } else if (dir === 'top') {
                if (e.key === 'ArrowDown' || e.key === 'Escape') targetDirection = 'center';
            }

            if (targetDirection !== dir) {
                isTransitioning = true;
                triggerDirectionalTransition(targetDirection, () => {
                    isTransitioning = false;
                });
            }
        };

        const handleTouchStart = (e) => {
            if (bootStage !== 'landing' || isTransitioning) return;
            touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        };

        const handleTouchMove = (e) => {
            if (!touchStartRef.current || bootStage !== 'landing' || isTransitioning) return;
        };

        const handleTouchEnd = (e) => {
            if (!touchStartRef.current || bootStage !== 'landing' || isTransitioning) return;
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;

            const dx = touchEndX - touchStartRef.current.x;
            const dy = touchEndY - touchStartRef.current.y;

            touchStartRef.current = null;

            const threshold = 40;

            if (Math.abs(dx) < threshold && Math.abs(dy) < threshold) return;

            let targetDirection = viewDirectionRef.current;
            const dir = viewDirectionRef.current;

            if (dir === 'center') {
                if (Math.abs(dy) > Math.abs(dx)) {
                    if (dy > threshold) { // Swipe Down
                        initiatePCBTransition();
                        return;
                    } else if (dy < -threshold) { // Swipe Up
                        targetDirection = 'top';
                    }
                } else {
                    if (dx > threshold) targetDirection = 'right'; // Swipe Right
                    else if (dx < -threshold) targetDirection = 'left'; // Swipe Left
                }
            } else if (dir === 'left') {
                if (dx > threshold || Math.abs(dy) > threshold) targetDirection = 'center';
            } else if (dir === 'right') {
                if (dx < -threshold || Math.abs(dy) > threshold) targetDirection = 'center';
            } else if (dir === 'top') {
                if (dy > threshold || Math.abs(dx) > threshold) targetDirection = 'center';
            }

            if (targetDirection !== dir) {
                isTransitioning = true;
                triggerDirectionalTransition(targetDirection, () => {
                    isTransitioning = false;
                });
            }
        };

        if (bootStage === 'landing') {
            window.addEventListener('wheel', handleWheel, { passive: false })
            window.addEventListener('keydown', handleKeyDown)
            window.addEventListener('touchstart', handleTouchStart, { passive: true })
            window.addEventListener('touchmove', handleTouchMove, { passive: true })
            window.addEventListener('touchend', handleTouchEnd, { passive: true })
            return () => {
                window.removeEventListener('wheel', handleWheel)
                window.removeEventListener('keydown', handleKeyDown)
                window.removeEventListener('touchstart', handleTouchStart)
                window.removeEventListener('touchmove', handleTouchMove)
                window.removeEventListener('touchend', handleTouchEnd)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bootStage])

    // Heartbeat, Scanline, and Cursor Tilt mapping
    useEffect(() => {
        if (bootStage !== 'landing') return;

        const heartbeatInterval = setInterval(() => {
            gsap.to(icRef.current, {
                opacity: "+=0.08",
                scale: 1.02,
                duration: 0.15,
                yoyo: true,
                repeat: 1,
                ease: "power1.inOut"
            });
            manualPulseTriggered.current = 2; // subtle glowing of channels
        }, 4000 + Math.random() * 2000);

        const scanlineInterval = setInterval(() => {
            if (scanlineRef.current) {
                gsap.fromTo(scanlineRef.current,
                    { y: '0%', opacity: 0.1 },
                    { y: '100%', opacity: 0, duration: 1.2, ease: "power1.inOut" }
                )
            }
        }, 10000);

        const handleMouseMove = (e) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };

            // Slight tilt (max 4°)
            const cx = window.innerWidth / 2;
            const cy = window.innerHeight / 2;
            const dx = (e.clientX - cx) / cx;
            const dy = (e.clientY - cy) / cy;

            if (icRef.current) {
                gsap.to(icRef.current, {
                    rotationY: dx * 4,
                    rotationX: -dy * 4,
                    duration: 0.5,
                    ease: "power2.out"
                });
            }
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            clearInterval(heartbeatInterval);
            clearInterval(scanlineInterval);
            window.removeEventListener('mousemove', handleMouseMove);
        }
    }, [bootStage])

    function initiatePCBTransition() {
        if (bootStage !== 'landing') return;
        setBootStage('descending');

        const tl = gsap.timeline();
        const customEase = "cubic-bezier(0.4, 0.0, 0.2, 1)";

        // Core -> Projects (Total roughly 900ms)
        tl.to(textGroupRef.current, { opacity: 0.4, scale: 1.05, duration: 0.5, ease: customEase }, 0)
            .to(['.nav-indicators', leftViewRef.current, rightViewRef.current], { opacity: 0, duration: 0.3 }, 0)
            .to(icRef.current, { opacity: 0.6, scale: 1.1, duration: 0.4, ease: customEase }, 0)
            .to(textGroupRef.current, { opacity: 0, duration: 0.4 }, 0.3)
            .to(overlayRef.current, { opacity: 1, duration: 0.25, onComplete: () => onEnter() }, "+=0.1");

        // Fire downward pulse visually on transition 
        manualPulseTriggered.current = 6;
    }

    function triggerDirectionalTransition(direction, onComplete) {
        const prevDirection = viewDirectionRef.current;
        viewDirectionRef.current = direction;
        setViewDirection(direction);

        const views = {
            center: { ref: centerViewRef.current, x: 0, y: 0 },
            left: { ref: leftViewRef.current, x: -50, y: 0 },
            right: { ref: rightViewRef.current, x: 50, y: 0 },
            top: { ref: topViewRef.current, x: 0, y: -50 },
        };

        const activeView = views[direction];
        const prevView = views[prevDirection];

        // Exact premium easing
        const customEase = "cubic-bezier(0.4, 0.0, 0.2, 1)";

        const tl = gsap.timeline({ onComplete: () => onComplete && onComplete() });

        if (prevView && prevView.ref) {
            let exitX = 0;
            let exitY = 0;
            if (direction === 'left') exitX = 30;
            else if (direction === 'right') exitX = -30;
            else if (direction === 'top') exitY = 30;
            else if (direction === 'center') {
                if (prevDirection === 'left') exitX = -30;
                if (prevDirection === 'right') exitX = 30;
                if (prevDirection === 'top') exitY = -30;
            }

            tl.to(prevView.ref, {
                opacity: 0, x: exitX, y: exitY, duration: 0.8, ease: customEase,
                onComplete: () => { gsap.set(prevView.ref, { display: 'none' }) }
            }, 0)
        }

        if (activeView && activeView.ref) {
            let entryX = 0;
            let entryY = 0;
            if (direction === 'left') entryX = -30;
            else if (direction === 'right') entryX = 30;
            else if (direction === 'top') entryY = -30;
            else if (direction === 'center') {
                if (prevDirection === 'left') entryX = 30;
                if (prevDirection === 'right') entryX = -30;
                if (prevDirection === 'top') entryY = 30;
            }

            gsap.set(activeView.ref, { display: 'flex', opacity: 0, x: entryX, y: entryY });
            tl.to(activeView.ref, { opacity: 1, x: 0, y: 0, duration: 0.8, ease: customEase }, 0.1)
        }

        // Fire horizontal/vertical particle stream tracking direction
        if (direction === 'right' || (direction === 'center' && prevDirection === 'right')) {
            fireTransitionStream('right');
        } else if (direction === 'left' || (direction === 'center' && prevDirection === 'left')) {
            fireTransitionStream('left');
        } else if (direction === 'top' || (direction === 'center' && prevDirection === 'top')) {
            fireTransitionStream('top');
        }
    }

    function fireTransitionStream(dir) {
        const count = 30 + Math.floor(Math.random() * 20);
        const newStream = [];
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;

        for (let i = 0; i < count; i++) {
            // Narrow stream
            const yOffset = (Math.random() - 0.5) * 40;
            const xOffset = (Math.random() - 0.5) * 40;

            // High initial velocity fading over time in loop
            let vx = 0;
            let vy = 0;
            if (dir === 'right') vx = (6 + Math.random() * 4);
            else if (dir === 'left') vx = -(6 + Math.random() * 4);
            else if (dir === 'top') vy = -(6 + Math.random() * 4);

            newStream.push({
                x: cx + xOffset,
                y: cy + yOffset,
                vx: vx,
                vy: vy || ((dir === 'left' || dir === 'right') ? (Math.random() - 0.5) * 0.1 : 0),
                size: Math.random() * 1.5 + 0.5, // 1-2px size
                alpha: 1.0,
                life: 1.0,
                dir: dir
            });
        }
        transitionStreams.current.push(...newStream);
    }

    // Interactive Name Hover Effect
    const handleNameHover = () => {
        gsap.to(icRef.current, { opacity: 0.45, duration: 0.4, ease: "power2.out" })
        gsap.to(subtitleGlowRef.current, { opacity: 1, duration: 0.4, ease: "power2.out" })

        // Emit one manual pulse
        manualPulseTriggered.current = 1;

        // Subtle horizontal scanline passing once
        gsap.fromTo(scanlineRef.current,
            { y: '0%', opacity: 0.1 },
            { y: '100%', opacity: 0, duration: 1.2, ease: "power1.inOut" }
        )
    }

    const handleNameLeave = () => {
        gsap.to(icRef.current, { opacity: 0.30, duration: 0.6, ease: "power2.inOut" })
        gsap.to(subtitleGlowRef.current, { opacity: 0.8, duration: 0.6, ease: "power2.inOut" })
    }


    // Canvas loop for particles, channels and pulses
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        let animationFrameId
        let isActive = true
        let lastPulseTime = performance.now();

        const updateSize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        window.addEventListener('resize', updateSize)
        updateSize()

        const render = (time) => {
            if (!isActive) return

            ctx.clearRect(0, 0, canvas.width, canvas.height)

            const cx = canvas.width / 2;
            const cy = canvas.height / 2;

            // Render static channels (5 left, 5 right, 5 top, 5 bottom) aligned precisely to IC edges
            const drawChannels = () => {
                const spacing = 18;
                const length = 400;

                ctx.lineWidth = 0.5;
                const drawLine = (x1, y1, x2, y2, gradX1, gradY1, gradX2, gradY2) => {
                    const grad = ctx.createLinearGradient(gradX1, gradY1, gradX2, gradY2);
                    grad.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
                    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
                    ctx.strokeStyle = grad;
                    ctx.beginPath();
                    ctx.moveTo(x1, y1);
                    ctx.lineTo(x2, y2);
                    ctx.stroke();
                }

                // 240px width/height IC -> bounds are +/- 120 from center
                for (let i = -2; i <= 2; i++) {
                    const offset = i * spacing;
                    // Top (starts exactly at top edge)
                    drawLine(cx + offset, cy - 120, cx + offset, cy - length, cx + offset, cy - 120, cx + offset, cy - length);
                    // Bottom (starts exactly at bottom edge)
                    drawLine(cx + offset, cy + 120, cx + offset, cy + length, cx + offset, cy + 120, cx + offset, cy + length);
                    // Left (starts exactly at left edge)
                    drawLine(cx - 120, cy + offset, cx - length, cy + offset, cx - 120, cy + offset, cx - length, cy + offset);
                    // Right (starts exactly at right edge)
                    drawLine(cx + 120, cy + offset, cx + length, cy + offset, cx + 120, cy + offset, cx + length, cy + offset);
                }
            }
            drawChannels();

            // Emit pulses
            if (time - lastPulseTime > 2000 + Math.random() * 1000) {
                if (pulses.current.length < 10) {
                    lastPulseTime = time;
                    const directions = ['top', 'bottom', 'left', 'right'];
                    const dir = directions[Math.floor(Math.random() * directions.length)];
                    const offset = (Math.floor(Math.random() * 5) - 2) * 18;

                    let startX, startY, vx, vy;
                    if (dir === 'top') { startX = cx + offset; startY = cy - 120; vx = 0; vy = -2; }
                    else if (dir === 'bottom') { startX = cx + offset; startY = cy + 120; vx = 0; vy = 2; }
                    else if (dir === 'left') { startX = cx - 120; startY = cy + offset; vx = -2; vy = 0; }
                    else if (dir === 'right') { startX = cx + 120; startY = cy + offset; vx = 2; vy = 0; }

                    pulses.current.push({ x: startX, y: startY, vx, vy, life: 1.0 });
                }
            }

            // Extra manual pulses from user interaction
            if (manualPulseTriggered.current > 0) {
                for (let i = 0; i < manualPulseTriggered.current; i++) {
                    const directions = ['top', 'bottom', 'left', 'right'];
                    const dir = directions[Math.floor(Math.random() * directions.length)];
                    const offset = (Math.floor(Math.random() * 5) - 2) * 18;

                    let startX, startY, vx, vy;
                    if (dir === 'top') { startX = cx + offset; startY = cy - 120; vx = 0; vy = -2; }
                    else if (dir === 'bottom') { startX = cx + offset; startY = cy + 120; vx = 0; vy = 2; }
                    else if (dir === 'left') { startX = cx - 120; startY = cy + offset; vx = -2; vy = 0; }
                    else if (dir === 'right') { startX = cx + 120; startY = cy + offset; vx = 2; vy = 0; }

                    pulses.current.push({ x: startX, y: startY, vx, vy, life: 1.0 });
                }
                manualPulseTriggered.current = 0;
            }

            // Render Pulses
            for (let i = pulses.current.length - 1; i >= 0; i--) {
                const p = pulses.current[i];
                p.x += p.vx;
                p.y += p.vy;
                p.life -= 0.005;

                if (p.life <= 0) {
                    pulses.current.splice(i, 1);
                    continue;
                }

                ctx.fillStyle = `rgba(255, 255, 255, ${p.life})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
                ctx.shadowColor = 'rgba(255,255,255,0.8)';
                ctx.shadowBlur = 8;
                ctx.fill();
                ctx.shadowBlur = 0;
            }

            // Render Transition Streams
            for (let i = transitionStreams.current.length - 1; i >= 0; i--) {
                const s = transitionStreams.current[i];
                s.x += s.vx;
                s.y += s.vy;

                // Fade out as it moves away from center
                const distFromCenter = Math.abs(s.x - cx);
                const maxDist = window.innerWidth / 2;
                s.alpha = Math.max(0, 1.0 - (distFromCenter / maxDist));
                s.life -= 0.015;

                if (s.life <= 0 || s.alpha <= 0) {
                    transitionStreams.current.splice(i, 1);
                    continue;
                }

                ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
                ctx.fill();
            }

            // Render Particles
            const mx = mouseRef.current.x;
            const my = mouseRef.current.y;

            particles.current.forEach(p => {
                let bendX = 0;
                let bendY = 0;
                const dx = mx - p.x;
                const dy = my - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                // Bend particles toward cursor
                if (dist > 0 && dist < 250) {
                    const force = (250 - dist) / 250;
                    bendX = (dx / dist) * force * 0.4;
                    bendY = (dy / dist) * force * 0.4;
                }

                p.x += p.vx + bendX;
                p.y += p.vy + bendY;

                if (p.x < -20) p.x = canvas.width + 20;
                if (p.x > canvas.width + 20) p.x = -20;
                if (p.y < -20) p.y = canvas.height + 20;
                if (p.y > canvas.height + 20) p.y = -20;

                ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            });

            animationFrameId = requestAnimationFrame(render)
        }

        animationFrameId = requestAnimationFrame(render)

        return () => {
            isActive = false
            window.removeEventListener('resize', updateSize)
            cancelAnimationFrame(animationFrameId)
        }
    }, [bootStage])

    const skillGroups = [
        {
            title: "CORE ENGINEERING",
            skills: ["Embedded Systems", "Control Systems", "Electronics Design"]
        },
        {
            title: "SOFTWARE & DEVELOPMENT",
            skills: ["Python", "C / C++", "Java", "Web Development"]
        },
        {
            title: "AI & INTELLIGENT SYSTEMS",
            skills: ["Machine Learning", "Computer Vision", "Data Processing"]
        },
        {
            title: "PROFESSIONAL SKILLS",
            skills: ["Leadership", "Good Communication", "System Thinking"]
        }
    ];

    return (
        <div ref={containerRef} className="fixed inset-0 z-50 flex flex-col items-center justify-center font-sans overflow-hidden bg-[#000000] text-white">

            {/* Soft Horizontal Scanline (triggered on hover) */}
            <div ref={scanlineRef} className="absolute inset-0 pointer-events-none z-30 opacity-0" style={{ background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.05) 50%, transparent)', height: '10%' }}></div>

            {/* Pure Black Background with Reduced Soft Glow (-25% radius for sharper presence) */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] pointer-events-none z-0 mix-blend-screen"
                style={{
                    background: 'radial-gradient(circle at center, rgba(255,255,255,0.12) 0%, transparent 50%)',
                    filter: 'blur(25px)'
                }}>
            </div>

            {/* Translucent IC Silhouette (opacity 0.30, higher border clarity, micro grid, tilt behavior) */}
            <div ref={icRef}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[240px] h-[240px] pointer-events-none z-10 opacity-[0.30] flex items-center justify-center transition-all duration-100 ease-out"
                style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
            >
                {/* Micro Grid Pattern */}
                <div className="absolute inset-0 border border-white/50 rounded-md"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
                        backgroundSize: '16px 16px'
                    }}
                ></div>
                <div className="w-[80%] h-[80%] border border-white/30 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="w-[40%] h-[40%] bg-white/10 flex items-center justify-center">
                        <div className="w-[20%] h-[20%] bg-white/20 animate-pulse"></div>
                    </div>
                </div>
            </div>

            {/* Canvas for channels and particles */}
            <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10" />

            {/* ======================= */}
            {/* ROUTER CONTENT VIEWS    */}
            {/* ======================= */}

            {/* VIEW: CENTER (HUB) */}
            <div ref={centerViewRef} className="absolute inset-0 flex flex-col items-center justify-center z-20">
                {/* Foreground Text Overlay */}
                <div ref={textGroupRef}
                    className="relative flex flex-col items-center justify-center pointer-events-auto z-20"
                    onMouseEnter={handleNameHover}
                    onMouseLeave={handleNameLeave}>
                    <h1 className="text-2xl sm:text-3xl md:text-5xl font-normal tracking-[0.3em] text-white/90 select-none cursor-default text-center pl-[0.3em]">
                        {nameText}
                    </h1>

                    <h2 ref={subtitleGlowRef} className="mt-[15px] md:mt-[20px] text-[#00FF41]/40 text-[8px] sm:text-[9px] md:text-[11px] font-mono tracking-[0.2em] md:tracking-[0.3em] uppercase select-none flex items-center opacity-80 transition-opacity cursor-default max-w-[95%] text-center justify-center">
                        <span className="text-[#00FF41]/40 mr-2 md:mr-3">&gt;</span> <span className="text-white/80">Electronics & Intelligent Systems Engineer</span>
                    </h2>
                </div>

                {/* Clickable Directional Navigation (Minimalist) */}
                <div className="absolute inset-0 pointer-events-none z-30 opacity-100 nav-indicators">
                    {/* Up -> About */}
                    <div className="absolute top-6 sm:top-8 md:top-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center pointer-events-auto cursor-pointer group"
                        onClick={() => triggerDirectionalTransition('top')}>
                        <span className="mb-4 text-white/60 text-[10px] font-sans opacity-0 transform translate-y-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0 text-center">↑</span>
                        <div className="w-[1px] h-12 bg-white/10 group-hover:bg-white group-hover:h-[65px] group-hover:translate-y-[10px] transition-all duration-[250ms] ease-out shadow-[0_0_10px_rgba(255,255,255,0)] group-hover:shadow-[0_0_10px_rgba(255,255,255,0.3)]"></div>
                        <span className="mt-3 text-[10px] font-mono tracking-[0.4em] uppercase text-white/55 group-hover:text-white group-hover:scale-[1.08] group-hover:tracking-[0.45em] transition-all duration-[250ms] ease-out">About</span>
                    </div>

                    {/* Down -> Projects */}
                    <div className="absolute bottom-6 sm:bottom-8 md:bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center pointer-events-auto cursor-pointer group"
                        onClick={initiatePCBTransition}>
                        <span className="text-[10px] font-mono tracking-[0.4em] uppercase mb-3 text-white/55 group-hover:text-white group-hover:scale-[1.08] group-hover:tracking-[0.45em] transition-all duration-[250ms] ease-out">Projects</span>
                        <div className="w-[1px] h-12 bg-white/10 group-hover:bg-white group-hover:h-[65px] group-hover:-translate-y-[10px] transition-all duration-[250ms] ease-out shadow-[0_0_10px_rgba(255,255,255,0)] group-hover:shadow-[0_0_10px_rgba(255,255,255,0.3)]"></div>
                        <span className="mt-4 text-white/60 text-[10px] font-sans opacity-0 transform -translate-y-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0 text-center">↓</span>
                    </div>

                    {/* Left -> Contact */}
                    <div className="absolute top-1/2 left-4 sm:left-6 md:left-10 transform -translate-y-1/2 flex items-center origin-left pointer-events-auto cursor-pointer group -rotate-90 md:rotate-0"
                        onClick={() => triggerDirectionalTransition('left')}>
                        <span className="text-[10px] font-mono tracking-[0.4em] uppercase text-white/55 group-hover:text-white group-hover:scale-[1.08] group-hover:tracking-[0.45em] transition-all duration-[250ms] ease-out" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>Contact</span>
                        <div className="hidden md:block w-12 h-[1px] bg-white/10 group-hover:w-[65px] group-hover:bg-white group-hover:translate-x-[10px] transition-all duration-[250ms] ease-out shadow-[0_0_10px_rgba(255,255,255,0)] group-hover:shadow-[0_0_10px_rgba(255,255,255,0.3)] mx-4"></div>
                        <span className="text-white/60 text-[10px] font-sans opacity-0 transform -translate-x-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0 hidden md:block">→</span>
                    </div>

                    {/* Right -> Skills */}
                    <div className="absolute top-1/2 right-4 sm:right-6 md:right-10 transform -translate-y-1/2 flex items-center origin-right pointer-events-auto cursor-pointer group rotate-90 md:rotate-0"
                        onClick={() => triggerDirectionalTransition('right')}>
                        <span className="mr-4 text-white/60 text-[10px] font-sans opacity-0 transform translate-x-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0 hidden md:block">←</span>
                        <div className="hidden md:block w-12 h-[1px] bg-white/10 group-hover:w-[65px] group-hover:bg-white group-hover:-translate-x-[10px] transition-all duration-[250ms] ease-out shadow-[0_0_10px_rgba(255,255,255,0)] group-hover:shadow-[0_0_10px_rgba(255,255,255,0.3)] mr-4"></div>
                        <span className="text-[10px] font-mono tracking-[0.4em] uppercase text-white/55 group-hover:text-white group-hover:scale-[1.08] group-hover:tracking-[0.45em] transition-all duration-[250ms] ease-out" style={{ writingMode: 'vertical-rl' }}>Skills</span>
                    </div>
                </div>
            </div>

            {/* VIEW: CONTACT (LEFT) */}
            <div ref={leftViewRef} className="absolute inset-0 flex flex-col items-center justify-center z-20 hidden" style={{ display: 'none' }}>
                <div className="flex flex-col items-center mb-8 md:mb-10 mt-12 md:mt-0">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-[0.3em] md:tracking-[0.4em] text-white uppercase border-b border-white/30 pb-3 w-56 sm:w-64 text-center">CONTACT</h2>
                </div>

                <div className="flex flex-col gap-4 md:gap-6 text-center w-[90%] md:w-[80%] max-w-[400px]">
                    {[
                        { label: 'EMAIL', value: 'pankajpandi0426@gmail.com', href: 'mailto:pankajpandi0426@gmail.com' },
                        { label: 'LINKEDIN', value: 'linkedin.com/in/pankaj-pandit-96b952318', href: 'https://www.linkedin.com/in/pankaj-pandit-96b952318' },
                        { label: 'GITHUB', value: 'github.com/parcosm04', href: 'https://github.com/parcosm04' }
                    ].map(item => (
                        <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer"
                            className="group/contact relative flex flex-col items-center justify-center w-full py-5 border border-white/30 bg-[#0b0b0b] pointer-events-auto transition-all duration-300 ease-out hover:scale-[1.03] hover:border-white cursor-pointer overflow-hidden">

                            <span className="font-sans text-[9px] font-medium tracking-[0.3em] text-white/50 uppercase mb-2 group-hover/contact:text-white/70 transition-colors uppercase z-10 flex items-center">
                                {item.label}
                                <span className="ml-2 text-[#00FF41]/0 group-hover/contact:text-[#00FF41]/80 transition-all duration-300 transform -translate-x-2 group-hover/contact:translate-x-0 font-sans">
                                    ↗
                                </span>
                            </span>
                            <span className="font-mono text-[11px] tracking-[0.1em] text-white z-10">{item.value}</span>

                            {/* Pulse Animation Line */}
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/contact:animate-[scan_1.5s_ease-out_infinite] pointer-events-none"></div>
                        </a>
                    ))}
                </div>

                <p className="mt-12 text-[9px] font-mono tracking-[0.4em] text-white/20 uppercase animate-fade-in-up">
                    Open Communication Channel
                </p>

                <div className="absolute top-1/2 right-12 transform -translate-y-1/2 flex flex-col items-center pointer-events-auto cursor-pointer group" onClick={() => triggerDirectionalTransition('center')}>
                    <span className="font-mono text-[9px] tracking-[0.3em] text-white/40 uppercase transition-colors duration-500 group-hover:text-white mb-2" style={{ writingMode: 'vertical-rl' }}>Back to Core</span>
                    <div className="w-[1px] h-8 bg-white/20 transition-all duration-500 group-hover:h-12 group-hover:bg-white"></div>
                </div>
            </div>

            {/* VIEW: SKILLS (RIGHT) */}
            <div ref={rightViewRef} className="absolute inset-0 flex flex-col items-center justify-center z-20 hidden" style={{ display: 'none' }}>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-normal tracking-[0.3em] md:tracking-[0.4em] text-white/90 mb-4 md:mb-8 uppercase mt-8 md:mt-0">Capabilities</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 md:gap-x-16 gap-y-6 md:gap-y-12 w-[90%] md:w-[80%] max-w-[800px] max-h-[70vh] overflow-y-auto style-scrollbar pb-6 px-2 md:max-h-none md:overflow-visible md:px-0">
                    {skillGroups.map((group, index) => (
                        <div key={index} className="flex flex-col items-center text-center w-full">
                            <h3 className="text-[10px] font-sans font-medium tracking-[0.3em] text-white/90 uppercase mb-4 w-[85%] border-b border-white/20 pb-2">{group.title}</h3>
                            <div className="w-full flex flex-col gap-2 items-center">
                                {group.skills.map(skill => (
                                    <div key={skill} className="group/skill relative flex items-center justify-center w-[85%] py-3 border border-white/35 bg-[#0b0b0b] pointer-events-auto transition-all duration-300 ease-out hover:scale-[1.02] hover:border-white cursor-default overflow-hidden">

                                        {/* Status Indicator */}
                                        <div className="absolute left-6 w-1.5 h-1.5 rounded-full border border-white/30 group-hover/skill:bg-white group-hover/skill:border-white transition-all duration-300"></div>

                                        <span className="font-mono text-[10px] tracking-[0.2em] text-white z-10">{skill}</span>

                                        {/* Pulse Animation Line */}
                                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/skill:animate-[scan_1.5s_ease-out_infinite] pointer-events-none"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="absolute top-1/2 left-12 transform -translate-y-1/2 flex items-center origin-left pointer-events-auto cursor-pointer group -rotate-90 md:rotate-0" onClick={() => triggerDirectionalTransition('center')}>
                    <div className="hidden md:block w-8 h-[1px] bg-white/20 transition-all duration-500 group-hover:w-12 group-hover:bg-white mr-4"></div>
                    <span className="text-[10px] font-sans font-light tracking-[0.3em] text-white/40 uppercase transition-colors duration-500 group-hover:text-white" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>Hub</span>
                </div>
            </div>

            {/* VIEW: ABOUT (TOP) */}
            <div ref={topViewRef} className="absolute inset-0 flex flex-col items-center justify-center z-20 hidden" style={{ display: 'none' }}>
                <div className="flex flex-col items-center mb-6 md:mb-10 mt-12 md:mt-0">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-[0.3em] md:tracking-[0.4em] text-white uppercase border-b border-white/30 pb-2 sm:pb-3 w-64 sm:w-72 text-center">ABOUT THE SYSTEM</h2>
                </div>

                <div className="flex flex-col gap-5 md:gap-8 w-[90%] md:w-[80%] max-w-[500px] text-center max-h-[70vh] overflow-y-auto style-scrollbar pb-8 px-2 md:max-h-none md:overflow-visible md:px-0">
                    <div>
                        <h3 className="text-[10px] font-mono tracking-[0.3em] text-white/50 uppercase mb-2">ENGINEER PROFILE</h3>
                        <p className="text-sm font-sans text-white">Electronics & Intelligent Systems Enthusiast</p>
                    </div>

                    <div>
                        <h3 className="text-[10px] font-mono tracking-[0.3em] text-white/50 uppercase mb-2">FOCUS</h3>
                        <p className="text-sm font-sans text-white/90">
                            Embedded Systems <span className="text-[#00FF41]/80 px-1">•</span> Control Systems <span className="text-[#00FF41]/80 px-1">•</span> AI Integration
                        </p>
                    </div>

                    <div>
                        <h3 className="text-[10px] font-mono tracking-[0.3em] text-white/50 uppercase mb-2">APPROACH</h3>
                        <div className="text-sm font-sans text-white/90 flex flex-col gap-1 items-center">
                            <p>Design structured architectures.</p>
                            <p>Integrate hardware and software.</p>
                            <p>Build efficient intelligent systems.</p>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-[10px] font-mono tracking-[0.3em] text-white/50 uppercase mb-2">OBJECTIVE</h3>
                        <p className="text-sm font-sans text-white/90">Develop scalable, real-world engineering solutions.</p>
                    </div>
                </div>

                <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center pointer-events-auto cursor-pointer group" onClick={() => triggerDirectionalTransition('center')}>
                    <div className="w-[1px] h-8 bg-white/20 transition-all duration-500 group-hover:h-12 group-hover:bg-white mb-2"></div>
                    <span className="font-mono text-[9px] tracking-[0.3em] text-white/40 uppercase transition-colors duration-500 group-hover:text-white">Back to Core</span>
                </div>
            </div>


            {/* Pure black overlay transition layer for PCB world */}
            <div ref={overlayRef} className="absolute inset-0 bg-[#000000] opacity-0 pointer-events-none z-50"></div>
        </div>
    )
}
