import { getFrameworkDefinition } from "../utils/framework_definitions.ts";

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

export const buildFrameworkTableBlock = (
  frameworkName: string,
  results?: string[],
): DataTableBlock => {
  const framework = getFrameworkDefinition(frameworkName);

  return {
    type: "data_table",
    caption: framework.label,
    rows: [
      [rawText("観点"), rawText("分析結果")],
      ...framework.perspectives.map((perspective, index) => [
        rawText(perspective),
        rawText(
          results?.[index] ?? "LLM連携後に分析結果を表示します",
        ),
      ]),
    ],
  };
};
