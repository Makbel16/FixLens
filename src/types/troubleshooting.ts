import { BoundingBox } from './ocr';
import { RecognizedScreenType } from './screen';

export type UserAction = 'REPEAT' | 'BACK' | 'SKIP' | 'NOT_WORKING' | 'MANUAL_OVERRIDE';
export type TroubleshootingAction = UserAction;

export interface TroubleshootingStep {
  stepId: string;
  stepNumber: number;
  totalSteps: number;
  title: string;
  instruction: string;
  detailedTip: string;
  expectedScreen: RecognizedScreenType;
  targetControlKey: string;
  targetLabel: string;
  alternateAction?: string;
  isVerificationStep?: boolean;
  recoveryGuidance?: string;
}

export interface TroubleshootingWorkflow {
  workflowId: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: 'NETWORK' | 'UPDATE' | 'AUDIO' | 'BLUETOOTH' | 'SYSTEM';
  icon: string;
  steps: TroubleshootingStep[];
  errorRecoverySteps?: Record<string, TroubleshootingStep>;
}

export type VerificationState = 'PENDING' | 'SEARCHING_EVIDENCE' | 'VERIFIED_SUCCESS' | 'FAILED_PERSISTS';

export interface TroubleshootingSessionState {
  workflow: TroubleshootingWorkflow;
  currentStepIndex: number;
  currentScreen: RecognizedScreenType;
  confidence: number;
  isPaused: boolean;
  targetBox: BoundingBox | null;
  targetLabel: string | null;
  verificationStatus: VerificationState;
  stepHistory: number[];
  unknownScreenFramesCount: number;
}
