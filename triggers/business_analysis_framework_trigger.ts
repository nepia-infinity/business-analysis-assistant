import type { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerContextData, TriggerTypes } from "deno-slack-api/mod.ts";
import BusinessAnalysisFrameworkWorkflow from "../workflows/business_analysis_framework_workflow.ts";

const businessAnalysisFrameworkTrigger: Trigger<
  typeof BusinessAnalysisFrameworkWorkflow.definition
> = {
  type: TriggerTypes.Shortcut,
  name: "ビジネス分析を開始",
  description: "フレームワークを選び、質問に答えて分析を始めます",
  workflow:
    `#/workflows/${BusinessAnalysisFrameworkWorkflow.definition.callback_id}`,
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

export default businessAnalysisFrameworkTrigger;
