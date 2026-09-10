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
      analysis_subject: {
        type: Schema.types.string,
        description: "分析する商品・事業・アイデア",
      },
      purpose: {
        type: Schema.types.string,
        description: "分析の目的",
      },
      target_customer: {
        type: Schema.types.string,
        description: "想定する顧客",
      },
      known_facts: {
        type: Schema.types.string,
        description: "すでに分かっている事実",
      },
      concerns: {
        type: Schema.types.string,
        description: "現在の課題や懸念点",
      },
    },
    required: ["framework", "analysis_subject", "purpose"],
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

const frameworkDefinitions: Record<
  string,
  { label: string; perspectives: string[] }
> = {
  swot: {
    label: "SWOT分析",
    perspectives: [
      "Strengths（強み）",
      "Weaknesses（弱み）",
      "Opportunities（機会）",
      "Threats（脅威）",
    ],
  },
  "3c": {
    label: "3C分析",
    perspectives: ["Customer（顧客）", "Competitor（競合）", "Company（自社）"],
  },
  "4p": {
    label: "4P分析",
    perspectives: [
      "Product（製品）",
      "Price（価格）",
      "Place（流通）",
      "Promotion（販促）",
    ],
  },
  "4c": {
    label: "4C分析",
    perspectives: [
      "Customer Value（顧客価値）",
      "Cost（顧客負担）",
      "Convenience（利便性）",
      "Communication（対話）",
    ],
  },
  vrio: {
    label: "VRIO分析",
    perspectives: [
      "Value（経済的価値）",
      "Rarity（希少性）",
      "Imitability（模倣困難性）",
      "Organization（組織）",
    ],
  },
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
    const framework = frameworkDefinitions[inputs.framework];

    if (!framework) {
      return {
        error: `Unsupported framework: ${inputs.framework}`,
      };
    }

    const perspectives = framework.perspectives
      .map((perspective) => `• ${perspective}: LLM連携後に分析結果を表示します`)
      .join("\n");

    const analysisResult = `*${framework.label}* :bar_chart:

*分析対象*
${normalizeInput(inputs.analysis_subject)}

*分析の目的*
${normalizeInput(inputs.purpose)}

*想定する顧客*
${normalizeInput(inputs.target_customer)}

*分かっている事実*
${normalizeInput(inputs.known_facts)}

*課題・懸念点*
${normalizeInput(inputs.concerns)}

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
