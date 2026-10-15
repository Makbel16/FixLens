import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';

import Button from '../components/Button';
import Card from '../components/Card';
import ConfidenceMeter from '../components/ConfidenceMeter';
import HUDHeader from '../components/HUDHeader';
import InstructionPanel from '../components/InstructionPanel';
import TargetBoundingBox from '../components/TargetBoundingBox';

import { CoordinateTransformer } from '../engine/coordinateTransformer';
import { TroubleshootingDecisionEngine } from '../engine/decisionEngine';
import { ScreenClassifier } from '../engine/screenClassifier';
import { VerificationEngine } from '../engine/verificationEngine';
import { HistoryStorage } from '../storage/historyStorage';
import { SettingsStorage } from '../storage/settingsStorage';

import colors from '../theme/colors';
import { BoundingBox, OCRResult } from '../types/ocr';
import { RecognizedScreenType, ScreenClassification } from '../types/screen';
import {
  TroubleshootingStep,
  TroubleshootingWorkflow,
  UserAction,
} from '../types/troubleshooting';

// Synthetic sample fixtures for interactive demonstration & testing
const desktopFixture = require('../engine/fixtures/desktop_taskbar_ocr.json');
const quickSettingsFixture = require('../engine/fixtures/quick_settings_ocr.json');
const hotspotSettingsFixture = require('../engine/fixtures/settings_mobile_hotspot_ocr.json');
const hotspotVerifiedFixture = require('../engine/fixtures/hotspot_verified_ocr.json');
const hotspotErrorFixture = require('../engine/fixtures/hotspot_error_ocr.json');

interface LiveScanScreenProps {
  workflow: TroubleshootingWorkflow;
  onExit: () => void;
  onRequestPermission: () => void;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const LiveScanScreen: React.FC<LiveScanScreenProps> = ({
  workflow,
  onExit,
  onRequestPermission,
}) => {
  const [permission, requestPermission] = useCameraPermissions();

  // Engine Instances
  const engineRef = useRef(new TroubleshootingDecisionEngine(workflow));
  const classifierRef = useRef(new ScreenClassifier());
  const transformerRef = useRef(new CoordinateTransformer(0.45));

  // State
  const [currentStep, setCurrentStep] = useState<TroubleshootingStep>(
    engineRef.current.getCurrentStep()
  );
  const [currentScreen, setCurrentScreen] = useState<RecognizedScreenType>('UNKNOWN_SCREEN');
  const [confidence, setConfidence] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [debugMode, setDebugMode] = useState<boolean>(false);
  const [rawTextSnippet, setRawTextSnippet] = useState<string>('');
  const [targetScreenBox, setTargetScreenBox] = useState<BoundingBox | null>(null);
  const [targetLabel, setTargetLabel] = useState<string | null>(null);
  const [unknownCount, setUnknownCount] = useState<number>(0);

  // Success Verification Modal
  const [showVerificationModal, setShowVerificationModal] = useState<boolean>(false);
  const [verificationSummary, setVerificationSummary] = useState<string>('');

  // Processing Throttling Lock
  const isProcessingRef = useRef<boolean>(false);
  const frameIntervalRef = useRef<number>(600);

  useEffect(() => {
    // Load configured throttling rate
    SettingsStorage.loadSettings().then(s => {
      if (s.lowPerformanceMode) {
        frameIntervalRef.current = 1200;
      } else {
        frameIntervalRef.current = s.cameraFpsThrottlingMs;
      }
      setDebugMode(s.showDebugBoundingBoxes);
    });

    return () => {
      // Save scan session to history on exit
      HistoryStorage.addRecord({
        workflowId: workflow.workflowId,
        workflowTitle: workflow.title,
        timestamp: Date.now(),
        status: showVerificationModal ? 'RESOLVED' : 'UNRESOLVED',
        stepsCompleted: engineRef.current.getState().currentStepIndex + 1,
        totalSteps: workflow.steps.length,
      });
    };
  }, [workflow, showVerificationModal]);

  /**
   * Evaluates an OCR frame result: classifies screen, feeds into decision engine,
   * transforms target coordinates to preview screen space.
   */
  const processOCRFrame = (ocr: OCRResult) => {
    if (isPaused || isProcessingRef.current) return;
    isProcessingRef.current = true;

    try {
      // 1. Classify screen state
      const classification = classifierRef.current.classify(ocr);
      setCurrentScreen(classification.screenType);
      setConfidence(classification.confidence);
      setRawTextSnippet(classification.rawSnippet);

      // 2. Feed into Troubleshooting Decision Engine
      const decision = engineRef.current.evaluateFrame(classification);
      const sessionState = engineRef.current.getState();
      setCurrentStep(engineRef.current.getCurrentStep());
      setUnknownCount(sessionState.unknownScreenFramesCount);

      // 3. Coordinate Transformation: Map target from Camera Sensor to Display Viewport
      if (sessionState.targetBox) {
        const transformed = transformerRef.current.transformBox(sessionState.targetBox, {
          frame: { width: ocr.frameWidth || 1920, height: ocr.frameHeight || 1080 },
          viewport: { width: SCREEN_WIDTH, height: SCREEN_HEIGHT * 0.65 },
          mode: 'aspectFill',
        });
        setTargetScreenBox(transformed);
        setTargetLabel(sessionState.targetLabel);
      } else {
        setTargetScreenBox(null);
        setTargetLabel(null);
      }

      // 4. Verification Check
      if (classification.screenType === 'WINDOWS_HOTSPOT_ACTIVE') {
        const evalResult = VerificationEngine.verifyMobileHotspot(ocr);
        if (evalResult.verified) {
          setVerificationSummary(evalResult.summaryMessage);
          setShowVerificationModal(true);
        }
      }
    } finally {
      // Release lock after throttling window
      setTimeout(() => {
        isProcessingRef.current = false;
      }, frameIntervalRef.current);
    }
  };

  /**
   * Interactive Simulation Helper: allows testing step transitions directly
   * on screen fixtures (useful for testing on real PC screens or development).
   */
  const simulateScreenDetection = (fixture: any) => {
    const ocr: OCRResult = {
      ...fixture,
      normalizedTokens: [],
      blocks: [],
      lines: [],
      timestamp: Date.now(),
    };
    processOCRFrame(ocr);
  };

  const handleUserAction = (action: UserAction) => {
    const res = engineRef.current.handleUserAction(action);
    setCurrentStep(engineRef.current.getCurrentStep());
    const state = engineRef.current.getState();
    setTargetScreenBox(null);
    transformerRef.current.reset();
  };

  const handleTogglePause = () => {
    const paused = engineRef.current.togglePause();
    setIsPaused(paused);
  };

  // If camera permission is not granted
  if (!permission?.granted) {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <Text style={styles.permissionIcon}>📷</Text>
        <Text style={styles.permissionTitle}>Camera Permission Required</Text>
        <Text style={styles.permissionText}>
          FixLens requires camera access to observe your computer screen and project AR troubleshooting highlights.
        </Text>
        <Button
          title="Grant Camera Access"
          variant="primary"
          style={styles.permissionBtn}
          onPress={requestPermission}
        />
        <Button title="Exit to Dashboard" variant="secondary" onPress={onExit} />
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      {/* Real Live Camera Preview */}
      <CameraView style={styles.cameraView} facing="back">
        {/* AR Tracking Target Overlay */}
        {targetScreenBox && !isPaused ? (
          <TargetBoundingBox
            box={targetScreenBox}
            label={targetLabel}
            subtext="Click control on PC"
          />
        ) : null}

        {/* Scan Reticle Guides */}
        <View pointerEvents="none" style={styles.reticleContainer}>
          <View style={styles.cornerTL} />
          <View style={styles.cornerTR} />
          <View style={styles.cornerBL} />
          <View style={styles.cornerBR} />
        </View>

        {/* Top HUD Header */}
        <SafeAreaView edges={['top']} style={styles.headerSafeArea}>
          <HUDHeader
            workflowTitle={workflow.title}
            isPaused={isPaused}
            debugMode={debugMode}
            onTogglePause={handleTogglePause}
            onToggleDebug={() => setDebugMode(!debugMode)}
            onExit={onExit}
          />

          {/* Debug OCR readout overlay */}
          {debugMode ? (
            <View style={styles.debugCard}>
              <Text style={styles.debugText}>
                OCR Frame: {rawTextSnippet ? rawTextSnippet.slice(0, 100) : 'Scanning...'}
              </Text>
              <ConfidenceMeter confidence={confidence} />
            </View>
          ) : null}

          {/* Quick Simulation Bar for Physical Testing */}
          <View style={styles.simBar}>
            <Text style={styles.simLabel}>DEV TEST / SIM:</Text>
            <TouchableOpacity
              style={styles.simBtn}
              onPress={() => simulateScreenDetection(desktopFixture)}
            >
              <Text style={styles.simBtnText}>1. Taskbar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.simBtn}
              onPress={() => simulateScreenDetection(quickSettingsFixture)}
            >
              <Text style={styles.simBtnText}>2. Quick Set</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.simBtn}
              onPress={() => simulateScreenDetection(hotspotSettingsFixture)}
            >
              <Text style={styles.simBtnText}>3. Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.simBtn}
              onPress={() => simulateScreenDetection(hotspotVerifiedFixture)}
            >
              <Text style={styles.simBtnText}>4. Verified</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.simBtn, styles.simBtnError]}
              onPress={() => simulateScreenDetection(hotspotErrorFixture)}
            >
              <Text style={styles.simBtnText}>Error</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </CameraView>

      {/* Bottom Step Instruction Panel */}
      <View style={styles.instructionContainer}>
        <InstructionPanel
          step={currentStep}
          currentScreen={currentScreen}
          confidence={confidence}
          onUserAction={handleUserAction}
          unknownFramesCount={unknownCount}
        />
      </View>

      {/* Verification Success Modal */}
      <Modal visible={showVerificationModal} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <Card glow highlightColor={colors.success} style={styles.modalCard}>
            <Text style={styles.modalIcon}>🎉</Text>
            <Text style={styles.modalTitle}>Problem Resolved!</Text>
            <Text style={styles.modalMessage}>{verificationSummary}</Text>
            <Text style={styles.modalEvidence}>
              FixLens visually confirmed the active status indicators on your computer.
            </Text>
            <Button
              title="Finish & Save to History"
              variant="primary"
              style={styles.modalBtn}
              onPress={() => {
                setShowVerificationModal(false);
                onExit();
              }}
            />
            <Button
              title="Continue Scanning"
              variant="ghost"
              onPress={() => setShowVerificationModal(false)}
            />
          </Card>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  cameraView: {
    flex: 1,
    width: '100%',
  },
  headerSafeArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  instructionContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 20,
  },
  reticleContainer: {
    ...StyleSheet.absoluteFillObject,
    margin: 40,
    marginBottom: 260,
  },
  cornerTL: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 28,
    height: 28,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderColor: 'rgba(0, 229, 255, 0.4)',
  },
  cornerTR: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 28,
    height: 28,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderColor: 'rgba(0, 229, 255, 0.4)',
  },
  cornerBL: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 28,
    height: 28,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderColor: 'rgba(0, 229, 255, 0.4)',
  },
  cornerBR: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderColor: 'rgba(0, 229, 255, 0.4)',
  },
  debugCard: {
    backgroundColor: 'rgba(11, 15, 25, 0.85)',
    marginHorizontal: 16,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    marginTop: 6,
  },
  debugText: {
    fontSize: 10,
    color: colors.textSecondary,
    fontFamily: 'monospace',
  },
  simBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(11, 15, 25, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginHorizontal: 16,
    borderRadius: 6,
    marginTop: 6,
  },
  simLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.primary,
    marginRight: 4,
  },
  simBtn: {
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    marginRight: 4,
  },
  simBtnError: {
    backgroundColor: 'rgba(255, 51, 102, 0.3)',
  },
  simBtnText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  permissionIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  permissionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 10,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  permissionBtn: {
    width: '100%',
    marginBottom: 12,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#0E1726',
  },
  modalIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.success,
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 22,
  },
  modalEvidence: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
  },
  modalBtn: {
    width: '100%',
    marginBottom: 8,
  },
});

export default LiveScanScreen;
