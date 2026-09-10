import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { GenerateBusinessAnalysisFunctionDefinition } from "../functions/generate_business_analysis_function.ts";

/**
 * Collects the information needed for a SWOT analysis.
 * LLM generation will be added after the Slack UI has been validated.
 */
const SwotAnalysisWorkflow = DefineWorkflow({
  callback_id: "swot_analysis_workflow",
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

const inputForm = SwotAnalysisWorkflow.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: "ビジネス分析を作成",
    interactivity: SwotAnalysisWorkflow.inputs.interactivity,
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
          ],
        },
        {
          name: "channel",
          title: "結果の投稿先",
          type: Schema.slack.types.channel_id,
          default: SwotAnalysisWorkflow.inputs.channel,
        },
        {
          name: "analysis_subject",
          title: "分析対象",
          type: Schema.types.string,
        },
        {
          name: "purpose",
          title: "分析の目的",
          type: Schema.types.string,
          long: true,
        },
        {
          name: "target_customer",
          title: "想定する顧客",
          type: Schema.types.string,
          long: true,
        },
        {
          name: "known_facts",
          title: "分かっている事実",
          type: Schema.types.string,
          long: true,
        },
        {
          name: "concerns",
          title: "課題・懸念点",
          type: Schema.types.string,
          long: true,
        },
      ],
      required: ["framework", "channel", "analysis_subject", "purpose"],
    },
  },
);

const analysisStep = SwotAnalysisWorkflow.addStep(
  GenerateBusinessAnalysisFunctionDefinition,
  {
    framework: inputForm.outputs.fields.framework,
    analysis_subject: inputForm.outputs.fields.analysis_subject,
    purpose: inputForm.outputs.fields.purpose,
    target_customer: inputForm.outputs.fields.target_customer,
    known_facts: inputForm.outputs.fields.known_facts,
    concerns: inputForm.outputs.fields.concerns,
  },
);

SwotAnalysisWorkflow.addStep(Schema.slack.functions.SendMessage, {
  channel_id: inputForm.outputs.fields.channel,
  message:
    `${analysisStep.outputs.analysis_result}\n\n入力者: <@${SwotAnalysisWorkflow.inputs.user}>`,
});

export default SwotAnalysisWorkflow;
