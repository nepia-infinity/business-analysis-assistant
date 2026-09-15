import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { GenerateBusinessAnalysisFunctionDefinition } from "../functions/generate_business_analysis_function.ts";
import { OpenBusinessAnalysisFormFunctionDefinition } from "../functions/open_business_analysis_form_function.ts";

/**
 * 動的フォームで分析条件を受け取り、選択されたフレームワークで分析します。
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
      user: {
        type: Schema.slack.types.user_id,
      },
    },
    required: ["interactivity", "user"],
  },
});

const inputForm = BusinessAnalysisFrameworkWorkflow.addStep(
  OpenBusinessAnalysisFormFunctionDefinition,
  {
    interactivity: BusinessAnalysisFrameworkWorkflow.inputs.interactivity,
  },
);

BusinessAnalysisFrameworkWorkflow.addStep(
  GenerateBusinessAnalysisFunctionDefinition,
  {
    framework: inputForm.outputs.framework,
    prompt: inputForm.outputs.prompt,
    channel: inputForm.outputs.channel,
    user: BusinessAnalysisFrameworkWorkflow.inputs.user,
  },
);

export default BusinessAnalysisFrameworkWorkflow;
