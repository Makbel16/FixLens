# Privacy and Safety Policy

FixLens is designed from the ground up as a **local-first, privacy-respecting computer troubleshooting tool**. 

## 1. Zero Cloud Transmission of Camera Video
- Camera frames captured by FixLens are processed entirely **in-device RAM**.
- No camera frames, video streams, or photos are uploaded to any cloud server, third-party AI provider, or analytics platform.
- Camera frame buffers are released immediately after OCR text extraction is performed.

## 2. On-Device OCR & Intelligence
- Optical Character Recognition (OCR) is performed entirely on the smartphone using local ML Kit models or lightweight offline parsing.
- The troubleshooting decision engine runs purely in local TypeScript logic.
- An internet connection is **not required** for core troubleshooting operations.

## 3. Storage and Data Retention
- By default, FixLens does not save scanned computer screen images.
- An optional local scan history log records only diagnostic metadata (workflow name, date/time, success/failure status, and matched screen type).
- Users have full access in **Settings** to:
  - Clear all local scan history with one tap.
  - Reset all application settings to defaults.

## 4. User Safety and System Integrity
- **No Remote Execution**: FixLens never executes shell commands, powershell scripts, or remote desktop commands on the user's computer. The user remains in complete physical control of their PC mouse and keyboard.
- **Non-Destructive Guidance**: Instructions prioritize safe, standard Windows configuration options. FixLens avoids advising dangerous registry tampering or permanent data deletion.
- **Live Indicator**: The application displays an explicit visual indicator whenever the camera sensor is actively operating.
