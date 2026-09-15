import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import { frameworkCategories } from "../utils/framework_categories.ts";
import {
  buildBusinessAnalysisModal,
  CATEGORY_ACTION_ID,
  CHANNEL_BLOCK_ID,
  getFrameworkBlockId,
  PROMPT_BLOCK_ID,
  readModalState,
  VIEW_CALLBACK_ID,
} from "../views/business_analysis_modal.ts";

export const OpenBusinessAnalysisFormFunctionDefinition = DefineFunction({
  callback_id: "open_business_analysis_form",
  title: "ビジネス分析フォームを開く",
  description: "中カテゴリーに応じて分析フレームワークを切り替えます",
  source_file: "functions/open_business_analysis_form_function.ts",
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
    },
    required: ["interactivity"],
  },
  output_parameters: {
    properties: {
      framework: {
        type: Schema.types.string,
        description: "選択された分析フレームワーク",
      },
      prompt: {
        type: Schema.types.string,
        description: "分析したい内容",
      },
      channel: {
        type: Schema.slack.types.channel_id,
        description: "分析結果の投稿先",
      },
    },
    required: ["framework", "prompt", "channel"],
  },
});

export default SlackFunction(
  OpenBusinessAnalysisFormFunctionDefinition,
  async ({ inputs, client }) => {
    const response = await client.views.open({
      interactivity_pointer: inputs.interactivity.interactivity_pointer,
      view: buildBusinessAnalysisModal({
        category: frameworkCategories[0].value,
      }),
    });

    if (response.error) {
      return { error: `分析フォームを開けませんでした: ${response.error}` };
    }

    return { completed: false };
  },
)
  .addBlockActionsHandler(
    CATEGORY_ACTION_ID,
    async ({ action, body, client }) => {
      const category = action.selected_option?.value;
      if (!category) {
        return { error: "中カテゴリーを取得できませんでした" };
      }

      const current = readModalState(body.view);
      const response = await client.views.update({
        interactivity_pointer: body.interactivity.interactivity_pointer,
        view_id: body.view.id,
        hash: body.view.hash,
        view: buildBusinessAnalysisModal({
          category,
          channel: current.channel,
          prompt: current.prompt,
        }),
      });

      if (response.error) {
        return {
          error: `分析フォームを更新できませんでした: ${response.error}`,
        };
      }

      return { completed: false };
    },
  )
  .addViewSubmissionHandler(
    VIEW_CALLBACK_ID,
    async ({ view, body, client }) => {
      const state = readModalState(view);
      const errors: Record<string, string> = {};

      if (!state.framework) {
        errors[getFrameworkBlockId(state.category ?? "unknown")] =
          "分析フレームワークを選択してください";
      }
      if (!state.channel) {
        errors[CHANNEL_BLOCK_ID] = "投稿先を選択してください";
      }
      if (!state.prompt?.trim()) {
        errors[PROMPT_BLOCK_ID] = "分析したい内容を入力してください";
      }

      if (Object.keys(errors).length > 0) {
        return { response_action: "errors", errors };
      }

      await client.functions.completeSuccess({
        function_execution_id: body.function_data.execution_id,
        outputs: {
          framework: state.framework!,
          channel: state.channel!,
          prompt: state.prompt!.trim(),
        },
      });

      return {};
    },
  )
  .addViewClosedHandler(
    VIEW_CALLBACK_ID,
    async ({ body, client }) => {
      await client.functions.completeError({
        function_execution_id: body.function_data.execution_id,
        error: "ビジネス分析の入力がキャンセルされました",
      });
    },
  );
