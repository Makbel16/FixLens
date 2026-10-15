# Developer Setup & Build Guide

## 1. Prerequisites

FixLens is built with React Native and TypeScript, targeting Android devices.

- **Operating System**: Windows 11 (64-bit)
- **Node.js**: >= v18.x (Tested with Node v24.x)
- **Package Manager**: npm 10+ / 11+
- **Java Development Kit**: JDK 17 (e.g. Eclipse Adoptium Temurin 17)
- **Android SDK**: Android API Level 33, 34, 35, or 36 installed under `C:\Users\<user>\AppData\Local\Android\Sdk`
- **Android Platform Tools**: `adb` available on PATH

## 2. Environment Variables Verification

Verify your environment configuration in PowerShell:

```powershell
# Verify Node and Java
node -v
java -version

# Verify Android SDK & ADB
$env:ANDROID_HOME = "C:\Users\$env:USERNAME\AppData\Local\Android\Sdk"
adb devices
```

## 3. Project Installation

```powershell
cd c:\Users\ybeka\Music\PROJECT\FixLens
npm install
```

## 4. Running the Development Server & Android Client

### Running the bundler:
```powershell
npm start
```

### Running on a connected Android phone via ADB:
1. Enable **Developer Options** and **USB Debugging** on your Android phone.
2. Connect your phone via USB cable (or connect via Wi-Fi ADB: `adb connect <IP>:5555`).
3. Verify device is detected:
   ```powershell
   adb devices
   ```
4. Run the Android app:
   ```powershell
   npm run android
   ```

### Running Automated Test Suite:
```powershell
npm test
```

### Running TypeScript Type Check:
```powershell
npm run typecheck
```
