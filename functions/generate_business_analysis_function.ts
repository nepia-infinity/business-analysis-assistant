import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

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
    },
    required: ["framework", "prompt"],
  },
  output_parameters: {
    properties: {
      analysis_result: {
        type: Schema.types.string,
        description: "Slackへ投稿する分析結果",
      },
    },
    required: ["analysis_result"],
  },
});

type FrameworkDefinition = {
  label: string;
  perspectives: string[];
};

const getFrameworkDefinition = (framework: string): FrameworkDefinition => {
  switch (framework) {
    case "swot":
      return {
        label: "SWOT分析",
        perspectives: [
          "Strengths（強み）",
          "Weaknesses（弱み）",
          "Opportunities（機会）",
          "Threats（脅威）",
        ],
      };

    case "3c":
      return {
        label: "3C分析",
        perspectives: [
          "Customer（顧客）",
          "Competitor（競合）",
          "Company（自社）",
        ],
      };

    case "4p":
      return {
        label: "4P分析",
        perspectives: [
          "Product（製品）",
          "Price（価格）",
          "Place（流通）",
          "Promotion（販促）",
        ],
      };

    case "4c":
      return {
        label: "4C分析",
        perspectives: [
          "Customer Value（顧客価値）",
          "Cost（顧客負担）",
          "Convenience（利便性）",
          "Communication（対話）",
        ],
      };

    case "vrio":
      return {
        label: "VRIO分析",
        perspectives: [
          "Value（経済的価値）",
          "Rarity（希少性）",
          "Imitability（模倣困難性）",
          "Organization（組織）",
        ],
      };

    default:
      throw new Error(`Unsupported framework: ${framework}`);
  }
};

const normalizeInput = (value?: string): string => {
  if (!value?.trim()) {
    return "未入力";
  }

  return value
    .trim()
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
};

export default SlackFunction(
  GenerateBusinessAnalysisFunctionDefinition,
  ({ inputs }) => {
    let framework: FrameworkDefinition;

    try {
      framework = getFrameworkDefinition(inputs.framework);
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Unsupported framework",
      };
    }

    const perspectives = framework.perspectives
      .map((perspective) => `• ${perspective}: LLM連携後に分析結果を表示します`)
      .join("\n");

    const analysisResult = `*${framework.label}* :bar_chart:

*入力内容*
${normalizeInput(inputs.prompt)}

*分析する観点*
${perspectives}

_現在はCustom Functionの接続確認用です。次の段階でLLMによる分析結果に置き換えます。_`;

    return {
      outputs: {
        analysis_result: analysisResult,
      },
    };
  },
);
