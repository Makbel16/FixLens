import { BoundingBox } from '../types/ocr';
import { RecognizedScreenType, ScreenClassification } from '../types/screen';
import {
  TroubleshootingAction,
  TroubleshootingSessionState,
  TroubleshootingStep,
  TroubleshootingWorkflow,
  UserAction,
} from '../types/troubleshooting';

export class TroubleshootingDecisionEngine {
  private state: TroubleshootingSessionState;
  private consecutiveAutoMatches = 0;
  private readonly autoAdvanceThreshold = 2; // Requires 2 consecutive frames of new state to auto-advance

  constructor(workflow: TroubleshootingWorkflow) {
    this.state = this.createInitialState(workflow);
  }

  private createInitialState(workflow: TroubleshootingWorkflow): TroubleshootingSessionState {
    return {
      workflow,
      currentStepIndex: 0,
      currentScreen: 'UNKNOWN_SCREEN',
      confidence: 0,
      isPaused: false,
      targetBox: null,
      targetLabel: null,
      verificationStatus: 'PENDING',
      stepHistory: [0],
      unknownScreenFramesCount: 0,
    };
  }

  public getState(): TroubleshootingSessionState {
    return { ...this.state };
  }

  public getCurrentStep(): TroubleshootingStep {
    return this.state.workflow.steps[this.state.currentStepIndex];
  }

  /**
   * Main evaluation loop: processes a new screen classification from OCR.
   * Returns true if step changed (auto-progressed or error branched).
   */
  public evaluateFrame(classification: ScreenClassification): {
    stateChanged: boolean;
    reason: string;
    targetBox: BoundingBox | null;
  } {
    if (this.state.isPaused) {
      return { stateChanged: false, reason: 'PAUSED', targetBox: null };
    }

    this.state.currentScreen = classification.screenType;
    this.state.confidence = classification.confidence;

    // Track unknown screen frames
    if (classification.screenType === 'UNKNOWN_SCREEN') {
      this.state.unknownScreenFramesCount++;
      return { stateChanged: false, reason: 'UNKNOWN_SCREEN', targetBox: null };
    } else {
      this.state.unknownScreenFramesCount = 0;
    }

    // Check for error state branch (e.g. HOTSPOT_ERROR_CANNOT_SETUP)
    if (
      classification.screenType === 'WINDOWS_HOTSPOT_ERROR' &&
      this.state.workflow.errorRecoverySteps?.WINDOWS_HOTSPOT_ERROR
    ) {
      const errStep = this.state.workflow.errorRecoverySteps.WINDOWS_HOTSPOT_ERROR;
      const targetBox = classification.identifiedElements[errStep.targetControlKey] || null;
      this.state.targetBox = targetBox;
      this.state.targetLabel = errStep.targetLabel;
      return { stateChanged: true, reason: 'ERROR_STATE_DETECTED', targetBox };
    }

    // Check for verification success state
    const currentStep = this.getCurrentStep();
    if (
      currentStep.isVerificationStep ||
      classification.screenType === 'WINDOWS_HOTSPOT_ACTIVE'
    ) {
      if (classification.screenType === 'WINDOWS_HOTSPOT_ACTIVE') {
        this.state.verificationStatus = 'VERIFIED_SUCCESS';
        this.state.targetBox = classification.identifiedElements['status_label'] || null;
        this.state.targetLabel = 'Hotspot Active & Verified';
        return { stateChanged: true, reason: 'VERIFIED_SUCCESS', targetBox: this.state.targetBox };
      }
    }

    // Check for Autonomous Step Advancement
    // If user performed the action, computer transitioned to the NEXT step's expected screen
    const nextStepIndex = this.state.currentStepIndex + 1;
    if (nextStepIndex < this.state.workflow.steps.length) {
      const nextStep = this.state.workflow.steps[nextStepIndex];
      if (classification.screenType === nextStep.expectedScreen) {
        this.consecutiveAutoMatches++;
        if (this.consecutiveAutoMatches >= this.autoAdvanceThreshold) {
          this.consecutiveAutoMatches = 0;
          this.state.currentStepIndex = nextStepIndex;
          this.state.stepHistory.push(nextStepIndex);
          const target = classification.identifiedElements[nextStep.targetControlKey] || null;
          this.state.targetBox = target;
          this.state.targetLabel = nextStep.targetLabel;
          return { stateChanged: true, reason: 'AUTO_ADVANCED_NEXT_SCREEN', targetBox: target };
        }
      } else {
        this.consecutiveAutoMatches = 0;
      }
    }

    // Still on current step's expected screen: update target box
    if (classification.screenType === currentStep.expectedScreen) {
      const target = classification.identifiedElements[currentStep.targetControlKey] || null;
      this.state.targetBox = target;
      this.state.targetLabel = currentStep.targetLabel;
      return { stateChanged: false, reason: 'TARGET_UPDATED', targetBox: target };
    }

    return { stateChanged: false, reason: 'NORMAL_TRACKING', targetBox: this.state.targetBox };
  }

  /**
   * Handles user controls: REPEAT, BACK, SKIP, NOT_WORKING.
   */
  public handleUserAction(action: UserAction): { success: boolean; message: string } {
    switch (action) {
      case 'REPEAT':
        // Re-read current step instructions, clear target smoothing
        this.state.targetBox = null;
        return { success: true, message: 'Repeating current instruction.' };

      case 'BACK':
        if (this.state.stepHistory.length > 1) {
          this.state.stepHistory.pop();
          const prevIndex = this.state.stepHistory[this.state.stepHistory.length - 1];
          this.state.currentStepIndex = prevIndex;
          this.state.targetBox = null;
          return { success: true, message: 'Moved back to previous step.' };
        }
        return { success: false, message: 'Already at the first step.' };

      case 'SKIP':
        if (this.state.currentStepIndex < this.state.workflow.steps.length - 1) {
          this.state.currentStepIndex++;
          this.state.stepHistory.push(this.state.currentStepIndex);
          this.state.targetBox = null;
          return { success: true, message: 'Skipped to next step.' };
        }
        return { success: false, message: 'Already at the final step.' };

      case 'NOT_WORKING':
        // Display secondary recovery tip
        const step = this.getCurrentStep();
        const alt = step.alternateAction || step.detailedTip;
        return { success: true, message: `Alternative approach: ${alt}` };

      case 'MANUAL_OVERRIDE':
        return { success: true, message: 'Manual override active.' };

      default:
        return { success: false, message: 'Unknown action.' };
    }
  }

  public togglePause(): boolean {
    this.state.isPaused = !this.state.isPaused;
    return this.state.isPaused;
  }

  public setWorkflow(workflow: TroubleshootingWorkflow): void {
    this.state = this.createInitialState(workflow);
    this.consecutiveAutoMatches = 0;
  }
}
