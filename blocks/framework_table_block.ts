import {
  type FrameworkAnalysisResults,
  getFrameworkDefinition,
} from "../utils/framework_definitions.ts";

type RawTextCell = {
  type: "raw_text";
  text: string;
};

type DataTableBlock = {
  type: "data_table";
  caption: string;
  rows: RawTextCell[][];
};

const rawText = (text: string): RawTextCell => ({
  type: "raw_text",
  text,
});

export const escapeMrkdwn = (value: string): string => {
  return value
    .trim()
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
};

export const buildFrameworkTableBlock = (
  frameworkName: string,
  results?: FrameworkAnalysisResults,
): DataTableBlock => {
  const framework = getFrameworkDefinition(frameworkName);

  return {
    type: "data_table",
    caption: framework.label,
    rows: [
      [rawText("観点"), rawText("分析結果")],
      ...framework.perspectives.map((perspective) => [
        rawText(perspective.label),
        rawText(
          results?.[perspective.key] ??
            "LLM連携後に分析結果を表示します",
        ),
      ]),
    ],
  };
};

export type AnalysisMessageParams = {
  framework: string;
  prompt: string;
  user: string;
  results: FrameworkAnalysisResults;
};

/**
 * 分析結果をチャンネルへ投稿するためのテキストとBlock Kit構造を組み立てます。
 */
export const buildAnalysisResultMessage = ({
  framework,
  prompt,
  user,
  results,
}: AnalysisMessageParams) => {
  const definition = getFrameworkDefinition(framework);
  const tableBlock = buildFrameworkTableBlock(framework, results);

  return {
    text: `${definition.label}: ${prompt}`,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*入力内容*\n${escapeMrkdwn(prompt)}`,
        },
      },
      tableBlock,
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `入力者: <@${user}>｜生成: Sakana Namazu`,
          },
        ],
      },
    ],
  };
};
