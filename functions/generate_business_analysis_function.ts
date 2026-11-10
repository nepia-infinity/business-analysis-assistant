import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import { buildAnalysisResultMessage } from "../blocks/framework_table_block.ts";
import { getEnvValue } from "../utils/env.ts";
import { generateBusinessAnalysis } from "../utils/sakana_ai_client.ts";

export const GenerateBusinessAnalysisFunctionDefinition = DefineFunction({
  callback_id: "generate_business_analysis",
  title: "ビジネス分析を生成",
  description: "選択されたフレームワークに応じて分析結果を生成します",
  source_file: "functions/generate_business_analysis_function.ts",
  input_parameters: {
    properties: {
      framework: {
        type: Schema.types.string,
        description: "使用する分析フレームワーク",
      },
      prompt: {
        type: Schema.types.string,
        description: "分析したい内容",
      },
      channel: {
        type: Schema.slack.types.channel_id,
        description: "分析結果の投稿先",
      },
      user: {
        type: Schema.slack.types.user_id,
        description: "分析を実行したユーザー",
      },
    },
    required: ["framework", "prompt", "channel", "user"],
  },
  output_parameters: {
    properties: {},
    required: [],
  },
});

export default SlackFunction(
  GenerateBusinessAnalysisFunctionDefinition,
  async ({ inputs, client, env }) => {
    try {
      // Slackの本番環境から環境変数を取得する。失敗したらローカルの.envから取得する。
      const apiKey = getEnvValue(env, "SAKANA_AI_API_KEY");

      if (!apiKey) {
        return {
          error: "SAKANA_AI_API_KEYが設定されていません",
        };
      }

      const analysisResults = await generateBusinessAnalysis(
        inputs.framework,
        inputs.prompt,
        { apiKey },
      );
      const message = buildAnalysisResultMessage({
        framework: inputs.framework,
        prompt: inputs.prompt,
        user: inputs.user,
        results: analysisResults,
      });

      const response = await client.apiCall("chat.postMessage", {
        channel: inputs.channel,
        ...message,
      });

      if (!response.ok) {
        return {
          error: response.error ?? "Failed to post analysis result",
        };
      }

      return { outputs: {} };
    } catch (error) {
      return {
        error: error instanceof Error
          ? error.message
          : "Failed to generate analysis",
      };
    }
  },
);
