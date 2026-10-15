import { TroubleshootingWorkflow } from '../../types/troubleshooting';
import mobileHotspotWorkflow from './mobileHotspot';
import wifiTroubleshooterWorkflow from './wifiTroubleshooter';
import windowsUpdateWorkflow from './windowsUpdate';

export const WORKFLOWS_REGISTRY: TroubleshootingWorkflow[] = [
  mobileHotspotWorkflow,
  wifiTroubleshooterWorkflow,
  windowsUpdateWorkflow,
];

export function getWorkflowById(id: string): TroubleshootingWorkflow | undefined {
  return WORKFLOWS_REGISTRY.find(w => w.workflowId === id);
}

export { mobileHotspotWorkflow, wifiTroubleshooterWorkflow, windowsUpdateWorkflow };
