import type { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerContextData, TriggerTypes } from "deno-slack-api/mod.ts";
import SwotAnalysisWorkflow from "../workflows/swot_analysis_workflow.ts";

const swotAnalysisTrigger: Trigger<
  typeof SwotAnalysisWorkflow.definition
> = {
  type: TriggerTypes.Shortcut,
  name: "SWOT分析を開始",
  description: "質問に答えるだけでSWOT分析を始めます",
  workflow: `#/workflows/${SwotAnalysisWorkflow.definition.callback_id}`,
  inputs: {
    interactivity: {
      value: TriggerContextData.Shortcut.interactivity,
    },
    channel: {
      value: TriggerContextData.Shortcut.channel_id,
    },
    user: {
      value: TriggerContextData.Shortcut.user_id,
    },
  },
};

export default swotAnalysisTrigger;
