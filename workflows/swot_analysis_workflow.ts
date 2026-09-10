import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";

/**
 * Collects the information needed for a SWOT analysis.
 * LLM generation will be added after the Slack UI has been validated.
 */
const SwotAnalysisWorkflow = DefineWorkflow({
  callback_id: "swot_analysis_workflow",
  title: "SWOT分析",
  description: "商品・事業・アイデアの情報を入力してSWOT分析を始めます",
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
    title: "SWOT分析を作成",
    interactivity: SwotAnalysisWorkflow.inputs.interactivity,
    submit_label: "分析を開始",
    fields: {
      elements: [
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
      required: ["channel", "analysis_subject", "purpose"],
    },
  },
);

SwotAnalysisWorkflow.addStep(Schema.slack.functions.SendMessage, {
  channel_id: inputForm.outputs.fields.channel,
  message: `*SWOT分析の入力を受け付けました* :memo:

*分析対象*
${inputForm.outputs.fields.analysis_subject}

*分析の目的*
${inputForm.outputs.fields.purpose}

*想定する顧客*
${inputForm.outputs.fields.target_customer}

*分かっている事実*
${inputForm.outputs.fields.known_facts}

*課題・懸念点*
${inputForm.outputs.fields.concerns}

*SWOT分析（UI確認用）*
• *Strengths（強み）*: LLM連携後に生成します
• *Weaknesses（弱み）*: LLM連携後に生成します
• *Opportunities（機会）*: LLM連携後に生成します
• *Threats（脅威）*: LLM連携後に生成します

入力者: <@${SwotAnalysisWorkflow.inputs.user}>`,
});

export default SwotAnalysisWorkflow;
