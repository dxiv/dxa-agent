import chalk from 'chalk';
import React, { type ReactNode, useCallback, useState } from 'react';
import { type AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS, logEvent } from 'src/services/analytics/index.js';
import { useSetAppState } from 'src/state/AppState.js';
import type { Tools } from '../../../../Tool.js';
import type {
  AgentDefinition,
  CustomAgentDefinition,
} from '../../../../tools/AgentTool/loadAgentsDir.js';
import { getActiveAgentsFromList } from '../../../../tools/AgentTool/loadAgentsDir.js';
import type { SettingSource } from '../../../../utils/settings/constants.js';
import { editFileInEditor } from '../../../../utils/promptEditor.js';
import { useWizard } from '../../../wizard/index.js';
import { getNewAgentFilePath, saveAgentToFile } from '../../agentFileUtils.js';
import type { AgentWizardData } from '../types.js';
import { ConfirmStep } from './ConfirmStep.js';
type Props = {
  tools: Tools;
  existingAgents: AgentDefinition[];
  onComplete: (message: string) => void;
};
export function ConfirmStepWrapper({
  tools,
  existingAgents,
  onComplete
}: Props): ReactNode {
  const {
    wizardData
  } = useWizard<AgentWizardData>();
  const [saveError, setSaveError] = useState<string | null>(null);
  const setAppState = useSetAppState();
  const saveAgent = useCallback(async (openInEditor: boolean): Promise<void> => {
    if (!wizardData?.finalAgent) return;
    const finalAgent = wizardData.finalAgent as Omit<CustomAgentDefinition, 'location'>;
    const source = wizardData.location as SettingSource;
    try {
      await saveAgentToFile(source, finalAgent.agentType, finalAgent.whenToUse, finalAgent.tools, finalAgent.getSystemPrompt(), true, finalAgent.color, finalAgent.model, finalAgent.memory);
      setAppState(state => {
        if (!wizardData.finalAgent) return state;
        const allAgents = state.agentDefinitions.allAgents.concat(finalAgent);
        return {
          ...state,
          agentDefinitions: {
            ...state.agentDefinitions,
            activeAgents: getActiveAgentsFromList(allAgents),
            allAgents
          }
        };
      });
      if (openInEditor) {
        const filePath = getNewAgentFilePath({
          source,
          agentType: finalAgent.agentType
        });
        await editFileInEditor(filePath);
      }
      logEvent('tengu_agent_created', {
        agent_type: finalAgent.agentType,
        generation_method: wizardData.wasGenerated ? 'generated' : 'manual',
        source,
        tool_count: finalAgent.tools?.length ?? 'all',
        has_custom_model: !!finalAgent.model,
        has_custom_color: !!finalAgent.color,
        has_memory: !!finalAgent.memory,
        memory_scope: finalAgent.memory ?? 'none',
        ...(openInEditor ? {
          opened_in_editor: true
        } : {})
      } as AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS);
      const message = openInEditor ? `Created agent: ${chalk.bold(finalAgent.agentType)} and opened in editor. ` + `If you made edits, restart to load the latest version.` : `Created agent: ${chalk.bold(finalAgent.agentType)}`;
      onComplete(message);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save agent');
    }
  }, [wizardData, onComplete, setAppState]);
  const handleSave = useCallback(() => saveAgent(false), [saveAgent]);
  const handleSaveAndEdit = useCallback(() => saveAgent(true), [saveAgent]);
  return <ConfirmStep tools={tools} existingAgents={existingAgents} onSave={handleSave} onSaveAndEdit={handleSaveAndEdit} error={saveError} />;
}
