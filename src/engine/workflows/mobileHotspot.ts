import { TroubleshootingWorkflow } from '../../types/troubleshooting';

export const mobileHotspotWorkflow: TroubleshootingWorkflow = {
  workflowId: 'windows-11-mobile-hotspot',
  title: 'Windows 11 Mobile Hotspot',
  shortDescription: 'Diagnose and configure Wi-Fi sharing from your Windows 11 PC',
  fullDescription:
    'Guides you through enabling Mobile Hotspot, resolving common adapter errors ("We can\'t set up mobile hotspot"), and verifying client device connections.',
  category: 'NETWORK',
  icon: 'Wifi',
  steps: [
    {
      stepId: 'step-1-open-quick-settings',
      stepNumber: 1,
      totalSteps: 4,
      title: 'Open Quick Settings',
      instruction: 'Click the Network/Sound icon cluster in the bottom-right corner of your Windows taskbar.',
      detailedTip: 'Locate the tray icons near the system clock. Clicking this cluster opens the Windows 11 Quick Settings panel.',
      expectedScreen: 'WINDOWS_DESKTOP_TASKBAR',
      targetControlKey: 'network_icon',
      targetLabel: 'Network Tray Icon',
      alternateAction: 'Or press Windows Key + A on your keyboard',
    },
    {
      stepId: 'step-2-toggle-hotspot',
      stepNumber: 2,
      totalSteps: 4,
      title: 'Turn On Mobile Hotspot',
      instruction: "Click the 'Mobile hotspot' tile to turn it ON.",
      detailedTip:
        "The tile should illuminate in blue. If the tile is missing or shows an error, right-click the tile and select 'Go to Settings'.",
      expectedScreen: 'WINDOWS_QUICK_SETTINGS',
      targetControlKey: 'mobile_hotspot_tile',
      targetLabel: 'Mobile Hotspot Tile',
      alternateAction: "Right-click tile and select 'Go to Settings'",
    },
    {
      stepId: 'step-3-settings-configuration',
      stepNumber: 3,
      totalSteps: 4,
      title: 'Configure Mobile Hotspot',
      instruction: "Turn the Mobile Hotspot switch ON and ensure 'Share over: Wi-Fi' is selected.",
      detailedTip:
        "If phones or tablets cannot discover your hotspot, click 'Properties' > 'Edit' and set Network Band to 'Any available' (2.4 GHz).",
      expectedScreen: 'WINDOWS_SETTINGS_MOBILE_HOTSPOT',
      targetControlKey: 'hotspot_switch',
      targetLabel: 'Turn On Switch',
      alternateAction: "Check 'Share my internet connection from' is set to Ethernet or Wi-Fi",
    },
    {
      stepId: 'step-4-verify-active',
      stepNumber: 4,
      totalSteps: 4,
      title: 'Verify Hotspot Connection',
      instruction: 'Mobile Hotspot is active and broadcasting! Connect your phone using the visible Network Name & Password.',
      detailedTip: 'Notice the "Devices connected" counter will increment when your secondary device joins.',
      expectedScreen: 'WINDOWS_HOTSPOT_ACTIVE',
      targetControlKey: 'status_label',
      targetLabel: 'Active Hotspot Status',
      isVerificationStep: true,
    },
  ],
  errorRecoverySteps: {
    WINDOWS_HOTSPOT_ERROR: {
      stepId: 'recovery-no-connection',
      stepNumber: 99,
      totalSteps: 4,
      title: 'Hotspot Error Detected',
      instruction:
        "Windows reports: 'We can't set up mobile hotspot because your PC doesn't have an active Internet connection'.",
      detailedTip:
        'Verify your PC is connected to an active Wi-Fi or Ethernet network. Turn OFF Airplane mode if enabled.',
      expectedScreen: 'WINDOWS_HOTSPOT_ERROR',
      targetControlKey: 'error_banner',
      targetLabel: 'Hotspot Error Banner',
      recoveryGuidance: 'Connect your PC to Ethernet or an active Wi-Fi network first.',
    },
  },
};

export default mobileHotspotWorkflow;
