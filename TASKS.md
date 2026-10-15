# FixLens Master Implementation Tasks

This document tracks the phase-by-phase implementation of FixLens. A task is checked off only after its implementation is verified through automated tests, builds, or physical/synthetic screen runs.

---

### Phase 0: Inspect the Environment
- [x] Inspect Node.js, npm, Java/JDK, Android SDK, ADB, and Git
- [x] Isolate and initialize dedicated Git repository at `FixLens`
- [x] Verify Android SDK path (`C:\Users\ybeka\AppData\Local\Android\Sdk`), platforms (33-36), and build tools

### Phase 1: Architecture and Planning
- [x] System Architecture document ([docs/ARCHITECTURE.md](file:///c:/Users/ybeka/Music/PROJECT/FixLens/docs/ARCHITECTURE.md))
- [x] Developer Setup guide ([docs/SETUP.md](file:///c:/Users/ybeka/Music/PROJECT/FixLens/docs/SETUP.md))
- [x] Testing Strategy & Verification plan ([docs/TESTING.md](file:///c:/Users/ybeka/Music/PROJECT/FixLens/docs/TESTING.md))
- [x] Privacy and Security Architecture ([docs/PRIVACY.md](file:///c:/Users/ybeka/Music/PROJECT/FixLens/docs/PRIVACY.md))
- [x] Troubleshooting Workflow Matrix ([docs/TROUBLESHOOTING.md](file:///c:/Users/ybeka/Music/PROJECT/FixLens/docs/TROUBLESHOOTING.md))

### Phase 2: Project Setup & Foundation UI
- [ ] Initialize React Native TypeScript project structure
- [ ] Configure TypeScript types and strict compiler options
- [ ] Implement design tokens (Dark navy/charcoal theme, cyan/blue accents, typography, spacing)
- [ ] Implement modular navigation structure
- [ ] Implement screens:
  - [ ] 1. Welcome & Onboarding Screen
  - [ ] 2. Home Dashboard Screen
  - [ ] 3. Live Camera Troubleshooting Screen (AR HUD base)
  - [ ] 4. Troubleshooting Guide Library Screen
  - [ ] 5. Scan History Screen
  - [ ] 6. Settings Screen (low-performance toggle, sensitivity, reset data)
  - [ ] 7. Camera Permission & Error Recovery Screen
  - [ ] 8. About & Privacy Screen
- [ ] Verify clean UI build and navigation flow

### Phase 3: Live Camera Subsystem
- [ ] Integrate camera module with camera permission management
- [ ] Build camera viewport with aspect ratio containment
- [ ] Implement lifecycle management (app backgrounding, foreground resumption, camera stop on unmount)
- [ ] Implement frame capture / processing loop with throttling (e.g. 500ms - 800ms intervals to prevent thermal/battery throttling)
- [ ] Verify camera preview and lifecycle stability

### Phase 4: OCR Engine & Bounding Box Pipeline
- [ ] Implement on-device OCR interface and parser
- [ ] Implement OCR line and block segmentation
- [ ] Implement OCR debug overlay mode for visual inspection during development
- [ ] Create synthetic Windows 11 OCR screen test fixtures
- [ ] Verify accurate text and bounding box extraction on real Windows screen samples

### Phase 5: Screen Recognition & State Classification
- [ ] Implement fuzzy text matcher and UI signature detector
- [ ] Implement screen state classifier:
  - Windows Desktop / Taskbar
  - Windows Quick Settings (Network flyout)
  - Windows Settings (Network & Internet)
  - Mobile Hotspot Settings Page
  - Hotspot Error State ("We can't set up mobile hotspot")
  - Hotspot Success / Active Sharing State
  - Unknown / Obscured / Glare Screen State
- [ ] Implement confidence score calculation and debounce/hysteresis safeguards
- [ ] Implement automatic screen-change detection between consecutive frames
- [ ] Write and run comprehensive unit tests for state classification

### Phase 6: Troubleshooting Decision Engine (Windows 11 Mobile Hotspot)
- [ ] Define declarative troubleshooting workflow schema (states, requirements, instructions, target selectors, transitions)
- [ ] Implement Mobile Hotspot workflow:
  - Desktop: Target Network icon in taskbar tray
  - Quick Settings: Target Mobile Hotspot toggle or "Go to Settings"
  - Settings: Target Mobile Hotspot switch, network band selector, or adapter properties
  - Error Recovery: Diagnose missing Wi-Fi or disabled adapter
- [ ] Implement navigation actions: Repeat, Back, Skip, Not Working
- [ ] Write unit tests for decision tree transitions

### Phase 7: Live AR Visual Guidance & Coordinate Mapping
- [ ] Implement coordinate transformer (Frame coordinate space -> Preview viewport space)
- [ ] Account for aspect ratio differences (Letterboxing/Crop mapping)
- [ ] Render animated AR tracking box with glowing corners and directional indicator arrow
- [ ] Implement position smoothing (exponential moving average / low-pass filter) to eliminate jitter
- [ ] Verify overlay alignment with targets across varied camera perspectives

### Phase 8: Autonomous Screen Progression & Safeguards
- [ ] Link screen-change detector to troubleshooting state machine
- [ ] Trigger automatic step advance upon detecting transition to expected next screen
- [ ] Implement anti-flapping logic (consecutive confirmations before committing transition)
- [ ] Provide user audio/haptic feedback on auto-progression
- [ ] Provide fallback prompt when unexpected screen appears

### Phase 9: Verification Module & Fallbacks
- [ ] Implement evidence-based outcome verification (e.g. detect "1 of 8 devices connected", "Share over: Wi-Fi", toggle set to "On")
- [ ] Display positive verification card with confirmation criteria
- [ ] Provide alternative remedies if problem persists after final step
- [ ] Ensure system never falsely claims success without visual evidence

### Phase 10: Workflow Library Expansion
- [ ] Add Wi-Fi & Internet Connection Troubleshooter
- [ ] Add Windows Update Error Troubleshooter
- [ ] Add Audio Device / Output Troubleshooter
- [ ] Modularize workflow loader to allow zero-code JSON workflow additions

### Phase 11: Performance Optimization & Reliability
- [ ] Implement Low-Performance Mode (reduced OCR frequency, simplified overlay animations)
- [ ] Implement camera frame disposal and memory leak audits
- [ ] Verify offline capability (100% functionality without internet connection)
- [ ] Test edge cases: glare, blur, off-angle screens, missing system fonts

### Phase 12: Release Build & Documentation Finalization
- [ ] Build Android APK
- [ ] Validate manual test checklist
- [ ] Update all documentation with finalized schemas, build steps, and limitations
