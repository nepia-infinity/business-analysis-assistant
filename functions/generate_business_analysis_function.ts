import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import { buildFrameworkTableBlock } from "../blocks/framework_table_block.ts";
import { getFrameworkDefinition } from "../utils/framework_definitions.ts";
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

const escapeMrkdwn = (value: string): string => {
  return value
    .trim()
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
};

export default SlackFunction(
  GenerateBusinessAnalysisFunctionDefinition,
  async ({ inputs, client, env }) => {
    try {
      const apiKey = env["SAKANA_AI_API_KEY"];

      if (!apiKey?.trim()) {
        return {
          error: "SAKANA_AI_API_KEYが設定されていません",
        };
      }

      const framework = getFrameworkDefinition(inputs.framework);
      const analysisResults = await generateBusinessAnalysis(
        inputs.framework,
        inputs.prompt,
        { apiKey },
      );
      const tableBlock = buildFrameworkTableBlock(
        inputs.framework,
        analysisResults,
      );

      const response = await client.apiCall("chat.postMessage", {
        channel: inputs.channel,
        text: `${framework.label}: ${inputs.prompt}`,
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*入力内容*\n${escapeMrkdwn(inputs.prompt)}`,
            },
          },
          tableBlock,
          {
            type: "context",
            elements: [
              {
                type: "mrkdwn",
                text: `入力者: <@${inputs.user}>｜生成: Sakana Namazu`,
              },
            ],
          },
        ],
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
