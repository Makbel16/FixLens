import { TroubleshootingWorkflow } from '../../types/troubleshooting';

export const wifiTroubleshooterWorkflow: TroubleshootingWorkflow = {
  workflowId: 'windows-11-wifi-troubleshooter',
  title: 'Wi-Fi & Network Connection',
  shortDescription: 'Resolve disconnected Wi-Fi, missing networks, or "No Internet" status',
  fullDescription:
    'Step-by-step guidance to re-enable disabled network adapters, disconnect & reconnect to SSID, and execute Windows Network Diagnostics.',
  category: 'NETWORK',
  icon: 'Globe',
  steps: [
    {
      stepId: 'wifi-step-1',
      stepNumber: 1,
      totalSteps: 3,
      title: 'Inspect Network Icon',
      instruction: "Check the Network icon in your taskbar. If you see a globe with a 'no' sign, your internet is disconnected.",
      detailedTip: 'Click the globe icon to open the Quick Settings network picker.',
      expectedScreen: 'WINDOWS_DESKTOP_TASKBAR',
      targetControlKey: 'network_icon',
      targetLabel: 'Taskbar Network Tray',
    },
    {
      stepId: 'wifi-step-2',
      stepNumber: 2,
      totalSteps: 3,
      title: 'Toggle Wi-Fi Quick Setting',
      instruction: 'Click the arrow next to the Wi-Fi icon to view available wireless networks, or toggle Wi-Fi off and back on.',
      detailedTip: 'Cycling the Wi-Fi toggle resets the wireless adapter DHCP client.',
      expectedScreen: 'WINDOWS_QUICK_SETTINGS',
      targetControlKey: 'wifi_tile',
      targetLabel: 'Wi-Fi Action Tile',
    },
    {
      stepId: 'wifi-step-3',
      stepNumber: 3,
      totalSteps: 3,
      title: 'Verify Connection Status',
      instruction: 'Select your preferred Wi-Fi network and check "Connect automatically". Verify status changes to "Connected, secured".',
      detailedTip: 'If your router SSID does not appear, ensure router 2.4/5GHz broadcast is running.',
      expectedScreen: 'WINDOWS_SETTINGS_NETWORK',
      targetControlKey: 'wifi_item',
      targetLabel: 'Connected Wi-Fi Network',
      isVerificationStep: true,
    },
  ],
};

export default wifiTroubleshooterWorkflow;
