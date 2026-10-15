import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AboutScreen } from './src/screens/AboutScreen';
import { GuidesLibraryScreen } from './src/screens/GuidesLibraryScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { LiveScanScreen } from './src/screens/LiveScanScreen';
import { PermissionRecoveryScreen } from './src/screens/PermissionRecoveryScreen';
import { ScanHistoryScreen } from './src/screens/ScanHistoryScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { WelcomeScreen } from './src/screens/WelcomeScreen';

import { WORKFLOWS_REGISTRY } from './src/engine/workflows';
import { TroubleshootingWorkflow } from './src/types/troubleshooting';

export type ScreenName =
  | 'WELCOME'
  | 'HOME'
  | 'LIVE_SCAN'
  | 'GUIDES_LIBRARY'
  | 'SCAN_HISTORY'
  | 'SETTINGS'
  | 'PERMISSION_RECOVERY'
  | 'ABOUT';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('HOME');
  const [activeWorkflow, setActiveWorkflow] = useState<TroubleshootingWorkflow>(
    WORKFLOWS_REGISTRY[0]
  );

  const startScan = (workflow: TroubleshootingWorkflow) => {
    setActiveWorkflow(workflow);
    setCurrentScreen('LIVE_SCAN');
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'WELCOME':
        return (
          <WelcomeScreen
            onStart={() => startScan(WORKFLOWS_REGISTRY[0])}
            onExploreGuides={() => setCurrentScreen('GUIDES_LIBRARY')}
          />
        );

      case 'LIVE_SCAN':
        return (
          <LiveScanScreen
            workflow={activeWorkflow}
            onExit={() => setCurrentScreen('HOME')}
            onRequestPermission={() => setCurrentScreen('PERMISSION_RECOVERY')}
          />
        );

      case 'GUIDES_LIBRARY':
        return (
          <GuidesLibraryScreen
            onSelectWorkflow={wf => startScan(wf)}
            onBack={() => setCurrentScreen('HOME')}
          />
        );

      case 'SCAN_HISTORY':
        return <ScanHistoryScreen onBack={() => setCurrentScreen('HOME')} />;

      case 'SETTINGS':
        return <SettingsScreen onBack={() => setCurrentScreen('HOME')} />;

      case 'PERMISSION_RECOVERY':
        return (
          <PermissionRecoveryScreen
            onRequestPermission={() => setCurrentScreen('LIVE_SCAN')}
            onBack={() => setCurrentScreen('HOME')}
          />
        );

      case 'ABOUT':
        return <AboutScreen onBack={() => setCurrentScreen('HOME')} />;

      case 'HOME':
      default:
        return (
          <HomeScreen
            onStartScan={startScan}
            onOpenLibrary={() => setCurrentScreen('GUIDES_LIBRARY')}
            onOpenHistory={() => setCurrentScreen('SCAN_HISTORY')}
            onOpenSettings={() => setCurrentScreen('SETTINGS')}
            onOpenAbout={() => setCurrentScreen('ABOUT')}
          />
        );
    }
  };

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      {renderCurrentScreen()}
    </SafeAreaProvider>
  );
}
