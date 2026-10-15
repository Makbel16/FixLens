# FixLens: Real-Time AI Computer Troubleshooting System

FixLens is an on-device, real-time AI computer troubleshooting mobile application with augmented-reality (AR) style visual guidance. By pointing their smartphone camera at a computer screen, users receive real-time, step-by-step diagnostic assistance, dynamic visual highlights over actual PC interface controls, and automatic step progression as screens change.

## Key Features

- 📷 **Live Screen Inspection**: Real-time camera capture of Windows computer screens.
- 🔍 **On-Device OCR & Element Detection**: Local text extraction, bounding-box tracking, and interface state recognition without sending frames to remote cloud servers.
- 🎯 **AR Visual Guidance**: Highlights, tracking bounding boxes, and directional cues overlaid directly on the PC controls the user needs to click or adjust.
- ⚡ **Autonomous Step Progression**: Recognizes state transitions when a user interacts with their PC and automatically delivers the next instruction without manual clicking.
- 🛡️ **Zero-Budget & Local-First**: Operates completely free of paid cloud APIs, proprietary models, or external subscription services.
- 🔒 **Privacy & Safety First**: Camera frames are processed in-memory and discarded. No destructive commands or unauthorized remote control.

## Supported Workflows

1. **Windows 11 Mobile Hotspot Troubleshooting (Primary Workflow)**
   - Desktop & Taskbar Network control identification
   - Windows Quick Settings navigation & state validation
   - Settings > Network & Internet > Mobile Hotspot diagnosis
   - Wi-Fi/Ethernet sharing validation & error detection ("We can't set up mobile hotspot", missing Wi-Fi adapter)
   - Real-time visual verification of successful hotspot broadcast
2. **Modular Extension Support**:
   - Network & Internet Connectivity
   - Windows Update Recovery
   - Audio & Peripheral Device Setup

## Getting Started

See [docs/SETUP.md](file:///c:/Users/ybeka/Music/PROJECT/FixLens/docs/SETUP.md) for full Windows 11 installation and development setup instructions.

## Project Documentation

- [TASKS.md](file:///c:/Users/ybeka/Music/PROJECT/FixLens/TASKS.md): Phase-by-phase implementation tracker
- [docs/ARCHITECTURE.md](file:///c:/Users/ybeka/Music/PROJECT/FixLens/docs/ARCHITECTURE.md): System decomposition, coordinate math, data models, and state machines
- [docs/SETUP.md](file:///c:/Users/ybeka/Music/PROJECT/FixLens/docs/SETUP.md): Dev environment setup for Windows 11, Node, Android SDK, and Expo Dev Client
- [docs/TESTING.md](file:///c:/Users/ybeka/Music/PROJECT/FixLens/docs/TESTING.md): Unit testing, synthetic screen fixtures, and validation suites
- [docs/PRIVACY.md](file:///c:/Users/ybeka/Music/PROJECT/FixLens/docs/PRIVACY.md): Privacy guarantees, local-only processing, data retention policy
- [docs/TROUBLESHOOTING.md](file:///c:/Users/ybeka/Music/PROJECT/FixLens/docs/TROUBLESHOOTING.md): Troubleshooting state trees, visual cues, and recovery paths
