# Testing Strategy & Test Plan

## 1. Overview

Testing an on-device computer vision and AR troubleshooting system requires a multi-tier testing strategy:
1. **Deterministic Unit Tests**: Rigorous unit tests for string tokenization, fuzzy keyword matching, screen-state classification, state-machine transitions, and coordinate transformations.
2. **Synthetic Screen Fixtures**: Replaying realistic OCR payloads derived from authentic Windows 11 PC screen captures (Desktop, Quick Settings, Settings app, error dialogs).
3. **Interactive Manual Testing**: Physical validation using a smartphone pointing at real PC displays under varying lighting and glare conditions.

---

## 2. Test Suites

### 2.1 OCR Parsing & Tokenization Tests (`tests/ocrParser.test.ts`)
- Case normalization and punctuation stripping
- Handling hyphenated or split lines (e.g., "Mobile" on line 1, "Hotspot" on line 2)
- Multi-word search matching across non-contiguous tokens
- Filtering low-confidence OCR artefacts

### 2.2 Screen State Classifier Tests (`tests/screenClassifier.test.ts`)
- Correct identification of `DESKTOP_TASKBAR` from taskbar labels (`Start`, `Search`, `Widgets`, `ENG`)
- Correct identification of `QUICK_SETTINGS_PANEL` from network tiles (`Wi-Fi`, `Bluetooth`, `Airplane mode`, `Mobile hotspot`)
- Identification of `SETTINGS_MOBILE_HOTSPOT` from page headers and controls (`Share my internet connection from`, `Share over`)
- Detection of error banners: `HOTSPOT_ERROR_CANNOT_SETUP` ("We can't set up mobile hotspot because your PC doesn't have an Ethernet, Wi-Fi...")
- Identification of verified active state: `HOTSPOT_ACTIVE_VERIFIED` ("Devices connected: 1 of 8", "Sharing over Wi-Fi")
- Robust fallback to `UNKNOWN_SCREEN` when viewing non-relevant content (e.g. YouTube, blank desktop, or code editor)

### 2.3 Troubleshooting Decision Engine Tests (`tests/troubleshootingEngine.test.ts`)
- Initialization with active workflow (Windows 11 Mobile Hotspot)
- Progression to Step 1 (`Open Quick Settings via Taskbar Network Icon`)
- Auto-progression when screen transitions from `DESKTOP_TASKBAR` to `QUICK_SETTINGS_PANEL`
- Target control identification: returning valid bounding box for `mobile_hotspot_toggle`
- Navigation handling: `Back`, `Skip`, `Repeat`, and `Not Working` recovery branching

### 2.4 Coordinate Transformation Tests (`tests/coordinateTransformer.test.ts`)
- Aspect Fill scaling calculation across standard phone resolutions (e.g. 1080x2400 screen with 1080x1920 camera sensor)
- Bounds clamping to ensure visual highlight box never renders outside viewport
- Exponential Moving Average (EMA) smoothing test: verifying jitter dampening over sequential frames

---

## 3. Synthetic Fixtures

Synthetic fixtures are located in `src/engine/fixtures/`:
- `desktop_taskbar_ocr.json`
- `quick_settings_ocr.json`
- `settings_mobile_hotspot_ocr.json`
- `hotspot_error_ocr.json`
- `hotspot_verified_ocr.json`
- `unknown_screen_ocr.json`

## 4. Running Tests

```powershell
npm test
```
