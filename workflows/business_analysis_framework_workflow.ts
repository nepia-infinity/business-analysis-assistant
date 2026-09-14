import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { GenerateBusinessAnalysisFunctionDefinition } from "../functions/generate_business_analysis_function.ts";

/**
 * Collects the information needed for a business framework analysis.
 * LLM generation will be added after the Slack UI has been validated.
 */
const BusinessAnalysisFrameworkWorkflow = DefineWorkflow({
  callback_id: "business_analysis_framework_workflow",
  title: "ビジネスフレームワーク分析",
  description: "フレームワークを選び、商品・事業・アイデアを分析します",
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
      channel: {
        type: Schema.slack.types.channel_id,
      },
      user: {
        type: Schema.slack.types.user_id,
      },
    },
    required: ["interactivity", "channel", "user"],
  },
});

const inputForm = BusinessAnalysisFrameworkWorkflow.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: "ビジネス分析を作成",
    interactivity: BusinessAnalysisFrameworkWorkflow.inputs.interactivity,
    submit_label: "分析を開始",
    fields: {
      elements: [
        {
          name: "framework",
          title: "分析フレームワーク",
          type: Schema.types.string,
          enum: ["swot", "3c", "4p", "4c", "vrio"],
          choices: [
            {
              value: "swot",
              title: "SWOT分析（強み・弱み・機会・脅威）",
              description: "強み・弱み・機会・脅威を整理します",
            },
            {
              value: "3c",
              title: "3C分析（顧客・競合・自社）",
              description: "顧客・競合・自社の観点から整理します",
            },
            {
              value: "4p",
              title: "4P分析（製品・価格・流通・販促）",
              description: "製品・価格・流通・販促を整理します",
            },
            {
              value: "4c",
              title: "4C分析（顧客価値・コスト・利便性・対話）",
              description: "顧客価値・コスト・利便性・対話を整理します",
            },
            {
              value: "vrio",
              title: "VRIO分析（価値・希少性・模倣困難性・組織）",
              description: "経営資源の競争優位性を評価します",
            },
            {
              value: "social-style",
              title: "ソーシャルスタイル分析（行動傾向・接し方）",
              description:
                "行動傾向から推定スタイルと効果的な接し方を整理します",
            },
          ],
        },
        {
          name: "channel",
          title: "結果の投稿先",
          type: Schema.slack.types.channel_id,
          default: BusinessAnalysisFrameworkWorkflow.inputs.channel,
        },
        {
          name: "prompt",
          title: "分析したい内容",
          type: Schema.types.string,
          long: true,
        },
      ],
      required: ["framework", "channel", "prompt"],
    },
  },
);

BusinessAnalysisFrameworkWorkflow.addStep(
  GenerateBusinessAnalysisFunctionDefinition,
  {
    framework: inputForm.outputs.fields.framework,
    prompt: inputForm.outputs.fields.prompt,
    channel: inputForm.outputs.fields.channel,
    user: BusinessAnalysisFrameworkWorkflow.inputs.user,
  },
);

export default BusinessAnalysisFrameworkWorkflow;
