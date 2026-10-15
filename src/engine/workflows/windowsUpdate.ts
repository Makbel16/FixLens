import { TroubleshootingWorkflow } from '../../types/troubleshooting';

export const windowsUpdateWorkflow: TroubleshootingWorkflow = {
  workflowId: 'windows-11-update-repair',
  title: 'Windows Update Troubleshooter',
  shortDescription: 'Resolve stuck updates, download failures, or installation error codes',
  fullDescription:
    'Guidance through running the built-in Windows Update Troubleshooter, clearing update cache, and checking service status.',
  category: 'UPDATE',
  icon: 'RefreshCw',
  steps: [
    {
      stepId: 'update-step-1',
      stepNumber: 1,
      totalSteps: 3,
      title: 'Open Settings via Start Menu',
      instruction: 'Click the Windows Start icon on your taskbar and select "Settings" (gear icon).',
      detailedTip: 'Keyboard shortcut: Press Win + I to jump directly to Settings.',
      expectedScreen: 'WINDOWS_DESKTOP_TASKBAR',
      targetControlKey: 'network_icon',
      targetLabel: 'Start Button',
    },
    {
      stepId: 'update-step-2',
      stepNumber: 2,
      totalSteps: 3,
      title: 'Navigate to Windows Update',
      instruction: 'In the left sidebar of the Settings window, click "Windows Update" at the bottom of the list.',
      detailedTip: 'If an error code like 0x80070002 is shown, click "Retry".',
      expectedScreen: 'WINDOWS_SETTINGS_NETWORK',
      targetControlKey: 'mobile_hotspot_item',
      targetLabel: 'Windows Update Navigation',
    },
    {
      stepId: 'update-step-3',
      stepNumber: 3,
      totalSteps: 3,
      title: 'Run Update Check & Verify',
      instruction: 'Click "Check for updates". Allow the process to complete until green checkmark "You\'re up to date" appears.',
      detailedTip: 'If updates remain stuck, restart your PC to clear locked background installer files.',
      expectedScreen: 'WINDOWS_SETTINGS_NETWORK',
      targetControlKey: 'mobile_hotspot_item',
      targetLabel: 'Check for Updates Button',
      isVerificationStep: true,
    },
  ],
};

export default windowsUpdateWorkflow;
