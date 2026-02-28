Interactive PCB-Based Portfolio Platform

Version: Architecture v1.0
Author: Pankaj Pandit
Framework: React + Vite
Deployment: Vercel

1. Overview
This project is a system-architecture-driven portfolio platform designed as a simulated electronic PCB environment.
Unlike traditional web portfolios, this platform models:
Power distribution logic
Signal propagation
Processing frequency response
Node-based routing
State-driven rendering
The interface behaves as a real-time embedded system simulation rather than a static website.

2. Architectural Model
2.1 Directional System Map
                 ↑ ABOUT (Identity Layer)

CONTACT  ←  CORE PROCESSOR  →  SKILLS

                 ↓ PROJECT BUS (PCB WORLD)
Core Design Principle:
The UI is treated as a processor-centered architecture.
Core = Main Processing Unit
Projects = Peripheral IC Modules
Skills = Capability Registers
Contact = External Communication Interface
About = System Metadata Layer
Navigation mimics hardware signal routing.

3. System Components
3.1 Core Processor Module
Central interactive node responsible for:
Electron routing logic
Power state management
Signal calculation
Frequency modulation
Section state transitions
Built using React state-driven architecture.

3.2 Electron Routing Engine
Simulates signal traversal along copper traces.
Features:
Arrow-key controlled routing
Path-constrained movement
Power-dependent enable/disable
Smooth camera tracking
Distance-aware signal response

3.3 Power Management Unit (PMU)
System VCC Logic
Condition	Behavior
100–60%	Full performance
60–30%	Slight dimming
30–10%	Reduced visual intensity
0%	System halt

At VCC = 0:
Electron movement disabled
Signal transmission halted
Brain frequency = 0 GHz
Recharge sequence required
Recharge mechanism restores system state gradually.

3.4 Signal Propagation Model
Signal strength (dBm) calculated based on:
Distance from core
Active routing load
Current power state

States:
Strong (-20 to -35 dBm)
Medium (-40 to -60 dBm)
Weak (-65 to -85 dBm)
Infinite loss (-∞ at shutdown)
Signal transitions are smoothed using throttled update cycles.

3.5 Processing Frequency Simulation
Brain Frequency (GHz) responds dynamically to:
Routing intensity
Active module load
Low power states
Idle: 2.8–3.0 GHz
Active Routing: 3.1–3.8 GHz
Shutdown: 0.00 GHz
Represents computational abstraction layer.

4. Project Modules (IC Implementations)
Each project is represented as an IC node within the PCB environment.

Implemented Modules:
RC Car — Embedded + Motor Control System
MediMeal — Food Health Analysis Platform
Spectrum Analyzer — Signal Processing System
MOSFET Tester — Power Electronics Diagnostic Tool
LiFi Communication System
Intelligent Desktop Assistant
Modules activate context panels upon electron routing.

5. Rendering Architecture
5.1 Visual Design Model
Minimal black engineering theme
Central translucent IC
Radial signal channels
Particle-based energy simulation
Controlled glow diffusion
Symmetry-preserving layout
No decorative noise.
All visuals serve system metaphor.

6. Performance Optimization Layer
Designed to scale across hardware capabilities.
Automatic Degradation System
If FPS < threshold:
Reduce particle count
Disable heavy glow
Throttle state updates
Reduce animation complexity
Optimization Strategies
requestAnimationFrame usage
GPU-accelerated transforms
Avoid layout-triggering CS
Throttled signal/frequency updates
Idle animation suspension

7. Tech Stack

Frontend:
React (Component-based architecture)
Vite (Fast build tooling)
JavaScript ES6+
HTML5 / CSS3

9. Design Philosophy

This platform reflects:
Hardware-centric thinking
Embedded systems abstraction
Architecture-driven UI
State-controlled behavior modeling
Performance-conscious rendering
The objective was to build a portfolio that demonstrates:
Engineering thinking through interface design.

12. Author
Pankaj Pandit
Electronics & Intelligent Systems Engineer
GitHub: https://github.com/parcosm04
LinkedIn: https://www.linkedin.com/in/pankaj-pandit-96b952318

Final Note
This project represents an intersection of:
Electronics engineering concepts
Control system modeling
Frontend architectural design
Performance-aware rendering

It is not a theme-based portfolio.
It is a simulated interactive system.
