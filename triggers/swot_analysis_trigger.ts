import type { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerContextData, TriggerTypes } from "deno-slack-api/mod.ts";
import SwotAnalysisWorkflow from "../workflows/swot_analysis_workflow.ts";

const swotAnalysisTrigger: Trigger<
  typeof SwotAnalysisWorkflow.definition
> = {
  type: TriggerTypes.Shortcut,
  name: "ビジネス分析を開始",
  description: "フレームワークを選び、質問に答えて分析を始めます",
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
